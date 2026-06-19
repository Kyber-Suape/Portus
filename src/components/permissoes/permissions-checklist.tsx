import { Checkbox } from "@/components/ui/checkbox";
import { FEATURE_LABELS } from "@/constants/permissions";
import type { PermissionSummary } from "@/types/permissions";

export interface PermissionsChecklistProps {
  catalog: PermissionSummary[];
  selectedKeys: Set<string>;
  onToggle: (key: string) => void;
}

/** Catálogo de permissões agrupado por feature, com checkboxes controlados. Reaproveitado no Cadastro e na Gestão de Usuários. */
export function PermissionsChecklist({ catalog, selectedKeys, onToggle }: PermissionsChecklistProps) {
  const groups = groupByFeature(catalog);

  return (
    <div className="flex flex-col gap-3">
      {groups.map(([feature, permissions]) => (
        <div key={feature} className="rounded-lg border border-border p-3">
          <h5 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {FEATURE_LABELS[feature] ?? feature}
          </h5>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {permissions.map((permission) => (
              <Checkbox
                key={permission.key}
                label={permission.description ?? permission.key}
                checked={selectedKeys.has(permission.key)}
                onChange={() => onToggle(permission.key)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function groupByFeature(catalog: PermissionSummary[]): [string, PermissionSummary[]][] {
  const map = new Map<string, PermissionSummary[]>();
  for (const permission of catalog) {
    const list = map.get(permission.feature) ?? [];
    list.push(permission);
    map.set(permission.feature, list);
  }
  return Array.from(map.entries());
}
