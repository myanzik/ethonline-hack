import { walletService } from './walletService';

export interface YellowNetworkMessage {
    id?: string;
    method?: string;
    params?: unknown;
    result?: unknown;
    error?: unknown;
}

export interface YellowNetworkStatus {
    isConnected: boolean;
    isConnecting: boolean;
    error: string | null;
    lastMessage: YellowNetworkMessage | null;
}

class YellowNetworkService {
    private ws: WebSocket | null = null;
    private status: YellowNetworkStatus = {
        isConnected: false,
        isConnecting: false,
        error: null,
        lastMessage: null,
    };
    private statusListeners: ((status: YellowNetworkStatus) => void)[] = [];
    private messageListeners: ((message: YellowNetworkMessage) => void)[] = [];

    constructor() {
        this.connect();
    }

    private connect() {
        if (this.ws?.readyState === WebSocket.OPEN || this.ws?.readyState === WebSocket.CONNECTING) {
            return;
        }

        this.updateStatus({ isConnecting: true, error: null });
        console.log('Connecting to Yellow Network...');

        try {
            this.ws = new WebSocket('wss://clearnet.yellow.com/ws');

            this.ws.onopen = () => {
                console.log('✅ Connected to Yellow Network!');
                this.updateStatus({
                    isConnected: true,
                    isConnecting: false,
                    error: null
                });
            };

            this.ws.onmessage = (event) => {
                try {
                    const message = JSON.parse(event.data);
                    console.log('📨 Received:', message);

                    this.updateStatus({ lastMessage: message });
                    this.notifyMessageListeners(message);
                } catch (error) {
                    console.error('Error parsing message:', error);
                    this.updateStatus({ error: 'Failed to parse message' });
                }
            };

            this.ws.onerror = (error) => {
                console.error('Connection error:', error);
                this.updateStatus({
                    isConnected: false,
                    isConnecting: false,
                    error: 'Connection error occurred'
                });
            };

            this.ws.onclose = () => {
                console.log('Connection closed');
                this.updateStatus({
                    isConnected: false,
                    isConnecting: false
                });

                // Attempt to reconnect after 5 seconds
                setTimeout(() => {
                    if (!this.status.isConnected && !this.status.isConnecting) {
                        this.connect();
                    }
                }, 5000);
            };
        } catch (error) {
            console.error('Failed to create WebSocket connection:', error);
            this.updateStatus({
                isConnecting: false,
                error: 'Failed to create connection'
            });
        }
    }

    private updateStatus(updates: Partial<YellowNetworkStatus>) {
        this.status = { ...this.status, ...updates };
        this.notifyStatusListeners();
    }

    private notifyStatusListeners() {
        this.statusListeners.forEach(listener => listener(this.status));
    }

    private notifyMessageListeners(message: YellowNetworkMessage) {
        this.messageListeners.forEach(listener => listener(message));
    }

    public getStatus(): YellowNetworkStatus {
        return { ...this.status };
    }

    public onStatusChange(callback: (status: YellowNetworkStatus) => void): () => void {
        this.statusListeners.push(callback);
        return () => {
            const index = this.statusListeners.indexOf(callback);
            if (index > -1) {
                this.statusListeners.splice(index, 1);
            }
        };
    }

    public onMessage(callback: (message: YellowNetworkMessage) => void): () => void {
        this.messageListeners.push(callback);
        return () => {
            const index = this.messageListeners.indexOf(callback);
            if (index > -1) {
                this.messageListeners.splice(index, 1);
            }
        };
    }

    public sendMessage(message: unknown) {
        if (this.ws?.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(message));
        } else {
            console.warn('WebSocket is not connected. Cannot send message.');
        }
    }

    public async sendSignedMessage(message: unknown) {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
            throw new Error('WebSocket is not connected');
        }

        const walletStatus = walletService.getStatus();
        if (!walletStatus.isConnected || !walletStatus.account) {
            throw new Error('Wallet is not connected');
        }

        try {
            // Create a message to sign
            const messageToSign = JSON.stringify(message);

            // Sign the message
            const signature = await walletService.signMessage(messageToSign);

            // Add signature to the message
            const signedMessage = {
                ...(typeof message === 'object' && message !== null ? message : {}),
                signature,
                signer: walletStatus.account.address
            };

            // Send the signed message
            this.ws.send(JSON.stringify(signedMessage));
            console.log('📤 Sent signed message:', signedMessage);

            return signedMessage;
        } catch (error) {
            console.error('Error sending signed message:', error);
            throw error;
        }
    }

    public async createAppSession() {
        const walletStatus = walletService.getStatus();
        if (!walletStatus.isConnected || !walletStatus.account) {
            throw new Error('Wallet is not connected');
        }

        try {
            const messageSigner = walletService.getMessageSigner();
            if (!messageSigner) {
                throw new Error('Message signer not available');
            }

            // Create a simple app session message
            const appSessionMessage = {
                id: Date.now(),
                method: 'app_session_create',
                params: {
                    address: walletStatus.account.address,
                    timestamp: Date.now()
                }
            };

            // Sign the app session message
            const messageToSign = JSON.stringify(appSessionMessage);
            const signature = await messageSigner(messageToSign);

            const signedAppSession = {
                ...appSessionMessage,
                signature,
                signer: walletStatus.account.address
            };

            this.sendMessage(signedAppSession);

            console.log('📤 Created app session:', signedAppSession);
            return signedAppSession;
        } catch (error) {
            console.error('Error creating app session:', error);
            throw error;
        }
    }

    public disconnect() {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
        this.updateStatus({
            isConnected: false,
            isConnecting: false
        });
    }

    public reconnect() {
        this.disconnect();
        setTimeout(() => this.connect(), 1000);
    }
}

// Create a singleton instance
export const yellowNetworkService = new YellowNetworkService();
