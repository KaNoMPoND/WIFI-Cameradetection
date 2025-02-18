import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { deviceIP } = await req.json();

        // จำลองการโจมตี
        const result = {
            success: true,
            target: deviceIP,
            method: "Default Password Attack",
            details: "Successfully accessed device"
        };

        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json({ error: "Attack failed" }, { status: 500 });
    }
} 