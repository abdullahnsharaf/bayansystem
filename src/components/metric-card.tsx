import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  icon: LucideIcon;
  title: string;
  value: string;
  trend: string;
  accentClass: string;
}

export function MetricCard({ icon: Icon, title, value, trend, accentClass }: MetricCardProps) {
  return (
    <Card className="card-flat rounded-xl border-none bg-muted shadow-none">
      <CardContent className="flex items-start justify-between p-5">
        <div>
          <p className="text-xs text-muted-foreground">{title}</p>
          <p className="display-heading mt-2 text-4xl text-bayan-green-deep">{value}</p>
          <p className={cn("mt-2 text-xs", accentClass)}>{trend}</p>
        </div>
        <div className={cn("rounded-lg p-3", accentClass.includes("danger") ? "bg-danger/10" : accentClass.includes("warning") ? "bg-warning/10" : accentClass.includes("success") ? "bg-success/10" : "bg-bayan-green-deep/10")}>
          <Icon className={cn("size-5", accentClass)} />
        </div>
      </CardContent>
    </Card>
  );
}
