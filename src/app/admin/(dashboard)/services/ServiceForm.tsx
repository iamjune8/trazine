import { TextField, TextAreaField, SelectField } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { stringifyLines } from "@/lib/admin/textLines";

const ICONS = ["compass", "stamp", "plane", "shield", "wallet", "headset"] as const;

export function ServiceForm({
  action,
  defaultValues,
  submitLabel,
  lockSlug = false,
}: {
  action: (formData: FormData) => void;
  defaultValues?: {
    slug: string;
    title: string;
    summary: string;
    detail: string;
    icon: string;
    image: string | null;
    points: string[];
    display_order: number;
  };
  submitLabel: string;
  /** True when editing — the slug is the primary key and used in URLs. */
  lockSlug?: boolean;
}) {
  return (
    <form action={action} className="mt-8 max-w-2xl space-y-6">
      <TextField
        label="Slug"
        name="slug"
        required
        readOnly={lockSlug}
        defaultValue={defaultValues?.slug}
        hint={
          lockSlug
            ? "Locked — used in the URL and by the footer's service links."
            : "Lowercase, hyphenated, e.g. visa-assistance."
        }
        className={lockSlug ? "opacity-70" : undefined}
      />
      <TextField label="Title" name="title" required defaultValue={defaultValues?.title} />
      <TextAreaField
        label="Summary"
        name="summary"
        required
        rows={3}
        hint="The short pull-quote shown on the homepage grid and at the top of the detail row."
        defaultValue={defaultValues?.summary}
      />
      <TextAreaField
        label="Detail"
        name="detail"
        required
        rows={5}
        hint="The longer paragraph on the /services page."
        defaultValue={defaultValues?.detail}
      />
      <SelectField
        label="Icon"
        name="icon"
        required
        options={ICONS}
        defaultValue={defaultValues?.icon}
      />
      <TextField
        label="Image"
        name="image"
        defaultValue={defaultValues?.image ?? ""}
        hint="Optional — a local path (/images/other/...) or Unsplash key. Only services with an image get the large banner treatment on the homepage instead of the plain icon grid."
      />
      <TextAreaField
        label="Points"
        name="points"
        rows={5}
        hint="One point per line — these become the checklist under the detail paragraph."
        defaultValue={stringifyLines(defaultValues?.points)}
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
