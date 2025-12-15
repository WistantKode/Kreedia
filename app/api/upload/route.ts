import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json(
                { success: false, message: 'No file provided' },
                { status: 400 }
            );
        }

        // Vérifier le type de fichier
        if (!file.type.startsWith('image/')) {
            return NextResponse.json(
                { success: false, message: 'File must be an image' },
                { status: 400 }
            );
        }

        // Vérifier la taille du fichier (10MB max)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            return NextResponse.json(
                { success: false, message: 'File size must be less than 10MB' },
                { status: 400 }
            );
        }

        // Simuler l'upload vers le backend Laravel
        // En réalité, vous devriez envoyer le fichier vers votre backend
        const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/upload`;

        const backendFormData = new FormData();
        backendFormData.append('file', file);

        const response = await fetch(backendUrl, {
            method: 'POST',
            body: backendFormData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json(
                { success: false, message: errorData.message || 'Upload failed' },
                { status: response.status }
            );
        }

        const result = await response.json();

        if (result.success && result.file?.url) {
            return NextResponse.json({
                success: true,
                message: 'File uploaded successfully',
                file: {
                    original_name: result.file.original_name,
                    file_name: result.file.file_name,
                    extension: result.file.extension,
                    size: result.file.size,
                    url: result.file.url,
                    path: result.file.path,
                },
            });
        } else {
            return NextResponse.json(
                { success: false, message: 'Invalid response from server' },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error('Error uploading file:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}
