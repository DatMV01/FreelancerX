import GigAddSearchTag from "@/features/gig/components/GigAddSearchTag";
import { GigEntity } from "@/features/gig/gig.entity";
import { GigTagEntity } from "@/features/gig/gig.types";
import { useQuerySync } from "@/hooks/useQuerySync";
import { buildQueryFromObject, QueryInput } from "@/lib/fitlers/query-utils";
import { useRouter } from "next/router";

const NavbarSearchBar = ({ ...props }) => {
  const router = useRouter();
  const { query, queryString, queryStringDecode, url, setQuery, resetQuery } =
    useQuerySync<GigEntity>({} as any);

  const handleClickSearchResult = (keyword: string) => {
    const queryObj: QueryInput<GigEntity> = {
      page: 1,
      pageSize: 50,
      sorts: { createdAt: "DESC", updatedAt: "DESC" },
      filters: {
        status: ["ACTIVE"],
        tags: {
          keyword,
        },
      },
      // fields: [
      //   "id",
      //   "status",
      //   "createdAt",
      //   "updatedAt",
      //   "medias",
      //   "ratingAverage",
      //   "basicPrice",
      //   "title",
      //   "slug",
      //   "freelancerId",
      // ],
    };
    const _query = buildQueryFromObject(queryObj as any);
    const decode = decodeURIComponent(_query);
    console.log(decode);

    setQuery(queryObj, { syncToUrl: true });

    router.push(`/search/gigs?${decode}`);
  };

  return (
    <GigAddSearchTag
      showCreateTagBtn={false}
      className="h-[45px]"
      onSetGigTagCb={async (gigTag: GigTagEntity) => {
        handleClickSearchResult(gigTag.keyword);
        //router.push(`/search/gigs?keyword=${gigTag.keyword}`);

        //      setQuery({keyword:gigTag.keyword})
      }}
    />
  );
};

export default NavbarSearchBar;

const NavbarSearchBarBackup = ({ ...props }) => {
  const router = useRouter();
  const { query, queryString, queryStringDecode, url, setQuery, resetQuery } =
    useQuerySync<GigEntity>({} as any);
  const handleClickSearchResult = (keyword: string) => {
    const queryObj: QueryInput<GigEntity> = {
      page: 1,
      pageSize: 50,
      sorts: { createdAt: "DESC", updatedAt: "DESC" },
      filters: {
        status: ["ACTIVE"],
        tags: {
          keyword,
        },
      },
      fields: [
        "id",
        "status",
        "createdAt",
        "updatedAt",
        "medias",
        "ratingAverage",
        "basicPrice",
        "title",
        "slug",
        "freelancerId",
      ],
    };
    const _query = buildQueryFromObject(queryObj as any);
    const decode = decodeURIComponent(_query);
    console.log(decode);

    router.push(`/search/gigs?${decode}`);
  };

  return (
    <GigAddSearchTag
      showCreateTagBtn={false}
      className="h-[45px]"
      onSetGigTagCb={async (gigTag: GigTagEntity) => {
        //handleClickSearchResult(gigTag.keyword);

        router.push(`/search/gigs?keyword=${gigTag.keyword}`);
        //      setQuery({keyword:gigTag.keyword})
      }}
    />
  );
};
