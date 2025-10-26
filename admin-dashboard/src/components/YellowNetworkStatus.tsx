'use client';

import { useState, useEffect } from 'react';
import { yellowNetworkService, type YellowNetworkStatus } from '@/services/yellowNetwork';
import { Wifi, WifiOff, Loader2, AlertCircle } from 'lucide-react';

export default function YellowNetworkStatus() {
    const [status, setStatus] = useState<YellowNetworkStatus>(yellowNetworkService.getStatus());

    useEffect(() => {
        const unsubscribe = yellowNetworkService.onStatusChange(setStatus);
        return unsubscribe;
    }, []);

    const getStatusIcon = () => {
        if (status.isConnecting) {
            return <Loader2 className="w-4 h-4 animate-spin" />;
        }
        if (status.isConnected) {
            return <Wifi className="w-4 h-4" />;
        }
        if (status.error) {
            return <AlertCircle className="w-4 h-4" />;
        }
        return <WifiOff className="w-4 h-4" />;
    };

    const getStatusText = () => {
        if (status.isConnecting) {
            return 'Connecting...';
        }
        if (status.isConnected) {
            return 'Connected';
        }
        if (status.error) {
            return 'Error';
        }
        return 'Disconnected';
    };

    const getStatusColor = () => {
        if (status.isConnecting) {
            return 'text-yellow-600';
        }
        if (status.isConnected) {
            return 'text-green-600';
        }
        if (status.error) {
            return 'text-red-600';
        }
        return 'text-gray-600';
    };

    const handleReconnect = () => {
        yellowNetworkService.reconnect();
    };

    return (
        <div className="flex items-center space-x-2">
            <div className={`flex items-center space-x-1 ${getStatusColor()}`}>
                {getStatusIcon()}
                <span className="text-sm font-medium">
                    Yellow Network: {getStatusText()}
                </span>
            </div>

            {!status.isConnected && !status.isConnecting && (
                <button
                    onClick={handleReconnect}
                    className="text-xs text-blue-600 hover:text-blue-800 underline"
                >
                    Reconnect
                </button>
            )}

            {status.error && (
                <div className="text-xs text-red-600" title={status.error}>
                    {status.error}
                </div>
            )}
        </div>
    );
}
