'use client';

import { useState } from 'react';
import { yellowNetworkService } from '@/services/yellowNetwork';
import { walletService } from '@/services/walletService';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Send, MessageSquare, Zap } from 'lucide-react';

export default function YellowNetworkDemo() {
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [lastSentMessage, setLastSentMessage] = useState<any>(null);

    const walletStatus = walletService.getStatus();
    const yellowNetworkStatus = yellowNetworkService.getStatus();

    const handleSendMessage = async () => {
        if (!message.trim()) return;

        setIsLoading(true);
        try {
            const messageData = {
                id: Date.now(),
                method: 'custom_message',
                params: { message: message.trim() }
            };

            await yellowNetworkService.sendMessage(messageData);
            setLastSentMessage(messageData);
            setMessage('');
        } catch (error) {
            console.error('Failed to send message:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendSignedMessage = async () => {
        if (!message.trim()) return;

        setIsLoading(true);
        try {
            const messageData = {
                id: Date.now(),
                method: 'signed_message',
                params: { message: message.trim() }
            };

            const signedMessage = await yellowNetworkService.sendSignedMessage(messageData);
            setLastSentMessage(signedMessage);
            setMessage('');
        } catch (error) {
            console.error('Failed to send signed message:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateAppSession = async () => {
        setIsLoading(true);
        try {
            const appSession = await yellowNetworkService.createAppSession();
            setLastSentMessage(appSession);
        } catch (error) {
            console.error('Failed to create app session:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const canSendSigned = walletStatus.isConnected && yellowNetworkStatus.isConnected;
    const canSendRegular = yellowNetworkStatus.isConnected;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                    <MessageSquare className="w-5 h-5" />
                    <span>Yellow Network Demo</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                        Message to send:
                    </label>
                    <Input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Enter your message..."
                        disabled={isLoading}
                    />
                </div>

                <div className="flex flex-wrap gap-2">
                    <Button
                        onClick={handleSendMessage}
                        disabled={!canSendRegular || isLoading}
                        variant="outline"
                        className="flex items-center space-x-2"
                    >
                        <Send className="w-4 h-4" />
                        <span>Send Message</span>
                    </Button>

                    <Button
                        onClick={handleSendSignedMessage}
                        disabled={!canSendSigned || isLoading}
                        className="flex items-center space-x-2"
                    >
                        <Zap className="w-4 h-4" />
                        <span>Send Signed Message</span>
                    </Button>

                    <Button
                        onClick={handleCreateAppSession}
                        disabled={!canSendSigned || isLoading}
                        variant="secondary"
                        className="flex items-center space-x-2"
                    >
                        <Zap className="w-4 h-4" />
                        <span>Create App Session</span>
                    </Button>
                </div>

                {!walletStatus.isConnected && (
                    <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
                        💡 Connect your wallet to send signed messages and create app sessions
                    </div>
                )}

                {!yellowNetworkStatus.isConnected && (
                    <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                        ⚠️ Yellow Network is not connected. Please wait for connection.
                    </div>
                )}

                {lastSentMessage && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Last Sent Message:</h4>
                        <pre className="text-xs text-gray-600 overflow-x-auto">
                            {JSON.stringify(lastSentMessage, null, 2)}
                        </pre>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
