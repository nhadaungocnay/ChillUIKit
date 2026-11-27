import { ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export interface ApprovalCardProps {
  title: string;
  description?: string;
  command: string;
  risk?: "low" | "medium" | "high";
  onApprove: () => void;
  onReject: () => void;
  className?: string;
}

export function ApprovalCard({
  title,
  description,
  command,
  risk = "medium",
  onApprove,
  onReject,
  className,
}: ApprovalCardProps) {
  const badgeVariant =
    risk === "high" ? "destructive" : risk === "medium" ? "warning" : "secondary";

  return (
    <Card className={cn("border-warning/40", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <ShieldAlert className="h-4 w-4 text-warning" />
          {title}
        </CardTitle>
        <Badge variant={badgeVariant}>{risk} risk</Badge>
      </CardHeader>
      <CardContent className="space-y-2">
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
        <pre className="overflow-x-auto rounded-md border border-border bg-background p-2.5 font-mono text-xs text-foreground">
          <code>{command}</code>
        </pre>
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button variant="outline" size="sm" onClick={onReject}>
          Reject
        </Button>
        <Button size="sm" onClick={onApprove}>
          Approve
        </Button>
      </CardFooter>
    </Card>
  );
}
