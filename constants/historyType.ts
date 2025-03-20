export interface CalculationSection {
  value: string;
  total: string;
}

export interface CalculationHistory {
  id: string;
  savedDate: Date;
  sectionA: CalculationSection;
  sectionD: CalculationSection;
  sectionM: CalculationSection;
  finalTotal: string;
}
