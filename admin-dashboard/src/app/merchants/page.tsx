'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { getMerchants, formatDate } from '@/utils/dataUtils';
import { Merchant } from '@/types';
import { Search, MapPin, Phone, Mail, Building, Eye } from 'lucide-react';

export default function MerchantsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null);
    const merchants = getMerchants();

    const filteredMerchants = merchants.filter(merchant =>
        merchant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        merchant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        merchant.businessType.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Merchants</h1>
                    <p className="mt-2 text-gray-600">Manage and view all registered merchants</p>
                </div>

                <div className="mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            type="text"
                            placeholder="Search merchants by name, email, or business type..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredMerchants.map((merchant) => (
                        <Card key={merchant.id} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg">{merchant.name}</CardTitle>
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-medium ${merchant.isActive
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                            }`}
                                    >
                                        {merchant.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                    <Building className="w-4 h-4 mr-1" />
                                    {merchant.businessType}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Mail className="w-4 h-4 mr-2" />
                                        {merchant.email}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Phone className="w-4 h-4 mr-2" />
                                        {merchant.phone}
                                    </div>
                                    <div className="flex items-start text-sm text-gray-600">
                                        <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                                        <span className="line-clamp-2">{merchant.address}</span>
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        Created: {formatDate(merchant.createdAt)}
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setSelectedMerchant(merchant)}
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

                {filteredMerchants.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No merchants found matching your search.</p>
                    </div>
                )}

                {/* Merchant Detail Modal */}
                {selectedMerchant && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-xl">{selectedMerchant.name}</CardTitle>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setSelectedMerchant(null)}
                                    >
                                        ×
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="font-medium text-gray-900">Business Information</h4>
                                        <p className="text-sm text-gray-600">Type: {selectedMerchant.businessType}</p>
                                        <p className="text-sm text-gray-600">Status: {selectedMerchant.isActive ? 'Active' : 'Inactive'}</p>
                                    </div>

                                    <div>
                                        <h4 className="font-medium text-gray-900">Contact Information</h4>
                                        <p className="text-sm text-gray-600">Email: {selectedMerchant.email}</p>
                                        <p className="text-sm text-gray-600">Phone: {selectedMerchant.phone}</p>
                                    </div>

                                    <div>
                                        <h4 className="font-medium text-gray-900">Address</h4>
                                        <p className="text-sm text-gray-600">{selectedMerchant.address}</p>
                                    </div>

                                    <div>
                                        <h4 className="font-medium text-gray-900">Registration Date</h4>
                                        <p className="text-sm text-gray-600">{formatDate(selectedMerchant.createdAt)}</p>
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
