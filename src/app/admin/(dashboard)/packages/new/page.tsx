import Link from "next/link";
import { PackageForm } from "../PackageForm";
import { createPackage } from "../actions";

export const dynamic = "force-dynamic";

export default function NewPackagePage() {
  return (
    <div>
      <Link
        href="/admin/packages"
        className="text-sm text-ink-3 transition-colors duration-200 hover:text-ink"
      >
        ← All packages
      </Link>
      <h1 className="font-display mt-4 text-3xl text-ink">Add package</h1>
      <p className="mt-2 max-w-2xl text-ink-2">
        Departure dates and seat counts are added afterwards, from the
        package&rsquo;s own page once it exists.
      </p>
      <PackageForm action={createPackage} submitLabel="Create package" />
    </div>
  );
}
