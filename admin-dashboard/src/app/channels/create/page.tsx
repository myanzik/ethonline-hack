'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Checkbox } from '@/components/ui/Checkbox';
import { getMerchants, getBeneficiaries, createChannel } from '@/utils/dataUtils';
import { CreateChannelData } from '@/types';
import { paymentSessionService } from '@/services/paymentSessionService';
import { walletService } from '@/services/walletService';
import { yellowNetworkService } from '@/services/yellowNetwork';
import { Search, Users, UserCheck, Coins, ArrowLeft, Check, Zap, AlertCircle } from 'lucide-react';

export default function CreateChannelPage() {
    const router = useRouter();
    const [formData, setFormData] = useState<CreateChannelData>({
        name: '',
        description: '',
        merchantIds: [],
        beneficiaryIds: [],
        totalTokens: 0,
    });

    const [merchantSearch, setMerchantSearch] = useState('');
    const [beneficiarySearch, setBeneficiarySearch] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [paymentSessionsCreated, setPaymentSessionsCreated] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const merchants = getMerchants();
    const beneficiaries = getBeneficiaries();

    const filteredMerchants = merchants.filter(merchant =>
        merchant.name.toLowerCase().includes(merchantSearch.toLowerCase()) ||
        merchant.businessType.toLowerCase().includes(merchantSearch.toLowerCase())
    );

    const filteredBeneficiaries = beneficiaries.filter(beneficiary =>
        beneficiary.name.toLowerCase().includes(beneficiarySearch.toLowerCase()) ||
        beneficiary.email.toLowerCase().includes(beneficiarySearch.toLowerCase())
    );

    const handleMerchantToggle = (merchantId: string) => {
        setFormData(prev => ({
            ...prev,
            merchantIds: prev.merchantIds.includes(merchantId)
                ? prev.merchantIds.filter(id => id !== merchantId)
                : [...prev.merchantIds, merchantId]
        }));
    };

    const handleBeneficiaryToggle = (beneficiaryId: string) => {
        setFormData(prev => ({
            ...prev,
            beneficiaryIds: prev.beneficiaryIds.includes(beneficiaryId)
                ? prev.beneficiaryIds.filter(id => id !== beneficiaryId)
                : [...prev.beneficiaryIds, beneficiaryId]
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            // Check wallet connection
            const walletStatus = walletService.getStatus();
            if (!walletStatus.isConnected) {
                throw new Error('Please connect your wallet to create payment sessions');
            }

            // Check Yellow Network connection
            const yellowNetworkStatus = yellowNetworkService.getStatus();
            if (!yellowNetworkStatus.isConnected) {
                throw new Error('Yellow Network is not connected. Please wait for connection.');
            }

            // Create the channel first
            const channel = createChannel(formData);

            // Create payment sessions in Yellow Network
            console.log('Creating payment sessions for channel:', channel.id);
            const sessions = await paymentSessionService.createChannelPaymentSession(
                channel.id,
                formData.merchantIds,
                formData.beneficiaryIds,
                formData.totalTokens
            );

            setPaymentSessionsCreated(true);
            setShowSuccess(true);

            console.log(`✅ Created ${sessions.length} payment sessions for channel ${channel.id}`);

            setTimeout(() => {
                router.push('/channels');
            }, 3000);
        } catch (error: any) {
            console.error('Error creating channel:', error);
            setError(error.message || 'Failed to create channel and payment sessions');
        } finally {
            setIsSubmitting(false);
        }
    };

    const tokensPerBeneficiary = formData.beneficiaryIds.length > 0
        ? Math.floor(formData.totalTokens / formData.beneficiaryIds.length)
        : 0;

    if (showSuccess) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                                <Check className="h-6 w-6 text-green-600" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Channel Created Successfully!</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Your channel "{formData.name}" has been created and payment sessions have been established.
                            </p>
                            {paymentSessionsCreated && (
                                <div className="flex items-center justify-center text-green-600 text-sm">
                                    <Zap className="w-4 h-4 mr-2" />
                                    Payment sessions created in Yellow Network
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <Button
                        variant="ghost"
                        onClick={() => router.back()}
                        className="mb-4"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Button>
                    <h1 className="text-3xl font-bold text-gray-900">Create New Channel</h1>
                    <p className="mt-2 text-gray-600">Create a new distribution channel and establish payment sessions in Yellow Network</p>
                </div>

                {/* Connection Status */}
                <Card className="mb-6">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2">
                                    <div className={`w-3 h-3 rounded-full ${walletService.getStatus().isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                    <span className="text-sm font-medium">
                                        Wallet: {walletService.getStatus().isConnected ? 'Connected' : 'Not Connected'}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className={`w-3 h-3 rounded-full ${yellowNetworkService.getStatus().isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                    <span className="text-sm font-medium">
                                        Yellow Network: {yellowNetworkService.getStatus().isConnected ? 'Connected' : 'Not Connected'}
                                    </span>
                                </div>
                            </div>
                            {(!walletService.getStatus().isConnected || !yellowNetworkService.getStatus().isConnected) && (
                                <div className="flex items-center text-amber-600 text-sm">
                                    <AlertCircle className="w-4 h-4 mr-1" />
                                    Both connections required
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Error Display */}
                {error && (
                    <Card className="mb-6 border-red-200 bg-red-50">
                        <CardContent className="pt-6">
                            <div className="flex items-center text-red-600">
                                <AlertCircle className="w-5 h-5 mr-2" />
                                <span className="font-medium">Error: {error}</span>
                            </div>
                        </CardContent>
                    </Card>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Basic Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Channel Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Channel Name
                                </label>
                                <Input
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    placeholder="Enter channel name"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <Input
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    placeholder="Enter channel description"
                                    required
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Merchant Selection */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Users className="w-5 h-5 mr-2" />
                                Select Merchants ({formData.merchantIds.length} selected)
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <Input
                                        type="text"
                                        placeholder="Search merchants..."
                                        value={merchantSearch}
                                        onChange={(e) => setMerchantSearch(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                                {filteredMerchants.map((merchant) => (
                                    <div
                                        key={merchant.id}
                                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${formData.merchantIds.includes(merchant.id)
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        onClick={() => handleMerchantToggle(merchant.id)}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <Checkbox
                                                checked={formData.merchantIds.includes(merchant.id)}
                                                onChange={() => handleMerchantToggle(merchant.id)}
                                            />
                                            <div className="flex-1">
                                                <p className="font-medium text-sm">{merchant.name}</p>
                                                <p className="text-xs text-gray-600">{merchant.businessType}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Beneficiary Selection */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <UserCheck className="w-5 h-5 mr-2" />
                                Select Beneficiaries ({formData.beneficiaryIds.length} selected)
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <Input
                                        type="text"
                                        placeholder="Search beneficiaries..."
                                        value={beneficiarySearch}
                                        onChange={(e) => setBeneficiarySearch(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                                {filteredBeneficiaries.map((beneficiary) => (
                                    <div
                                        key={beneficiary.id}
                                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${formData.beneficiaryIds.includes(beneficiary.id)
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        onClick={() => handleBeneficiaryToggle(beneficiary.id)}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <Checkbox
                                                checked={formData.beneficiaryIds.includes(beneficiary.id)}
                                                onChange={() => handleBeneficiaryToggle(beneficiary.id)}
                                            />
                                            <div className="flex-1">
                                                <p className="font-medium text-sm">{beneficiary.name}</p>
                                                <p className="text-xs text-gray-600">{beneficiary.email}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Token Distribution */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Coins className="w-5 h-5 mr-2" />
                                Token Distribution
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Total Tokens to Distribute
                                </label>
                                <Input
                                    type="number"
                                    min="0"
                                    step="1"
                                    value={formData.totalTokens}
                                    onChange={(e) => setFormData(prev => ({ ...prev, totalTokens: Number(e.target.value) }))}
                                    placeholder="Enter total token amount"
                                    required
                                />
                            </div>

                            {formData.beneficiaryIds.length > 0 && formData.totalTokens > 0 && (
                                <div className="p-4 bg-blue-50 rounded-lg">
                                    <h4 className="font-medium text-blue-900 mb-2">Distribution Summary</h4>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-blue-700">Total Beneficiaries:</span>
                                            <span className="ml-2 font-medium">{formData.beneficiaryIds.length}</span>
                                        </div>
                                        <div>
                                            <span className="text-blue-700">Tokens per Beneficiary:</span>
                                            <span className="ml-2 font-medium">{tokensPerBeneficiary}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Submit Button */}
                    <div className="flex justify-end space-x-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.back()}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={
                                isSubmitting ||
                                formData.merchantIds.length === 0 ||
                                formData.beneficiaryIds.length === 0 ||
                                formData.totalTokens <= 0 ||
                                !walletService.getStatus().isConnected ||
                                !yellowNetworkService.getStatus().isConnected
                            }
                        >
                            {isSubmitting ? 'Creating Channel & Payment Sessions...' : 'Create Channel & Payment Sessions'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
