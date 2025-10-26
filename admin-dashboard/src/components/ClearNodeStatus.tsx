'use client';

import { useState, useEffect } from 'react';
import { clearNodeService, type ClearNodeStatus } from '@/services/clearNodeService';
import { Button } from '@/components/ui/Button';

export default function ClearNodeStatus() {
    const [status, setStatus] = useState<ClearNodeStatus>(clearNodeService.getStatus());

    useEffect(() => {
        const unsubscribe = clearNodeService.onStatusChange(setStatus);
        return unsubscribe;
    }, []);

    const handleConnect = async () => {
        try {
            await clearNodeService.connect();
        } catch (error) {
            console.error('Failed to connect to ClearNode:', error);
        }
    };

    const handleDisconnect = () => {
        clearNodeService.disconnect();
    };

    const getStatusColor = () => {
        switch (status.connectionState) {
            case 'connected':
            case 'authenticated':
                return 'text-green-600';
            case 'connecting':
            case 'authenticating':
                return 'text-yellow-600';
            case 'error':
                return 'text-red-600';
            default:
                return 'text-gray-600';
        }
    };

    const getStatusText = () => {
        switch (status.connectionState) {
            case 'disconnected':
                return 'Disconnected';
            case 'connecting':
                return 'Connecting...';
            case 'connected':
                return 'Connected';
            case 'authenticating':
                return 'Authenticating...';
            case 'authenticated':
                return 'Authenticated';
            case 'error':
                return 'Error';
            default:
                return 'Unknown';
        }
    };

    return (
        <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${status.isAuthenticated ? 'bg-green-500' :
                                status.isConnected ? 'bg-yellow-500' : 'bg-gray-400'
                            }`} />
                        <span className="font-medium">ClearNode</span>
                    </div>
                    <span className={`text-sm ${getStatusColor()}`}>
                        {getStatusText()}
                    </span>
                    {status.jwtToken && (
                        <span className="text-xs text-gray-500">
                            (JWT: {status.jwtToken.substring(0, 8)}...)
                        </span>
                    )}
                </div>

                <div className="flex space-x-2">
                    {!status.isConnected ? (
                        <Button
                            onClick={handleConnect}
                            disabled={status.connectionState === 'connecting' || status.connectionState === 'authenticating'}
                            size="sm"
                        >
                            {status.connectionState === 'connecting' || status.connectionState === 'authenticating' ? 'Connecting...' : 'Connect'}
                        </Button>
                    ) : (
                        <Button
                            onClick={handleDisconnect}
                            variant="outline"
                            size="sm"
                        >
                            Disconnect
                        </Button>
                    )}
                </div>
            </div>

            {status.error && (
                <div className="mt-2 text-sm text-red-600">
                    Error: {status.error}
                </div>
            )}
        </div>
    );
}
