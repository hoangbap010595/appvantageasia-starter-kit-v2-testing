/// <reference types="./cypress.d.ts" />

describe('Authentication specs', () => {
    beforeEach(() => {
        cy.task('apv:loadSnapshots', ['baseUsers']);
    });

    it('Authentication page rejects invalid credentials', () => {
        cy.visit('/');
        cy.waitForNetworkIdle(2000);
        cy.location()
            .its('pathname')
            .should('match', /^\/login\/?$/);
        cy.takeSnapshot('Empty sign-in page');
        cy.get('form[data-cy=signInForm] input[name=email]').type('failure@unknown.co');
        cy.get('form[data-cy=signInForm] input[name=password]').type('incorrect-password');
        cy.get('form[data-cy=signInForm] button[type=submit]').click();
        cy.waitForNetworkIdle(2000);
        cy.contains('Invalid email or password').should('be.visible');
        cy.get('form[data-cy=signInForm] input[name=password]').should('be.focused');
        cy.takeSnapshot('Invalid credentials');
    });

    it('Authentication page accept valid credentials', () => {
        cy.visit('/');
        cy.waitForNetworkIdle(2000);
        cy.location()
            .its('pathname')
            .should('match', /^\/login\/?$/);
        cy.task('apv:getAuthCredentials', { e2eId: 'simple-user' }).then((credentials: any) => {
            cy.get('form[data-cy=signInForm] input[name=email]').type(credentials.email);
            cy.get('form[data-cy=signInForm] input[name=password]').type(credentials.password);
        });
        cy.get('form[data-cy=signInForm] button[type=submit]').click();
        cy.waitForNetworkIdle(2000);
        cy.location().its('pathname').should('eq', '/');
    });

    it('Authentication page accept valid credentials with 2fa and reject invalid 2fa token', () => {
        cy.visit('/');
        cy.waitForNetworkIdle(2000);
        cy.location()
            .its('pathname')
            .should('match', /^\/login\/?$/);
        cy.task('apv:getAuthCredentials', { e2eId: 'otp-user' }).then((credentials: any) => {
            cy.get('form[data-cy=signInForm] input[name=email]').type(credentials.email);
            cy.get('form[data-cy=signInForm] input[name=password]').type(credentials.password);
        });
        cy.get('form[data-cy=signInForm] button[type=submit]').click();
        cy.waitForNetworkIdle(2000);
        cy.contains('Two-Factor Authentication (2FA)');
        cy.get('form[data-cy=totpConfirmForm] input[name=password]').type('123456');
        cy.get('form[data-cy=totpConfirmForm] button[type=submit]').click();
        cy.waitForNetworkIdle(2000);
        cy.contains('Invalid token. Pleas try again.');
        cy.get('form[data-cy=totpConfirmForm] input[name=password]').should('be.focused');
        cy.takeSnapshot('Invalid 2FA token');
    });

    it('Authentication page accept valid credentials with 2fa and accept valid 2fa token', () => {
        cy.visit('/');
        cy.waitForNetworkIdle(2000);
        cy.location()
            .its('pathname')
            .should('match', /^\/login\/?$/);
        cy.task('apv:getAuthCredentials', { e2eId: 'otp-user' }).then((credentials: any) => {
            cy.get('form[data-cy=signInForm] input[name=email]').type(credentials.email);
            cy.get('form[data-cy=signInForm] input[name=password]').type(credentials.password);
        });
        cy.get('form[data-cy=signInForm] button[type=submit]').click();
        cy.waitForNetworkIdle(2000);
        cy.contains('Two-Factor Authentication (2FA)');
        cy.task('apv:getOtpCredentials', 'otp-user').then((token: any) => {
            cy.get('form[data-cy=totpConfirmForm] input[name=password]').type(token);
        });
        cy.get('form[data-cy=totpConfirmForm] button[type=submit]').click();
        cy.waitForNetworkIdle(2000);
        cy.location().its('pathname').should('eq', '/');
    });

    it('Authentication page accept valid credentials with outdated password and reject invalid new password', () => {
        cy.visit('/');
        cy.waitForNetworkIdle(2000);
        cy.location()
            .its('pathname')
            .should('match', /^\/login\/?$/);
        cy.task('apv:getAuthCredentials', { e2eId: 'simple-user', outdated: true }).then((credentials: any) => {
            cy.get('form[data-cy=signInForm] input[name=email]').type(credentials.email);
            cy.get('form[data-cy=signInForm] input[name=password]').type(credentials.password);
        });
        cy.get('form[data-cy=signInForm] button[type=submit]').click();
        cy.waitForNetworkIdle(2000);
        cy.contains('New Password');
        cy.get('form[data-cy=resetPasswordForm] input[name=password]').type('123456');
        cy.get('form[data-cy=resetPasswordForm] input[name=passwordRepeat]').type('123456');
        cy.get('form[data-cy=resetPasswordForm] button[type=submit]').click();
        cy.waitForNetworkIdle(2000);
        cy.contains('Invalid password');
        cy.takeSnapshot('Invalid password');
    });

    it('Authentication page accept valid credentials with outdated password and reject reused old password', () => {
        cy.visit('/');
        cy.waitForNetworkIdle(2000);
        cy.location()
            .its('pathname')
            .should('match', /^\/login\/?$/);
        cy.task('apv:getAuthCredentials', { e2eId: 'simple-user', outdated: true }).then((credentials: any) => {
            cy.get('form[data-cy=signInForm] input[name=email]').type(credentials.email);
            cy.get('form[data-cy=signInForm] input[name=password]').type(credentials.password);
        });
        cy.get('form[data-cy=signInForm] button[type=submit]').click();
        cy.waitForNetworkIdle(2000);
        cy.contains('New Password');
        cy.task('apv:getAuthCredentials', { e2eId: 'simple-user', resetPasswordValidity: false }).then(
            (credentials: any) => {
                cy.get('form[data-cy=resetPasswordForm] input[name=password]').type(credentials.password);
                cy.get('form[data-cy=resetPasswordForm] input[name=passwordRepeat]').type(credentials.password);
            }
        );
        cy.get('form[data-cy=resetPasswordForm] button[type=submit]').click();
        cy.waitForNetworkIdle(2000);
        cy.contains('Reused previous password');
        cy.get('form[data-cy=resetPasswordForm] input[name=password]').should('be.focused');
        cy.takeSnapshot('Reused previous password');
    });

    it('Authentication page accept valid credentials with outdated password and accept valid new password', () => {
        cy.visit('/');
        cy.waitForNetworkIdle(2000);
        cy.location()
            .its('pathname')
            .should('match', /^\/login\/?$/);
        cy.task('apv:getAuthCredentials', { e2eId: 'simple-user', outdated: true }).then((credentials: any) => {
            cy.get('form[data-cy=signInForm] input[name=email]').type(credentials.email);
            cy.get('form[data-cy=signInForm] input[name=password]').type(credentials.password);
        });
        cy.get('form[data-cy=signInForm] button[type=submit]').click();
        cy.waitForNetworkIdle(2000);
        cy.contains('New Password');
        cy.get('form[data-cy=resetPasswordForm] input[name=password]').type('w)[vy?G5KA@EAVB');
        cy.get('form[data-cy=resetPasswordForm] input[name=passwordRepeat]').type('w)[vy?G5KA@EAVB');
        cy.get('form[data-cy=resetPasswordForm] button[type=submit]').click();
        cy.waitForNetworkIdle(2000);
        cy.location().its('pathname').should('eq', '/');
    });

    it('Authentication page accept valid credentials and valid 2fa token and valid new password', () => {
        cy.visit('/');
        cy.waitForNetworkIdle(2000);
        cy.location()
            .its('pathname')
            .should('match', /^\/login\/?$/);
        cy.task('apv:getAuthCredentials', { e2eId: 'otp-user', outdated: true }).then((credentials: any) => {
            cy.get('form[data-cy=signInForm] input[name=email]').type(credentials.email);
            cy.get('form[data-cy=signInForm] input[name=password]').type(credentials.password);
        });
        cy.get('form[data-cy=signInForm] button[type=submit]').click();
        cy.waitForNetworkIdle(2000);
        cy.contains('Two-Factor Authentication (2FA)');
        cy.task('apv:getOtpCredentials', 'otp-user').then((token: any) => {
            cy.get('form[data-cy=totpConfirmForm] input[name=password]').type(token);
        });
        cy.get('form[data-cy=totpConfirmForm] button[type=submit]').click();
        cy.waitForNetworkIdle(2000);
        cy.contains('New Password');
        cy.get('form[data-cy=resetPasswordForm] input[name=password]').type('w)[vy?G5KA@EAVB');
        cy.get('form[data-cy=resetPasswordForm] input[name=passwordRepeat]').type('w)[vy?G5KA@EAVB');
        cy.get('form[data-cy=resetPasswordForm] button[type=submit]').click();
        cy.waitForNetworkIdle(2000);
        cy.location().its('pathname').should('eq', '/');
    });
});
