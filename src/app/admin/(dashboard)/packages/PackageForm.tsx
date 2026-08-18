import { AdminTextField, AdminTextAreaField, AdminCheckboxField } from "@/components/admin/ui/AdminField";
import { AdminButton } from "@/components/admin/ui/AdminButton";
import { SectionCard } from "@/components/admin/ui/Card";
import { FormSectionNav, type FormSection } from "@/components/admin/ui/FormSectionNav";
import { stringifyLines } from "@/lib/admin/textLines";
import {
  stringifyHotels,
  stringifyItinerary,
  type HotelInput,
  type ItineraryDayInput,
} from "@/lib/admin/textBlocks";

const SECTIONS: FormSection[] = [
  { id: "basics", label: "The basics", icon: "grid" },
  { id: "flight", label: "Departure flight", icon: "plane" },
  { id: "hotels", label: "Hotels & meals", icon: "bed" },
  { id: "sightseeing", label: "Sightseeing", icon: "map-route" },
  { id: "itinerary", label: "Itinerary", icon: "calendar" },
  { id: "inclusions", label: "Inclusions & exclusions", icon: "check" },
  { id: "policy", label: "Payment & cancellation", icon: "receipt" },
];

type PackageValues = {
  slug: string;
  name: string;
  departure_code: string;
  route_label: string;
  nights_summary: string;
  hero_image: string;
  base_price: number;
  currency: string;
  departure_city: string;
  departure_airport_code: string;
  flight_carrier: string;
  onward_flight_number: string;
  onward_route: string;
  onward_departure_time: string;
  return_flight_number: string;
  return_route: string;
  return_departure_time: string;
  hotels: unknown;
  sightseeing: unknown;
  itinerary: unknown;
  inclusions: string[];
  exclusions: string[];
  payment_terms: string[];
  cancellation_terms: string[];
  active: boolean;
  display_order: number;
};

export function PackageForm({
  action,
  defaultValues,
  submitLabel,
  lockSlug = false,
}: {
  action: (formData: FormData) => void;
  defaultValues?: PackageValues;
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
                : "Lowercase, hyphenated — becomes /packages/this-slug."
            }
            className={lockSlug ? "opacity-70" : undefined}
          />
          <AdminTextField label="Name" name="name" required defaultValue={defaultValues?.name} />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <AdminTextField
              label="Departure code badge"
              name="departure_code"
              hint='e.g. "EX-BOM" — shown next to the title.'
              defaultValue={defaultValues?.departure_code}
            />
            <AdminTextField
              label="Route label"
              name="route_label"
              hint='e.g. "2N Phuket | 2N Krabi"'
              defaultValue={defaultValues?.route_label}
            />
          </div>
          <AdminTextField
            label="Nights summary"
            name="nights_summary"
            hint="Short internal label, e.g. 4N Thailand."
            defaultValue={defaultValues?.nights_summary}
          />
          <AdminTextField
            label="Hero image URL"
            name="hero_image"
            placeholder="https://…"
            hint="A hosted image URL — paste a link from your image host."
            defaultValue={defaultValues?.hero_image}
          />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <AdminTextField
              label="Base price"
              name="base_price"
              type="number"
              min={0}
              required
              hint="Per person, in the currency below."
              defaultValue={defaultValues?.base_price ?? 0}
            />
            <AdminTextField
              label="Currency"
              name="currency"
              defaultValue={defaultValues?.currency ?? "INR"}
            />
          </div>
          <AdminCheckboxField
            label="Published — visible on the site"
            name="active"
            defaultChecked={defaultValues?.active ?? true}
          />
          <AdminTextField
            label="Display order"
            name="display_order"
            type="number"
            defaultValue={defaultValues?.display_order ?? 0}
            hint="Lower numbers show first on the /packages page."
          />
        </SectionCard>

        <SectionCard id="flight" icon="plane" title="Departure flight" accent="cyan">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <AdminTextField
              label="Departure city"
              name="departure_city"
              hint='e.g. "Mumbai"'
              defaultValue={defaultValues?.departure_city ?? "Mumbai"}
            />
            <AdminTextField
              label="Departure airport code"
              name="departure_airport_code"
              hint='e.g. "BOM"'
              defaultValue={defaultValues?.departure_airport_code ?? "BOM"}
            />
          </div>
          <AdminTextField
            label="Carrier"
            name="flight_carrier"
            hint='e.g. "Akasa Air"'
            defaultValue={defaultValues?.flight_carrier}
          />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <AdminTextField
              label="Onward flight number"
              name="onward_flight_number"
              defaultValue={defaultValues?.onward_flight_number}
            />
            <AdminTextField
              label="Onward departure time"
              name="onward_departure_time"
              placeholder="06:20 AM"
              defaultValue={defaultValues?.onward_departure_time}
            />
          </div>
          <AdminTextField
            label="Onward route"
            name="onward_route"
            placeholder="Mumbai (BOM) → Phuket (HKT)"
            defaultValue={defaultValues?.onward_route}
          />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <AdminTextField
              label="Return flight number"
              name="return_flight_number"
              defaultValue={defaultValues?.return_flight_number}
            />
            <AdminTextField
              label="Return departure time"
              name="return_departure_time"
              placeholder="01:50 PM"
              defaultValue={defaultValues?.return_departure_time}
            />
          </div>
          <AdminTextField
            label="Return route"
            name="return_route"
            placeholder="Phuket (HKT) → Mumbai (BOM)"
            defaultValue={defaultValues?.return_route}
          />
        </SectionCard>

        <SectionCard id="hotels" icon="bed" title="Hotels & meal plan" accent="pink">
          <AdminTextAreaField
            label="Hotels"
            name="hotels"
            rows={14}
            hint={
              'One block per stay, separated by a line with just "---". Format:\n' +
              "Location: Phuket\nNights: 2\nHotel: Patong Lodge Hotel (3 Star)\nRoom: Cozy Room\nMeal: Breakfast Included"
            }
            defaultValue={stringifyHotels(defaultValues?.hotels as HotelInput[])}
            className="font-mono text-xs"
          />
        </SectionCard>

        <SectionCard id="sightseeing" icon="map-route" title="Sightseeing" accent="violet">
          <AdminTextAreaField
            label="Sightseeing checklist"
            name="sightseeing"
            rows={5}
            hint="One line per item."
            defaultValue={stringifyLines(defaultValues?.sightseeing as string[])}
          />
        </SectionCard>

        <SectionCard id="itinerary" icon="calendar" title="Itinerary" accent="cyan">
          <AdminTextAreaField
            label="Day-by-day itinerary"
            name="itinerary"
            rows={16}
            hint={
              'One block per day, separated by a line with just "---". Format:\n' +
              "Title: Day 1 – Touchdown Phuket\nBody:\n- Arrive at Phuket Airport and transfer to hotel.\n- Overnight stay at Phuket."
            }
            defaultValue={stringifyItinerary(defaultValues?.itinerary as ItineraryDayInput[])}
            className="font-mono text-xs"
          />
        </SectionCard>

        <SectionCard id="inclusions" icon="check" title="Inclusions & exclusions" accent="pink">
          <AdminTextAreaField
            label="Inclusions"
            name="inclusions"
            rows={8}
            hint="One line per item."
            defaultValue={stringifyLines(defaultValues?.inclusions)}
          />
          <AdminTextAreaField
            label="Exclusions"
            name="exclusions"
            rows={6}
            hint="One line per item."
            defaultValue={stringifyLines(defaultValues?.exclusions)}
          />
        </SectionCard>

        <SectionCard id="policy" icon="receipt" title="Payment & cancellation" accent="violet">
          <AdminTextAreaField
            label="Payment policy"
            name="payment_terms"
            rows={4}
            hint="One line per item."
            defaultValue={stringifyLines(defaultValues?.payment_terms)}
          />
          <AdminTextAreaField
            label="Cancellation policy"
            name="cancellation_terms"
            rows={4}
            hint="One line per item."
            defaultValue={stringifyLines(defaultValues?.cancellation_terms)}
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
