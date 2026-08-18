import { TextField, TextAreaField } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { stringifyLines } from "@/lib/admin/textLines";
import {
  stringifyHotels,
  stringifyItinerary,
  type HotelInput,
  type ItineraryDayInput,
} from "@/lib/admin/textBlocks";

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
              : "Lowercase, hyphenated — becomes /packages/this-slug."
          }
          className={lockSlug ? "opacity-70" : undefined}
        />
        <TextField label="Name" name="name" required defaultValue={defaultValues?.name} />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <TextField
            label="Departure code badge"
            name="departure_code"
            hint='e.g. "EX-BOM" — shown next to the title.'
            defaultValue={defaultValues?.departure_code}
          />
          <TextField
            label="Route label"
            name="route_label"
            hint='e.g. "2N Phuket | 2N Krabi"'
            defaultValue={defaultValues?.route_label}
          />
        </div>
        <TextField
          label="Nights summary"
          name="nights_summary"
          hint="Short internal label, e.g. 4N Thailand."
          defaultValue={defaultValues?.nights_summary}
        />
        <TextField
          label="Hero image URL"
          name="hero_image"
          placeholder="https://…"
          hint="A hosted image URL — paste a link from your image host."
          defaultValue={defaultValues?.hero_image}
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <TextField
            label="Base price"
            name="base_price"
            type="number"
            min={0}
            required
            hint="Per person, in the currency below."
            defaultValue={defaultValues?.base_price ?? 0}
          />
          <TextField
            label="Currency"
            name="currency"
            defaultValue={defaultValues?.currency ?? "INR"}
          />
        </div>
        <label className="flex items-center gap-3 text-sm text-ink-2">
          <input
            type="checkbox"
            name="active"
            defaultChecked={defaultValues?.active ?? true}
            className="h-5 w-5 cursor-pointer accent-brass-deep"
          />
          Published — visible on the site
        </label>
        <TextField
          label="Display order"
          name="display_order"
          type="number"
          defaultValue={defaultValues?.display_order ?? 0}
          hint="Lower numbers show first on the /packages page."
        />
      </div>

      <div className="space-y-6 border-t border-line-2 pt-10">
        <p className="eyebrow">Departure flight</p>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <TextField
            label="Departure city"
            name="departure_city"
            hint='e.g. "Mumbai"'
            defaultValue={defaultValues?.departure_city ?? "Mumbai"}
          />
          <TextField
            label="Departure airport code"
            name="departure_airport_code"
            hint='e.g. "BOM"'
            defaultValue={defaultValues?.departure_airport_code ?? "BOM"}
          />
        </div>
        <TextField
          label="Carrier"
          name="flight_carrier"
          hint='e.g. "Akasa Air"'
          defaultValue={defaultValues?.flight_carrier}
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <TextField
            label="Onward flight number"
            name="onward_flight_number"
            defaultValue={defaultValues?.onward_flight_number}
          />
          <TextField
            label="Onward departure time"
            name="onward_departure_time"
            placeholder="06:20 AM"
            defaultValue={defaultValues?.onward_departure_time}
          />
        </div>
        <TextField
          label="Onward route"
          name="onward_route"
          placeholder="Mumbai (BOM) → Phuket (HKT)"
          defaultValue={defaultValues?.onward_route}
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <TextField
            label="Return flight number"
            name="return_flight_number"
            defaultValue={defaultValues?.return_flight_number}
          />
          <TextField
            label="Return departure time"
            name="return_departure_time"
            placeholder="01:50 PM"
            defaultValue={defaultValues?.return_departure_time}
          />
        </div>
        <TextField
          label="Return route"
          name="return_route"
          placeholder="Phuket (HKT) → Mumbai (BOM)"
          defaultValue={defaultValues?.return_route}
        />
      </div>

      <div className="space-y-6 border-t border-line-2 pt-10">
        <p className="eyebrow">Hotels & meal plan</p>
        <TextAreaField
          label="Hotels"
          name="hotels"
          rows={14}
          hint={
            'One block per stay, separated by a line with just "---". Format:\n' +
            "Location: Phuket\nNights: 2\nHotel: Patong Lodge Hotel (3 Star)\nRoom: Cozy Room\nMeal: Breakfast Included"
          }
          defaultValue={stringifyHotels(defaultValues?.hotels as HotelInput[])}
          className="font-mono text-sm"
        />
      </div>

      <div className="space-y-6 border-t border-line-2 pt-10">
        <p className="eyebrow">Sightseeing</p>
        <TextAreaField
          label="Sightseeing checklist"
          name="sightseeing"
          rows={5}
          hint="One line per item."
          defaultValue={stringifyLines(defaultValues?.sightseeing as string[])}
        />
      </div>

      <div className="space-y-6 border-t border-line-2 pt-10">
        <p className="eyebrow">Itinerary</p>
        <TextAreaField
          label="Day-by-day itinerary"
          name="itinerary"
          rows={16}
          hint={
            'One block per day, separated by a line with just "---". Format:\n' +
            "Title: Day 1 – Touchdown Phuket\nBody:\n- Arrive at Phuket Airport and transfer to hotel.\n- Overnight stay at Phuket."
          }
          defaultValue={stringifyItinerary(defaultValues?.itinerary as ItineraryDayInput[])}
          className="font-mono text-sm"
        />
      </div>

      <div className="space-y-6 border-t border-line-2 pt-10">
        <p className="eyebrow">Inclusions & exclusions</p>
        <TextAreaField
          label="Inclusions"
          name="inclusions"
          rows={8}
          hint="One line per item."
          defaultValue={stringifyLines(defaultValues?.inclusions)}
        />
        <TextAreaField
          label="Exclusions"
          name="exclusions"
          rows={6}
          hint="One line per item."
          defaultValue={stringifyLines(defaultValues?.exclusions)}
        />
      </div>

      <div className="space-y-6 border-t border-line-2 pt-10">
        <p className="eyebrow">Payment & cancellation</p>
        <TextAreaField
          label="Payment policy"
          name="payment_terms"
          rows={4}
          hint="One line per item."
          defaultValue={stringifyLines(defaultValues?.payment_terms)}
        />
        <TextAreaField
          label="Cancellation policy"
          name="cancellation_terms"
          rows={4}
          hint="One line per item."
          defaultValue={stringifyLines(defaultValues?.cancellation_terms)}
        />
      </div>

      <Button type="submit" size="lg">
        {submitLabel}
      </Button>
    </form>
  );
}
