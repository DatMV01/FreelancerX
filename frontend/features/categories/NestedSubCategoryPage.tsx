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
      </div>
    );
  }

  return null;
};

export default NestedSubCategoryPage;
