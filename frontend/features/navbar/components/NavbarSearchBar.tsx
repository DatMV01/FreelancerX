import { searchGigByTag } from "@/features/gig/gig.api";
import { defaulFetchGigsQuery } from "@/features/gig/hooks/useGetActiveGigs";
import { useFetchByQuery } from "@/hooks/useFetch";
import { buildUrlQuery } from "@/hooks/useQuerySync";
import { buildQueryFromObject, QueryInput } from "@/lib/fitlers/query-utils";
import { CircleX, Loader2, Search } from "lucide-react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react"; // Thêm useRef vào import

type SearchResult = {
  id: string;
  keyword: string;
};

const NavbarSearchBar = ({ ...props }) => {
  const [inputValue, setInputValue] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [popularSearches, setPopularSearches] = useState<SearchResult[]>([]);
  const [noResults, setNoResults] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Thêm ref vào useRef hook để tham chiếu DOM element
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [queryObj, setQueryObj] = useState<QueryInput<any>>({
  page: 1,
  pageSize: 10,
  });

  const queryString = buildQueryFromObject(queryObj);
  let key = `${pathname}?${buildUrlQuery(queryObj)}`;

  const {
    data: response,
    error,
    isLoading,
    isValidating,
    mutate,
  } = useFetchByQuery({
    queryString: inputValue != "" ? queryString : null,
    fetcherFn: searchGigByTag,
    key,
  });

  useEffect(() => {
    if (response?.data) {
      setSearchResults(response?.data);
      setNoResults(response?.data.length === 0);
    }
  }, [response]);

  const fetchSearchResults = async (keyword: string) => {
    setQueryObj((prev) => ({ ...prev, keyword }));
  };

  useEffect(() => {
    // Always clear timeout first
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (inputValue === "") {
      setSearchResults([]);
      setPopularSearches([
        { id: "1", keyword: "Web Development" },
        { id: "2", keyword: "App Development" },
        { id: "3", keyword: "UI/UX Design" },
      ]);
      return;
    }

    timeoutRef.current = setTimeout(() => {
      fetchSearchResults(inputValue);
    }, 1000);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [inputValue]);

  const handleClickSearchResult = (keyword: string) => {
    setInputValue("");
    setSearchResults([]);

    const abc: QueryInput<any> = {
      ...queryObj,
      filters: {
        tag: keyword,
      },
      keyword: undefined,
    };
    const _query = buildQueryFromObject(abc as any);
    const uri = decodeURIComponent(buildQueryFromObject(abc as any));
    console.log(uri);

    router.push(`/search/gigs?${_query}`);
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchResults.length > 0) {
      handleClickSearchResult(searchResults[0].keyword);
    }
  };

  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <b key={index}>{part}</b>
      ) : (
        part
      ),
    );
  };

  return (
    <div ref={searchInputRef} className="relative">
      {" "}
      {/* Sử dụng ref từ useRef */}
      <form className="relative flex h-full w-full flex-row">
        <input
          placeholder="Search for any service..."
          type="text"
          autoComplete="off"
          onChange={(e) => setInputValue(e.target.value)}
          value={inputValue}
          onKeyDown={handleKeyDown}
          className="h-[50px] w-full rounded-sm border border-gray-300 px-4 outline-none focus:border-gray-500"
        ></input>

        <button
          className="absolute top-1/2 right-2 flex h-[30px] w-[30px] -translate-y-1/2 items-center justify-center rounded-sm bg-green-900"
          onClick={(e) => {
            e.preventDefault();
          }}
        >
          <Search size={16} color="white" strokeWidth={1} />
        </button>

        {inputValue !== "" && (
          <button
            className="absolute top-1/2 right-11 flex -translate-y-1/2 items-center justify-center"
            onClick={(e) => {
              e.preventDefault();
              setInputValue("");
              setSearchResults([]);
            }}
          >
            <CircleX
              size={20}
              className="text-green-700 hover:text-green-900"
            />
          </button>
        )}
      </form>
      {/* {inputValue === "" && !isLoading && (
        <ul className="absolute z-51 mt-1 max-h-90 w-full overflow-hidden overflow-y-auto rounded-sm border-2 border-gray-200 bg-white p-2">
          {popularSearches.map((a) => (
            <li key={a.id} className="flex h-8 items-center hover:bg-green-100">
              <button
                className="flex w-full"
                onClick={() => handleClickSearchResult(a.keyword)}
              >
                <span>{a.keyword}</span>
              </button>
            </li>
          ))}
        </ul>
      )} */}
      {inputValue !== "" && (
        <ul className="absolute z-51 mt-1 max-h-90 w-full overflow-hidden overflow-y-auto rounded-sm border-2 border-gray-200 bg-white p-2">
          {isLoading && (
            <li>
              <Loader2 className="animate-spin" size={18} />
            </li>
          )}

          {!isLoading && noResults && (
            <li className="text-gray-500">No matching results found</li>
          )}

          {!isLoading &&
            !noResults &&
            searchResults.map((a) => (
              <li
                key={a.id}
                className="flex h-8 items-center hover:bg-green-100"
              >
                <button
                  className="flex w-full"
                  onClick={() => handleClickSearchResult(a.keyword)}
                >
                  <span>{highlightText(a.keyword, inputValue)}</span>
                </button>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};

export default NavbarSearchBar;
