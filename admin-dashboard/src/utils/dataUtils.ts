import { Merchant, Beneficiary, Channel, CreateChannelData } from '@/types';
import { mockMerchants, mockBeneficiaries, mockChannels } from '@/data/mockData';

// In a real app, these would be API calls
export const getMerchants = (): Merchant[] => {
    return mockMerchants;
};

export const getBeneficiaries = (): Beneficiary[] => {
    return mockBeneficiaries;
};

export const getChannels = (): Channel[] => {
    return mockChannels;
};

export const getMerchantById = (id: string): Merchant | undefined => {
    return mockMerchants.find(merchant => merchant.id === id);
};

export const getBeneficiaryById = (id: string): Beneficiary | undefined => {
    return mockBeneficiaries.find(beneficiary => beneficiary.id === id);
};

export const createChannel = (data: CreateChannelData): Channel => {
    const merchants = data.merchantIds.map(id => getMerchantById(id)).filter(Boolean) as Merchant[];
    const beneficiaries = data.beneficiaryIds.map(id => getBeneficiaryById(id)).filter(Boolean) as Beneficiary[];

    const tokensPerBeneficiary = beneficiaries.length > 0 ? Math.floor(data.totalTokens / beneficiaries.length) : 0;

    const newChannel: Channel = {
        id: (mockChannels.length + 1).toString(),
        name: data.name,
        description: data.description,
        merchants,
        beneficiaries,
        totalTokensDistributed: data.totalTokens,
        tokensPerBeneficiary,
        isActive: true,
        createdAt: new Date().toISOString(),
    };

    mockChannels.push(newChannel);
    return newChannel;
};

export const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount);
};
