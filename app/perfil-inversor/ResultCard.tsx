"use client";

import Link from "next/link";
import type { InvestorProfileDefinition } from "@/lib/investorProfile";
import { maxInvestorProfileScore } from "@/lib/investorProfile";

interface ResultCardProps {
  profile: InvestorProfileDefinition;
  totalScore: number;
  onRestart: () => void;
}

export default function ResultCard({ profile, totalScore, onRestart }: ResultCardProps) {
  return (
    <div
      aria-live="polite"
      className="flex flex-col gap-4 rounded-lg border border-foreground/10 p-6"
    >
      <p className="text-sm text-foreground/70">Tu perfil de inversor</p>
      <p className="text-3xl font-semibold tracking-tight">{profile.name}</p>
      <p className="text-foreground/70">{profile.description}</p>
      <p className="text-xs text-foreground/50">
        Puntuación: {totalScore} / {maxInvestorProfileScore}
      </p>

      <div className="mt-2 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onRestart}
          className="rounded-full border border-foreground/20 px-5 py-2 text-sm font-medium transition-colors hover:bg-foreground/5"
        >
          Repetir test
        </button>
        <Link
          href="/calculadoras"
          className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background transition-colors hover:opacity-90"
        >
          Ver calculadoras
        </Link>
      </div>

      <p className="text-xs text-foreground/50">
        Este resultado es una orientación educativa sobre tu perfil de riesgo, no una
        recomendación de inversión personalizada.
      </p>
    </div>
  );
}
