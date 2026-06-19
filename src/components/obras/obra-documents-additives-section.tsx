"use client";

import { useState } from "react";
import { FileText, GitCommitHorizontal, Plus, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { EmptyState } from "@/components/ui/empty-state";
import { usePermissions } from "@/hooks/use-permissions";
import { useWork } from "@/hooks/use-work";
import { formatDate } from "@/lib/format";
import { WORK_ADDITIVE_TYPE_OPTIONS, WORK_DOCUMENT_TYPE_OPTIONS } from "@/constants/work";
import type { Work } from "@/types/work";

interface SectionProps {
  work: Work;
  onChanged: (work: Work) => void;
}

export function ObraDocumentsSection({ work, onChanged }: SectionProps) {
  const { can } = usePermissions();
  const { addDocument, removeDocument } = useWork(null);
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [type, setType] = useState(WORK_DOCUMENT_TYPE_OPTIONS[0].value);

  async function handleAdd() {
    if (!title.trim()) return;
    const document = await addDocument(work.id, { title: title.trim(), type, fileName: `${title.trim()}.pdf` });
    onChanged({ ...work, documents: [...work.documents, document] });
    setTitle("");
    setAdding(false);
  }

  async function handleRemove(documentId: string) {
    await removeDocument(work.id, documentId);
    onChanged({ ...work, documents: work.documents.filter((d) => d.id !== documentId) });
  }

  return (
    <Card className="flex flex-col gap-4 p-5">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <FileText className="size-4" aria-hidden="true" />
          Documentos
        </h2>
        {can("work_documents:create") && (
          <Button type="button" variant="outline" size="sm" onClick={() => setAdding((prev) => !prev)}>
            <Plus className="size-4" aria-hidden="true" />
            Adicionar
          </Button>
        )}
      </div>

      {adding && (
        <div className="flex flex-col gap-3 rounded-lg border border-border bg-background p-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <Input label="Título do documento" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="w-48">
            <Select label="Tipo" options={WORK_DOCUMENT_TYPE_OPTIONS} value={type} onChange={(e) => setType(e.target.value)} />
          </div>
          <Button type="button" size="sm" disabled={!title.trim()} onClick={handleAdd}>
            Salvar
          </Button>
        </div>
      )}

      {work.documents.length === 0 ? (
        <EmptyState icon={FileText} title="Nenhum documento" description="Anexe ART/RRT, ordem de serviço ou outros documentos técnicos." />
      ) : (
        <ul className="flex flex-col gap-2">
          {work.documents.map((doc) => (
            <li key={doc.id} className="flex items-center justify-between rounded-lg border border-border p-3">
              <div>
                <p className="text-sm font-medium text-foreground">{doc.title}</p>
                <p className="text-xs text-muted-foreground">
                  {doc.type} · {formatDate(doc.createdAt)}
                </p>
              </div>
              {can("work_documents:delete") && (
                <button
                  type="button"
                  onClick={() => handleRemove(doc.id)}
                  aria-label={`Remover ${doc.title}`}
                  className="focus-ring rounded p-1.5 text-muted-foreground hover:bg-danger-50 hover:text-danger-600"
                >
                  <Trash2 className="size-4" aria-hidden="true" />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

export function ObraAdditivesSection({ work, onChanged }: SectionProps) {
  const { can } = usePermissions();
  const { addAdditive } = useWork(null);
  const [adding, setAdding] = useState(false);
  const [description, setDescription] = useState("");
  const [type, setType] = useState(WORK_ADDITIVE_TYPE_OPTIONS[0].value);
  const [newEndDate, setNewEndDate] = useState("");

  async function handleAdd() {
    if (!description.trim()) return;
    const additive = await addAdditive(work.id, { description: description.trim(), type, newEndDate: newEndDate || undefined });
    onChanged({
      ...work,
      additives: [...work.additives, additive],
      contractEndDate: newEndDate || work.contractEndDate,
    });
    setDescription("");
    setNewEndDate("");
    setAdding(false);
  }

  return (
    <Card className="flex flex-col gap-4 p-5">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <GitCommitHorizontal className="size-4" aria-hidden="true" />
          Aditivos Contratuais
        </h2>
        {can("work_additives:create") && (
          <Button type="button" variant="outline" size="sm" onClick={() => setAdding((prev) => !prev)}>
            <Plus className="size-4" aria-hidden="true" />
            Adicionar
          </Button>
        )}
      </div>

      {adding && (
        <div className="flex flex-col gap-3 rounded-lg border border-border bg-background p-3">
          <Input label="Descrição" value={description} onChange={(e) => setDescription(e.target.value)} />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Select label="Tipo" options={WORK_ADDITIVE_TYPE_OPTIONS} value={type} onChange={(e) => setType(e.target.value)} />
            <Input label="Nova data de término (se prazo)" type="date" value={newEndDate} onChange={(e) => setNewEndDate(e.target.value)} />
          </div>
          <Button type="button" size="sm" disabled={!description.trim()} onClick={handleAdd} className="self-start">
            Salvar
          </Button>
        </div>
      )}

      {work.additives.length === 0 ? (
        <EmptyState icon={GitCommitHorizontal} title="Nenhum aditivo registrado" description="Registre prorrogações de prazo, valor ou escopo." />
      ) : (
        <ul className="flex flex-col gap-2">
          {work.additives.map((additive) => (
            <li key={additive.id} className="rounded-lg border border-border p-3">
              <p className="text-sm font-medium text-foreground">{additive.description}</p>
              <p className="text-xs text-muted-foreground">
                {additive.type} · {formatDate(additive.createdAt)}
                {additive.newEndDate && ` · Nova vigência: ${formatDate(additive.newEndDate)}`}
              </p>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
