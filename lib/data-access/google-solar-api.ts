import 'dotenv/config';
import { LatLng, SolarBuildingInsights } from "../types";

export async function fetchSolarInsights(coords: LatLng): Promise<SolarBuildingInsights> {
    const url = `${process.env.BASE_URL_SOLAR}/buildingInsights:findClosest`;

    const params = new URLSearchParams({
        'location.latitude': coords.lat.toString(),
        'location.longitude': coords.lng.toString(),
        'requiredQuality': 'HIGH',
        'key': process.env.GOOGLE_SOLAR_API_KEY!
    });

    const res = await fetch(`${url}?${params}`);

    if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}));
        throw new Error(`Solar API Error: ${res.statusText}. ${JSON.stringify(errorBody)}`);
    }

    return res.json();
};