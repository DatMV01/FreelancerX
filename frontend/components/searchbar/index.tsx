import { faker } from "@faker-js/faker";
import { useEffect, useRef, useState } from "react";
import { CircleX, Search } from "lucide-react";
const SearchBar = ({ ...props }) => {
  const [inputValue, setInputValue] = useState("");
  const [showResults, setShowResults] = useState(false);

  const arr = Array.from({ length: 8 }, (_, i) => {
    return {
      userId: faker.string.uuid(),
      username: faker.internet.username(), // before version 9.1.0, use userName()
      email: faker.internet.email(),
      avatar: faker.image.avatar(),
      password: faker.internet.password(),
      birthdate: faker.date.birthdate(),
      registeredAt: faker.date.past(),
      job: faker.person.jobTitle(),
    };
  });

  useEffect(() => {
    inputValue === "" ? setShowResults(false) : setShowResults(true);
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

  return (
    <div ref={ref} className="relative">
      <form className="h-full] relative flex w-full flex-row">
        <input
          placeholder="Search for any service..."
          type="text"
          autoComplete="off"
          onChange={(e) => setInputValue(e.target.value)}
          value={inputValue}
          className="h-[50px] w-full rounded-sm border border-gray-300 px-4 outline-none focus:border-gray-500"
        ></input>

        <button
          className="absolute right-2 top-1/2 flex h-[30px] w-[30px] -translate-y-1/2 items-center justify-center rounded-sm bg-green-900"
          onClick={(e) => {
            e.preventDefault();
          }}
        >
          <Search size={16} color="white" strokeWidth={1} />
        </button>

        {showResults && (
          <button
            className="absolute right-11 top-1/2 flex -translate-y-1/2 items-center justify-center"
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
        <ul className="absolute z-50 mt-1 h-max w-full rounded-sm border-2 border-gray-200 bg-white p-2">
          {arr.map((a, index) => (
            <li
              key={index}
              className="flex h-8 items-center hover:bg-green-100"
            >
              <button>
                <span>{a.job.split(" ")[0]} </span>
                <b>{a.job.split(" ")[1]} </b>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
