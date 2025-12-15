import { auth, db } from './config';

export interface FirebaseDebugInfo {
    configStatus: {
        apiKey: boolean;
        authDomain: boolean;
        projectId: boolean;
        storageBucket: boolean;
        messagingSenderId: boolean;
        appId: boolean;
    };
    authStatus: {
        isConnected: boolean;
        currentUser: any;
    };
    firestoreStatus: {
        isConnected: boolean;
        error: string | null;
    };
}

export const getFirebaseDebugInfo = async (): Promise<FirebaseDebugInfo> => {
    const debugInfo: FirebaseDebugInfo = {
        configStatus: {
            apiKey: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
            authDomain: !!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
            projectId: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            storageBucket: !!process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
            messagingSenderId: !!process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
            appId: !!process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
        },
        authStatus: {
            isConnected: false,
            currentUser: null,
        },
        firestoreStatus: {
            isConnected: false,
            error: null,
        },
    };

    // Test Auth
    try {
        debugInfo.authStatus.isConnected = !!auth;
        debugInfo.authStatus.currentUser = auth.currentUser ? {
            uid: auth.currentUser.uid,
            email: auth.currentUser.email,
            displayName: auth.currentUser.displayName,
            emailVerified: auth.currentUser.emailVerified,
        } : null;
    } catch (error) {
        console.error('Auth debug error:', error);
    }

    // Test Firestore
    try {
        // Simple test to check if Firestore is accessible
        const testDoc = !!db.app;
        debugInfo.firestoreStatus.isConnected = testDoc;
    } catch (error) {
        debugInfo.firestoreStatus.isConnected = false;
        debugInfo.firestoreStatus.error = error instanceof Error ? error.message : 'Unknown Firestore error';
    }

    return debugInfo;
};

export const logFirebaseStatus = async () => {
    console.log('🔍 Firebase Debug Information:');

    const debugInfo = await getFirebaseDebugInfo();

    console.group('📋 Configuration Status:');
    Object.entries(debugInfo.configStatus).forEach(([key, value]) => {
        console.log(`${key}: ${value ? '✅' : '❌'}`);
    });
    console.groupEnd();

    console.group('🔐 Auth Status:');
    console.log(`Connected: ${debugInfo.authStatus.isConnected ? '✅' : '❌'}`);
    console.log('Current User:', debugInfo.authStatus.currentUser);
    console.groupEnd();

    console.group('📊 Firestore Status:');
    console.log(`Connected: ${debugInfo.firestoreStatus.isConnected ? '✅' : '❌'}`);
    if (debugInfo.firestoreStatus.error) {
        console.error('Error:', debugInfo.firestoreStatus.error);
    }
    console.groupEnd();

    return debugInfo;
};
