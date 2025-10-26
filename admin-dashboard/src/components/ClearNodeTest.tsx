'use client';

import { useState } from 'react';
import { clearNodeService } from '@/services/clearNodeService';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function ClearNodeTest() {
    const [logs, setLogs] = useState<string[]>([]);
    const [isConnected, setIsConnected] = useState(false);

    const addLog = (message: string) => {
        setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
    };

    const handleConnect = async () => {
        try {
            addLog('Attempting to connect to ClearNode...');
            await clearNodeService.connect();
            setIsConnected(true);
            addLog('✅ Connected to ClearNode successfully!');
        } catch (error) {
            addLog(`❌ Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };

    const handleGetChannels = async () => {
        try {
            addLog('Requesting channels...');
            const channels = await clearNodeService.getChannels();
            addLog(`✅ Received ${Array.isArray(channels) ? channels.length : 0} channels`);
            addLog(`Channels data: ${JSON.stringify(channels, null, 2)}`);
        } catch (error) {
            addLog(`❌ Failed to get channels: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };

    const handleGetConfig = async () => {
        try {
            addLog('Requesting config...');
            const config = await clearNodeService.getConfig();
            addLog(`✅ Received config: ${JSON.stringify(config, null, 2)}`);
        } catch (error) {
            addLog(`❌ Failed to get config: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };

    const handleDisconnect = () => {
        clearNodeService.disconnect();
        setIsConnected(false);
        addLog('Disconnected from ClearNode');
    };

    const clearLogs = () => {
        setLogs([]);
    };

    return (
        <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">ClearNode Connection Test</h3>

            <div className="space-y-4">
                <div className="flex space-x-2">
                    <Button
                        onClick={handleConnect}
                        disabled={isConnected}
                        size="sm"
                    >
                        Connect
                    </Button>
                    <Button
                        onClick={handleGetChannels}
                        disabled={!isConnected}
                        variant="outline"
                        size="sm"
                    >
                        Get Channels
                    </Button>
                    <Button
                        onClick={handleGetConfig}
                        disabled={!isConnected}
                        variant="outline"
                        size="sm"
                    >
                        Get Config
                    </Button>
                    <Button
                        onClick={handleDisconnect}
                        disabled={!isConnected}
                        variant="destructive"
                        size="sm"
                    >
                        Disconnect
                    </Button>
                    <Button
                        onClick={clearLogs}
                        variant="ghost"
                        size="sm"
                    >
                        Clear Logs
                    </Button>
                </div>

                <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
                    {logs.length === 0 ? (
                        <div className="text-gray-500">No logs yet. Click "Connect" to start testing.</div>
                    ) : (
                        logs.map((log, index) => (
                            <div key={index} className="mb-1">
                                {log}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </Card>
    );
}
