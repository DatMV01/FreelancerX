import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Category } from "@/dto/dto.type.";
import { House } from "lucide-react";
import { useRouter } from "next/router";

export interface BreadcrumbCategory {
  category: Category;
  subCategory: Category;
  nestedSubcategory: Category;
}

const BreadcrumbCategory = ({
  categoryInfo,
  ...props
}: {
  categoryInfo?: BreadcrumbCategory;
}) => {
  const router = useRouter();
  let breadcrumbs;
  if (categoryInfo) {
    const { category, subCategory, nestedSubcategory } = categoryInfo;

    breadcrumbs = [
      { label: "Home", href: "/", isHome: true },
      category && {
        label: category.title,
        href: category.url,
      },
      subCategory && {
        label: subCategory.title,
        href: subCategory.url,
      },
      nestedSubcategory && {
        label: nestedSubcategory.title,
        href: nestedSubcategory.url,
      },
    ].filter(Boolean);
  }

  // const { category, subCategory, nestedSubcategory } = useMemo(() => {
  //   return categoryInfo;
  // }, [categoryInfo]);

  // const breadcrumbs = useMemo(
  //   () =>
  //     [
  //       { label: "Home", href: "/", isHome: true },
  //       category && {
  //         label: decodeURIComponent(category),
  //         href: `/categories/${category}`,
  //       },
  //       subCategory && {
  //         label: decodeURIComponent(subCategory),
  //         href: `/categories/${category}/${subCategory}`,
  //       },
  //       nestedSubcategory && {
  //         label: decodeURIComponent(nestedSubcategory),
  //         href: `/categories/${category}/${subCategory}/${nestedSubcategory}`,
  //       },
  //     ].filter(Boolean),

  //   [category, subCategory, nestedSubcategory],
  // );

  return (
    <Breadcrumb className="my-4">
      <BreadcrumbList>
        {breadcrumbs &&
          breadcrumbs.map((item, index) => (
            <div key={item.href} className="inline-flex items-center">
              <BreadcrumbItem>
                <BreadcrumbLink
                  href={item.href}
                  className="capitalize hover:underline"
                >
                  {item.isHome ? (
                    <House color="currentColor" size={14} />
                  ) : (
                    item.label
                  )}
                </BreadcrumbLink>
              </BreadcrumbItem>
              {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
            </div>
          ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadcrumbCategory;
