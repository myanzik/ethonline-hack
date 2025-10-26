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
        <ContactsList onContactSelect={handleContactSelect} />
      )}
    </div>
  );
}
