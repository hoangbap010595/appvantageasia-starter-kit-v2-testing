/// <reference types="../e2e/cypress.d.ts" />
import { print } from 'graphql';
import { gql } from 'graphql-tag';
import 'cypress-file-upload';

const authQuery = gql`
    mutation AuthQuery($email: String!, $password: String!) {
        runBasicAuthentication(email: $email, password: $password) {
            ... on BasicAuthenticationSuccessfulResponse {
                __typename
                token
                user {
                    __typename
                    id
                }
            }
            ... on BasicAuthenticationRequireOtpResponse {
                __typename
                token
            }
        }
    }
    mutation AuthWithOtpQuery($token: String!, $password: String!) {
        runBasicAuthentication: authenticateWithOtp(token: $token, password: $password) {
            ... on BasicAuthenticationSuccessfulResponse {
                __typename
                token
                user {
                    __typename
                    id
                }
            }
        }
    }
`;

Cypress.Commands.add('signIn', (userId, hasOtp = false) => {
    const otpRequest = (token: string) =>
        cy.task('apv:getOtpCredentials', userId).then((code: any) =>
            cy
                .request({
                    method: 'POST',
                    url: `${Cypress.config().baseUrl}/api/graphql`,
                    body: {
                        operationName: 'AuthWithOtpQuery',
                        variables: { token, password: code },
                        query: print(authQuery),
                    },
                })
                .then(response => response.body.data.runBasicAuthentication.token)
        );

    cy.task('apv:getAuthCredentials', { e2eId: userId }).then((credentials: any) => {
        cy.request({
            method: 'POST',
            url: `${Cypress.config().baseUrl}/api/graphql`,
            body: {
                operationName: 'AuthQuery',
                variables: {
                    email: credentials.email,
                    password: credentials.password,
                },
                query: print(authQuery),
            },
        })
            .then(response => {
                const { token } = response.body.data.runBasicAuthentication;

                return hasOtp ? otpRequest(token) : token;
            })
            .then(token => {
                cy.window().then(window => {
                    window.localStorage.setItem('appvantage.session', token);
                });
                cy.reload();
            });
    });
});

Cypress.Commands.add('signOut', () => {
    cy.window().then(window => {
        window.localStorage.removeItem('appvantage.session');
    });
    cy.reload();
});

export type FillFormAction =
    | { inputName: string; value: string; empty?: boolean }
    | { selectName: string; value: string }
    | { switchName: string; value: boolean };

Cypress.Commands.add('fillForm', (formSelector, values) => {
    cy.get(formSelector).within(() => {
        values.forEach(action => {
            if ('inputName' in action) {
                if (action.empty) {
                    cy.get(`[name=${action.inputName}]`).click();
                    cy.get(`[name=${action.inputName}]`).type('{selectall}{backspace}');
                }
                cy.get(`[name=${action.inputName}]`).type(action.value);
            } else if ('selectName' in action) {
                cy.get(`[data-input-name=${action.selectName}`).within(() => {
                    cy.get('[data-cy="select"]').then(element => {
                        cy.wrap(element).click();
                        cy.root()
                            .parents('body')
                            .within(() => {
                                cy.get(`[data-cy-id="${element.attr('data-cy-id')!}"]`)
                                    .contains(action.value)
                                    .should('be.visible')
                                    .click();
                            });
                    });
                });
            } else if ('switchName' in action) {
                cy.get(`[data-input-name=${action.switchName}`).within(() => {
                    cy.get('[data-cy="switchField"]').then(element => {
                        if (!element.attr('data-checked') && action.value) {
                            cy.wrap(element).click();
                        }

                        if (element.attr('data-checked') && !action.value) {
                            cy.wrap(element).click();
                        }
                    });
                });
            }
        });
    });
});
