'use client';

import { useState } from 'react';
import { Contact } from '@/types';
import ContactsList from '@/components/ContactsList';
import MessagesView from '@/components/MessagesView';

export default function Home() {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  const handleContactSelect = (contact: Contact) => {
    setSelectedContact(contact);
  };

  const handleBack = () => {
    setSelectedContact(null);
  };

  return (
    <div className="h-screen w-full max-w-md mx-auto bg-white shadow-lg">
      {selectedContact ? (
        <MessagesView contact={selectedContact} onBack={handleBack} />
      ) : (
        <div className="h-full flex flex-col">
          {/* Transaction Instructions Banner */}
          <div className="bg-green-50 border-b border-green-200 p-3">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-800">
                  <span className="font-medium">Try SMS Transactions:</span> Type "PAY 500 USDC 1234567890" to simulate a payment
                </p>
              </div>
            </div>
          </div>

          <ContactsList onContactSelect={handleContactSelect} />
        </div>
      )}
    </div>
  );
}
