import { Octokit } from '@octokit/rest';
import { execa } from 'execa';

const git = async (...args: string[]) => {
    const { stdout } = await execa('git', args);

    return stdout;
};

const checkCommit = async (...refs: string[]) => Promise.all(refs.map(ref => git('cat-file', '-e', ref)));

const getGithubRange = async () => {
    const ref = process.env.GITHUB_REF;

    if (!ref) {
        throw new Error('Cannot find GITHUB_REF environment variable');
    }

    const github = new Octokit({ auth: process.env.GH_TOKEN || process.env.GITHUB_TOKEN });

    const results = ref.match(/^refs\/(?<type>[a-z]+)\/(?<info>.+)$/);

    if (!results?.groups) {
        throw new Error('unexpected wrong format');
    }

    const { type, info } = results.groups;

    switch (type) {
        case 'pull': {
            const [pull] = info.split('/');
            const [owner, repo] = process.env.GITHUB_REPOSITORY!.split('/');
            const {
                data: { base, head },
            } = await github.pulls.get({ owner, repo, pull_number: +pull });

            return [base.sha, head.sha];
        }

        case 'heads': {
            const sha = process.env.GITHUB_SHA!;

            return [`${sha}^1`, sha];
        }

        default:
            throw new Error('unsupported');
    }
};

const matchGithub = (url: string, prop: string) => {
    if (!url) {
        throw new Error();
    }

    const match = url.match(new RegExp(`github\\.com/(.+)/(.+)/${prop}/(.+)`));

    if (!match) {
        throw new Error();
    }

    const [, owner, repo, data] = match;

    return { owner, repo, data };
};

const getCircleCiRangeFromPr = async () => {
    if (!process.env.CIRCLE_PULL_REQUEST) {
        throw new Error('Cannot find CIRCLE_PULL_REQUEST environment variable');
    }

    const { owner, repo, data: pull } = matchGithub(process.env.CIRCLE_PULL_REQUEST, 'pull');
    const github = new Octokit({ auth: process.env.GH_TOKEN });

    console.info('📡   Looking up PR #%s...', pull);

    const {
        data: { base, head },
    } = await github.pulls.get({ owner, repo, pull_number: +pull });

    await checkCommit(base.sha, head.sha);
    console.info('🔀   Linting PR #%s', pull);

    return [base.sha, head.sha];
};

const getCircleCiRangeFromCompare = async () => {
    if (!process.env.CIRCLE_COMPARE_URL) {
        throw new Error('Cannot find CIRCLE_COMPARE_URL environment variable');
    }

    const [from, to] = matchGithub(process.env.CIRCLE_COMPARE_URL, 'compare').data.split('...');

    await checkCommit(from, to);
    console.info('🎏   Linting using comparison URL %s...%s', from, to);

    return [from, to];
};

const getCircleCiRangeFromSha = async () => {
    const sha = process.env.CIRCLE_SHA1;

    if (!sha) {
        throw new Error('Cannot find CIRCLE_SHA1 environment variable');
    }

    await checkCommit(sha);
    console.info('⚙️   Linting using CIRCLE_SHA1 (%s)', sha);

    return [`${sha}^1`, sha];
};

const runLint = ([from, to]: string[]) =>
    execa('yarn', ['commitlint', '--from', from, '--to', to, '-V'], { stdio: 'inherit' });

getGithubRange()
    .catch(getCircleCiRangeFromPr)
    .catch(getCircleCiRangeFromCompare)
    .catch(getCircleCiRangeFromSha)
    .then(runLint, error => {
        console.error(error);
        process.exit(1);
    })
    .catch(() => {
        console.error('Failed to lint commits');
        process.exit(1);
    });

export {};
