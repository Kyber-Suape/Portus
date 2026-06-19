import type { Work } from "@/types/work";
import type {
  Rdo,
  RdoActivityInput,
  RdoEquipmentInput,
  RdoNonConformityInput,
  RdoOccurrenceInput,
  RdoShift,
  RdoTeamInput,
  RdoWeatherInput,
} from "@/types/rdo";

export interface RdoWizardValues {
  date: string;
  shift: RdoShift;
  siteEngineerName: string;
  siteEngineerRegistry: string;
  foremanName: string;
  notes: string;
  activities: RdoActivityInput[];
  teams: RdoTeamInput[];
  equipments: RdoEquipmentInput[];
  weather: RdoWeatherInput;
  occurrences: RdoOccurrenceInput[];
  nonConformities: RdoNonConformityInput[];
}

export interface RdoWizardStepProps {
  values: RdoWizardValues;
  onChange: <K extends keyof RdoWizardValues>(field: K, value: RdoWizardValues[K]) => void;
  rdo: Rdo;
  /** Obra vinculada ao RDO (fonte da equipe mobilizável nas etapas 1 e 3). `null` enquanto carrega. */
  work: Work | null;
}

export function toWizardValues(rdo: Rdo): RdoWizardValues {
  return {
    date: rdo.date.slice(0, 10),
    shift: rdo.shift,
    siteEngineerName: rdo.siteEngineerName,
    siteEngineerRegistry: rdo.siteEngineerRegistry ?? "",
    foremanName: rdo.foremanName ?? "",
    notes: rdo.notes ?? "",
    activities: rdo.activities.map((a) => ({
      category: a.category,
      description: a.description,
      status: a.status,
      aiSuggestionUsed: a.aiSuggestionUsed,
    })),
    teams: rdo.teams.map((t) => ({
      name: t.name,
      function: t.function,
      quantity: t.quantity,
      startTime: t.startTime ?? undefined,
      endTime: t.endTime ?? undefined,
      company: t.company ?? undefined,
    })),
    equipments: rdo.equipments.map((e) => ({
      name: e.name,
      identifier: e.identifier ?? undefined,
      quantity: e.quantity,
      operator: e.operator ?? undefined,
      hours: e.hours ?? undefined,
      status: e.status,
    })),
    weather: rdo.weather
      ? {
          morningCondition: rdo.weather.morningCondition ?? undefined,
          afternoonCondition: rdo.weather.afternoonCondition ?? undefined,
          nightCondition: rdo.weather.nightCondition ?? undefined,
          minTemperature: rdo.weather.minTemperature ?? undefined,
          maxTemperature: rdo.weather.maxTemperature ?? undefined,
          groundStatus: rdo.weather.groundStatus,
          hadStoppage: rdo.weather.hadStoppage,
          stoppageReason: rdo.weather.stoppageReason ?? undefined,
        }
      : { groundStatus: "DRY", hadStoppage: false },
    occurrences: rdo.occurrences.map((o) => ({
      type: o.type,
      location: o.location,
      severity: o.severity,
      summary: o.summary,
      description: o.description ?? undefined,
    })),
    nonConformities: rdo.nonConformities.map((n) => ({
      title: n.title,
      description: n.description,
      severity: n.severity,
      status: n.status,
    })),
  };
}
