"use client";

import { useEffect, useRef, useState } from "react";
import { Pencil, Trash2, Check, PlusCircle, XCircle } from "lucide-react";

interface RowData {
  id: number;
  title: string;
  col1: string;
  col2: string;
  col3: string;
}

interface EditData {
  title: string;
  col1: string;
  col2: string;
  col3: string;
}

interface NewRowData {
  title: string;
  col1: string;
  col2: string;
  col3: string;
}

export default function EditableTable() {
  const [rows, setRows] = useState([
    {
      id: 1,
      title: "Package",
      col1: "Basic",
      col2: "Standard",
      col3: "Premium",
    },
  ]);
  const [editId, setEditId] = useState<number | null>(null);
  const [editData, setEditData] = useState({
    title: "",
    col1: "",
    col2: "",
    col3: "",
  });
  const [newRowData, setNewRowData] = useState({
    title: "",
    col1: "",
    col2: "",
    col3: "",
  });
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof EditData,
  ) => {
    setEditData({ ...editData, [field]: e.target.value });
  };

  const handleEdit = (id: number) => {
    const row = rows.find((r) => r.id === id);
    row &&
      setEditData({
        title: row.title,
        col1: row.col1,
        col2: row.col2,
        col3: row.col3,
      });
    setEditId(id);
  };

  const handleSave = (id: number) => {
    setRows(rows.map((r) => (r.id === id ? { ...r, ...editData } : r)));
    setEditId(null);
  };

  const handleDelete = (id: number) => {
    setRows(rows.filter((r) => r.id !== id));
  };

  const handleDeleteSelected = () => {
    setRows(rows.filter((r) => !selectedRows.includes(r.id)));
    setSelectedRows([]);
  };

  const handleRowSelection = (id: number) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id],
    );
  };

  const handleAddRow = () => {
    if (
      newRowData.title &&
      (newRowData.col1 || newRowData.col2 || newRowData.col3)
    ) {
      setRows([...rows, { id: Date.now(), ...newRowData }]);
      setNewRowData({ title: "", col1: "", col2: "", col3: "" });
    }
    setTimeout(() => inputRef.current?.focus(), 0);
  };
  const transformValue = (value: any) => {
    if (value.toLowerCase() === "x") {
      return <Check size={16} className="text-green-500" />;
    } else if (value.toLowerCase() === "") {
      return "-";
    } else {
      return value;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleAddRow();
  };

  return (
    <div className="w-full p-4">
      <button
        className="mb-2 cursor-pointer border-[1px] border-red-500 bg-white p-2 text-red-500 hover:text-red-700"
        onClick={handleDeleteSelected}
        disabled={selectedRows.length === 0}
      >
        <Trash2 size={16} />
      </button>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Select</th>
            <th className="border p-2">Package</th>
            <th className="border p-2">Basic</th>
            <th className="border p-2">Standard</th>
            <th className="border p-2">Premium</th>
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
                    <input
                      className="w-full border p-1"
                      type="text"
                      value={editData.title}
                      onChange={(e) => handleEditChange(e, "title")}
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      className="w-full border p-1"
                      type="text"
                      value={editData.col1}
                      onChange={(e) => handleEditChange(e, "col1")}
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      className="w-full border p-1"
                      type="text"
                      value={editData.col2}
                      onChange={(e) => handleEditChange(e, "col2")}
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      className="w-full border p-1"
                      type="text"
                      value={editData.col3}
                      onChange={(e) => handleEditChange(e, "col3")}
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
                  <td className="max-w-20 break-words border p-2">
                    {row.title}
                  </td>
                  <td className="max-w-10 break-words border p-2">
                    {transformValue(row.col1)}
                  </td>
                  <td className="max-w-10 break-words border p-2">
                    {transformValue(row.col2)}
                  </td>
                  <td className="max-w-10 break-words border p-2">
                    {transformValue(row.col3)}
                  </td>
                  <td className="max-w-10 break-words border p-2">
                    <button
                      className="mr-2 text-blue-500 hover:text-blue-700"
                      onClick={() => handleEdit(row.id)}
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
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
              <input
                ref={inputRef}
                className="w-full border p-1"
                type="text"
                placeholder="Title"
                value={newRowData.title}
                onChange={(e) =>
                  setNewRowData({ ...newRowData, title: e.target.value })
                }
                onKeyDown={handleKeyDown}
              />
            </td>
            <td className="border p-2">
              <input
                className="w-full border p-1"
                type="text"
                placeholder="Column 1"
                value={newRowData.col1}
                onChange={(e) =>
                  setNewRowData({ ...newRowData, col1: e.target.value })
                }
                onKeyDown={handleKeyDown}
              />
            </td>
            <td className="border p-2">
              <input
                className="w-full border p-1"
                type="text"
                placeholder="Column 2"
                value={newRowData.col2}
                onChange={(e) =>
                  setNewRowData({ ...newRowData, col2: e.target.value })
                }
                onKeyDown={handleKeyDown}
              />
            </td>
            <td className="border p-2">
              <input
                className="w-full border p-1"
                type="text"
                placeholder="Column 3"
                value={newRowData.col3}
                onChange={(e) =>
                  setNewRowData({ ...newRowData, col3: e.target.value })
                }
                onKeyDown={handleKeyDown}
              />
            </td>
            <td className="border p-2">
              <button
                className="text-blue-500 hover:text-blue-700"
                onClick={handleAddRow}
              >
                <PlusCircle size={16} />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
