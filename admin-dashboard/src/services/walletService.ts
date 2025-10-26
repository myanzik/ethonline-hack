export interface WalletAccount {
    address: string;
    balance?: string;
}

export interface WalletStatus {
    isConnected: boolean;
    isConnecting: boolean;
    account: WalletAccount | null;
    error: string | null;
}

export interface MessageSigner {
    (message: string): Promise<string>;
}

class WalletService {
    private status: WalletStatus = {
        isConnected: false,
        isConnecting: false,
        account: null,
        error: null,
    };
    private statusListeners: ((status: WalletStatus) => void)[] = [];
    private messageSigner: MessageSigner | null = null;

    constructor() {
        this.checkConnection();
        this.setupEventListeners();
    }

    private checkConnection() {
        if (typeof window !== 'undefined' && window.ethereum) {
            // Check if already connected
            window.ethereum.request({ method: 'eth_accounts' })
                .then((accounts: string[]) => {
                    if (accounts.length > 0) {
                        this.setAccount(accounts[0]);
                    }
                })
                .catch((error) => {
                    console.error('Error checking wallet connection:', error);
                });
        }
    }

    private setupEventListeners() {
        if (typeof window !== 'undefined' && window.ethereum) {
            // Listen for account changes
            window.ethereum.on('accountsChanged', (accounts: string[]) => {
                if (accounts.length > 0) {
                    this.setAccount(accounts[0]);
                } else {
                    this.disconnect();
                }
            });

            // Listen for chain changes
            window.ethereum.on('chainChanged', () => {
                // Refresh the page when chain changes
                window.location.reload();
            });
        }
    }

    private setAccount(address: string) {
        this.status = {
            isConnected: true,
            isConnecting: false,
            account: { address },
            error: null,
        };

        // Create message signer
        this.messageSigner = async (message: string) => {
            if (!window.ethereum) {
                throw new Error('MetaMask not available');
            }

            return await window.ethereum.request({
                method: 'personal_sign',
                params: [message, address]
            });
        };

        this.notifyStatusListeners();
        console.log('✅ Wallet connected:', address);
    }

    private updateStatus(updates: Partial<WalletStatus>) {
        this.status = { ...this.status, ...updates };
        this.notifyStatusListeners();
    }

    private notifyStatusListeners() {
        this.statusListeners.forEach(listener => listener(this.status));
    }

    public async connect(): Promise<void> {
        if (!window.ethereum) {
            const error = 'Please install MetaMask';
            this.updateStatus({ error, isConnecting: false });
            throw new Error(error);
        }

        this.updateStatus({ isConnecting: true, error: null });

        try {
            // Request wallet connection
            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts'
            });

            if (accounts.length > 0) {
                this.setAccount(accounts[0]);
            } else {
                throw new Error('No accounts found');
            }
        } catch (error: any) {
            console.error('Wallet connection error:', error);
            this.updateStatus({
                isConnected: false,
                isConnecting: false,
                error: error.message || 'Failed to connect wallet'
            });
            throw error;
        }
    }

    public disconnect() {
        this.status = {
            isConnected: false,
            isConnecting: false,
            account: null,
            error: null,
        };
        this.messageSigner = null;
        this.notifyStatusListeners();
        console.log('🔌 Wallet disconnected');
    }

    public getStatus(): WalletStatus {
        return { ...this.status };
    }

    public onStatusChange(callback: (status: WalletStatus) => void): () => void {
        this.statusListeners.push(callback);
        return () => {
            const index = this.statusListeners.indexOf(callback);
            if (index > -1) {
                this.statusListeners.splice(index, 1);
            }
        };
    }

    public async signMessage(message: string): Promise<string> {
        if (!this.messageSigner) {
            throw new Error('Wallet not connected');
        }

        return await this.messageSigner(message);
    }

    public getMessageSigner(): MessageSigner | null {
        return this.messageSigner;
    }

    public async getBalance(): Promise<string | null> {
        if (!this.status.account || !window.ethereum) {
            return null;
        }

        try {
            const balance = await window.ethereum.request({
                method: 'eth_getBalance',
                params: [this.status.account.address, 'latest']
            });

            // Convert from wei to ether
            const balanceInEth = (parseInt(balance, 16) / Math.pow(10, 18)).toFixed(4);
            return balanceInEth;
        } catch (error) {
            console.error('Error getting balance:', error);
            return null;
        }
    }
}

// Create a singleton instance
export const walletService = new WalletService();

// Extend Window interface for TypeScript
declare global {
    interface Window {
        ethereum?: {
            request: (args: { method: string; params?: any[] }) => Promise<any>;
            on: (event: string, callback: (args: any) => void) => void;
            removeListener: (event: string, callback: (args: any) => void) => void;
        };
    }
}
