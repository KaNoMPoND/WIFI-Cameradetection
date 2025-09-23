import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        // Simulate scan
        const devices = [
            {
                name: "Smart CCTV",
                ip: "192.168.1.100",
                risk: "high",
                vulnerabilities: ["Default Password", "Open Ports"]
            }
        ];

        return NextResponse.json({ devices });
    } catch (error) {
        return NextResponse.json({ error: "Scan failed" }, { status: 500 });
    }
} 