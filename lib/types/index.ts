export type GeocodingStatus =
    | "OK"
    | "ZERO_RESULTS"
    | "OVER_DAILY_LIMIT"
    | "OVER_QUERY_LIMIT"
    | "REQUEST_DENIED"
    | "INVALID_REQUEST"
    | "UNKNOWN_ERROR";

export interface LatLng {
    lat: number;
    lng: number;
}

export interface GeocodingResponse {
    status: GeocodingStatus;
    results: {
        geometry: {
            location: LatLng;
        };
        place_id: string;
        formatted_address: string;
    }[];
}

// Solar Types (MVP Focused)
export interface SolarBuildingInsights {
    name: string;
    center: LatLng;
    solarPotential: {
        maxArrayPanelsCount: number;
        maxSunshineHoursPerYear: number;
        carbonOffsetFactorKgPerMwh: number;
        // Add more fields here as you scale
    };
}