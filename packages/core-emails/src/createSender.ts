import { render } from '@react-email/render';
import type { Transporter, SendMailOptions } from 'nodemailer';
import type { ComponentType } from 'react';
import { createElement } from 'react';
import * as config from './config.js';
import defaultTransporter from './transporters/default.js';

export type SenderData<Props> = Omit<SendMailOptions, 'text' | 'html'> & {
    data: Props;
};

export interface SenderOptions {
    sender?: string;
    transporter?: Transporter;
}

const createSender =
    <Props extends {} = any>(rootComponent: ComponentType<Props>) =>
    async ({ data, ...renderOptions }: SenderData<Props>, options?: SenderOptions) => {
        const mailElement = createElement<Props>(rootComponent, data);
        const html = await render(mailElement, { pretty: true });

        const { sender = config.sender, transporter = defaultTransporter } = options || {};

        return transporter.sendMail({
            sender,
            from: sender,
            ...renderOptions,
            html,
        });
    };

export default createSender;
