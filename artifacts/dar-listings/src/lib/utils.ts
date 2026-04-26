import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatMAD(price: number, transaction?: "sale" | "rent") {
  const formatted = new Intl.NumberFormat("fr-MA", {
    style: "currency",
    currency: "MAD",
    maximumFractionDigits: 0,
  }).format(price).replace("MAD", "MAD").trim();
  
  if (transaction === "rent") {
    return `${formatted}/mois`;
  }
  return formatted;
}
