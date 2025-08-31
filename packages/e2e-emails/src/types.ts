export interface Recipient {
    Address: string;
    Name: string;
}

export interface MessagesResponse {
    count: number;
    messages: {
        ID: string;
        From: Recipient[];
        To: Recipient[];
        Cc: Recipient[];
        Bcc: Recipient[];
        ReplyTo: Recipient[];
        Created: string;
        Attachments: number;
        Read: boolean;
        Subject: string;
        Snippet: string;
    }[];
    start: number;
    total: number;
    unread: number;
}

export interface MessageResponse {
    ID: string;
    From: Recipient[];
    To: Recipient[];
    Cc: Recipient[];
    Bcc: Recipient[];
    ReplyTo: Recipient[];
    Created: string;
    Attachments: unknown[];
    Read: boolean;
    Subject: string;
    HTML: string;
    Text: string;
}

export interface MessageFilter {
    toAddress?: string;
    subject?: string;
}
