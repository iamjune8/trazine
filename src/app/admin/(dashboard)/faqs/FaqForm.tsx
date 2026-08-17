import { TextField, TextAreaField } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";

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
    <form action={action} className="mt-8 max-w-2xl space-y-6">
      <TextField
        label="Question"
        name="question"
        required
        defaultValue={defaultValues?.question}
      />
      <TextAreaField
        label="Answer"
        name="answer"
        required
        rows={6}
        defaultValue={defaultValues?.answer}
      />
      <TextField
        label="Display order"
        name="display_order"
        type="number"
        defaultValue={defaultValues?.display_order ?? 0}
        hint="Lower numbers show first."
      />
      <Button type="submit" size="lg">
        {submitLabel}
      </Button>
    </form>
  );
}
