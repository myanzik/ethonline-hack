'use client';

import { useState, useEffect } from 'react';
import { paymentSessionService, PaymentSession } from '@/services/paymentSessionService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Zap, Clock, CheckCircle, XCircle, RefreshCw, Eye, Copy } from 'lucide-react';

export default function PaymentSessionsManager() {
    const [sessions, setSessions] = useState<PaymentSession[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        loadSessions();
    }, []);

    const loadSessions = () => {
        const allSessions = paymentSessionService.getSessions();
        setSessions(allSessions);
    };

    const refreshSessions = () => {
        setIsLoading(true);
        loadSessions();
        setTimeout(() => setIsLoading(false), 1000);
    };

    const getStatusIcon = (status: PaymentSession['status']) => {
        switch (status) {
            case 'active':
                return <CheckCircle className="w-4 h-4 text-green-600" />;
            case 'pending':
                return <Clock className="w-4 h-4 text-yellow-600" />;
            case 'completed':
                return <CheckCircle className="w-4 h-4 text-blue-600" />;
            case 'failed':
                return <XCircle className="w-4 h-4 text-red-600" />;
            default:
                return <Clock className="w-4 h-4 text-gray-600" />;
        }
    };

    const getStatusColor = (status: PaymentSession['status']) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'completed':
                return 'bg-blue-100 text-blue-800';
            case 'failed':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatAddress = (address: string) => {
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
        } catch (error) {
            console.error('Failed to copy:', error);
        }
    };

    const formatAmount = (amount: string) => {
        const numAmount = parseInt(amount);
        return (numAmount / 1000000).toFixed(6); // Convert from USDC units (6 decimals)
    };

    if (sessions.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Zap className="w-5 h-5" />
                            <span>Payment Sessions</span>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={refreshSessions}
                            disabled={isLoading}
                        >
                            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                        </Button>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8">
                        <Zap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No payment sessions created yet</p>
                        <p className="text-sm text-gray-400 mt-2">
                            Create a channel to establish payment sessions in Yellow Network
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Zap className="w-5 h-5" />
                        <span>Payment Sessions ({sessions.length})</span>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={refreshSessions}
                        disabled={isLoading}
                    >
                        <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    </Button>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {sessions.map((session, index) => (
                        <div key={index} className="p-4 border rounded-lg bg-gray-50">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center space-x-2">
                                    {getStatusIcon(session.status)}
                                    <span className="font-medium">
                                        Session {index + 1}
                                    </span>
                                </div>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                                    {session.status || 'pending'}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <h4 className="font-medium text-gray-700 mb-2">Participants</h4>
                                    <div className="space-y-1">
                                        {session.appDefinition.participants.map((participant, idx) => (
                                            <div key={idx} className="flex items-center space-x-2">
                                                <span className="font-mono text-xs">
                                                    {formatAddress(participant)}
                                                </span>
                                                <button
                                                    onClick={() => copyToClipboard(participant)}
                                                    className="text-gray-400 hover:text-gray-600"
                                                >
                                                    <Copy className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-medium text-gray-700 mb-2">Allocations</h4>
                                    <div className="space-y-1">
                                        {session.allocations.map((allocation, idx) => (
                                            <div key={idx} className="flex items-center justify-between">
                                                <span className="font-mono text-xs">
                                                    {formatAddress(allocation.participant)}
                                                </span>
                                                <span className="font-medium">
                                                    {formatAmount(allocation.amount)} {allocation.asset.toUpperCase()}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-3 pt-3 border-t border-gray-200">
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                    <span>Protocol: {session.appDefinition.protocol}</span>
                                    <span>Created: {new Date(session.createdAt).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-4 text-xs text-gray-500 bg-yellow-50 p-3 rounded-lg">
                    ⚠️ <strong>Note:</strong> Payment sessions are established in Yellow Network.
                    Status updates depend on network confirmation and participant actions.
                </div>
            </CardContent>
        </Card>
    );
}
