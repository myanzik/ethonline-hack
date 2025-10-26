'use client';

import { Contact } from '@/types';
import { mockContacts } from '@/data/mockData';

interface ContactsListProps {
    onContactSelect: (contact: Contact) => void;
}

export default function ContactsList({ onContactSelect }: ContactsListProps) {
    const formatTime = (date: Date) => {
        const now = new Date();
        const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

        if (diffInHours < 24) {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else if (diffInHours < 24 * 7) {
            return date.toLocaleDateString([], { weekday: 'short' });
        } else {
            return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
        }
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className="flex flex-col h-full bg-white">
            {/* Header */}
            <div className="bg-blue-600 text-white p-4 shadow-sm">
                <h1 className="text-xl font-semibold">Messages</h1>
                <p className="text-blue-100 text-sm mt-1">{mockContacts.length} conversations</p>
            </div>

            {/* Search Bar */}
            <div className="p-4 bg-gray-50 border-b">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search conversations..."
                        className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <svg
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                </div>
            </div>

            {/* Contacts List */}
            <div className="flex-1 overflow-y-auto">
                {mockContacts.map((contact) => (
                    <div
                        key={contact.id}
                        onClick={() => onContactSelect(contact)}
                        className="flex items-center p-4 border-b border-gray-100 hover:bg-gray-50 active:bg-gray-100 cursor-pointer"
                    >
                        {/* Avatar */}
                        <div className="relative">
                            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                {getInitials(contact.name)}
                            </div>
                            {contact.unreadCount && contact.unreadCount > 0 && (
                                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                                    {contact.unreadCount > 9 ? '9+' : contact.unreadCount}
                                </div>
                            )}
                        </div>

                        {/* Contact Info */}
                        <div className="flex-1 ml-3 min-w-0">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-gray-900 truncate">
                                    {contact.name}
                                </h3>
                                {contact.lastMessageTime && (
                                    <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                                        {formatTime(contact.lastMessageTime)}
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center justify-between mt-1">
                                <p className="text-sm text-gray-600 truncate flex-1">
                                    {contact.lastMessage}
                                </p>
                                {contact.unreadCount && contact.unreadCount > 0 && (
                                    <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 flex-shrink-0"></div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
