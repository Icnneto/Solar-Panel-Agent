import { SolarFinancials } from "@/lib/types";

/**
 * Data is hardcoded
 * For an MVP is OK
 * For production it should be dynamic
 */

export function calculateSolarROI(
    yearlySunHours: number,
    maxPanels: number
): SolarFinancials {
    const PANEL_WATTAGE = 400;
    const EFFICIENCY_FACTOR = 0.75;
    const ENERGY_PRICE = 0.189; // Average cost per kWh in USA (from FRED - nov/2025)
    const COST_PER_PANEL_INSTALLED = 120;

    const systemSizeKw = (maxPanels * PANEL_WATTAGE) / 1000;
    const annualGenerationKwh = systemSizeKw * yearlySunHours * EFFICIENCY_FACTOR;
    const annualSavingsBrl = annualGenerationKwh * ENERGY_PRICE;

    const totalInstallCost = maxPanels * COST_PER_PANEL_INSTALLED;
    const paybackYears = totalInstallCost / annualSavingsBrl;
    const twentyYearSavings = (annualSavingsBrl * 20) - totalInstallCost;

    return {
        systemSizeKw: Math.round(systemSizeKw),
        annualGenerationKwh: Math.round(annualGenerationKwh),
        annualSavingsBrl: Math.round(annualSavingsBrl),
        paybackYears: Number(paybackYears.toFixed(1)),
        twentyYearSavings: Math.round(twentyYearSavings)
    };
}