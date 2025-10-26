'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { getChannels, formatDate, formatCurrency } from '@/utils/dataUtils';
import { Channel } from '@/types';
import { Search, Users, UserCheck, Coins, Eye, Calendar } from 'lucide-react';

export default function ChannelsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
    const channels = getChannels();

    const filteredChannels = channels.filter(channel =>
        channel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        channel.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Channels</h1>
                    <p className="mt-2 text-gray-600">View and manage all distribution channels</p>
                </div>

                <div className="mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            type="text"
                            placeholder="Search channels by name or description..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredChannels.map((channel) => (
                        <Card key={channel.id} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg">{channel.name}</CardTitle>
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-medium ${channel.isActive
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                            }`}
                                    >
                                        {channel.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600">{channel.description}</p>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex items-center text-sm">
                                            <Users className="w-4 h-4 mr-2 text-blue-600" />
                                            <span className="text-gray-600">
                                                {channel.merchants.length} Merchants
                                            </span>
                                        </div>
                                        <div className="flex items-center text-sm">
                                            <UserCheck className="w-4 h-4 mr-2 text-green-600" />
                                            <span className="text-gray-600">
                                                {channel.beneficiaries.length} Beneficiaries
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center text-sm">
                                        <Coins className="w-4 h-4 mr-2 text-yellow-600" />
                                        <span className="text-gray-600">
                                            Total: {formatCurrency(channel.totalTokensDistributed)}
                                        </span>
                                    </div>

                                    <div className="flex items-center text-sm">
                                        <Coins className="w-4 h-4 mr-2 text-yellow-600" />
                                        <span className="text-gray-600">
                                            Per Beneficiary: {formatCurrency(channel.tokensPerBeneficiary)}
                                        </span>
                                    </div>

                                    <div className="flex items-center text-sm">
                                        <Calendar className="w-4 h-4 mr-2 text-gray-600" />
                                        <span className="text-gray-600">
                                            Created: {formatDate(channel.createdAt)}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setSelectedChannel(channel)}
                                        className="w-full"
                                    >
                                        <Eye className="w-4 h-4 mr-2" />
                                        View Details
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {filteredChannels.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No channels found matching your search.</p>
                    </div>
                )}

                {/* Channel Detail Modal */}
                {selectedChannel && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-xl">{selectedChannel.name}</CardTitle>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setSelectedChannel(null)}
                                    >
                                        ×
                                    </Button>
                                </div>
                                <p className="text-sm text-gray-600">{selectedChannel.description}</p>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <h4 className="font-medium text-gray-900 mb-3">Merchants ({selectedChannel.merchants.length})</h4>
                                            <div className="space-y-2">
                                                {selectedChannel.merchants.map((merchant) => (
                                                    <div key={merchant.id} className="p-3 bg-gray-50 rounded-lg">
                                                        <p className="font-medium text-sm">{merchant.name}</p>
                                                        <p className="text-xs text-gray-600">{merchant.businessType}</p>
                                                        <p className="text-xs text-gray-500">{merchant.email}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="font-medium text-gray-900 mb-3">Beneficiaries ({selectedChannel.beneficiaries.length})</h4>
                                            <div className="space-y-2">
                                                {selectedChannel.beneficiaries.map((beneficiary) => (
                                                    <div key={beneficiary.id} className="p-3 bg-gray-50 rounded-lg">
                                                        <p className="font-medium text-sm">{beneficiary.name}</p>
                                                        <p className="text-xs text-gray-600">{beneficiary.email}</p>
                                                        <p className="text-xs text-gray-500 font-mono">
                                                            {beneficiary.walletAddress.slice(0, 10)}...{beneficiary.walletAddress.slice(-8)}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-t pt-4">
                                        <h4 className="font-medium text-gray-900 mb-3">Token Distribution</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="p-3 bg-blue-50 rounded-lg">
                                                <p className="text-sm text-blue-600 font-medium">Total Tokens</p>
                                                <p className="text-lg font-bold text-blue-900">
                                                    {formatCurrency(selectedChannel.totalTokensDistributed)}
                                                </p>
                                            </div>
                                            <div className="p-3 bg-green-50 rounded-lg">
                                                <p className="text-sm text-green-600 font-medium">Per Beneficiary</p>
                                                <p className="text-lg font-bold text-green-900">
                                                    {formatCurrency(selectedChannel.tokensPerBeneficiary)}
                                                </p>
                                            </div>
                                            <div className="p-3 bg-gray-50 rounded-lg">
                                                <p className="text-sm text-gray-600 font-medium">Created</p>
                                                <p className="text-sm font-medium text-gray-900">
                                                    {formatDate(selectedChannel.createdAt)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
}
