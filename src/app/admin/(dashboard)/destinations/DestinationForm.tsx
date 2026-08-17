import { TextField, TextAreaField, SelectField } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { stringifyLines } from "@/lib/admin/textLines";
import {
  stringifyPlaces,
  stringifyExperiences,
  stringifyFacts,
  stringifySeasons,
  type PlaceInput,
  type ExperienceInput,
  type FactInput,
  type SeasonInput,
} from "@/lib/admin/textBlocks";

const TIERS = ["premium", "easy"] as const;

type DestinationValues = {
  slug: string;
  name: string;
  tier: string;
  region: string;
  tagline: string;
  intro: string;
  body: string[];
  hero_image: string;
  card_image: string | null;
  gallery: string[];
  places: unknown;
  experiences: unknown;
  facts: unknown;
  seasons: unknown;
  ideal_for: string[];
  featured: boolean;
  display_order: number;
};

export function DestinationForm({
  action,
  defaultValues,
  submitLabel,
  lockSlug = false,
}: {
  action: (formData: FormData) => void;
  defaultValues?: DestinationValues;
  submitLabel: string;
  lockSlug?: boolean;
}) {
  return (
    <form action={action} className="mt-8 max-w-3xl space-y-10">
      <div className="space-y-6">
        <p className="eyebrow">The basics</p>
        <TextField
          label="Slug"
          name="slug"
          required
          readOnly={lockSlug}
          defaultValue={defaultValues?.slug}
          hint={
            lockSlug
              ? "Locked — this is baked into the page URL and every link to it."
              : "Lowercase, hyphenated — becomes /destinations/this-slug."
          }
          className={lockSlug ? "opacity-70" : undefined}
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <TextField label="Name" name="name" required defaultValue={defaultValues?.name} />
          <SelectField
            label="Tier"
            name="tier"
            required
            options={TIERS}
            defaultValue={defaultValues?.tier}
          />
        </div>
        <TextField
          label="Region"
          name="region"
          required
          hint='Shown as the subtitle, e.g. "France · United Kingdom · Netherlands".'
          defaultValue={defaultValues?.region}
        />
        <TextField
          label="Tagline"
          name="tagline"
          required
          hint="One sensory line. Never a price."
          defaultValue={defaultValues?.tagline}
        />
        <label className="flex items-center gap-3 text-sm text-ink-2">
          <input
            type="checkbox"
            name="featured"
            defaultChecked={defaultValues?.featured ?? false}
            className="h-5 w-5 cursor-pointer accent-brass-deep"
          />
          Featured on the homepage
        </label>
        <TextField
          label="Display order"
          name="display_order"
          type="number"
          defaultValue={defaultValues?.display_order ?? 0}
          hint="Lower numbers show first on the /destinations page."
        />
      </div>

      <div className="space-y-6 border-t border-line-2 pt-10">
        <p className="eyebrow">Editorial copy</p>
        <TextAreaField
          label="Intro"
          name="intro"
          required
          rows={4}
          hint="Two or three sentences, the lead-in on the detail page."
          defaultValue={defaultValues?.intro}
        />
        <TextAreaField
          label="Body paragraphs"
          name="body"
          rows={8}
          hint="One paragraph per line — each becomes its own <p> on the page."
          defaultValue={stringifyLines(defaultValues?.body)}
        />
      </div>

      <div className="space-y-6 border-t border-line-2 pt-10">
        <p className="eyebrow">Photography</p>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <TextField
            label="Hero image"
            name="hero_image"
            required
            hint="A key from the photo catalogue, e.g. parisEiffelSeine."
            defaultValue={defaultValues?.hero_image}
          />
          <TextField
            label="Card image"
            name="card_image"
            hint="Optional — falls back to the hero image if left blank."
            defaultValue={defaultValues?.card_image ?? ""}
          />
        </div>
        <TextAreaField
          label="Gallery"
          name="gallery"
          rows={4}
          hint="One photo key per line."
          defaultValue={stringifyLines(defaultValues?.gallery)}
        />
      </div>

      <div className="space-y-6 border-t border-line-2 pt-10">
        <p className="eyebrow">Places</p>
        <TextAreaField
          label="Places within this circuit"
          name="places"
          rows={16}
          hint={
            'One block per place, separated by a line with just "---". Format:\n' +
            "Name: Paris, France\nImage: parisEiffelTrocadero\nBlurb: One sentence.\nHighlights:\n- First highlight\n- Second highlight"
          }
          defaultValue={stringifyPlaces(defaultValues?.places as PlaceInput[])}
          className="font-mono text-sm"
        />
      </div>

      <div className="space-y-6 border-t border-line-2 pt-10">
        <p className="eyebrow">Experiences</p>
        <TextAreaField
          label='"What we arrange" list'
          name="experiences"
          rows={10}
          hint={'Blocks separated by "---". Format:\nTitle: Eurostar, city to city\nDescription: One or two sentences.'}
          defaultValue={stringifyExperiences(defaultValues?.experiences as ExperienceInput[])}
          className="font-mono text-sm"
        />
      </div>

      <div className="space-y-6 border-t border-line-2 pt-10">
        <p className="eyebrow">Facts</p>
        <TextAreaField
          label="Facts panel"
          name="facts"
          rows={10}
          hint={'Blocks separated by "---". Format:\nLabel: Visa\nValue: One Schengen visa covers most of the circuit.'}
          defaultValue={stringifyFacts(defaultValues?.facts as FactInput[])}
          className="font-mono text-sm"
        />
      </div>

      <div className="space-y-6 border-t border-line-2 pt-10">
        <p className="eyebrow">Seasons</p>
        <TextAreaField
          label="When to go"
          name="seasons"
          rows={8}
          hint={'Blocks separated by "---". Format:\nWindow: April – June\nNote: Why this window, including honest downsides.'}
          defaultValue={stringifySeasons(defaultValues?.seasons as SeasonInput[])}
          className="font-mono text-sm"
        />
      </div>

      <div className="space-y-6 border-t border-line-2 pt-10">
        <p className="eyebrow">Particularly good for</p>
        <TextAreaField
          label="Ideal for"
          name="ideal_for"
          rows={5}
          hint="One tag per line."
          defaultValue={stringifyLines(defaultValues?.ideal_for)}
        />
      </div>

      <Button type="submit" size="lg">
        {submitLabel}
      </Button>
    </form>
  );
}
