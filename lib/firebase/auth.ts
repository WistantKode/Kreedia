import { COLLECTIONS, User, UserStatus } from '@/types/firebase';
import {
    User as FirebaseUser,
    UserCredential,
    signOut as firebaseSignOut,
    getRedirectResult,
    onAuthStateChanged,
    signInWithPopup,
    signInWithRedirect
} from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from './config';
import { NotificationService } from './services/notifications';
import { UserService } from './services/users';

export class AuthService {
    /**
     * Sign in with Google using popup
     */
    static async signInWithGoogle(): Promise<UserCredential> {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            await this.handleUserSignIn(result.user);
            return result;
        } catch (error) {
            console.error('Error signing in with Google:', error);
            throw error;
        }
    }

    /**
     * Sign in with Google using redirect (better for mobile)
     */
    static async signInWithGoogleRedirect(): Promise<void> {
        try {
            await signInWithRedirect(auth, googleProvider);
        } catch (error) {
            console.error('Error signing in with Google redirect:', error);
            throw error;
        }
    }

    /**
     * Handle redirect result after Google sign-in
     */
    static async handleRedirectResult(): Promise<UserCredential | null> {
        try {
            const result = await getRedirectResult(auth);
            if (result?.user) {
                await this.handleUserSignIn(result.user);
            }
            return result;
        } catch (error) {
            console.error('Error handling redirect result:', error);
            throw error;
        }
    }

    /**
     * Sign out
     */
    static async signOut(): Promise<void> {
        try {
            await firebaseSignOut(auth);
        } catch (error) {
            console.error('Error signing out:', error);
            throw error;
        }
    }

    /**
     * Get current user
     */
    static getCurrentUser(): FirebaseUser | null {
        return auth.currentUser;
    }

    /**
     * Get current user data from Firestore
     */
    static async getCurrentUserData(): Promise<User | null> {
        const firebaseUser = this.getCurrentUser();
        if (!firebaseUser) {
            console.log('📊 No Firebase user found');
            return null;
        }

        console.log('📊 Fetching Firestore data for user:', firebaseUser.uid);
        try {
            const userData = await UserService.getUserById(firebaseUser.uid);
            console.log('📊 Firestore user data result:', userData);
            return userData;
        } catch (error) {
            console.error('📊 Error fetching user data from Firestore:', error);
            throw error;
        }
    }

    /**
     * Listen to auth state changes
     */
    static onAuthStateChanged(callback: (user: FirebaseUser | null) => void): () => void {
        return onAuthStateChanged(auth, callback);
    }

    /**
     * Handle user sign-in (create or update user in Firestore)
     */
    private static async handleUserSignIn(firebaseUser: FirebaseUser): Promise<void> {
        try {
            console.log('Handling user sign-in for:', firebaseUser.uid);

            // Check if user already exists in Firestore
            let user = await UserService.getUserById(firebaseUser.uid);

            if (!user) {
                console.log('Creating new user in Firestore...');
                // Create new user in Firestore
                const newUserData = {
                    name: firebaseUser.displayName || 'Anonymous User',
                    email: firebaseUser.email || '',
                    profileImage: firebaseUser.photoURL || undefined,
                    phone: null,
                    gender: null,
                    walletAddress: null,
                    ensName: null,
                    status: UserStatus.ACTIVE,
                    totalMissionsCompleted: 0,
                    totalRewardsEarned: 0,
                    level: 1,
                    badges: [],
                };

                // Use the Firebase UID as the document ID
                const userRef = doc(db, COLLECTIONS.USERS, firebaseUser.uid);
                await setDoc(userRef, {
                    ...newUserData,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                });

                console.log('✅ New user created in Firestore:', firebaseUser.uid);

                // Create welcome notification for new user
                try {
                    await NotificationService.createWelcomeNotification(
                        firebaseUser.uid,
                        newUserData.name
                    );
                    console.log('✅ Welcome notification created');
                } catch (notifError) {
                    console.warn('⚠️ Failed to create welcome notification:', notifError);
                    // Don't throw error as user creation succeeded
                }
            } else {
                console.log('Updating existing user in Firestore...');
                // Update existing user with latest info from Firebase Auth
                await UserService.updateUser(firebaseUser.uid, {
                    name: firebaseUser.displayName || user.name,
                    email: firebaseUser.email || user.email,
                    profileImage: firebaseUser.photoURL || user.profileImage,
                });

                console.log('✅ Existing user updated in Firestore:', firebaseUser.uid);
            }
        } catch (error) {
            console.error('❌ Error handling user sign-in:', error);
            // Don't throw the error to prevent blocking authentication
            // The user can still be authenticated even if Firestore update fails
            console.warn('User sign-in will continue despite Firestore error');
        }
    }

    /**
     * Check if user is authenticated
     */
    static isAuthenticated(): boolean {
        return this.getCurrentUser() !== null;
    }

    /**
     * Wait for auth to initialize
     */
    static waitForAuth(): Promise<FirebaseUser | null> {
        return new Promise((resolve) => {
            const unsubscribe = onAuthStateChanged(auth, (user) => {
                unsubscribe();
                resolve(user);
            });
        });
    }

    /**
     * Update user profile
     */
    static async updateUserProfile(updateData: {
        displayName?: string;
        photoURL?: string;
    }): Promise<void> {
        const user = this.getCurrentUser();
        if (!user) throw new Error('No user is currently signed in');

        try {
            const { updateProfile } = await import('firebase/auth');
            await updateProfile(user, updateData);

            // Also update in Firestore
            await UserService.updateUser(user.uid, {
                name: updateData.displayName,
                profileImage: updateData.photoURL,
            });
        } catch (error) {
            console.error('Error updating user profile:', error);
            throw error;
        }
    }

    /**
     * Delete user account
     */
    static async deleteAccount(): Promise<void> {
        const user = this.getCurrentUser();
        if (!user) throw new Error('No user is currently signed in');

        try {
            // Delete user data from Firestore first
            await UserService.deleteUser(user.uid);

            // Then delete Firebase Auth account
            await user.delete();
        } catch (error) {
            console.error('Error deleting user account:', error);
            throw error;
        }
    }

    /**
     * Reauthenticate user (useful before sensitive operations)
     */
    static async reauthenticate(): Promise<UserCredential> {
        const user = this.getCurrentUser();
        if (!user) throw new Error('No user is currently signed in');

        try {
            const { reauthenticateWithPopup } = await import('firebase/auth');
            return await reauthenticateWithPopup(user, googleProvider);
        } catch (error) {
            console.error('Error reauthenticating user:', error);
            throw error;
        }
    }

    /**
     * Check if user email is verified
     */
    static isEmailVerified(): boolean {
        const user = this.getCurrentUser();
        return user?.emailVerified || false;
    }

    /**
     * Send email verification
     */
    static async sendEmailVerification(): Promise<void> {
        const user = this.getCurrentUser();
        if (!user) throw new Error('No user is currently signed in');

        try {
            const { sendEmailVerification } = await import('firebase/auth');
            await sendEmailVerification(user);
        } catch (error) {
            console.error('Error sending email verification:', error);
            throw error;
        }
    }
}
