import { AdminTextField, AdminTextAreaField, AdminSelectField, AdminCheckboxField } from "@/components/admin/ui/AdminField";
import { AdminImageField } from "@/components/admin/ui/AdminImageField";
import { AdminButton } from "@/components/admin/ui/AdminButton";
import { SectionCard } from "@/components/admin/ui/Card";
import { FormSectionNav, type FormSection } from "@/components/admin/ui/FormSectionNav";
import { PlacesEditor } from "@/components/admin/ui/PlacesEditor";
import { stringifyLines } from "@/lib/admin/textLines";
import {
  stringifyExperiences,
  stringifyFacts,
  stringifySeasons,
  stringifyMonthlyClimate,
  stringifySuggestedItinerary,
  stringifyFaqs,
  type PlaceInput,
  type ExperienceInput,
  type FactInput,
  type SeasonInput,
  type MonthClimateInput,
  type SuggestedItineraryDayInput,
  type FaqInput,
} from "@/lib/admin/textBlocks";

const TIERS = ["premium", "easy"] as const;

const SECTIONS: FormSection[] = [
  { id: "basics", label: "The basics", icon: "grid" },
  { id: "copy", label: "Editorial copy", icon: "quote" },
  { id: "photography", label: "Photography", icon: "eye" },
  { id: "routing", label: "Route info", icon: "plane" },
  { id: "places", label: "Places", icon: "map-route" },
  { id: "experiences", label: "Experiences", icon: "compass" },
  { id: "facts", label: "Facts", icon: "help-circle" },
  { id: "seasons", label: "Seasons", icon: "calendar" },
  { id: "monthly-climate", label: "Monthly weather", icon: "sun" },
  { id: "ideal-for", label: "Particularly good for", icon: "users" },
  { id: "practical", label: "Currency & language", icon: "globe" },
  { id: "things-to-do", label: "Things to do", icon: "compass" },
  { id: "food-shopping", label: "Food & shopping", icon: "receipt" },
  { id: "traveller-fit", label: "Who it suits", icon: "users" },
  { id: "itinerary", label: "Suggested itinerary", icon: "calendar" },
  { id: "travel-tips", label: "Travel tips", icon: "help-circle" },
  { id: "guide-faqs", label: "FAQs", icon: "help-circle" },
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
  departure_code: string | null;
  route_city: string | null;
  places: unknown;
  experiences: unknown;
  facts: unknown;
  seasons: unknown;
  monthly_climate: unknown;
  ideal_for: string[];
  featured: boolean;
  display_order: number;
  currency: string;
  language: string;
  things_to_do: unknown;
  food_and_dining: string[];
  shopping: string[];
  family_friendly: string;
  honeymoon_suitable: string;
  adventure_activities: string[];
  suggested_itinerary: unknown;
  travel_tips: string[];
  faqs: unknown;
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
            <AdminImageField
              label="Hero image"
              name="hero_image"
              required
              hint="A key from the photo catalogue, e.g. parisEiffelSeine, or a full URL."
              defaultValue={defaultValues?.hero_image}
            />
            <AdminImageField
              label="Card image"
              name="card_image"
              hint="Optional — falls back to the hero image if left blank."
              defaultValue={defaultValues?.card_image ?? ""}
            />
          </div>
          <div className="space-y-4">
            <fieldset className="border border-admin-border rounded-lg p-4">
              <legend className="text-sm font-semibold text-admin-text mb-4 px-2 -mx-2">
                Gallery images
              </legend>
              <p className="text-xs text-admin-text-3 mb-4">
                Portrait-friendly images (3/4 aspect ratio) shown in a responsive grid. Enter a catalogue key (e.g. parisEiffelSeine), Unsplash photo ID (photo-xxxxx), or full URL per field — the thumbnail confirms it resolves before you save.
              </p>
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <AdminImageField
                    key={`gallery_${i}`}
                    label={`Gallery image ${i}`}
                    name={`gallery_${i}`}
                    hint={i === 1 ? "Example: parisEiffelSeine or https://images.unsplash.com/..." : undefined}
                    defaultValue={
                      defaultValues?.gallery && defaultValues.gallery[i - 1]
                        ? defaultValues.gallery[i - 1]
                        : ""
                    }
                  />
                ))}
              </div>
            </fieldset>
          </div>
        </SectionCard>

        <SectionCard id="routing" icon="plane" title="Route info" accent="cyan">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <AdminTextField
              label="Departure airport code"
              name="departure_code"
              hint="E.g. NRT (Narita), HND (Haneda), DXB (Dubai). Shown on the detail page route display."
              defaultValue={defaultValues?.departure_code ?? ""}
            />
            <AdminTextField
              label="Destination city"
              name="route_city"
              hint="City where travellers arrive (e.g. Tokyo, Dubai). Shown on the detail page route display."
              defaultValue={defaultValues?.route_city ?? ""}
            />
          </div>
        </SectionCard>

        <SectionCard id="places" icon="map-route" title="Places" accent="violet">
          <PlacesEditor defaultValue={defaultValues?.places as PlaceInput[]} />
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

        <SectionCard id="practical" icon="globe" title="Currency & language" accent="violet">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <AdminTextField
              label="Currency"
              name="currency"
              hint='e.g. "Japanese Yen (JPY)"'
              defaultValue={defaultValues?.currency ?? ""}
            />
            <AdminTextField
              label="Language"
              name="language"
              hint='e.g. "Japanese", or "Varies by country" for a multi-country circuit.'
              defaultValue={defaultValues?.language ?? ""}
            />
          </div>
        </SectionCard>

        <SectionCard id="things-to-do" icon="compass" title="Things to do" accent="cyan">
          <AdminTextAreaField
            label="Beyond the highlights"
            name="things_to_do"
            rows={10}
            hint={'Blocks separated by "---". Format:\nTitle: teamLab digital art museums\nDescription: One or two sentences.'}
            defaultValue={stringifyExperiences(defaultValues?.things_to_do as ExperienceInput[])}
            className="font-mono text-xs"
          />
        </SectionCard>

        <SectionCard id="food-shopping" icon="receipt" title="Food & shopping" accent="pink">
          <AdminTextAreaField
            label="Food and dining"
            name="food_and_dining"
            rows={6}
            hint="One line per point."
            defaultValue={stringifyLines(defaultValues?.food_and_dining)}
          />
          <AdminTextAreaField
            label="Shopping"
            name="shopping"
            rows={5}
            hint="One line per point."
            defaultValue={stringifyLines(defaultValues?.shopping)}
          />
        </SectionCard>

        <SectionCard id="traveller-fit" icon="users" title="Who it suits" accent="violet">
          <AdminTextAreaField
            label="Family travel"
            name="family_friendly"
            rows={4}
            hint="One paragraph — genuinely differentiated per destination, not a generic line."
            defaultValue={defaultValues?.family_friendly ?? ""}
          />
          <AdminTextAreaField
            label="Honeymoon suitability"
            name="honeymoon_suitable"
            rows={4}
            defaultValue={defaultValues?.honeymoon_suitable ?? ""}
          />
          <AdminTextAreaField
            label="Adventure activities"
            name="adventure_activities"
            rows={5}
            hint="One line per activity."
            defaultValue={stringifyLines(defaultValues?.adventure_activities)}
          />
        </SectionCard>

        <SectionCard id="itinerary" icon="calendar" title="Suggested itinerary" accent="cyan">
          <AdminTextAreaField
            label="Day-by-day outline"
            name="suggested_itinerary"
            rows={12}
            hint={
              'Blocks separated by "---". Format:\nDay: Day 1\nTitle: Arrive Tokyo\n' +
              "Description: One or two sentences.\n\nExplicitly a suggestion, not a booked itinerary — say so in the copy if relevant."
            }
            defaultValue={stringifySuggestedItinerary(
              defaultValues?.suggested_itinerary as SuggestedItineraryDayInput[],
            )}
            className="font-mono text-xs"
          />
        </SectionCard>

        <SectionCard id="travel-tips" icon="help-circle" title="Travel tips" accent="pink">
          <AdminTextAreaField
            label="Practical tips"
            name="travel_tips"
            rows={8}
            hint="One line per tip. Evergreen only — no prices, no dated visa specifics."
            defaultValue={stringifyLines(defaultValues?.travel_tips)}
          />
        </SectionCard>

        <SectionCard id="guide-faqs" icon="help-circle" title="FAQs" accent="violet">
          <AdminTextAreaField
            label="Frequently asked questions"
            name="faqs"
            rows={12}
            hint={'Blocks separated by "---". Format:\nQuestion: Is X safe for families?\nAnswer: One or two sentences, evergreen — no prices.'}
            defaultValue={stringifyFaqs(defaultValues?.faqs as FaqInput[])}
            className="font-mono text-xs"
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
