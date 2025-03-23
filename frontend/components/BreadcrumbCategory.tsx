import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { House } from "lucide-react";
import { useRouter } from "next/router";
import { Label } from "radix-ui";
import { useMemo } from "react";

const BreadcrumbCategory = ({
  categoryInfo,
  ...props
}: {
  categoryInfo?: any;
}) => {
  const router = useRouter();

  const { category, subcategory, subsubcategory } = useMemo(() => {
    return categoryInfo || router.query;
  }, [categoryInfo, router.query]);

  const breadcrumbs = useMemo(
    () =>
      [
        { label: "Home", href: "/", isHome: true },
        category && {
          label: decodeURIComponent(category),
          href: `/categories/${category}`,
        },
        subsubcategory && {
          label: decodeURIComponent(subsubcategory),
          href: `/categories/${category}/${subcategory}/${subsubcategory}`,
        },
      ].filter(Boolean), // Loại bỏ giá trị `undefined`

    [category, subcategory, subsubcategory],
  );

  return (
    <Breadcrumb className="my-4">
      <BreadcrumbList>
        {breadcrumbs.map((item, index) => (
          <BreadcrumbItem key={item.href}>
            <BreadcrumbLink
              href={item.href}
              className="capitalize hover:underline"
            >
              {item.isHome ? <House color="currentColor"  size={14} /> : item.label}
            </BreadcrumbLink>
            {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadcrumbCategory;
