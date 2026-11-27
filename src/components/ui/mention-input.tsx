import * as React from "react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

export interface MentionUser {
  id: string;
  name: string;
  role?: string;
}

export interface MentionInputProps {
  value: string;
  onChange: (value: string) => void;
  users: MentionUser[];
  placeholder?: string;
  className?: string;
}

export function MentionInput({
  value,
  onChange,
  users,
  placeholder = "Viết bình luận... gõ @ để nhắc đồng nghiệp",
  className,
}: MentionInputProps) {
  const [showList, setShowList] = React.useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const next = e.target.value;
    onChange(next);
    setShowList(next.endsWith("@"));
  };

  const insertMention = (name: string) => {
    onChange(`${value}${name} `);
    setShowList(false);
  };

  return (
    <div className={cn("relative", className)}>
      <Textarea
        rows={3}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="text-xs"
      />
      {showList && users.length > 0 && (
        <div className="absolute left-0 bottom-full mb-1 z-20 w-56 rounded-md border border-border bg-surface p-1 shadow-md">
          {users.map((u) => (
            <button
              key={u.id}
              type="button"
              onClick={() => insertMention(u.name)}
              className="flex w-full items-center justify-between rounded px-2 py-1.5 text-left text-xs hover:bg-muted cursor-pointer"
            >
              <span className="font-medium text-foreground">@{u.name}</span>
              {u.role && <span className="text-[10px] text-muted-foreground">{u.role}</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
