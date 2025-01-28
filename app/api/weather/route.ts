import { NextResponse } from "next/server";

const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');

    if (!address) {
        return NextResponse.json({ error: "Address parameter is required" }, { status: 400 });
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(address)}&appid=${API_KEY}`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return NextResponse.json({ data });
    } catch (error) {
        console.error('Error fetching weather data:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}