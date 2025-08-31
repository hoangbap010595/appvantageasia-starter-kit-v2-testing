/// <reference types="cypress" />
/// <reference types="cypress-network-idle" />

import type { FillFormAction } from '../support/commands.js';

declare global {
    declare namespace Cypress {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        interface Chainable<Subject = any> {
            /**
             * Take a snapshot of the current state of the application
             * @param name Optional name for the snapshot
             */
            takeSnapshot(name?: string): Chainable<void>;

            /**
             * Access the organization page
             * @param e2eId The e2eId of the organization
             * @param pathname Optional pathname to visit
             * @param queryArgs Optional query arguments
             */
            visitOrganization: (
                e2eId: string,
                pathname?: string,
                queryArgs?: Record<string, string | string[]>
            ) => Chainable<void>;

            /**
             * Sign in as a user
             * @param userId The userId of the user
             */
            signIn: (userId: string, hasOtp?: boolean) => Chainable<void>;

            /**
             * Sign out the current user
             */
            signOut: () => Chainable<void>;

            /**
             * Fill a form with the given values
             * @param formSelector The selector of the form
             * @param values The values to fill the form with
             */
            fillForm: (formSelector: string, values: FillFormAction[]) => Chainable<void>;
        }
    }
}
