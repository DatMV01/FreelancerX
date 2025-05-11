import { faker } from "@faker-js/faker";
import { CircleX, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const NavbarSearchBar = ({ ...props }) => {
  const [inputValue, setInputValue] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const arr = Array.from({ length: 100 }, (_, i) => {
    return {
      userId: faker.string.uuid(),
      username: faker.internet.username(),
      email: faker.internet.email(),
      avatar: faker.image.avatar(),
      password: faker.internet.password(),
      birthdate: faker.date.birthdate(),
      registeredAt: faker.date.past(),
      job: faker.person.jobTitle(),
    };
  });

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchSearchResults = async (query: string) => {
    console.log("Fetching results for:", query);

    const results = arr.filter((a) =>
      a.job.toLowerCase().includes(query.toLowerCase()),
    );

    setSearchResults(results);
  };

  useEffect(() => {
    if (inputValue === "") {
      setShowResults(false);
      return;
    }
    setShowResults(true);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      fetchSearchResults(inputValue);
    }, 500);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [inputValue]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowResults(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        ref.current &&
        !(ref.current as HTMLElement).contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);

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
    <div ref={ref} className="relative">
      <form className="relative flex h-full w-full flex-row">
        <input
          placeholder="Search for any service..."
          type="text"
          autoComplete="off"
          onChange={(e) => setInputValue(e.target.value)}
          value={inputValue}
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

        {showResults && (
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

      {showResults && (
        <ul className="absolute z-51 mt-1 max-h-90 w-full overflow-hidden overflow-y-auto rounded-sm border-2 border-gray-200 bg-white p-2">
          {searchResults.map((a, index) => (
            <li
              key={index}
              className="flex h-8 items-center hover:bg-green-100"
            >
              <button>
                {/* Highlight the matched text in job title */}
                <span>{highlightText(a.job, inputValue)}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NavbarSearchBar;
