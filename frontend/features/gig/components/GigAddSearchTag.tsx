import { createNewTag, searchGigByTag } from "@/features/gig/gig.api";
import { useFetchByQuery } from "@/hooks/useFetch";
import { buildQueryFromObject, QueryInput } from "@/lib/fitlers/query-utils";
import clsx from "clsx";
import { CircleX, Loader2, Search } from "lucide-react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react"; // Thêm useRef vào import
import { toast } from "sonner";
import { GigTagEntity } from "../gig.types";
import { Button } from "@/components/ui/button";

const GigAddSearchTag = ({
  onSetGigTagCb,
  className,
  showCreateTagBtn = true,
}: {
  onSetGigTagCb?: any;
  className?: any;
  showCreateTagBtn?: boolean;
}) => {
  const pathname = usePathname();
  const router = useRouter();

  const [inputValue, setInputValue] = useState("");
  const [searchResults, setSearchResults] = useState<GigTagEntity[]>([]);
  const [noResults, setNoResults] = useState(false);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [queryObj, setQueryObj] = useState<QueryInput<any>>({
    page: 1,
    pageSize: 10,
  });
  const latestKeywordRef = useRef("");

  const queryString = buildQueryFromObject(queryObj);
  const key = `${pathname}?${buildQueryFromObject(queryObj)}`;

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
    if (response?.data && queryObj.keyword === latestKeywordRef.current) {
      setSearchResults(response?.data);
      setNoResults(response?.data.length === 0);
    }
  }, [response]);

  const fetchSearchResults = async (keyword: string) => {
    latestKeywordRef.current = keyword;

    setQueryObj((prev) => ({ ...prev, keyword }));
  };

  useEffect(() => {
    // Always clear timeout first
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (inputValue === "") {
      setSearchResults([]);
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

  const handleClickSearchResult = (gigTag: GigTagEntity) => {
    setInputValue("");
    setSearchResults([]);
    setNoResults(false);

    onSetGigTagCb(gigTag);
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      setInputValue("");
      setSearchResults([]);
      setNoResults(false);
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

  const handleCreateTag = async () => {
    try {
      const response = await createNewTag(inputValue);
      if (response?.data) {
        toast.success("Tag created successfully");
        onSetGigTagCb(response.data);
        setInputValue("");
        setSearchResults([]);
        setNoResults(false);
      }
    } catch (error) {
      toast.error("Failed to create new tag");
    }
  };

  const shouldShowCreateButton =
    !isLoading &&
    !(
      searchResults.length === 1 &&
      searchResults[0].keyword.toLowerCase() === inputValue.toLowerCase()
    ) &&
    showCreateTagBtn;

  return (
    <div ref={searchInputRef} className="relative w-full">
      <div className="relative flex flex-row">
        <input
          placeholder="Enter tag keyword"
          type="text"
          autoComplete="off"
          onChange={(e) => setInputValue(e.target.value)}
          value={inputValue}
          onKeyDown={handleKeyDown}
          className={clsx(
            "h-[40px] w-full rounded-sm border border-gray-300 px-4 text-sm",
            "outline-none focus:border-gray-500",
            className,
          )}
        ></input>

        {inputValue !== "" && (
          <button
            className="absolute top-1/2 right-12 flex -translate-y-1/2 items-center justify-center"
            onClick={(e) => {
              e.preventDefault();
              setInputValue("");
              setSearchResults([]);
              setNoResults(true);
            }}
          >
            <CircleX
              size={20}
              className={clsx("text-green-700 hover:text-green-900")}
            />
          </button>
        )}

        <button
          className="absolute top-1/2 right-2 flex h-[30px] w-[30px] -translate-y-1/2 cursor-default items-center justify-center rounded-sm bg-green-900"
          onClick={(e) => {
            e.preventDefault();
          }}
        >
          <Search size={16} color="white" strokeWidth={1} />
        </button>
      </div>

      {inputValue !== "" && (
        <ul className="absolute z-51 mt-1 max-h-110 w-full space-y-1 overflow-hidden overflow-y-auto rounded-sm border-2 border-gray-200 bg-white p-2">
          {isLoading && (
            <li className="flex h-8 items-center justify-center">
              <Loader2 className="animate-spin" size={18} />
            </li>
          )}

          {!isLoading && noResults && (
            <li className="flex h-8 items-center px-2 text-gray-500">
              <span>No results found for:&nbsp;</span> <b>{inputValue}</b>
            </li>
          )}

          {!isLoading &&
            !noResults &&
            searchResults.map((result) => (
              <li
                key={result.id}
                className="flex h-8 items-center rounded-sm px-2 hover:bg-green-100"
              >
                <button
                  type="button"
                  className="flex w-full text-left"
                  onClick={() => handleClickSearchResult(result)}
                >
                  {highlightText(result.keyword, inputValue)}
                </button>
              </li>
            ))}

          {shouldShowCreateButton && (
            <li className="mt-2 border-t border-gray-200 pt-2">
              <button
                type="button"
                onClick={handleCreateTag}
                className="w-full px-2 text-left text-green-700 hover:text-green-900"
              >
                Create a new tag with keyword: <b>{inputValue}</b>
              </button>
            </li>
          )}
        </ul>
      )}

      {/* {inputValue !== "" && (
        <ul className="absolute z-51 mt-1 max-h-100 w-full overflow-hidden overflow-y-auto rounded-sm border-2 border-gray-200 bg-white p-2">
          {isLoading ? (
            <li>
              <Loader2 className="animate-spin" size={18} />
            </li>
          ) : noResults ? (
            <li className="text-gray-500">
              No results found for <b>{inputValue}</b>
            </li>
          ) : (
            searchResults.map((result) => (
              <li
                key={result.id}
                className="flex h-8 items-center hover:bg-green-100"
              >
                <button
                  type="button"
                  className="flex w-full text-left"
                  onClick={() => handleClickSearchResult(result)}
                >
                  <span>{highlightText(result.keyword, inputValue)}</span>
                </button>
              </li>
            ))
          )}

          <li className="mt-2 border-t border-gray-200 pt-2">
            <button onClick={handleCreateTag}>
              <span className="text-green-700 hover:text-green-900">
                {`Create a new tag with keyword: `}
                <b>{inputValue}</b>
              </span>
            </button>
          </li>
        </ul>
      )} */}
    </div>
  );
};

export default GigAddSearchTag;
