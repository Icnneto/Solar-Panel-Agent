import { getCoordsFromAddress } from "@/lib/data-access/google-maps-api";
import { fetchSolarInsights } from "@/lib/data-access/google-solar-api";
import { ServiceResponse, SolarBuildingInsights } from "@/lib/types";

export async function getCoordsFromAddressService(address: string): Promise<ServiceResponse<SolarBuildingInsights>> {
    try {
        const coordsRes = await getCoordsFromAddress(address);

        if (!coordsRes.success || !coordsRes.data) {
            return {
                success: false,
                message: coordsRes.message || 'Failed to find address coordinates'
            }
        }

        const solarRes = await fetchSolarInsights(coordsRes.data);

        if (!solarRes.success || !solarRes.data) {
            return {
                success: false,
                message: solarRes.message || 'Address found, but no solar data available'
            }
        }

        return {
            success: true,
            message: "Successfully retrieved solar building insights.",
            data: solarRes.data
        };

    } catch (error) {
        return {
            success: false,
            message: "Unexpected error in Solar Service",
            error: error
        };
    }
}