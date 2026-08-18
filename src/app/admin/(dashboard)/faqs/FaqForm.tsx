import { AdminTextField, AdminTextAreaField } from "@/components/admin/ui/AdminField";
import { AdminButton } from "@/components/admin/ui/AdminButton";
import { Card } from "@/components/admin/ui/Card";

export function FaqForm({
  action,
  defaultValues,
  submitLabel,
}: {
  action: (formData: FormData) => void;
  defaultValues?: { question: string; answer: string; display_order: number };
  submitLabel: string;
}) {
  return (
    <Card className="mt-8 max-w-2xl p-6 sm:p-8">
      <form action={action} className="space-y-6">
        <AdminTextField
          label="Question"
          name="question"
          required
          defaultValue={defaultValues?.question}
        />
        <AdminTextAreaField
          label="Answer"
          name="answer"
          required
          rows={6}
          defaultValue={defaultValues?.answer}
        />
        <AdminTextField
          label="Display order"
          name="display_order"
          type="number"
          defaultValue={defaultValues?.display_order ?? 0}
          hint="Lower numbers show first."
        />
        <AdminButton type="submit" size="lg">
          {submitLabel}
        </AdminButton>
      </form>
    </Card>
  );
}
