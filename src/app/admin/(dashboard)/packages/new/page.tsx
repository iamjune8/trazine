import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { PackageForm } from "../PackageForm";
import { createPackage } from "../actions";

export const dynamic = "force-dynamic";

export default function NewPackagePage() {
  return (
    <div>
      <Link
        href="/admin/packages"
        className="inline-flex items-center gap-1.5 text-sm text-admin-text-3 transition-colors duration-200 hover:text-admin-text"
      >
        <Icon name="chevron-left" size={15} />
        All packages
      </Link>
      <h1 className="mt-4 text-2xl font-semibold text-admin-text sm:text-3xl">Add package</h1>
      <p className="mt-2 max-w-2xl text-sm text-admin-text-3">
        Departure dates and seat counts are added afterwards, from the package&rsquo;s own page
        once it exists.
      </p>
      <PackageForm action={createPackage} submitLabel="Create package" />
    </div>
  );
}
