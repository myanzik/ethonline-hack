'use client';

import { useState, useEffect } from 'react';
import { clearNodeService, type Channel, type ClearNodeStatus } from '@/services/clearNodeService';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function ChannelManager() {
    const [status, setStatus] = useState<ClearNodeStatus>(clearNodeService.getStatus());
    const [channels, setChannels] = useState<Channel[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
    const [channelBalances, setChannelBalances] = useState<any>(null);

    useEffect(() => {
        const unsubscribe = clearNodeService.onStatusChange(setStatus);
        return unsubscribe;
    }, []);

    const handleGetChannels = async () => {
        if (!status.isAuthenticated) {
            setError('Not authenticated with ClearNode');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const channelsData = await clearNodeService.getChannels();
            console.log('Channels received:', channelsData);
            setChannels(Array.isArray(channelsData) ? channelsData : []);
        } catch (err) {
            console.error('Error fetching channels:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch channels');
        } finally {
            setLoading(false);
        }
    };

    const handleGetChannelBalances = async (channel: Channel) => {
        if (!status.isAuthenticated) {
            setError('Not authenticated with ClearNode');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const balances = await clearNodeService.getLedgerBalances(channel.channel_id);
            console.log('Channel balances received:', balances);
            setChannelBalances(balances);
            setSelectedChannel(channel);
        } catch (err) {
            console.error('Error fetching channel balances:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch channel balances');
        } finally {
            setLoading(false);
        }
    };

    const handleGetConfig = async () => {
        if (!status.isAuthenticated) {
            setError('Not authenticated with ClearNode');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const config = await clearNodeService.getConfig();
            console.log('Config received:', config);
            alert(`Config: ${JSON.stringify(config, null, 2)}`);
        } catch (err) {
            console.error('Error fetching config:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch config');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Connection Status */}
            <Card className="p-4">
                <h3 className="text-lg font-semibold mb-4">ClearNode Connection</h3>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${status.isAuthenticated ? 'bg-green-500' :
                                status.isConnected ? 'bg-yellow-500' : 'bg-gray-400'
                            }`} />
                        <span className="font-medium">
                            {status.isAuthenticated ? 'Authenticated' :
                                status.isConnected ? 'Connected' : 'Disconnected'}
                        </span>
                    </div>
                    <div className="flex space-x-2">
                        <Button
                            onClick={handleGetChannels}
                            disabled={!status.isAuthenticated || loading}
                            size="sm"
                        >
                            {loading ? 'Loading...' : 'Get Channels'}
                        </Button>
                        <Button
                            onClick={handleGetConfig}
                            disabled={!status.isAuthenticated || loading}
                            variant="outline"
                            size="sm"
                        >
                            Get Config
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Error Display */}
            {error && (
                <Card className="p-4 border-red-200 bg-red-50">
                    <div className="text-red-600">
                        <strong>Error:</strong> {error}
                    </div>
                </Card>
            )}

            {/* Channels List */}
            {channels.length > 0 && (
                <Card className="p-4">
                    <h3 className="text-lg font-semibold mb-4">Your Channels ({channels.length})</h3>
                    <div className="space-y-3">
                        {channels.map((channel, index) => (
                            <div key={channel.channel_id || index} className="border rounded-lg p-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="font-medium">
                                            Channel ID: {channel.channel_id}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            Status: <span className={`font-medium ${channel.status === 'open' ? 'text-green-600' : 'text-yellow-600'
                                                }`}>
                                                {channel.status}
                                            </span>
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            Token: {channel.token}
                                        </div>
                                        {channel.participants && (
                                            <div className="text-sm text-gray-600">
                                                Participants: {channel.participants.length}
                                            </div>
                                        )}
                                    </div>
                                    <Button
                                        onClick={() => handleGetChannelBalances(channel)}
                                        disabled={loading}
                                        size="sm"
                                        variant="outline"
                                    >
                                        Get Balances
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            )}

            {/* Channel Balances */}
            {selectedChannel && channelBalances && (
                <Card className="p-4">
                    <h3 className="text-lg font-semibold mb-4">
                        Balances for Channel: {selectedChannel.channel_id}
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-3">
                        <pre className="text-sm overflow-auto">
                            {JSON.stringify(channelBalances, null, 2)}
                        </pre>
                    </div>
                </Card>
            )}

            {/* No Channels Message */}
            {channels.length === 0 && status.isAuthenticated && !loading && (
                <Card className="p-4">
                    <div className="text-center text-gray-600">
                        <p>No channels found.</p>
                        <p className="text-sm mt-1">Click "Get Channels" to fetch your channels from ClearNode.</p>
                    </div>
                </Card>
            )}
        </div>
    );
}
