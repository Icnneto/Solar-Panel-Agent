import 'dotenv/config';
import { GeocodingResponse, LatLng } from "../types";

export async function getCoordsFromAddress(address: string): Promise<LatLng> {
    const baseUrl = process.env.BASE_URL_MAPS;

    const params = new URLSearchParams({
        address: address,
        key: process.env.GOOGLE_GEOCODING_API_KEY!
    });

    const fullUrl = `${baseUrl}?${params.toString()}`;
    console.log(fullUrl)

    const res = await fetch(fullUrl);

    if (!res.ok) {
        throw new Error(`Network response was not ok: ${res.statusText}`);
    }

    const data: GeocodingResponse = await res.json();

    if (data.status !== 'OK') {
        throw new Error(`Geocoding failed with status: ${data.status}`)
    };

    return data.results[0].geometry.location
};