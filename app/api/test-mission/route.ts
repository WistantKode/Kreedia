import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        console.log('🧪 Test mission API called');

        const body = await request.json();
        console.log('📝 Test request body:', JSON.stringify(body, null, 2));

        // Simuler une réponse de test
        return NextResponse.json({
            success: true,
            message: 'Test mission created successfully',
            data: {
                id: 999,
                uid: 'test-mission-uid',
                title: null,
                description: null,
                pictures: body.pictures || [],
                clean_pictures: [],
                location: body.location || { latitude: 0, longitude: 0 },
                address: body.address || 'Test Address',
                reward_amount: null,
                reward_currency: null,
                duration: null,
                status: 'pending',
                status_label: 'Pending NGO acceptance',
                available_actions: ['accept', 'update', 'delete'],
                can_be_updated: true,
                can_be_deleted: true,
                is_final: false,
                is_visible: true,
                proposer: {
                    id: 1,
                    uid: 'test-user-uid',
                    name: 'Test User',
                    email: 'test@example.com',
                    phone: null,
                    gender: null,
                    wallet_address: null,
                    ens_name: null,
                    role: 'contributor',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error('💥 Test API error:', error);
        return NextResponse.json(
            {
                message: 'Test API error',
                error: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
