import { describe, expect, test } from 'vitest';
import * as regexps from '../src/regexp.js';

describe('regexp.ts', () => {
    describe('name', () => {
        test('accepts valid names', () => {
            const validNames = [
                'John',
                'Mary Jane',
                "O'Connor",
                'Jean-Claude',
                'José María',
                'Amélie',
                'François Müller',
            ];

            for (const name of validNames) {
                expect(name).toMatch(regexps.name);
            }
        });

        test('rejects invalid names', () => {
            const invalidNames = ['', ' ', '123', 'John123', 'John@Doe', '-John', 'John-'];

            for (const name of invalidNames) {
                expect(name).not.toMatch(regexps.name);
            }
        });
    });

    describe('slug', () => {
        test('accepts valid slugs', () => {
            const validSlugs = ['a', 'a-b', 'a_b', 'a-b-c', 'a123', '123-abc', 'my-slug-123'];

            for (const slug of validSlugs) {
                expect(slug).toMatch(regexps.slug);
            }
        });

        test('rejects invalid slugs', () => {
            const invalidSlugs = ['', ' ', '-abc', 'abc-', 'Ab-c', 'a#b', 'a b'];

            for (const slug of invalidSlugs) {
                expect(slug).not.toMatch(regexps.slug);
            }
        });
    });

    describe('objectId', () => {
        test('accepts valid ObjectIds', () => {
            const validIds = [
                '507f1f77bcf86cd799439011',
                '000000000000000000000000',
                'ffffffffffffffffffffffff',
                'ABCDEF1234567890abcdef12',
            ];

            for (const id of validIds) {
                expect(id).toMatch(regexps.objectId);
            }
        });

        test('rejects invalid ObjectIds', () => {
            const invalidIds = [
                '',
                '507f1f77bcf86cd79943901', // too short
                '507f1f77bcf86cd7994390111', // too long
                '507f1f77bcf86cd79943901g', // invalid character
                ' 507f1f77bcf86cd799439011',
            ];

            for (const id of invalidIds) {
                expect(id).not.toMatch(regexps.objectId);
            }
        });
    });

    describe('password', () => {
        test('accepts valid passwords', () => {
            const validPasswords = [
                'StrongPassword123!',
                'Another-Strong_Pass123',
                'C0mpl!cated&P@ssword',
                'Th1s!sAV3ryStr0ngP@ssw0rd',
            ];

            for (const password of validPasswords) {
                expect(password).toMatch(regexps.password);
            }
        });

        test('rejects invalid passwords', () => {
            const invalidPasswords = [
                '',
                'short1A!',
                'nouppercase123!',
                'NOLOWERCASE123!',
                'NoNumbers!',
                'NoSpecial123',
                'Missing Number!',
            ];

            for (const password of invalidPasswords) {
                expect(password).not.toMatch(regexps.password);
            }
        });
    });

    describe('url', () => {
        test('accepts valid URLs', () => {
            const validUrls = ['example.com', 'www.example.com', 'subdomain.example.com', 'my-site.com'];

            for (const url of validUrls) {
                expect(url).toMatch(regexps.url);
            }
        });

        test('rejects invalid URLs', () => {
            const invalidUrls = ['', 'example', '.com', 'www.example..com'];

            for (const url of invalidUrls) {
                expect(url).not.toMatch(regexps.url);
            }
        });
    });

    describe('email', () => {
        test('accepts valid email addresses', () => {
            const validEmails = [
                'test@example.com',
                'user.name@example.com',
                'user+tag@example.com',
                'user-name@example.co.uk',
                '123@example.com',
            ];

            for (const email of validEmails) {
                expect(email).toMatch(regexps.email);
            }
        });

        test('rejects invalid email addresses', () => {
            const invalidEmails = [
                '',
                'plainaddress',
                '@example.com',
                'user@',
                'user@.com',
                'user@example..com',
                'user name@example.com',
            ];

            for (const email of invalidEmails) {
                expect(email).not.toMatch(regexps.email);
            }
        });
    });
});
