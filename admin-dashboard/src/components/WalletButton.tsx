'use client';

import { useState, useEffect } from 'react';
import { walletService, WalletStatus } from '@/services/walletService';
import { Button } from '@/components/ui/Button';
import { Wallet, Loader2, LogOut, Copy, Check } from 'lucide-react';

export default function WalletButton() {
    const [status, setStatus] = useState<WalletStatus>(walletService.getStatus());
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const unsubscribe = walletService.onStatusChange(setStatus);
        return unsubscribe;
    }, []);

    const handleConnect = async () => {
        try {
            await walletService.connect();
        } catch (error) {
            console.error('Failed to connect wallet:', error);
        }
    };

    const handleDisconnect = () => {
        walletService.disconnect();
    };

    const copyAddress = async () => {
        if (status.account?.address) {
            try {
                await navigator.clipboard.writeText(status.account.address);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch (error) {
                console.error('Failed to copy address:', error);
            }
        }
    };

    const formatAddress = (address: string) => {
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    if (status.isConnecting) {
        return (
            <Button disabled className="flex items-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Connecting...</span>
            </Button>
        );
    }

    if (status.isConnected && status.account) {
        return (
            <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-green-800">
                        {formatAddress(status.account.address)}
                    </span>
                    <button
                        onClick={copyAddress}
                        className="text-green-600 hover:text-green-800 transition-colors"
                        title="Copy address"
                    >
                        {copied ? (
                            <Check className="w-4 h-4" />
                        ) : (
                            <Copy className="w-4 h-4" />
                        )}
                    </button>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDisconnect}
                    className="flex items-center space-x-1"
                >
                    <LogOut className="w-4 h-4" />
                    <span>Disconnect</span>
                </Button>
            </div>
        );
    }

    return (
        <Button
            onClick={handleConnect}
            className="flex items-center space-x-2"
            disabled={!!status.error}
        >
            <Wallet className="w-4 h-4" />
            <span>Connect Wallet</span>
        </Button>
    );
}
