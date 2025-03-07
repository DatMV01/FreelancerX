import { useState, useEffect } from "react";
import { Trash, Edit, Check } from "lucide-react";

interface QA {
  id: string;
  question: string;
  answer: string;
}

const _faq = "faqList";

export default function FrequentlyAskedQuestionsV2() {
  const [inputQuestion, setInputQuestion] = useState("");

  const [inputAnswer, setInputAnswer] = useState("");

  const [charCount, setCharCount] = useState(0);

  const [faqList, setQaList] = useState<QA[]>(() =>
    JSON.parse(localStorage.getItem(_faq) || "[]"),
  );

  const [editingId, setEditingId] = useState<string | null>(null);

  const [editingQuestion, setEditingQuestion] = useState("");

  const [editingAnswer, setEditingAnswer] = useState("");

  const [editCharCount, setEditCharCount] = useState(0);

  useEffect(() => {
    localStorage.setItem(_faq, JSON.stringify(faqList));
  }, [faqList]);

  const handleChange =
    (
      setter: React.Dispatch<React.SetStateAction<string>>,
      setCount?: React.Dispatch<React.SetStateAction<number>>,
    ) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (e.target.value.length <= 300) {
        setter(e.target.value);
        setCount?.(e.target.value.length);
      }
    };

  const handleAddOrUpdate = () => {
    if (!inputQuestion.trim() || !inputAnswer.trim()) return;

    if (editingId) {
      setQaList((prev) =>
        prev.map((qa) =>
          qa.id === editingId
            ? { ...qa, question: inputQuestion, answer: inputAnswer }
            : qa,
        ),
      );
      setEditingId(null);
    } else {
      setQaList((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          question: inputQuestion,
          answer: inputAnswer,
        },
      ]);
    }

    setInputQuestion("");
    setInputAnswer("");
    setCharCount(0);
  };

  const handleEdit = (id: string) => {
    const qa = faqList.find((q) => q.id === id);
    if (qa) {
      setEditingId(id);
      setEditingQuestion(qa.question);
      setEditingAnswer(qa.answer);
      setEditCharCount(qa.answer.length);
    }
  };

  const handleSaveEdit = () => {
    if (!editingQuestion.trim() || !editingAnswer.trim()) return;

    setQaList((prev) =>
      prev.map((qa) =>
        qa.id === editingId
          ? { ...qa, question: editingQuestion, answer: editingAnswer }
          : qa,
      ),
    );
    setEditingId(null);
    setEditingQuestion("");
    setEditingAnswer("");
    setEditCharCount(0);
  };

  const handleDelete = (id: string) => {
    setQaList((prev) => prev.filter((qa) => qa.id !== id));
  };

  return (
    <div className="w-full bg-gray-50 p-4">
      <input
        type="text"
        value={inputQuestion}
        onChange={handleChange(setInputQuestion)}
        placeholder="Add a Question"
        maxLength={300}
        className="mb-2 w-full rounded-md border p-2 focus:outline-none focus:ring focus:ring-gray-300"
      />

      <textarea
        value={inputAnswer}
        onChange={handleChange(setInputAnswer, setCharCount)}
        placeholder="Add an Answer"
        maxLength={300}
        className="mb-2 h-36 w-full resize-none rounded-md border p-2 focus:outline-none focus:ring focus:ring-gray-300"
      ></textarea>

      <div className="mb-2 text-right text-xs text-gray-500">
        {charCount}/300 characters
      </div>
      <div className="flex justify-end">
        <button
          className="rounded-md border bg-black px-4 py-1 text-white disabled:opacity-50"
          onClick={handleAddOrUpdate}
          disabled={!inputQuestion.trim() || !inputAnswer.trim()}
        >
          Add
        </button>
      </div>
      <div className="mt-4">
        {faqList.map((qa) => (
          <div
            key={qa.id}
            className="mb-2 flex items-center justify-between rounded-lg border bg-white p-3 shadow-sm"
          >
            {editingId === qa.id ? (
              <div className="w-full">
                <input
                  type="text"
                  value={editingQuestion}
                  onChange={handleChange(setEditingQuestion)}
                  className="mb-1 w-full rounded-md border p-1"
                />
                <textarea
                  value={editingAnswer}
                  onChange={handleChange(setEditingAnswer, setEditCharCount)}
                  maxLength={300}
                  className="h-36 w-full resize-none rounded-md border p-1"
                ></textarea>
                <div className="mb-1 text-right text-xs text-gray-500">
                  {editCharCount}/300 characters
                </div>
                <button
                  className="mt-1 text-green-500"
                  onClick={handleSaveEdit}
                >
                  <Check size={16} />
                </button>
              </div>
            ) : (
              <div>
                <p className="font-semibold">Question: {qa.question}</p>
                <p className="font-semibold">Answer:</p>
                <p>{qa.answer}</p>
              </div>
            )}
            <div className="flex gap-2">
              {editingId !== qa.id && (
                <button
                  onClick={() => handleEdit(qa.id)}
                  className="text-blue-500"
                >
                  <Edit size={16} />
                </button>
              )}
              <button
                onClick={() => handleDelete(qa.id)}
                className="text-red-500"
              >
                <Trash size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
