"use client";

import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { Check, Pencil, PlusCircle, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface RowData {
  id: number;
  package: string;
  basic: string;
  standard: string;
  premium: string;
}

interface EditData {
  package: string;
  basic: string;
  standard: string;
  premium: string;
}

interface NewRowData {
  package: string;
  basic: string;
  standard: string;
  premium: string;
}
const deliveryOptions = [
  { day: 1, title: "1 day " },
  { day: 2, title: "2 days" },
  { day: 3, title: "3 days" },
  { day: 4, title: "4 days" },
  { day: 5, title: "5 days" },
  { day: 6, title: "6 days" },
  { day: 7, title: "7 days" },
  { day: 10, title: "10 days" },
  { day: 14, title: "14 days" },
  { day: 21, title: "21 days" },
  { day: 30, title: "30 days" },
  { day: 45, title: "45 days" },
  { day: 60, title: "60 days" },
  { day: 75, title: "75 days" },
  { day: 90, title: "90 days" },
];

interface Props {
  switchToTab: (tab: string) => void;
  tabs: { label: string }[];
}

const initialRequiredInformation = [
  {
    id: 1,
    package: "Name",
    basic: "",
    standard: "",
    premium: "",
  },
  {
    id: 2,
    package: "Detail",
    basic: "",
    standard: "",
    premium: "",
  },
  {
    id: 3,
    package: "Delivery",
    basic: "",
    standard: "",
    premium: "",
  },

  {
    id: 4,
    package: "Price",
    basic: "",
    standard: "",
    premium: "",
  },
];

const initialData: NewRowData = {
  package: "",
  basic: "",
  standard: "",
  premium: "",
};

const gig_requiredInformation = "gig_requiredInformation";
const gig_additionalInformation = "gig_additionalInformation";

export default function GigPricing({ switchToTab, tabs }: Props) {
  const [requiredInformation, setRequiredInformation] = useState<RowData[]>(
    () =>
      JSON.parse(
        localStorage.getItem(gig_requiredInformation) ||
          JSON.stringify(initialRequiredInformation),
      ),
  );

  const [additionalInformation, setAdditionalInformation] = useState<RowData[]>(
    () => JSON.parse(localStorage.getItem(gig_additionalInformation) || "[]"),
  );

  const [editId, setEditId] = useState<number | null>(null);

  const [editData, setEditData] = useState<EditData>(initialData);

  const [newRowData, setNewRowData] = useState(initialData);

  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem(
      gig_requiredInformation,
      JSON.stringify(requiredInformation),
    );
  }, [requiredInformation]);

  useEffect(() => {
    localStorage.setItem(
      gig_additionalInformation,
      JSON.stringify(additionalInformation),
    );
  }, [additionalInformation]);

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof EditData,
  ) => {
    setEditData({ ...editData, [field]: e.target.value });
  };

  const handleEdit = (id: number) => {
    const row = additionalInformation.find(
      (r: RowData) => r.id === id,
    ) as unknown as RowData;
    if (row) {
      setEditData({
        package: row.package,
        basic: row.basic,
        standard: row.standard,
        premium: row.premium,
      });
    }
    setEditId(id);
  };

  const handleSave = (id: number) => {
    setAdditionalInformation(
      additionalInformation.map((r) =>
        r.id === id ? { ...r, ...editData } : r,
      ),
    );
    setEditId(null);
  };

  const handleDelete = (id: number) => {
    setAdditionalInformation(additionalInformation.filter((r) => r.id !== id));
  };

  const handleDeleteSelected = () => {
    setAdditionalInformation(
      additionalInformation.filter((r) => !selectedRows.includes(r.id)),
    );
    setSelectedRows([]);
  };

  const handleRowSelection = (id: number) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id],
    );
  };

  const handleAddRow = () => {
    if (
      newRowData.package &&
      (newRowData.basic || newRowData.standard || newRowData.premium)
    ) {
      setAdditionalInformation([
        ...additionalInformation,
        { id: Date.now(), ...newRowData },
      ]);
      setNewRowData({ package: "", basic: "", standard: "", premium: "" });
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
    <div className="flex w-full flex-col space-y-2 p-4">
      <button
        className="mb-2 w-fit cursor-pointer border-[1px] border-red-500 bg-white p-2 text-red-500 hover:text-red-700"
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
          {/* Name your package */}
          <tr>
            <td className="border p-2 text-center">-</td>
            <td className="border p-2">Name</td>
            <td className="border p-2">
              <textarea
                rows={4}
                className="w-full outline-none"
                placeholder="Name your package"
                value={requiredInformation[0].basic}
                onChange={(e) => {
                  setRequiredInformation(
                    requiredInformation.map((_) =>
                      _.id === 1 ? { ..._, basic: e.target.value } : _,
                    ),
                  );
                }}
              />
            </td>
            <td className="border p-2">
              <textarea
                rows={4}
                className="w-full outline-none"
                placeholder="Name your package"
                value={requiredInformation[0].standard}
                onChange={(e) => {
                  setRequiredInformation(
                    requiredInformation.map((_) =>
                      _.id === 1 ? { ..._, standard: e.target.value } : _,
                    ),
                  );
                }}
              />
            </td>
            <td className="border p-2">
              <textarea
                rows={4}
                className="w-full outline-none"
                placeholder="Name your package"
                value={requiredInformation[0].premium}
                onChange={(e) => {
                  setRequiredInformation(
                    requiredInformation.map((_) =>
                      _.id === 1 ? { ..._, premium: e.target.value } : _,
                    ),
                  );
                }}
              />
            </td>
            <td className="border p-2 text-center">-</td>
          </tr>

          {/* Describe the details of your offering */}
          <tr className=" ">
            <td className="border p-2 text-center">-</td>
            <td className="border p-2">Detail</td>
            <td className="border p-2">
              <textarea
                className="w-full outline-none"
                rows={8}
                placeholder="Describe the details of your offering"
                value={requiredInformation[1].basic}
                onChange={(e) => {
                  setRequiredInformation(
                    requiredInformation.map((_) =>
                      _.id === 2 ? { ..._, basic: e.target.value } : _,
                    ),
                  );
                }}
              />
            </td>
            <td className="border p-2">
              <textarea
                rows={8}
                className="w-full outline-none"
                placeholder="Describe the details of your offering"
                value={requiredInformation[1].standard}
                onChange={(e) => {
                  setRequiredInformation(
                    requiredInformation.map((_) =>
                      _.id === 2 ? { ..._, standard: e.target.value } : _,
                    ),
                  );
                }}
              />
            </td>
            <td className="border p-2">
              <textarea
                rows={8}
                className="w-full outline-none"
                placeholder="Describe the details of your offering"
                value={requiredInformation[1].premium}
                onChange={(e) => {
                  setRequiredInformation(
                    requiredInformation.map((_) =>
                      _.id === 2 ? { ..._, premium: e.target.value } : _,
                    ),
                  );
                }}
              />
            </td>
            <td className="border p-2 text-center">-</td>
          </tr>

          {/* Delivery */}
          <tr>
            <td className="border p-2 text-center">-</td>
            <td className="border p-2">Delivery</td>
            <td className="border p-2">
              <FormControl variant="standard" sx={{ p: 1, width: "100%" }}>
                <InputLabel
                  id="demo-simple-select-standard-label"
                  sx={{ p: 1 }}
                >
                  Delivery
                </InputLabel>
                <Select
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  sx={{ width: 100 }}
                  value={requiredInformation[2].basic}
                  onChange={(e) => {
                    setRequiredInformation(
                      requiredInformation.map((_) =>
                        _.id === 3 ? { ..._, basic: e.target.value } : _,
                      ),
                    );
                  }}
                  label="Delivery Day"
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        maxHeight: 200,
                      },
                    },
                  }}
                >
                  <MenuItem value="">
                    <em>Delivery</em>
                  </MenuItem>

                  {deliveryOptions.map((_) => (
                    <MenuItem value={_.day}>{_.title}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </td>
            <td className="border p-2">
              <FormControl variant="standard" sx={{ p: 1, width: "100%" }}>
                <InputLabel
                  id="demo-simple-select-standard-label"
                  sx={{ p: 1 }}
                >
                  Delivery
                </InputLabel>
                <Select
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  sx={{ width: 100 }}
                  value={requiredInformation[2].standard}
                  onChange={(e) => {
                    setRequiredInformation(
                      requiredInformation.map((_) =>
                        _.id === 3 ? { ..._, standard: e.target.value } : _,
                      ),
                    );
                  }}
                  label="Delivery Day"
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        maxHeight: 200,
                      },
                    },
                  }}
                >
                  <MenuItem value="">
                    <em>Delivery</em>
                  </MenuItem>

                  {deliveryOptions.map((_) => (
                    <MenuItem value={_.day}>{_.title}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </td>
            <td className="border p-2">
              <FormControl variant="standard" sx={{ p: 1, width: "100%" }}>
                <InputLabel
                  id="demo-simple-select-standard-label"
                  sx={{ p: 1 }}
                >
                  Delivery
                </InputLabel>
                <Select
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  sx={{ width: 100 }}
                  value={requiredInformation[2].premium}
                  onChange={(e) => {
                    setRequiredInformation(
                      requiredInformation.map((_) =>
                        _.id === 3 ? { ..._, premium: e.target.value } : _,
                      ),
                    );
                  }}
                  label="Delivery Day"
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        maxHeight: 200,
                      },
                    },
                  }}
                >
                  <MenuItem value="">
                    <em>Delivery</em>
                  </MenuItem>

                  {deliveryOptions.map((_) => (
                    <MenuItem value={_.day}>{_.title}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </td>
            <td className="border p-2 text-center">-</td>
          </tr>

          {/* Price */}
          <tr>
            <td className="border p-2 text-center">-</td>
            <td className="border p-2">Price</td>
            <td className="border p-2">
              <div className="relative w-full">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500">
                  $
                </span>
                <input
                  type="number"
                  className="w-full rounded-sm border-2 p-1 pl-6 outline-none"
                  placeholder="50"
                  value={requiredInformation[3].standard}
                  onChange={(e) => {
                    setRequiredInformation(
                      requiredInformation.map((_) =>
                        _.id === 4 ? { ..._, standard: e.target.value } : _,
                      ),
                    );
                  }}
                />
              </div>
            </td>
            <td className="border p-2">
              <div className="relative w-full">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500">
                  $
                </span>
                <input
                  type="number"
                  className="w-full rounded-sm border-2 p-1 pl-6 outline-none"
                  placeholder="100"
                  value={requiredInformation[3].basic}
                  onChange={(e) => {
                    setRequiredInformation(
                      requiredInformation.map((_) =>
                        _.id === 4 ? { ..._, basic: e.target.value } : _,
                      ),
                    );
                  }}
                />
              </div>
            </td>
            <td className="border p-2">
              <div className="relative w-full">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500">
                  $
                </span>
                <input
                  type="number"
                  className="w-full rounded-sm border-2 p-1 pl-6 outline-none"
                  placeholder="150"
                  value={requiredInformation[3].premium}
                  onChange={(e) => {
                    setRequiredInformation(
                      requiredInformation.map((_) =>
                        _.id === 4 ? { ..._, premium: e.target.value } : _,
                      ),
                    );
                  }}
                />
              </div>
            </td>
            <td className="border p-2 text-center">-</td>
          </tr>

          {additionalInformation.map((row: RowData) => (
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
                      value={editData.package}
                      onChange={(e) => handleEditChange(e, "package")}
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      className="w-full border p-1"
                      type="text"
                      value={editData.basic}
                      onChange={(e) => handleEditChange(e, "basic")}
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      className="w-full border p-1"
                      type="text"
                      value={editData.standard}
                      onChange={(e) => handleEditChange(e, "standard")}
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      className="w-full border p-1"
                      type="text"
                      value={editData.premium}
                      onChange={(e) => handleEditChange(e, "premium")}
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
                    {row.package}
                  </td>
                  <td className="max-w-10 break-words border p-2">
                    {transformValue(row.basic)}
                  </td>
                  <td className="max-w-10 break-words border p-2">
                    {transformValue(row.standard)}
                  </td>
                  <td className="max-w-10 break-words border p-2">
                    {transformValue(row.premium)}
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
                placeholder="Package"
                value={newRowData.package}
                onChange={(e) =>
                  setNewRowData({ ...newRowData, package: e.target.value })
                }
                onKeyDown={handleKeyDown}
              />
            </td>
            <td className="border p-2">
              <input
                className="w-full border p-1"
                type="text"
                placeholder="Column 1"
                value={newRowData.basic}
                onChange={(e) =>
                  setNewRowData({ ...newRowData, basic: e.target.value })
                }
                onKeyDown={handleKeyDown}
              />
            </td>
            <td className="border p-2">
              <input
                className="w-full border p-1"
                type="text"
                placeholder="Column 2"
                value={newRowData.standard}
                onChange={(e) =>
                  setNewRowData({ ...newRowData, standard: e.target.value })
                }
                onKeyDown={handleKeyDown}
              />
            </td>
            <td className="border p-2">
              <input
                className="w-full border p-1"
                type="text"
                placeholder="Column 3"
                value={newRowData.premium}
                onChange={(e) =>
                  setNewRowData({ ...newRowData, premium: e.target.value })
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
      <Button
        variant="contained"
        sx={{ alignSelf: "end" }}
        onClick={() => switchToTab(tabs[2].label)}
      >
        Save & Continue
      </Button>
    </div>
  );
}
