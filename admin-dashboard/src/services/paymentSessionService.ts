import { yellowNetworkService } from './yellowNetwork';
import { walletService } from './walletService';
import { createAppSessionMessage, NitroliteClient } from '@erc7824/nitrolite';


export interface PaymentAppDefinition {
    protocol: string;
    participants: `0x${string}`[];
    weights: number[];
    quorum: number;
    challenge: number;
    nonce: number;
}

export interface PaymentAllocation {
    participant: `0x${string}`;
    asset: string;
    amount: string;
}

export interface PaymentSession {
    appDefinition: PaymentAppDefinition;
    allocations: PaymentAllocation[];
    sessionId?: string;
    status?: 'pending' | 'active' | 'completed' | 'failed';
    createdAt: string;
}

export interface CreatePaymentSessionParams {
    merchantAddress: string;
    beneficiaryAddress: string;
    merchantAmount: string; // in USDC units (6 decimals)
    beneficiaryAmount: string; // in USDC units (6 decimals)
    protocol?: string;
}

class PaymentSessionService {
    private sessions: PaymentSession[] = [];

    public async createPaymentSession(params: CreatePaymentSessionParams): Promise<PaymentSession> {
        const {
            merchantAddress,
            beneficiaryAddress,
            merchantAmount,
            beneficiaryAmount,
            protocol = 'nitroliterpc'
        } = params;

        // Check if wallet is connected
        const walletStatus = walletService.getStatus();
        if (!walletStatus.isConnected || !walletStatus.account) {
            throw new Error('Wallet is not connected');
        }

        // Check if Yellow Network is connected
        const yellowNetworkStatus = yellowNetworkService.getStatus();
        if (!yellowNetworkStatus.isConnected) {
            throw new Error('Yellow Network is not connected');
        }

        try {
            // Define the payment application
            const appDefinition: PaymentAppDefinition = {
                protocol,
                participants: [merchantAddress as `0x${string}`, beneficiaryAddress as `0x${string}`],
                weights: [50, 50], // Equal participation
                quorum: 100, // Both participants must agree
                challenge: 0,
                nonce: Date.now()
            };

            // Initial balances (USDC with 6 decimals)
            const allocations: PaymentAllocation[] = [
                // {
                //     participant: merchantAddress as `0x${string}`,
                //     asset: 'usdc',
                //     amount: merchantAmount
                // },
                // {
                //     participant: beneficiaryAddress as `0x${string}`,
                //     asset: 'usdc',
                //     amount: beneficiaryAmount
                // }
                {
                    participant: '0x299b4CB6e48423F927560a131A5aEc6b7e13233A',
                    asset: 'usdc',
                    amount: '10000000'
                },
                {
                    participant: '0x3042b367307aB87b1A93D0E7b36261F71CD33C68',
                    asset: 'usdc',
                    amount: '20000000'
                }
            ];

            // Create the payment session
            const paymentSession: PaymentSession = {
                appDefinition,
                allocations,
                status: 'pending',
                createdAt: new Date().toISOString()
            };

            // Get user address from wallet service
            const walletStatus = walletService.getStatus();
            if (!walletStatus.account) {
                throw new Error('User address not available');
            }
            const userAddress = walletStatus.account.address;

            // Create message signer using personal_sign directly
            const personalSigner = async (message: string) => {
                if (!window.ethereum) {
                    throw new Error('MetaMask not available');
                }
                return await window.ethereum.request({
                    method: 'personal_sign',
                    params: [message, userAddress]
                });
            };

            // Create a wrapper that handles nitrolite's MessageSigner interface
            const nitroliteMessageSigner = async (payload: any) => {
                console.log("NITROLITE PAYLOAD:", payload);
                const messageString = typeof payload === 'string' ? payload : JSON.stringify(payload);
                console.log("MESSAGE TO SIGN:", messageString);
                const signature = await personalSigner(messageString);
                console.log("SIGNATURE:", signature);
                return signature as `0x${string}`;
            };

            // Create the session message using nitrolite
            const sessionMessage = await createAppSessionMessage(
                nitroliteMessageSigner,
                {
                    definition: appDefinition,
                    allocations
                }
            );

            // Send to Yellow Network
            console.log("SESSION MESSAGE:", sessionMessage);
            yellowNetworkService.sendMessage(sessionMessage);

            // Store the session
            this.sessions.push(paymentSession);

            console.log('✅ Payment session created!', {
                session: paymentSession,
                message: sessionMessage
            });

            return paymentSession;

        } catch (error) {
            console.error('Error creating payment session:', error);
            throw error;
        }
    }

    public async createChannelPaymentSession(
        channelId: string,
        merchantIds: string[],
        beneficiaryIds: string[],
        totalTokens: number
    ): Promise<PaymentSession[]> {
        const sessions: PaymentSession[] = [];

        try {
            // Get wallet status
            const walletStatus = walletService.getStatus();
            if (!walletStatus.isConnected || !walletStatus.account) {
                throw new Error('Wallet is not connected');
            }

            // Calculate tokens per beneficiary
            const tokensPerBeneficiary = Math.floor(totalTokens / beneficiaryIds.length);
            const remainingTokens = totalTokens - (tokensPerBeneficiary * beneficiaryIds.length);

            // Create payment sessions for each merchant-beneficiary pair
            for (let i = 0; i < beneficiaryIds.length; i++) {
                const beneficiaryId = beneficiaryIds[i];
                const merchantId = merchantIds[i % merchantIds.length]; // Distribute merchants evenly

                // Get wallet addresses (you'll need to import your wallet data)
                const { MERCHANT_WALLETS, BENEFICIARY_WALLETS } = await import('@/data/walletAddresses');

                const merchantAddress = MERCHANT_WALLETS[merchantId as '1' | '2' | '3' | '4' | '5'];
                const beneficiaryAddress = BENEFICIARY_WALLETS[beneficiaryId as '1' | '2' | '3' | '4' | '5' | '6'];

                if (!merchantAddress || !beneficiaryAddress) {
                    console.warn(`Missing wallet address for merchant ${merchantId} or beneficiary ${beneficiaryId}`);
                    continue;
                }

                // Calculate amounts (convert to USDC units with 6 decimals)
                const beneficiaryAmount = (tokensPerBeneficiary + (i === 0 ? remainingTokens : 0)) * 1000000;
                const merchantAmount = 0; // Merchant starts with 0, receives tokens from the system

                const session = await this.createPaymentSession({
                    merchantAddress,
                    beneficiaryAddress,
                    merchantAmount: merchantAmount.toString(),
                    beneficiaryAmount: beneficiaryAmount.toString(),
                    protocol: `channel-${channelId}-payment-v1`
                });

                sessions.push(session);
            }

            console.log(`✅ Created ${sessions.length} payment sessions for channel ${channelId}`);
            return sessions;

        } catch (error) {
            console.error('Error creating channel payment sessions:', error);
            throw error;
        }
    }

    public getSessions(): PaymentSession[] {
        return [...this.sessions];
    }

    public getSessionById(sessionId: string): PaymentSession | null {
        return this.sessions.find(session => session.sessionId === sessionId) || null;
    }

    public updateSessionStatus(sessionId: string, status: PaymentSession['status']): boolean {
        const session = this.sessions.find(s => s.sessionId === sessionId);
        if (session) {
            session.status = status;
            return true;
        }
        return false;
    }

    public clearSessions(): void {
        this.sessions = [];
    }
}

// Create a singleton instance
export const paymentSessionService = new PaymentSessionService();
