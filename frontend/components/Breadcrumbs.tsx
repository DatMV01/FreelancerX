"use client";

import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Breadcrumbs({
  homePageHref = "/",
}: {
  homePageHref?: string;
}) {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean);

  const crumbs = pathSegments.map((segment, index) => {
    const href = "/" + pathSegments.slice(0, index + 1).join("/");
    const label = decodeURIComponent(
      segment.charAt(0).toUpperCase() + segment.slice(1),
    );

    const isLast = index === pathSegments.length - 1;

    return (
      <div
        key={href}
        className="text-muted-foreground flex items-center text-sm"
      >
        <ChevronRight className="text-muted-foreground mx-1 h-4 w-4" />

        {isLast ? (
          <span className="text-foreground font-medium">
            {String(label).replaceAll("-", " ")}
          </span>
        ) : (
          <Link href={href} className="hover:underline">
            {String(label).replaceAll("-", " ")}
          </Link>
        )}
      </div>
    );
  });

  return (
    <div className="flex items-center text-sm">
      <Link
        href={homePageHref}
        className="text-muted-foreground flex items-center gap-1 hover:underline"
      >
        <Home className="h-4 w-4" />
        <span>Home</span>
      </Link>
      {crumbs}
    </div>
  );
}
