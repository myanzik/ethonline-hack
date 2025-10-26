# BlinkAid - Disaster-Resilient Token Distribution System

### Summary

BlinkAid is a disaster-resilient application designed to facilitate the creation and management of distribution channels between merchants and beneficiaries during humanitarian crises and natural disasters.


## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or pnpm package manager

### Repository Structure
```
ethonline-hack/
├── admin-dashboard/          # Web-based admin interface
│   ├── src/
│   │   ├── app/             # Next.js pages and routing
│   │   ├── components/      # React components
│   │   ├── services/        # API services and integrations
│   │   └── types/           # TypeScript type definitions
│   └── package.json
├── sms-simulator/           # SMS simulation interface
│   ├── src/
│   │   ├── app/             # Next.js pages
│   │   ├── components/      # React components
│   │   └── data/            # Mock data and types
│   └── package.json
├── yellow-app-test/         # Yellow Network integration tests
└── README.md
```

### Running the Applications

#### 1. Admin Dashboard
The admin dashboard provides a web interface for managing merchants, beneficiaries, and distribution channels.

```bash
# Navigate to admin dashboard directory
cd admin-dashboard

# Install dependencies
npm install
# or
pnpm install

# Start the development server
npm run dev
# or
pnpm dev

# The dashboard will be available at http://localhost:3000
```

**Features:**
- Merchant management
- Beneficiary management
- Channel creation and management
- Real-time transaction monitoring
- Yellow Network integration testing

#### 2. SMS Simulator
The SMS simulator provides a testing interface to simulate SMS-based transactions and communications.

```bash
# Navigate to SMS simulator directory
cd sms-simulator

# Install dependencies
npm install
# or
pnpm install

# Start the development server
npm run dev
# or
pnpm dev

# The simulator will be available at http://localhost:3000
```

**Features:**
- SMS message simulation
- Contact list management
- Transaction flow testing
- Mock data for testing scenarios

#### 3. Yellow Network Integration
The Yellow Network integration provides testing capabilities for state channel functionality.

```bash
# Navigate to Yellow Network test directory
cd yellow-app-test

# Install dependencies
npm install

# Run the test application
node app.js
```

**Features:**
- State channel testing
- ClearNode integration
- Payment session management
- Network connectivity testing

### Development Notes
- Both the admin dashboard and SMS simulator run on port 3000 by default
- Make sure to run them on different ports if testing simultaneously
- The Yellow Network integration requires proper network configuration
- Mock data is provided for testing purposes in both applications


### 1. Project Overview

#### 1.1 Problem Statement
During natural disasters and humanitarian crises, traditional aid distribution systems face critical challenges that can severely impact relief efforts:

**Disaster-Specific Challenges:**
- **Limited Internet Connectivity**: Damaged infrastructure often results in unreliable or completely unavailable internet access
- **Communication Breakdown**: Traditional digital payment systems become unusable when internet is unavailable
- **Urgent Transaction Needs**: Disaster victims need immediate access to essential goods and services
- **Geographic Isolation**: Affected areas may be cut off from traditional banking and payment infrastructure

**System Requirements for Disaster Response:**
- Enable transactions through SMS when internet is unavailable
- Provide ultra-fast transaction processing for emergency situations
- Create flexible distribution channels between merchants and beneficiaries
- Ensure transparent and efficient resource distribution
- Support custodial wallet management linked to phone numbers

#### 1.2 Solution
A disaster-resilient aid distribution system that leverages **Yellow Network state channels** and **SMS-based transactions** to ensure continuous operation even when internet connectivity is severely limited:

**Core Technology Stack:**
- **Yellow Network State Channels**: Enable ultra-fast, off-chain transactions that can be processed instantly
- **SMS Integration**: Allow beneficiaries and merchants to conduct transactions via simple text messages
- **Custodial Wallet System**: Each beneficiary and merchant has a wallet linked to their phone number
- **Admin Dashboard**: Web-based interface for channel management and oversight

**Key Capabilities:**
- **SMS-Based Transactions**: Beneficiaries can send/receive payments through simple text messages
- **Instant Settlement**: Yellow Network state channels provide near-instantaneous transaction processing
- **Offline Resilience**: System continues to function even with minimal internet connectivity
- **Phone Number Integration**: All wallets are tied to phone numbers for easy identification and access
- **Real-time Channel Management**: Administrators can create and manage distribution channels remotely

### 2. System Architecture

#### 2.1 Core Components

```
┌─────────────────────────────────────────────────────────────┐
│                    DISASTER-RESILIENT AID SYSTEM            │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │  SMS        │  │  YELLOW     │  │  CUSTODIAL  │         │
│  │  GATEWAY    │  │  NETWORK    │  │  WALLETS    │         │
│  │             │  │  CHANNELS   │  │             │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
├─────────────────────────────────────────────────────────────┤
│                    ADMIN DASHBOARD                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │  Merchants  │  │Beneficiaries│  │   Channels  │         │
│  │ Management  │  │ Management  │  │ Management  │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
├─────────────────────────────────────────────────────────────┤
│                    DISASTER SCENARIO                        │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  • Limited Internet → SMS Transactions              │   │
│  │  • Fast Settlement → Yellow Network State Channels  │   │
│  │  • Phone-Linked Wallets → Easy Access               │   │
│  │  • Emergency Relief → Instant Distribution          │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 3. System Workflow

#### 3.1 Disaster Response Channel Creation

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Admin Selects │    │   Admin Sets    │    │   System        │
│   Merchants &   │───▶│   Token Amount  │───▶│   Creates       │
│   Beneficiaries │    │   for Channel   │    │   Custodial     │
│   (Phone #s)    │    │   (Emergency)   │    │   Wallets       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Channel       │    │   Tokens        │    │   SMS           │
│   Created       │    │   Allocated     │    │   Notifications │
│   Successfully  │    │   to Wallets    │    │   Sent to All   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

#### 3.2 SMS-Based Transaction Flow (Disaster Scenario)

```
┌─────────────────────────────────────────────────────────────┐
│                    SMS TRANSACTION FLOW                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Beneficiary sends SMS: "PAY 50 TOKENS TO MERCHANT123"     │
│                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │   SMS       │    │   Yellow    │    │   Instant   │     │
│  │  Gateway    │───▶│   Network   │───▶│ Settlement  │     │
│  │  Processes  │    │   State     │    │   via SMS   │     │
│  │  Request    │    │  Channels   │    │  Confirmation│    │
│  └─────────────┘    └─────────────┘    └─────────────┘     │
│                                                             │
│  Merchant receives: "PAYMENT RECEIVED: 50 TOKENS"          │
│  Beneficiary receives: "PAYMENT SENT: 50 TOKENS"           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### 3.3 Emergency Token Distribution Flow

```
┌─────────────────────────────────────────────────────────────┐
│                DISASTER EMERGENCY TOKEN DISTRIBUTION        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Emergency Relief: 1000 tokens for disaster victims        │
│  Affected Population: 5 families (phone numbers)           │
│  Distribution: 200 tokens per family via SMS               │
│                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │ Family A    │    │ Family B    │    │ Family C    │     │
│  │ +1234567890 │    │ +1234567891 │    │ +1234567892 │     │
│  │ 200 tokens  │    │ 200 tokens  │    │ 200 tokens  │     │
│  │ (SMS sent)  │    │ (SMS sent)  │    │ (SMS sent)  │     │
│  └─────────────┘    └─────────────┘    └─────────────┘     │
│                                                             │
│  ┌─────────────┐    ┌─────────────┐                       │
│  │ Family D    │    │ Family E    │                       │
│  │ +1234567893 │    │ +1234567894 │                       │
│  │ 200 tokens  │    │ 200 tokens  │                       │
│  │ (SMS sent)  │    │ (SMS sent)  │                       │
│  └─────────────┘    └─────────────┘                       │
│                                                             │
│  SMS Message: "EMERGENCY AID: 200 tokens credited to your  │
│  wallet. Use SMS to purchase from local merchants."        │
└─────────────────────────────────────────────────────────────┘
```


### Key Features

1. **Disaster Response Dashboard**
   - Real-time emergency metrics and statistics
   - Quick disaster response action buttons
   - Live transaction monitoring during crises
   - SMS delivery status tracking

2. **SMS-Based Transaction System**
   - **Ultra-Fast Processing**: Yellow Network state channels enable instant settlements
   - **Offline Resilience**: Works even with minimal internet connectivity
   - **Simple Interface**: Beneficiaries use basic text messages for transactions
   - **Phone Number Integration**: All wallets linked to phone numbers for easy access

3. **Emergency Merchant Management**
   - Rapid merchant registration for disaster zones
   - Emergency supply categorization (food, water, medicine, shelter)
   - SMS-based merchant communication
   - Real-time inventory tracking for relief supplies

4. **Disaster Victim Management**
   - Quick beneficiary registration via phone numbers
   - Custodial wallet creation and management
   - SMS notification system for token distribution
   - Emergency contact information tracking

5. **Emergency Channel Management**
   - Rapid channel creation for disaster response
   - Geographic-based channel organization
   - Instant token distribution to affected populations
   - Real-time participant monitoring

6. **Crisis Token Distribution**
   - **Instant Allocation**: Immediate token distribution via SMS
   - **Fair Distribution**: Equal allocation among disaster victims
   - **Real-time Tracking**: Live monitoring of token usage
   - **Emergency Balance Management**: Quick reallocation during crises

### 6. Disaster Response Benefits

#### 6.1 For Emergency Administrators
- **Crisis Management**: Rapid response capabilities during disasters
- **Real-time Monitoring**: Live visibility into relief distribution
- **Geographic Flexibility**: Create channels for specific disaster zones
- **Instant Deployment**: Automated token distribution to affected populations
- **SMS Integration**: Communicate directly with disaster victims

#### 6.2 For Emergency Merchants
- **Reliable Payment System**: Instant settlement via Yellow Network state channels
- **Disaster Zone Access**: Serve affected communities with guaranteed payments
- **SMS-Based Operations**: Continue business even with limited internet
- **Emergency Supply Management**: Track and distribute relief supplies efficiently
- **Crisis Revenue**: Generate income while providing essential services

#### 6.3 For Disaster Victims (Beneficiaries)
- **Immediate Access**: Receive aid tokens instantly via SMS
- **Simple Transactions**: Use basic text messages for purchases
- **No Technical Barriers**: Phone number-based system requires no complex setup
- **Essential Goods Access**: Purchase food, water, medicine, and shelter supplies
- **Dignified Aid**: Choose from multiple merchants rather than receiving handouts

### 7. Disaster Response Use Cases

#### 7.1 Natural Disaster Relief (Hurricanes, Earthquakes, Floods)
- **Immediate Response**: Create emergency channels within hours of disaster
- **SMS-Based Aid**: Distribute tokens to affected families via text messages
- **Essential Supplies**: Enable purchase of food, water, medicine, and shelter materials
- **Local Merchant Network**: Partner with surviving local businesses for immediate relief

#### 7.2 Conflict Zone Humanitarian Aid
- **Safe Distribution**: Provide aid without physical cash or vulnerable distribution points
- **SMS Communication**: Coordinate with beneficiaries in areas with limited internet
- **Essential Services**: Enable access to medical supplies, food, and basic necessities
- **Merchant Support**: Help local businesses continue operating in crisis zones

#### 7.3 Pandemic Emergency Response
- **Contactless Aid**: Distribute tokens without physical contact
- **Essential Goods**: Enable purchase of medical supplies, food, and hygiene products
- **SMS-Based Transactions**: Minimize physical interaction during lockdowns
- **Local Economy Support**: Help local merchants survive during economic shutdowns

#### 7.4 Refugee Camp Management
- **Digital Identity**: Use phone numbers as digital identity for aid distribution
- **SMS-Based System**: Work in areas with limited internet infrastructure
- **Merchant Integration**: Connect refugees with local and camp merchants
- **Transparent Distribution**: Ensure fair and accountable aid distribution

#### 7.5 Post-Disaster Recovery
- **Economic Stimulus**: Provide tokens to stimulate local economic recovery
- **Merchant Support**: Help local businesses rebuild and serve communities
- **SMS-Based Commerce**: Enable economic activity even with damaged infrastructure
- **Long-term Aid**: Support communities through extended recovery periods

### 8. Technical Implementation: Yellow Network & SMS Integration

#### 8.1 Yellow Network State Channels
- **Ultra-Fast Transactions**: State channels enable instant, off-chain transactions
- **Low Cost**: Minimal transaction fees compared to on-chain operations
- **Scalability**: Handle thousands of transactions per second during emergencies
- **Reliability**: Continue operating even with intermittent internet connectivity
- **Instant Settlement**: Merchants receive payments immediately upon transaction

#### 8.2 SMS Gateway Integration
- **Universal Access**: Works with any mobile phone, no smartphone required
- **Simple Commands**: Easy-to-use text message format for transactions
- **Reliable Delivery**: SMS has higher delivery rates than internet-based messaging
- **Offline Capability**: Functions even when internet is completely unavailable
- **Multi-language Support**: Can be configured for local languages

#### 8.3 Custodial Wallet System
- **Phone Number as Identity**: Each wallet is linked to a unique phone number
- **No Private Key Management**: Users don't need to manage complex cryptographic keys
- **Instant Setup**: Wallets are created automatically when phone numbers are registered
- **Secure Backend**: All private keys are securely managed by the system
- **Easy Recovery**: Wallet access can be restored through SMS verification
