import { useState } from "react";

const PositiveKeywords = () => {
  const [keywords, setKeywords] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");

  const addKeyword = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === "Tab") && inputValue.trim() !== "") {
      if (keywords.length < 5) {
        setKeywords([...keywords, inputValue.trim()]);
        setInputValue("");
      }
    }
  };

  const removeKeyword = (keyword: string) => {
    setKeywords(keywords.filter((k) => k !== keyword));
  };

  return (
    <div className="flex w-full flex-col space-y-2">
      <label className="block text-sm font-semibold">Positive keywords</label>
      <p className="text-xs text-gray-500">
        Enter search terms you feel your buyers will use when looking for your
        service.
      </p>
      <div className="flex min-h-[40px] flex-wrap gap-2 rounded-md border p-2">
        {keywords.map((keyword) => (
          <div
            key={keyword}
            className="flex items-center rounded-md bg-gray-200 px-2 py-1 text-sm"
          >
            {keyword}
            <button
              onClick={() => removeKeyword(keyword)}
              className="ml-2 text-gray-600 hover:text-red-500"
            >
              ✕
            </button>
          </div>
        ))}
        <input
          type="text"
          className="flex-grow px-1 text-sm outline-none"
          placeholder=""
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={addKeyword}
        />
      </div>

      <p className="text-xs text-gray-500">
        5 tags maximum. Use letters and numbers only.
      </p>
    </div>
  );
};

export default PositiveKeywords;
