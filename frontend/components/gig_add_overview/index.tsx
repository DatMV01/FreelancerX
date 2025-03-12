import { categories } from "@/data/data";
import {
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import SearchTags from "./search_tag";

interface categoryType {
  id: string;
  slug: string;
  title: string;
}

interface Props {
  switchToTab: (tab: string) => void;
  tabs: { label: string }[];
  gig: any;
  setGig: any;
}

const AddGigOverview = ({ switchToTab, tabs, gig, setGig }: Props) => {
  const [uploading, setUploading] = useState(false);

  const [gigOverview, setGigOverview] = useState(() => {
    return {
      title: gig.title || "",
      category: gig.category || "",
      subCategory: gig.subCategory || "",
      tags: gig.tags || "",
      nestedSubcategory: gig.nestedSubcategory || "",
    };
  });

  const [title, setGigTitle] = useState(gigOverview.title || "");
  const [category, setCategory] = useState(gigOverview.category || "");
  const [subCategory, setSubCategory] = useState(gigOverview.subCategory || "");
  const [tags, setTags] = useState<string[]>(gigOverview.tags || []);
  const [nestedSubcategory, setNestedSubcategory] = useState(
    gigOverview.nestedSubcategory || "",
  );

  useEffect(() => {
    setGig((prev: any) => ({ ...prev, tags }));
    setGigOverview((prev: any) => ({ ...prev, tags }));
  }, [tags]);

  useEffect(() => {
    setGig((prev: any) => ({ ...prev, title }));
    setGigOverview((prev: any) => ({ ...prev, title }));
  }, [title]);

  useEffect(() => {
    setGig((prev: any) => ({ ...prev, category }));
    setGigOverview((prev: any) => ({ ...prev, category }));
  }, [category]);

  useEffect(() => {
    setGig((prev: any) => ({ ...prev, subCategory }));
    setGigOverview((prev: any) => ({ ...prev, subCategory }));
  }, [subCategory]);

  useEffect(() => {
    setGig((prev: any) => ({ ...prev, nestedSubcategory }));
    setGigOverview((prev: any) => ({ ...prev, nestedSubcategory }));
  }, [nestedSubcategory]);

  const filteredSubCategoryData = useMemo(() => {
    return categories.find((_) => _.slug === category)?.subCategories || [];
  }, [category]);

  const filteredNestedSubCategoryData = useMemo(() => {
    return (
      filteredSubCategoryData.find((_) => _.slug === subCategory)
        ?.subCategories || []
    );
  }, [subCategory, filteredSubCategoryData]);

  return (
    <div className="relative flex w-full flex-col space-y-8 rounded-sm p-6">
      {uploading && (
        <div className="absolute inset-0 z-50 m-0 flex items-center justify-center bg-black bg-opacity-50">
          <CircularProgress />
        </div>
      )}

      {/* Gig Title */}
      <div className="flex flex-row space-x-4" style={{ marginTop: 0 }}>
        <div className="basis-1/3">
          <label className="font-semibold text-gray-700">Gig title</label>
          <p className="text-sm text-gray-500">
            As your Gig storefront, your{" "}
            <strong>title is the most important place</strong> to include
            keywords that buyers would likely use.
          </p>
        </div>
        <div className="h-full basis-2/3">
          <textarea
            value={title}
            onChange={(e) => setGigTitle(e.target.value)}
            placeholder="I will do something I'm really good at"
            maxLength={80}
            className="mt-2 h-full w-full rounded border p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>

      {/* Category & Subcategory */}
      <div className="flex flex-row space-x-4">
        <div className="basis-1/3">
          <label className="font-semibold text-gray-700">Category</label>
          <p className="text-sm text-gray-500">
            Choose the category and sub-category most suitable for your Gig.
          </p>
        </div>
        <div className="flex basis-2/3 gap-4">
          <FormControl variant="standard" fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={category}
              onChange={(e) => {
                const value = e.target.value as string;
                console.log(value);
                setCategory(value);
              }}
            >
              <MenuItem value="None">
                <em>None</em>
              </MenuItem>
              {categories.map((_) => (
                <MenuItem key={_.id} value={_.slug}>
                  {_.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl variant="standard" fullWidth>
            <InputLabel>SubCategory</InputLabel>
            <Select
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value as string)}
              disabled={!filteredSubCategoryData.length}
            >
              {filteredSubCategoryData.map((_) => (
                <MenuItem key={_.id} value={_.slug}>
                  {_.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </div>

      {/* Nested Sub Category */}
      <div className="flex flex-row space-x-4">
        <div className="basis-1/3">
          <label className="font-semibold text-gray-700">
            Nested Sub Category
          </label>
        </div>
        <div className="basis-2/3">
          <FormControl variant="standard" fullWidth>
            <InputLabel>Nested Sub Category</InputLabel>
            <Select
              value={nestedSubcategory}
              onChange={(e) => setNestedSubcategory(e.target.value as string)}
              disabled={!filteredNestedSubCategoryData.length}
            >
              {filteredNestedSubCategoryData.map((_) => (
                <MenuItem key={_.id} value={_.slug}>
                  {_.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </div>

      {/* Search Tags */}
      <div className="flex flex-row space-x-4">
        <div className="basis-1/3">
          <label className="font-semibold text-gray-700">Search tags</label>
          <p className="text-sm text-gray-500">
            Tag your Gig with buzz words that are relevant to the services you
            offer. Use all 5 tags to get found.
          </p>
        </div>
        <div className="basis-2/3">
          <SearchTags tags={tags} setTags={setTags} setGig={setGig} />
        </div>
      </div>

      {/* Gig Metadata (Placeholder) */}
      <div className="flex flex-row space-x-4">
        <div className="basis-1/3">
          <label className="font-semibold text-gray-700">Gig metadata</label>
        </div>
        <div className="basis-2/3">Under development</div>
      </div>

      {/* Save Button */}
      <Button
        variant="contained"
        sx={{ alignSelf: "end" }}
        onClick={async () => {
          if (
            title !== "" &&
            category !== "" &&
            subCategory !== "" &&
            nestedSubcategory !== "" &&
            tags.length != 0
          ) {
            // setUploading(true);
            // const isUploadOk = await hanleOnSaveAndCountinue();
            // setUploading(false);
            // isUploadOk &&
            switchToTab(tabs[1].label);
          }
        }}
      >
        Continue
      </Button>
    </div>
  );
};

export default AddGigOverview;
