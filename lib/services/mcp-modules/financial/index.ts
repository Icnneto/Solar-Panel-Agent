import { ServiceResponse, SolarFinancials } from "@/lib/types";

/**
 * Constants - For production these should come from a database or config
 */
const PANEL_WATTAGE = 400;
const EFFICIENCY_FACTOR = 0.75;
const ENERGY_PRICE_USD = 0.189; // Data from nov/2025 - FRED
const HARDWARE_COST_PER_PANEL = 120;
const INSTALL_FACTOR = 1.5;
const CO2_KG_PER_KWH = 0.42; // Average US grid carbon intensity

export function calculateROIService(
    yearlySunHours: number,
    maxPanels: number,
    monthlyBillUsd?: number
): ServiceResponse<SolarFinancials> {

    try {
        // Calculate user's estimated annual consumption from their bill
        const annualBillUsd = (monthlyBillUsd || 150) * 12;
        const estimatedAnnualConsumptionKwh = annualBillUsd / ENERGY_PRICE_USD;

        // Calculate how many panels are needed to cover their consumption
        const kwhPerPanelPerYear = (PANEL_WATTAGE / 1000) * yearlySunHours * EFFICIENCY_FACTOR;
        const panelsNeededForFullCoverage = Math.ceil(estimatedAnnualConsumptionKwh / kwhPerPanelPerYear);

        // Use the smaller of: panels needed OR max panels available on roof
        const recommendedPanels = Math.min(panelsNeededForFullCoverage, maxPanels);

        const systemSizeKw = (recommendedPanels * PANEL_WATTAGE) / 1000;
        const annualGenerationKwh = systemSizeKw * yearlySunHours * EFFICIENCY_FACTOR;
        const annualSavingsUsd = Math.min(annualGenerationKwh * ENERGY_PRICE_USD, annualBillUsd);
        const totalInstallCost = (recommendedPanels * HARDWARE_COST_PER_PANEL) * INSTALL_FACTOR;
        const paybackYears = totalInstallCost / annualSavingsUsd;
        const twentyYearSavings = (annualSavingsUsd * 20) - totalInstallCost;

        // Calculate coverage percentage
        const monthlyBillCoverage = Math.min((annualGenerationKwh / estimatedAnnualConsumptionKwh) * 100, 100);

        // CO2 offset
        const co2OffsetKg = annualGenerationKwh * CO2_KG_PER_KWH;

        return {
            success: true,
            message: "ROI Calculated Successfully",
            data: {
                systemSizeKw: Math.round(systemSizeKw * 10) / 10,
                annualGenerationKwh: Math.round(annualGenerationKwh),
                annualSavingsUsd: Math.round(annualSavingsUsd),
                installationCost: Math.round(totalInstallCost),
                paybackYears: Number(paybackYears.toFixed(1)),
                twentyYearSavings: Math.round(twentyYearSavings),
                monthlyBillCoverage: Math.round(monthlyBillCoverage),
                recommendedPanels,
                co2OffsetKg: Math.round(co2OffsetKg)
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