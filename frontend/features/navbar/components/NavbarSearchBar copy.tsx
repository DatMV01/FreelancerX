import { fetchGigsV2, searchGig, searchGigByTag } from "@/features/gig/gig.api";
import { defaulFetchGigsQuery } from "@/features/gig/hooks/useGetActiveGigs";
import { useFetchByQuery } from "@/hooks/useFetch";
import { buildUrlQuery } from "@/hooks/useQuerySync";
import { buildQueryFromObject, QueryInput } from "@/lib/fitlers/query-utils";
import { CircleX, Search } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const NavbarSearchBar = ({ ...props }) => {
  const [inputValue, setInputValue] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const pathname = usePathname();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef(null);

  const [queryObj, setQueryObj] = useState<QueryInput<any>>({
    ...defaulFetchGigsQuery,
    pageSize: 50,
  });
  const queryString = buildQueryFromObject(queryObj);
  const key = `${pathname}?${buildUrlQuery(queryObj)}`;

  const { data: response } = useFetchByQuery({
    queryString,
    fetcherFn: searchGigByTag,
    key,
  });

  useEffect(() => {
    if (response?.data) {
      setSearchResults(response.data);
    }
  }, [response]);

  const fetchSearchResults = async (keyword: string) => {
    setQueryObj((prev) => ({ ...prev, keyword }));
  };

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      if (inputValue.trim()) fetchSearchResults(inputValue);
    }, 500);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [inputValue]);

  // Escape key → clear input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setInputValue("");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Click outside → clear input
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !(inputRef.current as HTMLElement).contains(event.target as Node)
      ) {
        setInputValue("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const highlightText = (text: string, query: string) => {
    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <b key={index}>{part}</b>
      ) : (
        part
      )
    );
  };

  const shouldShowResults = inputValue !== "" && searchResults.length > 0;

  return (
    <div ref={inputRef} className="relative">
      <form className="relative flex h-full w-full flex-row">
        <input
          placeholder="Search for any service..."
          type="text"
          autoComplete="off"
          onChange={(e) => setInputValue(e.target.value)}
          value={inputValue}
          className="h-[50px] w-full rounded-sm border border-gray-300 px-4 outline-none focus:border-gray-500"
        />

        <button
          className="absolute top-1/2 right-2 flex h-[30px] w-[30px] -translate-y-1/2 items-center justify-center rounded-sm bg-green-900"
          onClick={(e) => e.preventDefault()}
        >
          <Search size={16} color="white" strokeWidth={1} />
        </button>

        {inputValue && (
          <button
            className="absolute top-1/2 right-11 flex -translate-y-1/2 items-center justify-center"
            onClick={(e) => {
              e.preventDefault();
              setInputValue("");
            }}
          >
            <CircleX
              size={20}
              className="text-green-700 hover:text-green-900"
            />
          </button>
        )}
      </form>

      {shouldShowResults && (
        <ul className="absolute z-51 mt-1 max-h-90 w-full overflow-hidden overflow-y-auto rounded-sm border-2 border-gray-200 bg-white p-2">
          {searchResults.map((a) => (
            <li key={a.id} className="flex h-8 items-center hover:bg-green-100">
              <button
                className="flex w-full"
                onClick={() => toast.info(a.keyword)}
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
