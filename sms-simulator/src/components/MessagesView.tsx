'use client';

import { Contact, Message } from '@/types';
import { mockMessages } from '@/data/mockData';
import { useState, useEffect } from 'react';

interface MessagesViewProps {
    contact: Contact;
    onBack: () => void;
}

export default function MessagesView({ contact, onBack }: MessagesViewProps) {
    const [newMessage, setNewMessage] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);

    // Get messages for this contact
    useEffect(() => {
        const contactMessages = mockMessages.filter(msg => msg.contactId === contact.id);
        setMessages(contactMessages);
    }, [contact.id]);

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            const messageText = newMessage.trim();

            // Check if it's a transaction message
            const transactionMatch = messageText.match(/^PAY\s+(\d+)\s+(USDC|USD)\s+(\d+)$/i);

            if (transactionMatch) {
                const [, amount, currency, transactionId] = transactionMatch;

                // Create transaction message
                const transactionMessage: Message = {
                    id: Date.now().toString(),
                    contactId: contact.id,
                    content: messageText,
                    timestamp: new Date(),
                    isFromUser: true,
                    status: 'sent',
                    type: 'transaction',
                    transactionData: {
                        amount: parseInt(amount),
                        currency: currency.toUpperCase(),
                        transactionId: `TXN-${transactionId}`,
                        status: 'pending',
                    },
                };

                // Add user message
                setMessages(prev => [...prev, transactionMessage]);

                // Simulate merchant response after 2 seconds
                setTimeout(() => {
                    const merchantResponse: Message = {
                        id: (Date.now() + 1).toString(),
                        contactId: contact.id,
                        content: `${amount} ${currency.toUpperCase()} RECEIVED`,
                        timestamp: new Date(),
                        isFromUser: false,
                        status: 'read',
                        type: 'transaction',
                        transactionData: {
                            amount: parseInt(amount),
                            currency: currency.toUpperCase(),
                            transactionId: `TXN-${transactionId}`,
                            status: 'completed',
                        },
                    };

                    setMessages(prev => [...prev, merchantResponse]);
                }, 2000);
            } else {
                // Regular text message
                const textMessage: Message = {
                    id: Date.now().toString(),
                    contactId: contact.id,
                    content: messageText,
                    timestamp: new Date(),
                    isFromUser: true,
                    status: 'sent',
                    type: 'text',
                };

                setMessages(prev => [...prev, textMessage]);
            }

            setNewMessage('');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="flex flex-col h-full bg-gray-100">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 p-4 flex items-center">
                <button
                    onClick={onBack}
                    className="mr-3 p-2 hover:bg-gray-100 rounded-full"
                >
                    <svg
                        className="w-5 h-5 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                        />
                    </svg>
                </button>

                <div className="flex items-center flex-1">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {getInitials(contact.name)}
                    </div>
                    <div className="ml-3">
                        <h2 className="font-semibold text-gray-900">{contact.name}</h2>
                        <p className="text-sm text-gray-500">{contact.phoneNumber}</p>
                    </div>
                </div>

                <button className="p-2 hover:bg-gray-100 rounded-full">
                    <svg
                        className="w-5 h-5 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                        />
                    </svg>
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                    <div className="text-center text-gray-500 mt-8">
                        <p>No messages yet</p>
                        <p className="text-sm mt-1">Start a conversation!</p>
                    </div>
                ) : (
                    messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${message.isFromUser ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${message.type === 'transaction'
                                        ? message.isFromUser
                                            ? 'bg-green-500 text-white'
                                            : 'bg-green-100 text-green-800 border border-green-200'
                                        : message.isFromUser
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-white text-gray-900 border border-gray-200'
                                    }`}
                            >
                                <p className="text-sm font-medium">{message.content}</p>

                                {message.type === 'transaction' && message.transactionData && (
                                    <div className="mt-2 p-2 bg-black bg-opacity-10 rounded-lg">
                                        <div className="flex justify-between items-center text-xs">
                                            <span>Amount: {message.transactionData.amount} {message.transactionData.currency}</span>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${message.transactionData.status === 'completed'
                                                    ? 'bg-green-200 text-green-800'
                                                    : message.transactionData.status === 'pending'
                                                        ? 'bg-yellow-200 text-yellow-800'
                                                        : 'bg-red-200 text-red-800'
                                                }`}>
                                                {message.transactionData.status.toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="text-xs mt-1 opacity-75">
                                            ID: {message.transactionData.transactionId}
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center justify-end mt-1">
                                    <span
                                        className={`text-xs ${message.isFromUser ? 'text-blue-100' : 'text-gray-500'
                                            }`}
                                    >
                                        {formatTime(message.timestamp)}
                                    </span>
                                    {message.isFromUser && (
                                        <span className="ml-1">
                                            {message.status === 'read' && (
                                                <svg className="w-3 h-3 text-blue-200" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                            {message.status === 'delivered' && (
                                                <svg className="w-3 h-3 text-blue-200" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                            {message.status === 'sent' && (
                                                <svg className="w-3 h-3 text-blue-200" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 p-4">
                <div className="flex items-center space-x-3">
                    <button className="p-2 hover:bg-gray-100 rounded-full">
                        <svg
                            className="w-5 h-5 text-gray-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                            />
                        </svg>
                    </button>

                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Type a message or 'PAY 500 USDC 1234567890' for transaction..."
                            className="w-full px-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                        className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
