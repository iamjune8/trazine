/**
 * ⚠ PLACEHOLDER TESTIMONIALS — written to demonstrate tone and layout.
 * Replace with real, attributable client quotes before go-live. Never publish
 * invented reviews as genuine ones.
 */

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  trip: string;
};

export const testimonials: Testimonial[] = [
  {
    quote:
      "We had eleven nights and wanted to see six countries. They talked us down to two, and it was the best travel advice anyone has given us. Paris and the Bernese Oberland, and we came home rested instead of wrecked.",
    name: "Ananya & Rohit Deshmukh",
    role: "Bandra, Mumbai",
    trip: "Paris & Switzerland, 11 nights",
  },
  {
    quote:
      "My parents are in their seventies and my daughter is four. I did not think one trip could work for both. They planned Dubai around that, down to which pool had shade in the afternoon.",
    name: "Faisal Merchant",
    role: "Powai, Mumbai",
    trip: "Dubai & Abu Dhabi, 6 nights",
  },
  {
    quote:
      "Our Schengen file was refused once before, through another agent. They rebuilt it from scratch, explained what had gone wrong, and it was approved in twelve days.",
    name: "Sneha Iyer",
    role: "Thane",
    trip: "Switzerland, 9 nights",
  },
  {
    quote:
      "Our train from Edinburgh was cancelled at nine at night. One WhatsApp message and we were rebooked before we had finished working out what to do.",
    name: "Vikram & Priya Nair",
    role: "Navi Mumbai",
    trip: "United Kingdom, 12 nights",
  },
];
