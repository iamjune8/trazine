import { AdminTextField, AdminTextAreaField } from "@/components/admin/ui/AdminField";
import { AdminButton } from "@/components/admin/ui/AdminButton";
import { Card } from "@/components/admin/ui/Card";

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
    <Card className="mt-8 max-w-2xl p-6 sm:p-8">
      <form action={action} className="space-y-6">
        <AdminTextAreaField
          label="Quote"
          name="quote"
          required
          rows={5}
          defaultValue={defaultValues?.quote}
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <AdminTextField label="Name" name="name" required defaultValue={defaultValues?.name} />
          <AdminTextField
            label="Role / location"
            name="role"
            required
            placeholder="e.g. Bandra, Mumbai"
            defaultValue={defaultValues?.role}
          />
        </div>
        <AdminTextField
          label="Trip"
          name="trip"
          required
          placeholder="e.g. Paris & Switzerland, 11 nights"
          defaultValue={defaultValues?.trip}
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
