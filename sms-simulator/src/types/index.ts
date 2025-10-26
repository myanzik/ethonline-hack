export interface Contact {
    id: string;
    name: string;
    phoneNumber: string;
    avatar?: string;
    lastMessage?: string;
    lastMessageTime?: Date;
    unreadCount?: number;
}

export interface Message {
    id: string;
    contactId: string;
    content: string;
    timestamp: Date;
    isFromUser: boolean;
    status: 'sent' | 'delivered' | 'read';
    type?: 'text' | 'transaction';
    transactionData?: {
        amount: number;
        currency: string;
        transactionId?: string;
        status: 'pending' | 'completed' | 'failed';
    };
}

export interface Conversation {
    contactId: string;
    messages: Message[];
}
