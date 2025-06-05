import { Data } from "../db/schema";

type BMICategory = { min: number; max: number; label: string };

const bmiCategories: BMICategory[] = [
  { min: -Infinity, max: 17, label: "Sangat kurus" },
  { min: 17, max: 18.5, label: "Kurus" },
  { min: 18.5, max: 25, label: "Normal" },
  { min: 25, max: 27, label: "Gemuk" },
  { min: 27, max: Infinity, label: "Obesitas" },
];

export const calculateImt = (data: Data) => {
  const imt = data?.berat_badan / (data?.tinggi_badan / 100 * data?.tinggi_badan / 100);
  const category = bmiCategories.find((c) => imt >= c.min && imt < c.max);
  return category ? category.label : "Unknown";
}
