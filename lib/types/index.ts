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

export interface SolarFinancials {
    annualGenerationKwh: number;
    annualSavingsUsd: number;
    paybackYears: number;
    twentyYearSavings: number;
    systemSizeKw: number;
    installationCost: number;
}

export type ServiceResponse<T = null> = {
    success: boolean;
    message: string;
    data?: T;
    error?: any;
}