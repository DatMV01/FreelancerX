import {
     Select,
     SelectContent,
     SelectItem,
     SelectTrigger,
     SelectValue,
} from "@/components/ui/select";
import { useQuerySync } from "@/hooks/useQuerySync";
import { useState } from "react";
import { GigEntity } from "../gig/gig.entity";

const ResultAndSortSection = () => {
  const { query, queryString, queryStringDecode, url, setQuery, resetQuery } =
    useQuerySync<GigEntity>({} as any);

  const [sortBy, setsortBy] = useState("latest");

  return (
    <div className="flex justify-end">
      <div className="flex items-center">
        <p className="mr-2">Sort by:</p>
        <Select value={sortBy} onValueChange={(val) => setsortBy(val)}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="latest">Newest</SelectItem>
            <SelectItem value="price_asc">Price: Low to High</SelectItem>
            <SelectItem value="price_desc">Price: High to Low</SelectItem>
            {/* <SelectItem value="popular">Most Popular</SelectItem>
            <SelectItem value="rating">Top Rated</SelectItem> */}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ResultAndSortSection;
