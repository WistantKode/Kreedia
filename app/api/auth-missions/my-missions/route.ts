import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        // Get the authorization header
        const authHeader = request.headers.get('authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                { success: false, message: 'Authorization token required' },
                { status: 401 }
            );
        }

        const token = authHeader.split(' ')[1];

        // Forward the request to your Laravel API
        const apiResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth-missions/my-missions`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        });

        const data = await apiResponse.json();

        if (!apiResponse.ok) {
            return NextResponse.json(
                { success: false, message: data.message || 'Failed to fetch missions' },
                { status: apiResponse.status }
            );
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching missions:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}
