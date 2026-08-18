import { createClient } from "@/lib/supabase/server";
import { TextField, TextAreaField } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { updatePromotion } from "./actions";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ saved?: string }> };

/**
 * A single settings row, not a list — there is only ever one promotion live
 * at a time, shown as a floating popup on every page (see
 * PromotionPopup.tsx). Flip "Show on the site" off between offers rather
 * than deleting the content, so the next promotion is a quick edit away.
 */
export default async function PromotionPage({ searchParams }: Props) {
  const { saved } = await searchParams;
  const supabase = await createClient();
  const { data: promotion } = await supabase
    .from("promotion")
    .select("*")
    .eq("id", true)
    .single();

  return (
    <div>
      <h1 className="font-display text-3xl text-ink">Promotion popup</h1>
      <p className="mt-3 max-w-2xl text-ink-2">
        A small flyer that floats over every page — no section, just a
        banner. Clicking it opens the enquiry form. Meant to stay on
        indefinitely; for a big, one-time welcome poster tied to a campaign
        with an end date, use <span className="font-medium">Landing poster</span> in
        the menu above instead.
      </p>

      {saved ? (
        <p className="mt-6 inline-block border border-success/40 bg-success/10 px-4 py-2 text-sm text-success">
          Saved.
        </p>
      ) : null}

      <form action={updatePromotion} className="mt-8 max-w-2xl space-y-6">
        <label className="flex items-center gap-3 text-sm text-ink-2">
          <input
            type="checkbox"
            name="active"
            defaultChecked={promotion?.active ?? false}
            className="h-5 w-5 cursor-pointer accent-brass-deep"
          />
          Show on the site
        </label>

        <TextField
          label="Image URL"
          name="image_url"
          placeholder="https://…"
          hint="A hosted image URL — paste a link from your image host. Leave blank for a text-only flyer."
          defaultValue={promotion?.image_url ?? ""}
        />
        <TextField
          label="Heading"
          name="heading"
          required
          placeholder="e.g. Early-bird Europe, save ₹15,000"
          defaultValue={promotion?.heading ?? ""}
        />
        <TextAreaField
          label="Subheading"
          name="subheading"
          rows={3}
          placeholder="One or two lines with the detail — dates, what's included, when it ends."
          defaultValue={promotion?.subheading ?? ""}
        />
        <TextField
          label="Button text"
          name="cta_label"
          placeholder="Enquire now"
          defaultValue={promotion?.cta_label ?? "Enquire now"}
        />

        <Button type="submit" size="lg">
          Save
        </Button>
      </form>
    </div>
  );
}
