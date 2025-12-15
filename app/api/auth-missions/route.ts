import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        console.log('🚀 Starting mission creation API call');

        const token = request.headers.get('Authorization');
        console.log('🔑 Token present:', !!token);

        if (!token) {
            console.log('❌ No token provided');
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        console.log('📝 Request body:', JSON.stringify(body, null, 2));

        // Valider les données requises
        if (!body.pictures || !Array.isArray(body.pictures) || body.pictures.length === 0) {
            console.log('❌ Validation failed: Pictures are required');
            return NextResponse.json(
                { message: 'Pictures are required' },
                { status: 400 }
            );
        }

        if (!body.location || !body.location.latitude || !body.location.longitude) {
            console.log('❌ Validation failed: Location coordinates are required');
            return NextResponse.json(
                { message: 'Location coordinates are required' },
                { status: 400 }
            );
        }

        if (!body.address) {
            console.log('❌ Validation failed: Address is required');
            return NextResponse.json(
                { message: 'Address is required' },
                { status: 400 }
            );
        }

        console.log('✅ Validation passed');

        // Préparer les données pour le backend
        const missionData = {
            pictures: body.pictures,
            location: {
                latitude: body.location.latitude,
                longitude: body.location.longitude,
            },
            address: body.address,
        };

        // Appeler le backend Laravel
        const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth-missions`;
        console.log('🌐 Backend URL:', backendUrl);
        console.log('🌐 API URL env var:', process.env.NEXT_PUBLIC_API_URL);
        console.log('📤 Mission data to send:', JSON.stringify(missionData, null, 2));

        if (!process.env.NEXT_PUBLIC_API_URL) {
            console.log('❌ NEXT_PUBLIC_API_URL is not set');
            return NextResponse.json(
                { message: 'API URL not configured' },
                { status: 500 }
            );
        }

        const response = await fetch(backendUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token,
            },
            body: JSON.stringify(missionData),
        });

        console.log('📡 Backend response status:', response.status);
        console.log('📡 Backend response headers:', Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
            console.log('❌ Backend error:', errorData);
            return NextResponse.json(
                { message: errorData.message || 'Failed to create mission' },
                { status: response.status }
            );
        }

        const result = await response.json();
        console.log('✅ Backend response:', JSON.stringify(result, null, 2));

        if (result.success) {
            return NextResponse.json({
                success: true,
                message: 'Mission created successfully',
                data: result.data,
            });
        } else {
            console.log('❌ Backend returned success: false');
            return NextResponse.json(
                { message: result.message || 'Failed to create mission' },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error('💥 Error creating mission:', error);
        console.error('💥 Error stack:', error instanceof Error ? error.stack : 'No stack trace');
        return NextResponse.json(
            {
                message: 'Internal server error',
                error: error instanceof Error ? error.message : 'Unknown error',
                details: process.env.NODE_ENV === 'development' ? error : undefined
            },
            { status: 500 }
        );
    }
}
