'use client';

import { useEffect } from 'react';
import { clearNodeService } from '@/services/clearNodeService';

export default function ClearNodeProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        // Auto-connect to ClearNode when the app starts
        const connectToClearNode = async () => {
            try {
                console.log('Connecting to ClearNode...');
                await clearNodeService.connect();
            } catch (error) {
                console.error('Failed to auto-connect to ClearNode:', error);
            }
        };

        connectToClearNode();

        // Cleanup on unmount
        return () => {
            clearNodeService.disconnect();
        };
    }, []);

    return <>{children}</>;
}
