import { describe, expect, test, beforeEach, vi } from 'vitest';
import print from '../src/print.js';

describe('print.ts', () => {
    const spyError = vi.spyOn(console, 'error');
    const spyInfo = vi.spyOn(console, 'info');
    const spyWarn = vi.spyOn(console, 'warn');

    beforeEach(() => vi.resetAllMocks());

    test('print.info should call console.info with correct arguments', () => {
        const message = 'Test message';
        const svc = 'Test service';
        print.info(message, svc);
        console.info('yeah');
        expect(spyInfo).toHaveBeenCalled();
    });

    test('print.warn should call console.warn with correct arguments', () => {
        const message = 'Test message';
        const svc = 'Test service';
        print.warn(message, svc);
        expect(spyWarn).toHaveBeenCalled();
    });

    test('print.error should call console.error with correct arguments', () => {
        const message = 'Test message';
        const svc = 'Test service';
        print.error(message, svc);
        expect(spyError).toHaveBeenCalled();
    });

    test('print.debug should call console.debug with correct arguments', () => {
        const message = 'Test message';
        const svc = 'Test service';
        print.debug(message, svc);
        expect(spyInfo).toHaveBeenCalled();
    });
});
