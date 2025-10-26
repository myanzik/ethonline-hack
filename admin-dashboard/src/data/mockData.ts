import { Merchant, Beneficiary, Channel } from '@/types';
import { MERCHANT_WALLETS, BENEFICIARY_WALLETS } from './walletAddresses';

export const mockMerchants: Merchant[] = [
    {
        id: '1',
        name: 'Green Grocery Store',
        email: 'contact@greengrocery.com',
        address: '123 Main St, City, State 12345',
        phone: '+1 (555) 123-4567',
        businessType: 'Grocery',
        walletAddress: MERCHANT_WALLETS[1],
        isActive: true,
        createdAt: '2024-01-15T10:30:00Z',
    },
    {
        id: '2',
        name: 'Health & Wellness Center',
        email: 'contact@healthwellness.com',
        address: '321 Health St, City, State 12345',
        phone: '+1 (555) 456-7890',
        businessType: 'Healthcare',
        walletAddress: MERCHANT_WALLETS[4],
        isActive: false,
        createdAt: '2024-02-10T16:20:00Z',
    },
    {
        id: '3',
        name: 'Local Restaurant',
        email: 'orders@localrestaurant.com',
        address: '654 Food Court, City, State 12345',
        phone: '+1 (555) 567-8901',
        businessType: 'Food & Beverage',
        walletAddress: MERCHANT_WALLETS[5],
        isActive: true,
        createdAt: '2024-02-15T11:30:00Z',
    },
];

export const mockBeneficiaries: Beneficiary[] = [
    {
        id: '1',
        name: 'Alice Johnson',
        email: 'alice.johnson@email.com',
        address: '100 Oak Street, City, State 12345',
        phone: '+1 (555) 111-2222',
        walletAddress: BENEFICIARY_WALLETS[1],
        isActive: true,
        createdAt: '2024-01-10T08:00:00Z',
    },
    {
        id: '2',
        name: 'Bob Smith',
        email: 'bob.smith@email.com',
        address: '200 Pine Avenue, City, State 12345',
        phone: '+1 (555) 222-3333',
        walletAddress: BENEFICIARY_WALLETS[2],
        isActive: true,
        createdAt: '2024-01-12T10:15:00Z',
    },
    {
        id: '3',
        name: 'Carol Davis',
        email: 'carol.davis@email.com',
        address: '300 Maple Drive, City, State 12345',
        phone: '+1 (555) 333-4444',
        walletAddress: BENEFICIARY_WALLETS[3],
        isActive: true,
        createdAt: '2024-01-18T14:30:00Z',
    },
    {
        id: '4',
        name: 'David Wilson',
        email: 'david.wilson@email.com',
        address: '400 Elm Street, City, State 12345',
        phone: '+1 (555) 444-5555',
        walletAddress: BENEFICIARY_WALLETS[4],
        isActive: false,
        createdAt: '2024-02-05T12:45:00Z',
    },
    {
        id: '5',
        name: 'Eva Brown',
        email: 'eva.brown@email.com',
        address: '500 Cedar Lane, City, State 12345',
        phone: '+1 (555) 555-6666',
        walletAddress: BENEFICIARY_WALLETS[5],
        isActive: true,
        createdAt: '2024-02-12T16:00:00Z',
    },
    {
        id: '6',
        name: 'Frank Miller',
        email: 'frank.miller@email.com',
        address: '600 Birch Road, City, State 12345',
        phone: '+1 (555) 666-7777',
        walletAddress: BENEFICIARY_WALLETS[6],
        isActive: true,
        createdAt: '2024-02-18T09:20:00Z',
    },
];

export const mockChannels: Channel[] = [
    {
        id: '1',
        name: 'Food Assistance Program',
        description: 'Channel for distributing food tokens to beneficiaries for grocery purchases',
        merchants: [mockMerchants[0], mockMerchants[4]], // Green Grocery Store, Local Restaurant
        beneficiaries: [mockBeneficiaries[0], mockBeneficiaries[1], mockBeneficiaries[2]], // Alice, Bob, Carol
        totalTokensDistributed: 1500,
        tokensPerBeneficiary: 500,
        isActive: true,
        createdAt: '2024-02-01T10:00:00Z',
    },
    {
        id: '2',
        name: 'Tech Support Initiative',
        description: 'Channel for providing technology services to beneficiaries',
        merchants: [mockMerchants[1]], // Tech Solutions Inc
        beneficiaries: [mockBeneficiaries[3], mockBeneficiaries[4]], // David, Eva
        totalTokensDistributed: 800,
        tokensPerBeneficiary: 400,
        isActive: true,
        createdAt: '2024-02-10T14:30:00Z',
    },
];
