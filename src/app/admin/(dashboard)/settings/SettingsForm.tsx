import { AdminTextField } from "@/components/admin/ui/AdminField";
import { AdminButton } from "@/components/admin/ui/AdminButton";
import { Card } from "@/components/admin/ui/Card";

export function SettingsForm({
  action,
  defaultValues,
}: {
  action: (formData: FormData) => void;
  defaultValues: {
    phone: string;
    email: string;
    address_line1: string;
    address_line2: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    hours: string;
  };
}) {
  return (
    <Card className="mt-8 max-w-2xl p-6 sm:p-8">
      <form action={action} className="space-y-6">
        <AdminTextField
          label="Phone number"
          name="phone"
          required
          defaultValue={defaultValues.phone}
          hint="One number for the whole site — shown in the header, footer, contact page and every Call/WhatsApp button. Include the country code, e.g. +91 81085 31332. WhatsApp links and click-to-call both derive from this single field."
        />
        <AdminTextField
          label="Email"
          name="email"
          type="email"
          required
          defaultValue={defaultValues.email}
          hint="Shown on the contact page, footer and header. Lead-notification emails (where enquiries land internally) are a separate setting your developer configures — this one is only what visitors see."
        />
        <AdminTextField
          label="Address line 1"
          name="address_line1"
          required
          defaultValue={defaultValues.address_line1}
          hint="Building/unit and street — used in the footer, About and Contact pages, and regenerates the Google map on the Contact page."
        />
        <AdminTextField
          label="Address line 2"
          name="address_line2"
          defaultValue={defaultValues.address_line2}
        />
        <div className="grid gap-6 sm:grid-cols-2">
          <AdminTextField
            label="City"
            name="city"
            required
            defaultValue={defaultValues.city}
          />
          <AdminTextField
            label="State"
            name="state"
            required
            defaultValue={defaultValues.state}
          />
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          <AdminTextField
            label="Postal code"
            name="postal_code"
            required
            defaultValue={defaultValues.postal_code}
          />
          <AdminTextField
            label="Country"
            name="country"
            required
            defaultValue={defaultValues.country}
          />
        </div>
        <AdminTextField
          label="Business hours"
          name="hours"
          defaultValue={defaultValues.hours}
          hint="Free text, shown as-is — e.g. Monday – Saturday, 10:00 – 19:00 IST."
        />

        <AdminButton type="submit" icon="check" withArrow>
          Save changes
        </AdminButton>
      </form>
    </Card>
  );
}
