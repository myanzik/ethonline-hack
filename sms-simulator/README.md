# SMS Simulator - Messaging App

A simple Next.js messaging app with a mobile-first design that simulates SMS conversations.

## Features

- **Mobile-First Design**: Optimized for mobile devices with responsive layout
- **Contacts List**: View all contacts with last message preview and unread counts
- **Message View**: Individual conversation view with message history
- **Real-time UI**: Smooth transitions and modern interface
- **Mock Data**: Pre-populated with sample contacts and messages

## Tech Stack

- **Next.js 16** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **React Hooks** for state management

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
src/
├── app/
│   ├── globals.css      # Global styles
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Main page component
├── components/
│   ├── ContactsList.tsx # Contacts list component
│   └── MessagesView.tsx # Messages view component
├── data/
│   └── mockData.ts      # Mock data for contacts and messages
└── types/
    └── index.ts         # TypeScript type definitions
```

## Features Overview

### Contacts List
- Displays all contacts with avatars (initials)
- Shows last message preview and timestamp
- Unread message count badges
- Search functionality (UI ready)
- Tap to open conversation

### Messages View
- Individual conversation interface
- Message bubbles with timestamps
- Message status indicators (sent, delivered, read)
- Message input with send button
- Back navigation to contacts list

### Mobile Optimization
- Touch-friendly interface
- Responsive design
- Smooth animations and transitions
- Custom scrollbars
- Mobile viewport optimization

## Customization

The app uses mock data that can be easily replaced with real API calls. Update the following files:

- `src/data/mockData.ts` - Replace with API calls
- `src/types/index.ts` - Extend types as needed
- `src/components/` - Modify components for your needs

## Browser Support

- Modern browsers with ES6+ support
- Mobile browsers (iOS Safari, Chrome Mobile)
- Responsive design works on tablets and desktops

## License

MIT License - feel free to use this project as a starting point for your own messaging app!