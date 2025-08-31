/**
 * @type {import('semantic-release').GlobalConfig}
 */
module.exports = {
    branches: [
        '+([0-9])?(.{+([0-9]),x}).x',
        {
            name: 'latest',
            channel: false,
        },
        {
            name: 'master',
            channel: 'next',
            prerelease: 'next',
        },
    ],
    plugins: [
        [
            '@semantic-release/commit-analyzer',
            {
                preset: 'angular',
                releaseRules: [
                    { type: 'refactor', release: 'patch' },
                    { type: 'chore', scope: 'deps', release: 'patch' },
                    { type: 'chore', scope: 'helm', release: 'patch' },
                    { type: 'chore', scope: 'build', release: 'patch' },
                ],
            },
        ],
        [
            '@semantic-release/release-notes-generator',
            {
                preset: 'conventionalcommits',
                presetConfig: {
                    types: [
                        { type: 'chore', section: 'Build System', hidden: false },
                        { type: 'feat', section: 'Features', hidden: false },
                        { type: 'fix', section: 'Bug Fixes', hidden: false },
                        { type: 'refactor', section: 'Code Refactoring', hidden: false },
                    ],
                },
                writerOpts: {
                    commitsSort: ['subject', 'scope'],
                },
            }
        ],
        [
            './packages/devtools/build/semantic-release-plugins/index.js',
            {
                image: '985587343714.dkr.ecr.ap-southeast-1.amazonaws.com/starter-kit-v2-1c40d9f7',
                assets_bucket_name: 'starter-kit-v2-1c40d9f7-assets',
                sentry_organization: 'appvantage',
                sentry_project: 'starter-kit-v2',
            },
        ],
        '@semantic-release/github',
    ],
};
