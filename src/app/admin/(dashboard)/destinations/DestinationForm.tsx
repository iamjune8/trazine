import { AdminTextField, AdminTextAreaField, AdminSelectField, AdminCheckboxField } from "@/components/admin/ui/AdminField";
import { AdminButton } from "@/components/admin/ui/AdminButton";
import { SectionCard } from "@/components/admin/ui/Card";
import { FormSectionNav, type FormSection } from "@/components/admin/ui/FormSectionNav";
import { stringifyLines } from "@/lib/admin/textLines";
import {
  stringifyPlaces,
  stringifyExperiences,
  stringifyFacts,
  stringifySeasons,
  stringifyMonthlyClimate,
  type PlaceInput,
  type ExperienceInput,
  type FactInput,
  type SeasonInput,
  type MonthClimateInput,
} from "@/lib/admin/textBlocks";

const TIERS = ["premium", "easy"] as const;

const SECTIONS: FormSection[] = [
  { id: "basics", label: "The basics", icon: "grid" },
  { id: "copy", label: "Editorial copy", icon: "quote" },
  { id: "photography", label: "Photography", icon: "eye" },
  { id: "places", label: "Places", icon: "map-route" },
  { id: "experiences", label: "Experiences", icon: "compass" },
  { id: "facts", label: "Facts", icon: "help-circle" },
  { id: "seasons", label: "Seasons", icon: "calendar" },
  { id: "monthly-climate", label: "Monthly weather", icon: "sun" },
  { id: "ideal-for", label: "Particularly good for", icon: "users" },
];

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
  monthly_climate: unknown;
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
    <div className="mt-8 grid gap-6 lg:grid-cols-12 lg:items-start">
      <div className="hidden lg:col-span-3 lg:block">
        <FormSectionNav sections={SECTIONS} />
      </div>

      <form action={action} className="space-y-6 lg:col-span-9">
        <SectionCard id="basics" icon="grid" title="The basics" accent="violet">
          <AdminTextField
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
            <AdminTextField label="Name" name="name" required defaultValue={defaultValues?.name} />
            <AdminSelectField
              label="Tier"
              name="tier"
              required
              options={TIERS}
              defaultValue={defaultValues?.tier}
            />
          </div>
          <AdminTextField
            label="Region"
            name="region"
            required
            hint='Shown as the subtitle, e.g. "France · United Kingdom · Netherlands".'
            defaultValue={defaultValues?.region}
          />
          <AdminTextField
            label="Tagline"
            name="tagline"
            required
            hint="One sensory line. Never a price."
            defaultValue={defaultValues?.tagline}
          />
          <AdminCheckboxField
            label="Featured on the homepage"
            name="featured"
            defaultChecked={defaultValues?.featured ?? false}
          />
          <AdminTextField
            label="Display order"
            name="display_order"
            type="number"
            defaultValue={defaultValues?.display_order ?? 0}
            hint="Lower numbers show first on the /destinations page."
          />
        </SectionCard>

        <SectionCard id="copy" icon="quote" title="Editorial copy" accent="cyan">
          <AdminTextAreaField
            label="Intro"
            name="intro"
            required
            rows={4}
            hint="Two or three sentences, the lead-in on the detail page."
            defaultValue={defaultValues?.intro}
          />
          <AdminTextAreaField
            label="Body paragraphs"
            name="body"
            rows={8}
            hint="One paragraph per line — each becomes its own <p> on the page."
            defaultValue={stringifyLines(defaultValues?.body)}
          />
        </SectionCard>

        <SectionCard id="photography" icon="eye" title="Photography" accent="pink">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <AdminTextField
              label="Hero image"
              name="hero_image"
              required
              hint="A key from the photo catalogue, e.g. parisEiffelSeine."
              defaultValue={defaultValues?.hero_image}
            />
            <AdminTextField
              label="Card image"
              name="card_image"
              hint="Optional — falls back to the hero image if left blank."
              defaultValue={defaultValues?.card_image ?? ""}
            />
          </div>
          <AdminTextAreaField
            label="Gallery"
            name="gallery"
            rows={4}
            hint="One photo key per line."
            defaultValue={stringifyLines(defaultValues?.gallery)}
          />
        </SectionCard>

        <SectionCard id="places" icon="map-route" title="Places" accent="violet">
          <AdminTextAreaField
            label="Places within this circuit"
            name="places"
            rows={16}
            hint={
              'One block per place, separated by a line with just "---". Format:\n' +
              "Name: Paris, France\nImage: parisEiffelTrocadero\nBlurb: One sentence.\nHighlights:\n- First highlight\n- Second highlight"
            }
            defaultValue={stringifyPlaces(defaultValues?.places as PlaceInput[])}
            className="font-mono text-xs"
          />
        </SectionCard>

        <SectionCard id="experiences" icon="compass" title="Experiences" accent="cyan">
          <AdminTextAreaField
            label='"What we arrange" list'
            name="experiences"
            rows={10}
            hint={'Blocks separated by "---". Format:\nTitle: Eurostar, city to city\nDescription: One or two sentences.'}
            defaultValue={stringifyExperiences(defaultValues?.experiences as ExperienceInput[])}
            className="font-mono text-xs"
          />
        </SectionCard>

        <SectionCard id="facts" icon="help-circle" title="Facts" accent="pink">
          <AdminTextAreaField
            label="Facts panel"
            name="facts"
            rows={10}
            hint={'Blocks separated by "---". Format:\nLabel: Visa\nValue: One Schengen visa covers most of the circuit.'}
            defaultValue={stringifyFacts(defaultValues?.facts as FactInput[])}
            className="font-mono text-xs"
          />
        </SectionCard>

        <SectionCard id="seasons" icon="calendar" title="Seasons" accent="violet">
          <AdminTextAreaField
            label="When to go"
            name="seasons"
            rows={8}
            hint={'Blocks separated by "---". Format:\nWindow: April – June\nNote: Why this window, including honest downsides.'}
            defaultValue={stringifySeasons(defaultValues?.seasons as SeasonInput[])}
            className="font-mono text-xs"
          />
        </SectionCard>

        <SectionCard id="monthly-climate" icon="sun" title="Monthly weather" accent="pink">
          <AdminTextAreaField
            label="Typical conditions by month"
            name="monthly_climate"
            rows={24}
            hint={
              'All 12 months required, one block each, separated by "---". Format:\n' +
              "Month: January\nTemp: 19-25°C\nCondition: Warm days, cool evenings — the season\n\n" +
              "Blocks can be typed in any order — they're always sorted into calendar order on save. " +
              "This drives the \"this month / next month\" cards on the detail page, so all 12 must be present."
            }
            defaultValue={stringifyMonthlyClimate(
              defaultValues?.monthly_climate as MonthClimateInput[],
            )}
            className="font-mono text-xs"
          />
        </SectionCard>

        <SectionCard id="ideal-for" icon="users" title="Particularly good for" accent="cyan">
          <AdminTextAreaField
            label="Ideal for"
            name="ideal_for"
            rows={5}
            hint="One tag per line."
            defaultValue={stringifyLines(defaultValues?.ideal_for)}
          />
        </SectionCard>

        <div className="sticky bottom-5 z-10">
          <div className="admin-glass admin-glow-ring flex items-center justify-between rounded-2xl px-6 py-4">
            <p className="hidden text-xs text-admin-text-3 sm:block">
              Changes save when you submit — nothing goes live until then.
            </p>
            <AdminButton type="submit" size="lg" className="ml-auto">
              {submitLabel}
            </AdminButton>
          </div>
        </div>
      </form>
    </div>
  );
}
