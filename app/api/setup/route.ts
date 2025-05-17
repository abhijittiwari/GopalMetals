import { NextRequest, NextResponse } from 'next/server';
import { seedDatabase } from '@/lib/seed';

export async function GET(request: NextRequest) {
  try {
    // Security check - only allow in deployment or with secret key
    const authHeader = request.headers.get('authorization');
    const isAuthorized = 
      process.env.NODE_ENV === 'development' || 
      authHeader === `Bearer ${process.env.SETUP_SECRET_KEY}`;
    
    if (!isAuthorized) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Run database seeding
    const seeded = await seedDatabase();
    
    return NextResponse.json({
      success: true,
      message: 'Database setup completed successfully',
      seeded
    });
  } catch (error) {
    console.error('Error during database setup:', error);
    return NextResponse.json(
      { error: 'Failed to set up database' },
      { status: 500 }
    );
  }
} 