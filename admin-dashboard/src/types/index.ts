export interface Merchant {
    id: string;
    name: string;
    email: string;
    address: string;
    phone: string;
    businessType: string;
    isActive: boolean;
    createdAt: string;
}

export interface Beneficiary {
    id: string;
    name: string;
    email: string;
    address: string;
    phone: string;
    walletAddress: string;
    isActive: boolean;
    createdAt: string;
}

export interface Channel {
    id: string;
    name: string;
    description: string;
    merchants: Merchant[];
    beneficiaries: Beneficiary[];
    totalTokensDistributed: number;
    tokensPerBeneficiary: number;
    isActive: boolean;
    createdAt: string;
}

export interface CreateChannelData {
    name: string;
    description: string;
    merchantIds: string[];
    beneficiaryIds: string[];
    totalTokens: number;
}
