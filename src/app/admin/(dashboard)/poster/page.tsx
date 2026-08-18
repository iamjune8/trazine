import { createClient } from "@/lib/supabase/server";
import { TextField, TextAreaField } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { updateLandingPoster } from "./actions";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ saved?: string }> };

/**
 * The big welcome poster — a second, separate promotion surface from
 * /admin/promotion's small corner banner. Shown once per browser session,
 * on landing, and meant to run out: set a start/end date for a campaign
 * window, or leave both blank and use "Show on the site" as a manual
 * on/off switch instead.
 */
export default async function PosterPage({ searchParams }: Props) {
  const { saved } = await searchParams;
  const supabase = await createClient();
  const { data: poster } = await supabase
    .from("landing_poster")
    .select("*")
    .eq("id", true)
    .single();

  return (
    <div>
      <h1 className="font-display text-3xl text-ink">Landing poster</h1>
      <p className="mt-3 max-w-2xl text-ink-2">
        A big, attention-grabbing poster shown once when a visitor first
        lands on the site — not on every page, and not forever. Use it for a
        campaign with an end date; the small corner banner (
        <span className="font-medium">Promotion</span> in the menu above)
        stays for always-on offers.
      </p>

      {saved ? (
        <p className="mt-6 inline-block border border-success/40 bg-success/10 px-4 py-2 text-sm text-success">
          Saved.
        </p>
      ) : null}

      <form action={updateLandingPoster} className="mt-8 max-w-2xl space-y-6">
        <label className="flex items-center gap-3 text-sm text-ink-2">
          <input
            type="checkbox"
            name="active"
            defaultChecked={poster?.active ?? false}
            className="h-5 w-5 cursor-pointer accent-brass-deep"
          />
          Show on the site
        </label>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <TextField
            label="Starts"
            name="starts_at"
            type="date"
            hint="Leave blank to start immediately."
            defaultValue={poster?.starts_at ?? ""}
          />
          <TextField
            label="Ends"
            name="ends_at"
            type="date"
            hint="Leave blank to run until turned off."
            defaultValue={poster?.ends_at ?? ""}
          />
        </div>

        <TextField
          label="Flyer image URL"
          name="image_url"
          placeholder="https://…"
          hint="A hosted image of the flyer/poster. Leave blank for a text-only poster."
          defaultValue={poster?.image_url ?? ""}
        />
        <TextField
          label="Heading"
          name="heading"
          required
          placeholder="e.g. Independence Day Sale — flat 20% off Europe"
          defaultValue={poster?.heading ?? ""}
        />
        <TextAreaField
          label="Subheading"
          name="subheading"
          rows={3}
          placeholder="The detail — what's included, who it's for, when it ends."
          defaultValue={poster?.subheading ?? ""}
        />
        <TextField
          label="Button text"
          name="cta_label"
          placeholder="Enquire now"
          defaultValue={poster?.cta_label ?? "Enquire now"}
        />

        <Button type="submit" size="lg">
          Save
        </Button>
      </form>
    </div>
  );
}
