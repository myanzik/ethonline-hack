'use client';

import { useEffect } from 'react';
import { yellowNetworkService } from '@/services/yellowNetwork';

export default function YellowNetworkProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        // Initialize Yellow Network connection when the app starts
        console.log('🚀 Initializing Yellow Network connection...');

        // The service is already initialized in its constructor,
        // but we can add any additional setup here if needed

        return () => {
            // Cleanup on unmount
            yellowNetworkService.disconnect();
        };
    }, []);

    return <>{children}</>;
}
