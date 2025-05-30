import Breadcrumbs from "@/components/Breadcrumbs";
import { useRouter } from "next/router";

const NestedSubCategoryPage = () => {
  const router = useRouter();

  const { slug } = router.query;
  if (Array.isArray(slug) && Array.from(slug).length == 3) {
    const [category, subCategory, nestedSubCategory] = slug;

    return (
      <div>
        <Breadcrumbs />

        <div className="flex items-center justify-center text-center">
          <strong>
            <span>This category is under development.</span>
          </strong>
        </div>
      </div>
    );
  }

  return null;
};

export default NestedSubCategoryPage;
