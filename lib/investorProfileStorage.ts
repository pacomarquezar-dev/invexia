import type { InvestorProfile } from "./investorProfile";

const STORAGE_KEY = "invexia:perfil-inversor";

export interface StoredInvestorProfileResult {
  profile: InvestorProfile;
  totalScore: number;
  completedAt: string;
}

export function saveInvestorProfileResult(result: StoredInvestorProfileResult): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(result));
}

export function loadInvestorProfileResult(): StoredInvestorProfileResult | null {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as StoredInvestorProfileResult;
  } catch {
    return null;
  }
}

export function clearInvestorProfileResult(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}
