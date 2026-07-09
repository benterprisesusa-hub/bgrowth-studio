import { cleaningPricingCalc } from './configs/cleaningPricing';
import { mileageDeductionCalc } from './configs/mileageDeduction';
import { roiCalc } from './configs/roi';
import { notaryFeeCalc } from './configs/notaryFee';
import { pressureWashingCalc } from './configs/pressureWashing';
import { lawnCareCalc } from './configs/lawnCare';
import { taxEstimatorCalc } from './configs/taxEstimator';
import { hourlyRateCalc } from './configs/hourlyRate';
import { startupCostCalc } from './configs/startupCost';
import { breakEvenCalc } from './configs/breakEven';
import { mortgageCalc } from './configs/mortgage';
import { commissionCalc } from './configs/commission';
import { businessProfitCalc } from './configs/businessProfit';
import { loanProfitCalc } from './configs/loanProfit';
import type { CalculatorConfig } from './types';

export const ALL_CALCULATORS: CalculatorConfig[] = [
  cleaningPricingCalc,
  mileageDeductionCalc,
  roiCalc,
  notaryFeeCalc,
  pressureWashingCalc,
  lawnCareCalc,
  taxEstimatorCalc,
  hourlyRateCalc,
  startupCostCalc,
  breakEvenCalc,
  mortgageCalc,
  commissionCalc,
  businessProfitCalc,
  loanProfitCalc,
];
