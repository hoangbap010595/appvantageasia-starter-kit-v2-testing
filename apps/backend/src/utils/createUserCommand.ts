import { print, regexp } from '@appvantageasia/core-node-utils';
import { getCollections, localAuthentication, type UserDocument } from '@appvantageasia/core-users';
import { ObjectId } from 'mongodb';
// eslint-disable-next-line import/no-named-as-default
import prompts from 'prompts';

type OnExitFn = () => never;

const getEmail = async (onExit: OnExitFn) => {
    while (true) {
        const { email } = await prompts({
            type: 'text',
            name: 'email',
            message: 'EMail Address',
        });

        if (!email) {
            // the prompt was cancelled
            return onExit();
        }

        if (!regexp.email.test(email)) {
            print.error('Invalid email address');
            continue;
        }

        const { users } = await getCollections();
        const matchedUsers = await users.countDocuments({ email: email.toLowerCase() });

        if (matchedUsers > 0) {
            print.error('Email already exists');
            continue;
        }

        return email.toLowerCase();
    }
};

const getPassword = async (onExit: OnExitFn) => {
    while (true) {
        const password = await prompts({
            type: 'password',
            name: 'password',
            message: 'Password',
        }).then(values => values.password);

        if (!password) {
            return onExit();
        }

        const validation = await localAuthentication.checkNewPasswordValidity(password);

        if (validation !== true) {
            print.error(`Invalid password : ${validation}`);
            continue;
        }

        const { confirmPassword } = await prompts({
            type: 'password',
            name: 'confirmPassword',
            message: 'Confirm Password',
        });

        if (!confirmPassword) {
            return onExit();
        }

        if (confirmPassword !== password) {
            print.error('Passwords do not match');
            continue;
        }

        return password;
    }
};

const createUserCommand = async (onExit: OnExitFn = () => process.exit(1)) => {
    const email = await getEmail(onExit);
    const password = await getPassword(onExit);

    const document: UserDocument = {
        _id: new ObjectId(),
        email,
        name: email.split('@')[0],
        authProfiles: [],
        isSuperAdmin: false,
        _caslType: 'User',
    } as const;

    const { users } = await getCollections();
    await users.insertOne(document);
    await localAuthentication.createProfile(document, password);

    print.info('User created');
};

export default createUserCommand;
