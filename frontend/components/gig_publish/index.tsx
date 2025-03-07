import Image from "next/image";
import Link from "next/link";

export default function GigPublish() {
  return (
    <div className="w-full">
      <div className="flex h-full flex-col items-center justify-center space-y-2">
        <Image src="/gig_publish.svg" alt="" width={500} height={500} />

        <p className="text-xl font-semibold">You're almost there!</p>
        <p className="mt-2 text-gray-600">
          Let's publish your Gig and get you ready to start selling.
        </p>

        <button className="rounded-lg bg-black px-6 py-2 text-white">
          Publish Gig
        </button>

        <Link
          href="/gigs/manage"
          className="rounded-lg bg-black px-6 py-2 text-white"
        >
          Done. Back to Gig Management
        </Link>
      </div>
    </div>
  );
}
