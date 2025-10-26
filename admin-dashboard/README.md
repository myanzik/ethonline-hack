# BlinkAid Admin Dashboard

A disaster-resilient Next.js admin dashboard for managing merchants, beneficiaries, and distribution channels with SMS-based token distribution functionality during humanitarian crises.

## Features

- **Dashboard Overview**: View system statistics and recent activity
- **Merchant Management**: View and manage registered merchants
- **Beneficiary Management**: View and manage registered beneficiaries with wallet addresses
- **Channel Management**: Create and manage distribution channels
- **Token Distribution**: Distribute tokens to beneficiaries through channels
- **Search & Filter**: Search functionality across all entities
- **Responsive Design**: Modern UI with Tailwind CSS

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **UI Components**: Custom components with Headless UI

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── merchants/         # Merchants listing page
│   ├── beneficiaries/     # Beneficiaries listing page
│   ├── channels/          # Channels listing and creation
│   └── layout.tsx         # Root layout with navigation
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components
│   └── Navigation.tsx    # Main navigation component
├── data/                 # Mock data
├── types/                # TypeScript type definitions
└── utils/                # Utility functions
```

## Key Features

### Dashboard
- System overview with key metrics
- Quick action buttons
- Recent channels display
- Activation rate statistics

### Merchants
- View all registered merchants
- Search by name, email, or business type
- View detailed merchant information
- Status indicators (Active/Inactive)

### Beneficiaries
- View all registered beneficiaries
- Search by name, email, or wallet address
- Copy wallet addresses to clipboard
- View detailed beneficiary information

### Channels
- View all distribution channels
- Create new channels with merchant/beneficiary selection
- Token distribution calculation
- Channel details with participant lists

### Create Channel
- Select multiple merchants and beneficiaries
- Set total token amount
- Automatic calculation of tokens per beneficiary
- Form validation and success feedback

## Data Models

### Merchant
- Basic business information
- Contact details
- Business type
- Active status

### Beneficiary
- Personal information
- Contact details
- Wallet address for token distribution
- Active status

### Channel
- Channel name and description
- Associated merchants and beneficiaries
- Token distribution amounts
- Creation timestamp

## Mock Data

The application includes comprehensive mock data for testing:
- 5 merchants across different business types
- 6 beneficiaries with wallet addresses
- 2 sample channels with token distributions

## Future Enhancements

- Real API integration
- User authentication
- Advanced filtering and sorting
- Export functionality
- Real-time updates
- Transaction history
- Analytics and reporting

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Style

- TypeScript for type safety
- Tailwind CSS for styling
- ESLint for code quality
- Component-based architecture