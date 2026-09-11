import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { Icon } from "@/components/ui/Icon";
import { SettingsForm } from "./SettingsForm";
import { updateSiteSettings } from "./actions";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ saved?: string }> };

export default async function SettingsPage({ searchParams }: Props) {
  const { saved } = await searchParams;
  const supabase = await createClient();
  const { data: settings, error } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", "default")
    .single();

  return (
    <div>
      <PageHeader
        eyebrow="Site"
        title="Contact settings"
        description="The one phone number, email and address used everywhere on the public site — header, footer, contact page, and every Call/WhatsApp button. Change it here once and it updates everywhere, no code change needed."
      />

      {error || !settings ? (
        <p className="mt-8 rounded-xl border border-admin-danger/30 bg-admin-danger/10 px-4 py-3 text-sm text-admin-danger">
          Couldn&rsquo;t load settings: {error?.message ?? "not found"}
        </p>
      ) : (
        <>
          {saved ? (
            <p className="mt-8 inline-flex items-center gap-2 rounded-xl border border-admin-success/30 bg-admin-success/10 px-4 py-2 text-sm text-admin-success">
              <Icon name="check" size={15} />
              Saved. Live on the site now.
            </p>
          ) : null}

          <SettingsForm action={updateSiteSettings} defaultValues={settings} />
        </>
      )}
    </div>
  );
}
