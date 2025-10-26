import { Contact, Message } from '@/types';

export const mockContacts: Contact[] = [
    {
        id: '1',
        name: 'Alice',
        phoneNumber: '+1 (555) 123-4567',
        lastMessage: 'Hey, how are you doing?',
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        unreadCount: 2,
    },
    {
        id: '2',
        name: 'Bob',
        phoneNumber: '+1 (555) 987-6543',
        lastMessage: 'Thanks for the help!',
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        unreadCount: 0,
    },
    {
        id: '3',
        name: 'Merchant',
        phoneNumber: '+1 (555) 987-6543',
        lastMessage: 'Thanks for the help!',
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        unreadCount: 0,
    },
];

export const mockMessages: Message[] = [
    // Messages for John Doe (id: '1')
    {
        id: '1',
        contactId: '1',
        content: 'Hey, how are you doing?',
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        isFromUser: false,
        status: 'read',
    },
    {
        id: '2',
        contactId: '1',
        content: 'I\'m doing great! How about you?',
        timestamp: new Date(Date.now() - 1000 * 60 * 25),
        isFromUser: true,
        status: 'read',
    },
    {
        id: '3',
        contactId: '1',
        content: 'Pretty good! Just working on some projects',
        timestamp: new Date(Date.now() - 1000 * 60 * 20),
        isFromUser: false,
        status: 'read',
    },
    {
        id: '4',
        contactId: '1',
        content: 'That sounds interesting! What kind of projects?',
        timestamp: new Date(Date.now() - 1000 * 60 * 15),
        isFromUser: true,
        status: 'delivered',
    },
    {
        id: '5',
        contactId: '1',
        content: 'I\'m building a mobile app for messaging',
        timestamp: new Date(Date.now() - 1000 * 60 * 10),
        isFromUser: false,
        status: 'read',
    },
    {
        id: '6',
        contactId: '1',
        content: 'That\'s awesome! I\'d love to see it when it\'s done',
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
        isFromUser: true,
        status: 'sent',
    },

    // Messages for Sarah Wilson (id: '2')
    {
        id: '7',
        contactId: '2',
        content: 'Thanks for the help!',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        isFromUser: false,
        status: 'read',
    },
    {
        id: '8',
        contactId: '2',
        content: 'No problem at all! Happy to help',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2 + 1000 * 60 * 5),
        isFromUser: true,
        status: 'read',
    },

    // Messages for Mike Johnson (id: '3')
    {
        id: '9',
        contactId: '3',
        content: 'See you tomorrow',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
        isFromUser: false,
        status: 'read',
    },
    {
        id: '10',
        contactId: '3',
        content: 'Looking forward to it!',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 + 1000 * 60 * 10),
        isFromUser: true,
        status: 'read',
    },
    {
        id: '11',
        contactId: '3',
        content: 'Don\'t forget to bring the documents',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 + 1000 * 60 * 15),
        isFromUser: false,
        status: 'read',
    },

    // Messages for Emily Davis (id: '4')
    {
        id: '12',
        contactId: '4',
        content: 'Perfect! Let me know when you\'re ready',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
        isFromUser: false,
        status: 'read',
    },

    // Messages for Alex Chen (id: '5')
    {
        id: '13',
        contactId: '5',
        content: 'The meeting is at 3 PM',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
        isFromUser: false,
        status: 'read',
    },
    {
        id: '14',
        contactId: '5',
        content: 'Got it, thanks for the reminder',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3 + 1000 * 60 * 30),
        isFromUser: true,
        status: 'read',
    },
    {
        id: '15',
        contactId: '5',
        content: 'Can you also prepare the quarterly report?',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
        isFromUser: false,
        status: 'delivered',
    },
    {
        id: '16',
        contactId: '5',
        content: 'Sure, I\'ll have it ready by tomorrow',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2 + 1000 * 60 * 45),
        isFromUser: true,
        status: 'sent',
    },
    {
        id: '17',
        contactId: '5',
        content: 'Great! Also, don\'t forget about the client presentation',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
        isFromUser: false,
        status: 'read',
    },
];
