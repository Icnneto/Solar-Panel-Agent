import 'dotenv/config';
import { GeocodingResponse, LatLng, ServiceResponse } from "../types";

export async function getCoordsFromAddress(address: string): Promise<ServiceResponse<LatLng>> {
    const baseUrl = process.env.BASE_URL_MAPS;

    const params = new URLSearchParams({
        address: address,
        key: process.env.GOOGLE_GEOCODING_API_KEY!
    });

    const fullUrl = `${baseUrl}?${params.toString()}`;

    const res = await fetch(fullUrl);

    if (!res.ok) {
        return {
            success: false,
            message: `Network response was not ok: ${res.statusText}`,
        }
    }

    const data: GeocodingResponse = await res.json();

    if (data.status !== 'OK') {
        return {
            success: false,
            message: `Geocoding failed with status: ${data.status}`,
        }
    };

    return {
        success: true,
        message: `Data retrieved successfully for the address: ${address}`,
        data: data.results[0].geometry.location
    } 
};