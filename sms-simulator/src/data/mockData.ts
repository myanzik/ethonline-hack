import { Contact, Message } from '@/types';

export const mockContacts: Contact[] = [
    {
        id: '1',
        name: 'Alice (Beneficiary)',
        phoneNumber: '+1 (555) 123-4567',
        lastMessage: 'PAY 500 USDC 9234923423',
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
        unreadCount: 0,
    },
    {
        id: '2',
        name: 'Green Grocery Store',
        phoneNumber: '+1 (555) 987-6543',
        lastMessage: '500 USDC RECEIVED',
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 3), // 3 minutes ago
        unreadCount: 1,
    },
    {
        id: '4',
        name: 'Health Center',
        phoneNumber: '+1 (555) 321-0987',
        lastMessage: '200 USDC RECEIVED',
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 1), // 1 hour ago
        unreadCount: 0,
    },
    {
        id: '5',
        name: 'Emergency Relief',
        phoneNumber: '+1 (555) 999-8888',
        lastMessage: 'Aid tokens distributed to your wallet',
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        unreadCount: 0,
    },
];

export const mockMessages: Message[] = [
    // Messages for Alice (Beneficiary) - id: '1'
    {
        id: '1',
        contactId: '1',
        content: 'Welcome to BlinkAid! Your emergency aid tokens have been distributed.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        isFromUser: false,
        status: 'read',
        type: 'text',
    },
    {
        id: '2',
        contactId: '1',
        content: 'You have 1000 USDC available for emergency purchases',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2 + 1000 * 30),
        isFromUser: false,
        status: 'read',
        type: 'text',
    },
    {
        id: '3',
        contactId: '1',
        content: 'PAY 500 USDC 9234923423',
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
        isFromUser: true,
        status: 'delivered',
        type: 'transaction'
    },

    {
        id: '4',
        contactId: '1',
        content: '500 USDC Payment Sent',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2 + 1000 * 30),
        isFromUser: false,
        status: 'read',
        type: 'text',
    },

    // Messages for Green Grocery Store (id: '2')
    {
        id: '7',
        contactId: '2',
        content: 'Welcome to Green Grocery Store! We accept BlinkAid tokens for emergency supplies.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        isFromUser: false,
        status: 'read',
        type: 'text',
    },
    {
        id: '8',
        contactId: '2',
        content: '500 USDC RECEIVED',
        timestamp: new Date(Date.now() - 1000 * 60 * 3),
        isFromUser: false,
        status: 'read',
        type: 'transaction',

    },


    // Messages for Tech Solutions Inc (id: '3')
    {
        id: '10',
        contactId: '3',
        content: 'Welcome to Tech Solutions Inc! We provide emergency tech support.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        isFromUser: false,
        status: 'read',
        type: 'text',
    },
    {
        id: '11',
        contactId: '3',
        content: 'We accept BlinkAid tokens for all our services',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1),
        isFromUser: false,
        status: 'read',
        type: 'text',
    },

    // Messages for Health Center (id: '4')
    {
        id: '12',
        contactId: '4',
        content: 'Welcome to Health Center! Emergency medical services available.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        isFromUser: false,
        status: 'read',
        type: 'text',
    },
    {
        id: '13',
        contactId: '4',
        content: '200 USDC RECEIVED',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1),
        isFromUser: false,
        status: 'read',
        type: 'transaction',
        transactionData: {
            amount: 200,
            currency: 'USDC',
            transactionId: 'TXN-4567890123',
            status: 'completed',
        },
    },
    {
        id: '14',
        contactId: '4',
        content: 'Your medical supplies are ready for pickup.',
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        isFromUser: false,
        status: 'read',
        type: 'text',
    },

    // Messages for Emergency Relief (id: '5')
    {
        id: '15',
        contactId: '5',
        content: 'Aid tokens distributed to your wallet',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
        isFromUser: false,
        status: 'read',
        type: 'text',
    },
    {
        id: '16',
        contactId: '5',
        content: 'You have 1000 USDC available for emergency purchases',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 + 1000 * 30),
        isFromUser: false,
        status: 'read',
        type: 'text',
    },
    {
        id: '17',
        contactId: '5',
        content: 'Stay safe and use your tokens wisely during this emergency',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12),
        isFromUser: false,
        status: 'read',
        type: 'text',
    },
];
