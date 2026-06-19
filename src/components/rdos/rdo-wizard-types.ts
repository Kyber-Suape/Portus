import type { Work } from "@/types/work";
import type {
  Rdo,
  RdoActivityInput,
  RdoEquipmentInput,
  RdoNonConformityInput,
  RdoOccurrenceInput,
  RdoProfessionalInput,
  RdoShift,
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
  professionals: RdoProfessionalInput[];
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
    professionals: rdo.professionals.map((p) => ({
      workUserId: p.workUserId ?? undefined,
      name: p.name,
      function: p.function,
      startTime: p.startTime ?? undefined,
      endTime: p.endTime ?? undefined,
      notes: p.notes ?? undefined,
    })),
    equipments: rdo.equipments.map((e) => ({
      name: e.name,
      identifier: e.identifier ?? undefined,
      operator: e.operator ?? undefined,
      startTime: e.startTime ?? undefined,
      endTime: e.endTime ?? undefined,
      status: e.status,
      notes: e.notes ?? undefined,
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
