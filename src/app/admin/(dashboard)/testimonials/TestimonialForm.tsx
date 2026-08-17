import { TextField, TextAreaField } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";

export function TestimonialForm({
  action,
  defaultValues,
  submitLabel,
}: {
  action: (formData: FormData) => void;
  defaultValues?: {
    quote: string;
    name: string;
    role: string;
    trip: string;
    display_order: number;
  };
  submitLabel: string;
}) {
  return (
    <form action={action} className="mt-8 max-w-2xl space-y-6">
      <TextAreaField
        label="Quote"
        name="quote"
        required
        rows={5}
        defaultValue={defaultValues?.quote}
      />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <TextField label="Name" name="name" required defaultValue={defaultValues?.name} />
        <TextField
          label="Role / location"
          name="role"
          required
          placeholder="e.g. Bandra, Mumbai"
          defaultValue={defaultValues?.role}
        />
      </div>
      <TextField
        label="Trip"
        name="trip"
        required
        placeholder="e.g. Paris & Switzerland, 11 nights"
        defaultValue={defaultValues?.trip}
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
