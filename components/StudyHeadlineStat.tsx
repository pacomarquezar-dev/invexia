import Card from "@/components/Card";
import type { StudyHeadlineStat as StudyHeadlineStatData } from "@/lib/guias";

export default function StudyHeadlineStat({ label, value, caption }: StudyHeadlineStatData) {
  return (
    <Card className="p-6 sm:p-8">
      <p className="text-sm font-medium text-muted">{label}</p>
      <p className="mt-1 text-5xl font-bold tracking-tight text-chart-green sm:text-6xl">
        {value}
      </p>
      {caption && <p className="mt-3 text-sm text-muted">{caption}</p>}
    </Card>
  );
}
