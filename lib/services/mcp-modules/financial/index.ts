import { ServiceResponse, SolarFinancials } from "@/lib/types";

/**
 * Data is hardcoded
 * For an MVP is OK
 * For production it should be dynamic
 */

export function calculateROIService(
    yearlySunHours: number,
    maxPanels: number
): ServiceResponse<SolarFinancials> {

    try {
        const PANEL_WATTAGE = 400;
        const EFFICIENCY_FACTOR = 0.75;
        const ENERGY_PRICE_USD = 0.189; // Data from nov/2025 - FRED
        const HARDWARE_COST_PER_PANEL = 120;

        const INSTALL_FACTOR = 1.5;

        const systemSizeKw = (maxPanels * PANEL_WATTAGE) / 1000;
        const annualGenerationKwh = systemSizeKw * yearlySunHours * EFFICIENCY_FACTOR;
        const annualSavingsUsd = annualGenerationKwh * ENERGY_PRICE_USD;
        const totalInstallCost = (maxPanels * HARDWARE_COST_PER_PANEL) * INSTALL_FACTOR;
        const paybackYears = totalInstallCost / annualSavingsUsd;
        const twentyYearSavings = (annualSavingsUsd * 20) - totalInstallCost;

        return {
            success: true,
            message: "ROI Calculated Successfully",
            data: {
                systemSizeKw: Math.round(systemSizeKw * 10) / 10,
                annualGenerationKwh: Math.round(annualGenerationKwh),
                annualSavingsUsd: Math.round(annualSavingsUsd),
                installationCost: Math.round(totalInstallCost),
                paybackYears: Number(paybackYears.toFixed(1)),
                twentyYearSavings: Math.round(twentyYearSavings)
            }
        };
    } catch (error) {
        return {
            success: false,
            message: "Error calculating ROI",
            error
        };
    }
}