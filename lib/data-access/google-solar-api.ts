import { LatLng, ServiceResponse, SolarBuildingInsights } from "../types";

export async function fetchSolarInsights(coords: LatLng): Promise<ServiceResponse<SolarBuildingInsights>> {
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

        return {
            success: false,
            message: `Solar API Error: ${res.statusText}. ${JSON.stringify(errorBody)}`,
            error: errorBody
        }
    }

    const solarInsights: SolarBuildingInsights = await res.json();

    return {
        success: true,
        message: `Solar insights retrieved successfully`,
        data: solarInsights
    }
};