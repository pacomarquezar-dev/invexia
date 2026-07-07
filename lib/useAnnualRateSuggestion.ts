import { useState } from "react";
import { resolveAnnualRateSuggestion } from "./investorProfile";
import { useSuggestedInvestorProfile } from "./useSuggestedInvestorProfile";

export interface AnnualRateFieldState {
  /** Valor a usar: lo que haya editado el usuario, o si no la sugerencia, o si no el valor por defecto. */
  value: number;
  setValue: (raw: string) => void;
  /** Texto para mostrar bajo el campo mientras se está usando la sugerencia sin editar. */
  hint: string | null;
}

function toNonNegativeNumber(value: string): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

/**
 * Da el valor a usar para un campo de "rentabilidad anual esperada",
 * pre-rellenado con una sugerencia editable según el perfil de inversor
 * guardado en localStorage (ver resolveAnnualRateSuggestion en
 * investorProfile.ts para la lógica de decisión, que es la parte testeada).
 */
export function useAnnualRateSuggestion(defaultValue: number): AnnualRateFieldState {
  const [override, setOverride] = useState<number | null>(null);
  const profile = useSuggestedInvestorProfile();
  const { value, hint } = resolveAnnualRateSuggestion(profile, override, defaultValue);

  return {
    value,
    setValue: (raw: string) => setOverride(toNonNegativeNumber(raw)),
    hint,
  };
}
