import { faker } from "@faker-js/faker";
import { useState } from "react";

const SearchBar = ({ ...props }: { title: any }) => {
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

  const onChangeEvent = (e: any) => {
    e.target.value === "" ? setShowResults(false) : setShowResults(true);
  };

  return (
    <div className="relative mb-2">
      <form className="relative w-full">
        <input
          type="search"
          placeholder="Find services"
          onChange={(e) => onChangeEvent(e)}
          className=" h-[40px] w-full border-2 border-gray-200 px-2 focus:border-gray-400 focus:outline-none"
        />
      </form>

      {showResults && (
        <ul className="absolute z-50 h-max w-full border-2 border-gray-200 bg-white p-2">
          {arr.map((a) => (
            <li className="flex h-8 items-center hover:bg-slate-400">
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
