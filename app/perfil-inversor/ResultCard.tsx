"use client";

import { Scale, Shield, TrendingUp, type LucideIcon } from "lucide-react";
import Button from "@/components/Button";
import Card from "@/components/Card";
import type { InvestorProfile, InvestorProfileDefinition } from "@/lib/investorProfile";
import { maxInvestorProfileScore } from "@/lib/investorProfile";
import { CHART_GREEN, CHART_GREEN_MID } from "@/lib/chartColors";

interface ResultCardProps {
  profile: InvestorProfileDefinition;
  totalScore: number;
  onRestart: () => void;
}

interface ProfileVisual {
  Icon: LucideIcon;
  /** Color distintivo del perfil: variación de intensidad dentro del verde ya usado en la web. */
  color: string;
  /** Solo el perfil agresivo reutiliza el glow de los resultados de las calculadoras (mismo verde que .result-glow). */
  glow?: boolean;
}

const profileVisuals: Record<InvestorProfile, ProfileVisual> = {
  conservador: { Icon: Shield, color: CHART_GREEN_MID },
  moderado: { Icon: Scale, color: "var(--accent)" },
  agresivo: { Icon: TrendingUp, color: CHART_GREEN, glow: true },
};

export default function ResultCard({ profile, totalScore, onRestart }: ResultCardProps) {
  const visual = profileVisuals[profile.id];
  const { Icon } = visual;

  return (
    <Card aria-live="polite" className="flex flex-col gap-4 p-6 sm:p-8">
      <p className="text-sm font-medium text-muted">Tu perfil de inversor</p>

      <div className="flex items-center gap-3">
        <Icon aria-hidden="true" className="h-9 w-9 shrink-0" style={{ color: visual.color }} />
        <p
          className={`text-4xl font-bold tracking-tight sm:text-5xl ${visual.glow ? "result-glow" : ""}`}
          style={{ color: visual.color }}
        >
          {profile.name}
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <p className="text-sm font-medium text-muted">Qué significa este perfil</p>
        <p className="leading-7 text-foreground/80">{profile.description}</p>
      </div>

      <p className="text-xs text-muted">
        Puntuación: {totalScore} / {maxInvestorProfileScore}
      </p>

      <div className="mt-2 flex flex-wrap gap-3">
        <Button type="button" variant="secondary" onClick={onRestart}>
          Repetir test
        </Button>
        <Button href="/calculadoras">Ver calculadoras</Button>
      </div>

      <p className="text-xs text-muted">
        Este resultado es una orientación educativa sobre tu perfil de riesgo, no una
        recomendación de inversión personalizada.
      </p>
    </Card>
  );
}
