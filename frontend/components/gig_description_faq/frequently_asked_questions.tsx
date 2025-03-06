"use client";

import { Check, Pencil, PlusCircle, Trash2 } from "lucide-react";
import { useRef, useState, useEffect, useCallback } from "react";

interface RowData {
  id: number;
  question: string;
  answer: string;
}

export default function FrequentlyAskedQuestions() {
  const [rows, setRows] = useState<RowData[]>(() => {
    if (typeof window !== "undefined") {
      const savedRows = localStorage.getItem("faq_rows");
      return savedRows ? JSON.parse(savedRows) : [];
    }
    return [];
  });

  const [editId, setEditId] = useState<number | null>(null);
  const [editData, setEditData] = useState<RowData>({
    id: 0,
    question: "",
    answer: "",
  });
  const [newRowData, setNewRowData] = useState<Omit<RowData, "id">>({
    question: "",
    answer: "",
  });
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Lưu vào localStorage với debounce (giảm số lần lưu)
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem("faq_rows", JSON.stringify(rows));
    }, 300);
    return () => clearTimeout(timer);
  }, [rows]);

  const handleEdit = (id: number) => {
    const row = rows.find((r) => r.id === id);
    if (row) {
      setEditData(row);
      setEditId(id);
    }
  };

  const handleSave = (id: number) => {
    setRows((prev) => prev.map((r) => (r.id === id ? editData : r)));
    setEditId(null);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa?")) {
      setRows((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const handleDeleteSelected = () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa các mục đã chọn?")) {
      setRows((prev) => prev.filter((r) => !selectedRows.includes(r.id)));
      setSelectedRows([]);
    }
  };

  const handleRowSelection = (id: number) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id],
    );
  };

  const handleAddRow = () => {
    if (newRowData.question.trim() && newRowData.answer.trim()) {
      setRows((prev) => [...prev, { id: Date.now(), ...newRowData }]);
      setNewRowData({ question: "", answer: "" });
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  // Xử lý chung cho input (edit và new)
  const handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    type: "question" | "answer",
    mode: "edit" | "new",
  ) => {
    if (mode === "edit") {
      setEditData((prev) => ({ ...prev, [type]: e.target.value }));
    } else {
      setNewRowData((prev) => ({ ...prev, [type]: e.target.value }));
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
    action: () => void,
  ) => {
    if (e.key === "Enter") action();
  };

  return (
    <div className="flex w-full flex-col space-y-2 py-2">
      <button
        className="mb-2 w-fit border border-red-500 bg-white p-2 text-red-500 hover:text-red-700"
        onClick={handleDeleteSelected}
        disabled={selectedRows.length === 0}
      >
        <Trash2 size={16} />
      </button>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Select</th>
            <th className="border p-2">Questions</th>
            <th className="border p-2">Answers</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border">
              <td className="border p-2 text-center">
                <input
                  type="checkbox"
                  checked={selectedRows.includes(row.id)}
                  onChange={() => handleRowSelection(row.id)}
                />
              </td>
              {editId === row.id ? (
                <>
                  <td className="border p-2">
                    <textarea
                      className="w-full border p-1"
                      rows={5}
                      value={editData.question}
                      onChange={(e) => handleChange(e, "question", "edit")}
                    //   onKeyDown={(e) =>
                    //     handleKeyDown(e, () => handleSave(row.id))
                    //   }
                    />
                  </td>
                  <td className="border p-2">
                    <textarea
                      className="w-full border p-1"
                      rows={5}
                      value={editData.answer}
                      onChange={(e) => handleChange(e, "answer", "edit")}
                    //   onKeyDown={(e) =>
                    //     handleKeyDown(e, () => handleSave(row.id))
                    //   }
                    />
                  </td>
                  <td className="border p-2">
                    <button
                      className="mr-2 text-green-500"
                      onClick={() => handleSave(row.id)}
                    >
                      <Check size={16} />
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td className="border p-2 ">{row.question}</td>
                  <td className="border p-2">{row.answer || "-"}</td>
                  <td className="border p-2">
                    <button
                      className="mr-2 text-blue-500"
                      onClick={() => handleEdit(row.id)}
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      className="text-red-500"
                      onClick={() => handleDelete(row.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
          <tr>
            <td className="border p-2 text-center">-</td>
            <td className="border p-2">
              <textarea
                ref={inputRef}
                className="w-full border p-1"
                rows={5}
                placeholder="Title"
                value={newRowData.question}
                onChange={(e) => handleChange(e, "question", "new")}
              //  onKeyDown={(e) => handleKeyDown(e, handleAddRow)}
              />
            </td>
            <td className="border p-2">
              <textarea
                className="w-full border p-1"
                rows={5}
                placeholder="Answer"
                value={newRowData.answer}
                onChange={(e) => handleChange(e, "answer", "new")}
               // onKeyDown={(e) => handleKeyDown(e, handleAddRow)}
              />
            </td>
            <td className="border p-2">
              <button className="text-blue-500" onClick={handleAddRow}>
                <PlusCircle size={16} />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
