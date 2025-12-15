import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {},
            async authorize() {
                // Simulation d'un utilisateur connecté automatiquement
                return {
                    id: '1',
                    name: 'Eco Warrior',
                    email: 'ecowarrior@Kreedia.app',
                    image: '/icon.png',
                };
            },
        }),
    ],
    pages: {
        signIn: '/auth/signin',
    },
    callbacks: {
        async session({ session, token }) {
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
    },
    session: {
        strategy: 'jwt',
    },
};
