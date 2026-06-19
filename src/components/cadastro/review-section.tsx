import type { LucideIcon } from "lucide-react";

export interface ReviewField {
  label: string;
  value?: string;
  highlight?: boolean;
}

export interface ReviewSectionProps {
  title: string;
  icon?: LucideIcon;
  fields: ReviewField[];
  columns?: 1 | 2;
}

/** Bloco de revisão "título + label/valor". Campos e a seção inteira são omitidos automaticamente quando vazios. */
export function ReviewSection({ title, icon: Icon, fields, columns = 2 }: ReviewSectionProps) {
  const filledFields = fields.filter((field) => field.value && field.value.trim() !== "");
  if (filledFields.length === 0) return null;

  return (
    <div className="rounded-xl bg-background p-4">
      <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-primary-900">
        {Icon && <Icon className="size-4" aria-hidden="true" />}
        {title}
      </h4>
      <div className={columns === 2 ? "grid grid-cols-1 gap-y-3 gap-x-4 sm:grid-cols-2" : "flex flex-col gap-3"}>
        {filledFields.map((field) => (
          <div key={field.label}>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {field.label}
            </p>
            <p
              className={
                field.highlight
                  ? "font-semibold text-primary-900"
                  : "font-medium text-foreground"
              }
            >
              {field.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
