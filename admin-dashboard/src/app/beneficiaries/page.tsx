'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { getBeneficiaries, formatDate } from '@/utils/dataUtils';
import { Beneficiary } from '@/types';
import { Search, MapPin, Phone, Mail, Wallet, Eye, Copy } from 'lucide-react';

export default function BeneficiariesPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBeneficiary, setSelectedBeneficiary] = useState<Beneficiary | null>(null);
    const beneficiaries = getBeneficiaries();

    const filteredBeneficiaries = beneficiaries.filter(beneficiary =>
        beneficiary.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        beneficiary.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        beneficiary.walletAddress.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Beneficiaries</h1>
                    <p className="mt-2 text-gray-600">Manage and view all registered beneficiaries</p>
                </div>

                <div className="mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            type="text"
                            placeholder="Search beneficiaries by name, email, or wallet address..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredBeneficiaries.map((beneficiary) => (
                        <Card key={beneficiary.id} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg">{beneficiary.name}</CardTitle>
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-medium ${beneficiary.isActive
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                            }`}
                                    >
                                        {beneficiary.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Mail className="w-4 h-4 mr-2" />
                                        {beneficiary.email}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Phone className="w-4 h-4 mr-2" />
                                        {beneficiary.phone}
                                    </div>
                                    <div className="flex items-start text-sm text-gray-600">
                                        <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                                        <span className="line-clamp-2">{beneficiary.address}</span>
                                    </div>
                                    <div className="flex items-start text-sm text-gray-600">
                                        <Wallet className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                                        <span className="font-mono text-xs break-all">
                                            {beneficiary.walletAddress.slice(0, 10)}...{beneficiary.walletAddress.slice(-8)}
                                        </span>
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        Created: {formatDate(beneficiary.createdAt)}
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setSelectedBeneficiary(beneficiary)}
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

                {filteredBeneficiaries.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No beneficiaries found matching your search.</p>
                    </div>
                )}

                {/* Beneficiary Detail Modal */}
                {selectedBeneficiary && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-xl">{selectedBeneficiary.name}</CardTitle>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setSelectedBeneficiary(null)}
                                    >
                                        ×
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="font-medium text-gray-900">Status</h4>
                                        <p className="text-sm text-gray-600">{selectedBeneficiary.isActive ? 'Active' : 'Inactive'}</p>
                                    </div>

                                    <div>
                                        <h4 className="font-medium text-gray-900">Contact Information</h4>
                                        <p className="text-sm text-gray-600">Email: {selectedBeneficiary.email}</p>
                                        <p className="text-sm text-gray-600">Phone: {selectedBeneficiary.phone}</p>
                                    </div>

                                    <div>
                                        <h4 className="font-medium text-gray-900">Address</h4>
                                        <p className="text-sm text-gray-600">{selectedBeneficiary.address}</p>
                                    </div>

                                    <div>
                                        <h4 className="font-medium text-gray-900">Wallet Address</h4>
                                        <div className="flex items-center space-x-2">
                                            <p className="text-sm text-gray-600 font-mono break-all">
                                                {selectedBeneficiary.walletAddress}
                                            </p>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => copyToClipboard(selectedBeneficiary.walletAddress)}
                                            >
                                                <Copy className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-medium text-gray-900">Registration Date</h4>
                                        <p className="text-sm text-gray-600">{formatDate(selectedBeneficiary.createdAt)}</p>
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
