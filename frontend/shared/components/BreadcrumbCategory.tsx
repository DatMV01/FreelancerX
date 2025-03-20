import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useRouter } from "next/router";

const BreadcrumbCategory = ({ categoryInfo, ...props }: { categoryInfo?: any }) => {
  const router = useRouter();

  const { category, subcategory, subsubcategory } =
    categoryInfo || router.query;

  return (
    <Breadcrumb className="my-4">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 14"
            >
              <path d="M12.773 13.5H3.227a.7.7 0 0 1-.482-.194.65.65 0 0 1-.2-.468V6.884H.5L7.541.672a.694.694 0 0 1 .918 0L15.5 6.884h-2.046v5.954a.65.65 0 0 1-.2.468.7.7 0 0 1-.481.194m-4.091-1.323h3.409V5.664L8 2.056 3.91 5.664v6.513h3.408v-3.97h1.364z"></path>
            </svg>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {category && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink
                href={`/categories/${category}`}
                className="capitalize hover:underline"
              >
                {String(category).replaceAll("-", " ")}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </>
        )}

        {subcategory && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink
                href={`/categories/${category}/${subcategory}`}
                className="capitalize hover:underline"
              >
                {subcategory && String(subcategory).replaceAll("-", " ")}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </>
        )}

        {subsubcategory && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink
                href={`/categories/${category}/${subcategory}/${subsubcategory}`}
                className="capitalize hover:underline"
              >
                {String(subsubcategory).replaceAll("-", " ")}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadcrumbCategory;
