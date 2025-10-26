import {
    createAuthRequestMessage,
    createAuthVerifyMessage,
    parseAnyRPCResponse,
    createGetChannelsMessage,
    createGetLedgerBalancesMessage,
    createGetConfigMessage,
    RPCMethod,
    type RPCResponse
} from '@erc7824/nitrolite';
import { walletService } from './walletService';

export interface ClearNodeStatus {
    isConnected: boolean;
    isAuthenticated: boolean;
    connectionState: 'disconnected' | 'connecting' | 'connected' | 'authenticating' | 'authenticated' | 'error';
    error?: string;
    jwtToken?: string;
}

export interface Channel {
    channel_id: string;
    status: string;
    token: string;
    participants: string[];
    balances?: any;
}

export interface ClearNodeMessage {
    req?: [string, string, any];
    res?: [string, string, any];
    method?: string;
    params?: any;
    result?: any;
    error?: any;
}

class ClearNodeService {
    private ws: WebSocket | null = null;
    private url: string;
    private isConnected: boolean = false;
    private isAuthenticated: boolean = false;
    private connectionState: ClearNodeStatus['connectionState'] = 'disconnected';
    private reconnectAttempts: number = 0;
    private maxReconnectAttempts: number = 5;
    private reconnectInterval: number = 3000;
    private messageHandlers: Map<string, (message: any) => void> = new Map();
    private requestMap: Map<string, { resolve: (value: any) => void; reject: (error: any) => void; timeout: NodeJS.Timeout }> = new Map();
    private jwtToken?: string;
    private statusCallbacks: ((status: ClearNodeStatus) => void)[] = [];

    constructor(url: string = 'wss://clearnode.yellow.org') {
        this.url = url;
    }

    public async connect(): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                this.connectionState = 'connecting';
                this.emitStatusUpdate();

                this.ws = new WebSocket(this.url);

                this.ws.onopen = async () => {
                    console.log(`Connected to ClearNode at ${this.url}`);
                    this.isConnected = true;
                    this.connectionState = 'connected';
                    this.reconnectAttempts = 0;
                    this.emitStatusUpdate();

                    // Start authentication flow
                    await this.authenticate();
                    resolve();
                };

                this.ws.onmessage = (event) => {
                    this.handleMessage(event);
                };

                this.ws.onerror = (error) => {
                    console.error('WebSocket error:', error);
                    this.connectionState = 'error';
                    this.emitStatusUpdate();
                    reject(error);
                };

                this.ws.onclose = (event) => {
                    this.isConnected = false;
                    this.isAuthenticated = false;
                    this.connectionState = 'disconnected';
                    this.emitStatusUpdate();
                    console.log(`WebSocket closed: ${event.code} ${event.reason}`);

                    // Attempt to reconnect if not a user-initiated disconnect
                    if (event.code !== 1000) {
                        this.attemptReconnect();
                    }
                };

            } catch (error) {
                this.connectionState = 'error';
                this.emitStatusUpdate();
                reject(error);
            }
        });
    }

    private async authenticate(): Promise<void> {
        try {
            this.connectionState = 'authenticating';
            this.emitStatusUpdate();

            // Get wallet status
            const walletStatus = walletService.getStatus();
            if (!walletStatus.isConnected || !walletStatus.account) {
                throw new Error('Wallet is not connected');
            }

            const userAddress = walletStatus.account.address;

            // Create message signer
            const messageSigner = async (message: string) => {
                if (!window.ethereum) {
                    throw new Error('MetaMask not available');
                }
                return await window.ethereum.request({
                    method: 'personal_sign',
                    params: [message, userAddress]
                });
            };

            // Create auth request message
            const authRequestMsg = await createAuthRequestMessage({
                address: userAddress as `0x${string}`,
                session_key: userAddress as `0x${string}`, // Using same address as session key
                app_name: 'Admin Dashboard',
                expire: (Math.floor(Date.now() / 1000) + 3600).toString(), // 1 hour expiration
                scope: 'console',
                application: userAddress as `0x${string}`, // Using user address as application
                allowances: [],
            });

            console.log('Sending auth request:', authRequestMsg);
            this.ws?.send(authRequestMsg);

        } catch (error) {
            console.error('Authentication error:', error);
            this.connectionState = 'error';
            this.emitStatusUpdate();
            throw error;
        }
    }

    private handleMessage(event: MessageEvent): void {
        try {
            const message = parseAnyRPCResponse(event.data);
            console.log('Received ClearNode message:', message);

            // Handle different message types
            if (message.res) {
                const [requestId, method, result] = message.res;

                // Handle pending requests
                if (this.requestMap.has(requestId)) {
                    const { resolve, timeout } = this.requestMap.get(requestId)!;
                    clearTimeout(timeout);
                    this.requestMap.delete(requestId);
                    resolve(result);
                    return;
                }

                // Handle specific response types
                switch (method) {
                    case RPCMethod.AuthSuccess:
                        this.handleAuthSuccess(result);
                        break;
                    case RPCMethod.AuthFailure:
                        this.handleAuthFailure(result);
                        break;
                    case RPCMethod.AuthChallenge:
                        this.handleAuthChallenge(result);
                        break;
                }
            }

            // Emit message event
            this.emit('message', message);

        } catch (error) {
            console.error('Error handling message:', error);
        }
    }

    private async handleAuthChallenge(challenge: any): Promise<void> {
        try {
            console.log('Received auth challenge:', challenge);

            // Get wallet status
            const walletStatus = walletService.getStatus();
            if (!walletStatus.isConnected || !walletStatus.account) {
                throw new Error('Wallet is not connected');
            }

            const userAddress = walletStatus.account.address;

            // Create message signer
            const messageSigner = async (message: string) => {
                if (!window.ethereum) {
                    throw new Error('MetaMask not available');
                }
                return await window.ethereum.request({
                    method: 'personal_sign',
                    params: [message, userAddress]
                });
            };

            // Create auth verify message
            const authVerifyMsg = await createAuthVerifyMessage(
                messageSigner,
                {
                    challenge: challenge.challenge,
                    session_key: userAddress,
                    allowances: []
                }
            );

            console.log('Sending auth verify:', authVerifyMsg);
            this.ws?.send(authVerifyMsg);

        } catch (error) {
            console.error('Error handling auth challenge:', error);
            this.connectionState = 'error';
            this.emitStatusUpdate();
        }
    }

    private handleAuthSuccess(result: any): void {
        console.log('Authentication successful:', result);
        this.isAuthenticated = true;
        this.connectionState = 'authenticated';
        this.jwtToken = result.jwt_token;
        this.emitStatusUpdate();
        this.emit('authenticated', result);
    }

    private handleAuthFailure(result: any): void {
        console.error('Authentication failed:', result);
        this.connectionState = 'error';
        this.emitStatusUpdate();
        this.emit('auth_failure', result);
    }

    public async getChannels(): Promise<Channel[]> {
        if (!this.isAuthenticated) {
            throw new Error('Not authenticated with ClearNode');
        }

        return new Promise((resolve, reject) => {
            try {
                // Get wallet status
                const walletStatus = walletService.getStatus();
                if (!walletStatus.isConnected || !walletStatus.account) {
                    throw new Error('Wallet is not connected');
                }

                const userAddress = walletStatus.account.address;

                // Create message signer
                const messageSigner = async (payload: any) => {
                    if (!window.ethereum) {
                        throw new Error('MetaMask not available');
                    }
                    const messageString = typeof payload === 'string' ? payload : JSON.stringify(payload);
                    return await window.ethereum.request({
                        method: 'personal_sign',
                        params: [messageString, userAddress]
                    });
                };

                // Create get channels message
                const getChannelsMsg = createGetChannelsMessage(messageSigner, userAddress);
                const parsed = JSON.parse(getChannelsMsg);
                const requestId = parsed.req[0];

                const timeout = setTimeout(() => {
                    this.requestMap.delete(requestId);
                    reject(new Error('Request timeout for getChannels'));
                }, 30000);

                this.requestMap.set(requestId, {
                    resolve: (response) => {
                        clearTimeout(timeout);
                        resolve(response);
                    },
                    reject,
                    timeout
                });

                console.log('Requesting channels:', getChannelsMsg);
                this.ws?.send(getChannelsMsg);

            } catch (error) {
                reject(error);
            }
        });
    }

    public async getLedgerBalances(channelId: string): Promise<any> {
        if (!this.isAuthenticated) {
            throw new Error('Not authenticated with ClearNode');
        }

        return new Promise((resolve, reject) => {
            try {
                // Get wallet status
                const walletStatus = walletService.getStatus();
                if (!walletStatus.isConnected || !walletStatus.account) {
                    throw new Error('Wallet is not connected');
                }

                const userAddress = walletStatus.account.address;

                // Create message signer
                const messageSigner = async (payload: any) => {
                    if (!window.ethereum) {
                        throw new Error('MetaMask not available');
                    }
                    const messageString = typeof payload === 'string' ? payload : JSON.stringify(payload);
                    return await window.ethereum.request({
                        method: 'personal_sign',
                        params: [messageString, userAddress]
                    });
                };

                // Create get ledger balances message
                const getBalancesMsg = createGetLedgerBalancesMessage(messageSigner, channelId);
                const parsed = JSON.parse(getBalancesMsg);
                const requestId = parsed.req[0];

                const timeout = setTimeout(() => {
                    this.requestMap.delete(requestId);
                    reject(new Error('Request timeout for getLedgerBalances'));
                }, 30000);

                this.requestMap.set(requestId, {
                    resolve: (response) => {
                        clearTimeout(timeout);
                        resolve(response);
                    },
                    reject,
                    timeout
                });

                console.log('Requesting ledger balances:', getBalancesMsg);
                this.ws?.send(getBalancesMsg);

            } catch (error) {
                reject(error);
            }
        });
    }

    public async getConfig(): Promise<any> {
        if (!this.isAuthenticated) {
            throw new Error('Not authenticated with ClearNode');
        }

        return new Promise((resolve, reject) => {
            try {
                // Get wallet status
                const walletStatus = walletService.getStatus();
                if (!walletStatus.isConnected || !walletStatus.account) {
                    throw new Error('Wallet is not connected');
                }

                const userAddress = walletStatus.account.address;

                // Create message signer
                const messageSigner = async (payload: any) => {
                    if (!window.ethereum) {
                        throw new Error('MetaMask not available');
                    }
                    const messageString = typeof payload === 'string' ? payload : JSON.stringify(payload);
                    return await window.ethereum.request({
                        method: 'personal_sign',
                        params: [messageString, userAddress]
                    });
                };

                // Create get config message
                const getConfigMsg = createGetConfigMessage(messageSigner, userAddress);
                const parsed = JSON.parse(getConfigMsg);
                const requestId = parsed.req[0];

                const timeout = setTimeout(() => {
                    this.requestMap.delete(requestId);
                    reject(new Error('Request timeout for getConfig'));
                }, 30000);

                this.requestMap.set(requestId, {
                    resolve: (response) => {
                        clearTimeout(timeout);
                        resolve(response);
                    },
                    reject,
                    timeout
                });

                console.log('Requesting config:', getConfigMsg);
                this.ws?.send(getConfigMsg);

            } catch (error) {
                reject(error);
            }
        });
    }

    private attemptReconnect(): void {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.error('Maximum reconnection attempts reached');
            this.connectionState = 'error';
            this.emitStatusUpdate();
            return;
        }

        this.reconnectAttempts++;
        const delay = this.reconnectInterval * Math.pow(2, this.reconnectAttempts - 1);

        console.log(`Attempting to reconnect in ${delay}ms (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);

        setTimeout(() => {
            console.log('Reconnecting...');
            this.connect().catch(error => {
                console.error(`Reconnection attempt ${this.reconnectAttempts} failed:`, error);
            });
        }, delay);
    }

    public disconnect(): void {
        if (this.ws) {
            // Clear all pending requests
            for (const [requestId, handler] of this.requestMap.entries()) {
                clearTimeout(handler.timeout);
                handler.reject(new Error('Connection closed'));
                this.requestMap.delete(requestId);
            }

            this.ws.close(1000, 'User initiated disconnect');
            this.ws = null;
        }
        this.isConnected = false;
        this.isAuthenticated = false;
        this.connectionState = 'disconnected';
        this.emitStatusUpdate();
    }

    public getStatus(): ClearNodeStatus {
        return {
            isConnected: this.isConnected,
            isAuthenticated: this.isAuthenticated,
            connectionState: this.connectionState,
            jwtToken: this.jwtToken
        };
    }

    public onStatusChange(callback: (status: ClearNodeStatus) => void): () => void {
        this.statusCallbacks.push(callback);
        return () => {
            const index = this.statusCallbacks.indexOf(callback);
            if (index > -1) {
                this.statusCallbacks.splice(index, 1);
            }
        };
    }

    private emitStatusUpdate(): void {
        const status = this.getStatus();
        this.statusCallbacks.forEach(callback => callback(status));
    }

    // Simple event system
    private events: { [key: string]: ((...args: any[]) => void)[] } = {};

    public on(event: string, callback: (...args: any[]) => void): this {
        if (!this.events[event]) this.events[event] = [];
        this.events[event].push(callback);
        return this;
    }

    public off(event: string, callback: (...args: any[]) => void): this {
        if (!this.events[event]) return this;
        if (!callback) {
            delete this.events[event];
            return this;
        }
        this.events[event] = this.events[event].filter(cb => cb !== callback);
        return this;
    }

    private emit(event: string, ...args: any[]): boolean {
        if (!this.events[event]) return false;
        this.events[event].forEach(callback => callback(...args));
        return true;
    }
}

// Create singleton instance
export const clearNodeService = new ClearNodeService();
