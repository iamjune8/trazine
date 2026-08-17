import { destinations } from "@/data/destinations";

/** Shape accepted by POST /api/inquiries. */
export type InquiryInput = {
  name: string;
  email: string;
  phone: string;
  destination: string;
  /** Kept as strings throughout — form inputs (even type="number"/"date") hand back strings, and the API route is where these get parsed and range-checked. */
  adults: string;
  children: string;
  accommodation: string;
  nights: string;
  travelDate: string;
  transfers: string;
  flightBooked: string;
  /** Where on the site the enquiry started — useful for attribution. */
  source?: string;
};

export type FieldErrors = Partial<Record<keyof InquiryInput, string>>;

export const destinationOptions = [
  ...destinations.map((d) => d.name),
  "Somewhere else / not sure yet",
];

export const accommodationOptions = ["3-star", "4-star", "5-star", "Not sure yet"];

export const transferOptions = ["Shared", "Private"];

export const flightBookedOptions = ["Yes", "No"];

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
/** Indian mobile numbers with or without +91, plus general international. */
const PHONE = /^[+()\-\s\d]{8,20}$/;

/** Today at midnight, local time — travel dates before this are rejected as a likely typo. Exported so the date input can also set `min` and steer the native picker away from past dates. */
export function todayISO(): string {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now.toISOString().slice(0, 10);
}

/**
 * Validates an enquiry. Runs on both the client (for inline, per-field errors)
 * and the server (because client validation is a convenience, not a control).
 */
export function validateInquiry(input: Partial<InquiryInput>): FieldErrors {
  const errors: FieldErrors = {};

  const name = input.name?.trim() ?? "";
  if (name.length < 2) {
    errors.name = "Please tell us your name.";
  }

  const email = input.email?.trim() ?? "";
  if (!email) {
    errors.email = "We need an email address to send your proposal to.";
  } else if (!EMAIL.test(email)) {
    errors.email = "That email address doesn't look complete.";
  }

  const phone = input.phone?.trim() ?? "";
  if (!phone) {
    errors.phone = "A phone number lets us call you back.";
  } else if (!PHONE.test(phone) || phone.replace(/\D/g, "").length < 8) {
    errors.phone = "Please enter a reachable phone number.";
  }

  if (!input.destination?.trim()) {
    errors.destination = "Choose a destination, or tell us you're undecided.";
  }

  const adults = Number(input.adults);
  if (!input.adults?.trim() || !Number.isInteger(adults) || adults < 1) {
    errors.adults = "At least one adult.";
  }

  const children = input.children?.trim() ? Number(input.children) : 0;
  if (!Number.isInteger(children) || children < 0) {
    errors.children = "Enter a number, or leave it as 0.";
  }

  if (!input.accommodation?.trim()) {
    errors.accommodation = "Pick a comfort level, or \"Not sure yet\".";
  }

  const nights = Number(input.nights);
  if (!input.nights?.trim() || !Number.isInteger(nights) || nights < 1) {
    errors.nights = "How many nights?";
  }

  const travelDate = input.travelDate?.trim() ?? "";
  if (!travelDate) {
    errors.travelDate = "When do you leave?";
  } else if (travelDate < todayISO()) {
    errors.travelDate = "That date's already passed — check the year?";
  }

  if (!input.transfers?.trim()) {
    errors.transfers = "Shared or private?";
  }

  if (!input.flightBooked?.trim()) {
    errors.flightBooked = "Yes or no is fine.";
  }

  return errors;
}

export function hasErrors(errors: FieldErrors): boolean {
  return Object.keys(errors).length > 0;
}
