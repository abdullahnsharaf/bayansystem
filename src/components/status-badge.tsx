import { LoaderCircle, CheckCircle2, Eye, XCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ApplicationStatus } from "@/lib/types";

const statusConfig: Record<
  ApplicationStatus,
  { label: string; className: string; icon: typeof LoaderCircle }
> = {
  review_needed: {
    label: "Review needed",
    className: "border-transparent bg-bayan-amber/16 text-bayan-amber",
    icon: Eye,
  },
  approved: {
    label: "Approved",
    className: "border-transparent bg-success/12 text-success",
    icon: CheckCircle2,
  },
  rejected: {
    label: "Rejected",
    className: "border-transparent bg-danger/12 text-danger",
    icon: XCircle,
  },
  processing: {
    label: "Processing",
    className: "border-transparent bg-bayan-blue/12 text-bayan-blue",
    icon: LoaderCircle,
  },
  draft: {
    label: "Draft",
    className: "border-transparent bg-muted text-muted-foreground",
    icon: LoaderCircle,
  },
};

export function StatusBadge({ status, className }: { status: ApplicationStatus; className?: string }) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge className={cn("gap-1 rounded-full px-3 py-1 font-medium shadow-none", config.className, className)}>
      <Icon className={cn("size-3.5", status === "processing" && "animate-spin")} />
      <span>{config.label}</span>
    </Badge>
  );
}
