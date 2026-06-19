"use client";

import { useState } from "react";
import { CheckCircle2, ClipboardList, History, MessageSquare, RotateCcw, Truck, Users, XCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert } from "@/components/ui/alert";
import { ReviewSection } from "@/components/cadastro/review-section";
import { usePermissions } from "@/hooks/use-permissions";
import { useRdo } from "@/hooks/use-rdo";
import { useRdoEvidences } from "@/hooks/use-rdo-evidences";
import { ApiError } from "@/lib/api/client";
import { formatDate, formatDateTime } from "@/lib/format";
import { RDO_SHIFT_LABELS, RDO_STATUS_CONFIG, isRdoReopenable } from "@/constants/rdo";
import { EvidenceCard } from "./evidence-card";
import type { Rdo } from "@/types/rdo";

interface RdoReviewViewProps {
  rdo: Rdo;
  onUpdated: (rdo: Rdo) => void;
}

export function RdoReviewView({ rdo, onUpdated }: RdoReviewViewProps) {
  const { can } = usePermissions();
  const { externalApprove, externalReject, suapeApprove, suapeReject, reopen, addComment, isSaving } = useRdo(null);
  const { evidences, update: updateEvidence, isUploading: isValidatingEvidence } = useRdoEvidences(rdo.id);
  const [comments, setComments] = useState("");
  const [commentBody, setCommentBody] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);

  const canReviewExternal = rdo.status === "UNDER_EXTERNAL_REVIEW" && can("rdo:approve") && can("rdo:reject");
  const canReviewSuape = rdo.status === "UNDER_SUAPE_REVIEW" && can("rdo:approve") && can("rdo:reject");
  const canReopen = isRdoReopenable(rdo.status) && can("rdo:reopen");
  const canValidateEvidence = can("evidences:validate_geo");

  async function handleAction(action: () => Promise<Rdo>) {
    setActionError(null);
    try {
      const updated = await action();
      onUpdated(updated);
      setComments("");
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : "Não foi possível concluir a ação.");
    }
  }

  async function handleAddComment() {
    if (!commentBody.trim()) return;
    setActionError(null);
    try {
      const updatedRdo = await addComment(rdo.id, { body: commentBody.trim() });
      setCommentBody("");
      onUpdated({ ...rdo, comments: [...rdo.comments, updatedRdo] });
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : "Não foi possível adicionar o comentário.");
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-muted-foreground">Revisão por {rdo.author.name}</p>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="flex flex-col gap-3 lg:col-span-8">
          <ReviewSection
            title="Dados do Dia"
            icon={ClipboardList}
            fields={[
              { label: "Data", value: formatDate(rdo.date) },
              { label: "Turno", value: RDO_SHIFT_LABELS[rdo.shift] },
              { label: "Engenheiro responsável", value: rdo.siteEngineerName },
              { label: "Mestre de obras", value: rdo.foremanName ?? undefined },
              { label: "Observações", value: rdo.notes ?? undefined },
            ]}
          />

          {rdo.activities.length > 0 && (
            <Card className="p-4">
              <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-primary-900">
                <ClipboardList className="size-4" aria-hidden="true" />
                Atividades Realizadas
              </h4>
              <ul className="flex flex-col gap-2">
                {rdo.activities.map((activity) => (
                  <li key={activity.id} className="rounded-lg bg-background p-3">
                    <p className="text-sm font-semibold text-foreground">{activity.category}</p>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {(rdo.professionals.length > 0 || rdo.equipments.length > 0) && (
            <Card className="p-4">
              <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-primary-900">
                <Users className="size-4" aria-hidden="true" />
                Equipe e Equipamentos
              </h4>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {rdo.professionals.map((professional) => (
                  <div key={professional.id} className="rounded-lg bg-background p-3">
                    <p className="text-sm font-semibold text-foreground">{professional.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {professional.function}
                      {professional.startTime && professional.endTime
                        ? ` · ${professional.startTime} – ${professional.endTime}`
                        : ""}
                    </p>
                    {professional.notes && <p className="mt-1 text-xs text-muted-foreground">{professional.notes}</p>}
                  </div>
                ))}
                {rdo.equipments.map((equipment) => (
                  <div key={equipment.id} className="rounded-lg bg-background p-3">
                    <p className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                      <Truck className="size-3.5" aria-hidden="true" />
                      {equipment.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {equipment.identifier ?? "Sem identificação"}
                      {equipment.startTime && equipment.endTime ? ` · ${equipment.startTime} – ${equipment.endTime}` : ""}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {(rdo.occurrences.length > 0 || rdo.nonConformities.length > 0) && (
            <Card className="p-4">
              <h4 className="mb-3 text-sm font-bold text-primary-900">Ocorrências e Não Conformidades</h4>
              <ul className="flex flex-col gap-2">
                {rdo.occurrences.map((occurrence) => (
                  <li key={occurrence.id} className="rounded-lg bg-background p-3">
                    <p className="text-sm font-semibold text-foreground">{occurrence.summary}</p>
                    <p className="text-xs text-muted-foreground">{occurrence.location}</p>
                  </li>
                ))}
                {rdo.nonConformities.map((nc) => (
                  <li key={nc.id} className="rounded-lg bg-danger-50 p-3">
                    <p className="text-sm font-semibold text-danger-700">
                      {nc.code} — {nc.title}
                    </p>
                    <p className="text-xs text-danger-600">{nc.description}</p>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {evidences.length > 0 && (
            <Card className="p-4">
              <h4 className="mb-3 text-sm font-bold text-primary-900">Evidências ({evidences.length})</h4>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {evidences.map((evidence) => (
                  <EvidenceCard
                    key={evidence.id}
                    evidence={evidence}
                    isValidating={isValidatingEvidence}
                    onValidate={
                      canValidateEvidence
                        ? (validationStatus) => void updateEvidence(evidence.id, { validationStatus })
                        : undefined
                    }
                  />
                ))}
              </div>
            </Card>
          )}
        </div>

        <div className="flex flex-col gap-3 lg:col-span-4">
          {(canReviewExternal || canReviewSuape) && (
            <Card className="p-4">
              <h4 className="mb-3 text-sm font-bold text-primary-900">Parecer da Revisão</h4>
              {actionError && (
                <div className="mb-3">
                  <Alert tone="danger">{actionError}</Alert>
                </div>
              )}
              <Textarea
                label="Comentários"
                placeholder="Observações técnicas para a contratada..."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
              />
              <div className="mt-3 flex flex-col gap-2">
                <Button
                  type="button"
                  loading={isSaving}
                  onClick={() =>
                    handleAction(() =>
                      canReviewExternal ? externalApprove(rdo.id, { comments }) : suapeApprove(rdo.id, { comments }),
                    )
                  }
                >
                  <CheckCircle2 className="size-4" aria-hidden="true" />
                  Aprovar
                </Button>
                <Button
                  type="button"
                  variant="danger"
                  loading={isSaving}
                  disabled={!comments.trim()}
                  onClick={() =>
                    handleAction(() =>
                      canReviewExternal ? externalReject(rdo.id, { comments }) : suapeReject(rdo.id, { comments }),
                    )
                  }
                >
                  <XCircle className="size-4" aria-hidden="true" />
                  Reprovar e Solicitar Ajustes
                </Button>
              </div>
            </Card>
          )}

          {canReopen && (
            <Card className="p-4">
              <h4 className="mb-2 text-sm font-bold text-primary-900">Reabrir RDO</h4>
              <p className="mb-3 text-xs text-muted-foreground">Permite que a contratada edite e reenvie o RDO.</p>
              <Button type="button" variant="outline" loading={isSaving} onClick={() => handleAction(() => reopen(rdo.id, { reason: comments }))}>
                <RotateCcw className="size-4" aria-hidden="true" />
                Reabrir para correções
              </Button>
            </Card>
          )}

          <Card className="p-4">
            <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-primary-900">
              <History className="size-4" aria-hidden="true" />
              Histórico
            </h4>
            {rdo.statusHistory.length === 0 ? (
              <p className="text-sm text-muted-foreground">Sem movimentações ainda.</p>
            ) : (
              <ul className="flex flex-col gap-2 text-sm">
                {rdo.statusHistory.map((entry) => (
                  <li key={entry.id} className="rounded-lg bg-background p-2.5">
                    <p className="font-medium text-foreground">{RDO_STATUS_CONFIG[entry.toStatus].label}</p>
                    <p className="text-xs text-muted-foreground">
                      {entry.changedBy.name} · {formatDateTime(entry.createdAt)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card className="p-4">
            <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-primary-900">
              <MessageSquare className="size-4" aria-hidden="true" />
              Comentários
            </h4>
            {rdo.comments.length > 0 && (
              <ul className="mb-3 flex flex-col gap-2 text-sm">
                {rdo.comments.map((comment) => (
                  <li key={comment.id} className="rounded-lg bg-background p-2.5">
                    <p className="text-foreground">{comment.body}</p>
                    <p className="text-xs text-muted-foreground">
                      {comment.author.name} · {formatDateTime(comment.createdAt)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
            <Textarea
              label="Adicionar comentário"
              value={commentBody}
              onChange={(e) => setCommentBody(e.target.value)}
            />
            <Button type="button" size="sm" className="mt-2" onClick={handleAddComment}>
              Comentar
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
