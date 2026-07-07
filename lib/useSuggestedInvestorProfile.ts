import { useSyncExternalStore } from "react";
import type { InvestorProfile } from "./investorProfile";
import { loadInvestorProfileResult } from "./investorProfileStorage";

function subscribe() {
  return () => {};
}

function getSnapshot(): InvestorProfile | null {
  return loadInvestorProfileResult()?.profile ?? null;
}

function getServerSnapshot(): InvestorProfile | null {
  return null;
}

/**
 * Perfil de inversor guardado en localStorage, si existe. Usa
 * useSyncExternalStore (en vez de useState + useEffect) para poder leerlo
 * de forma segura desde componentes que también se renderizan en servidor,
 * sin provocar un hydration mismatch.
 */
export function useSuggestedInvestorProfile(): InvestorProfile | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
