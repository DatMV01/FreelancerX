"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Check,
  CheckCircle,
  Pencil,
  PlusCircle,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface RowData {
  id: number | string;
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
  { id: "446655440001", day: 1, title: "1 day" },
  { id: "446655440002", day: 2, title: "2 days" },
  { id: "446655440003", day: 3, title: "3 days" },
  { id: "446655440004", day: 4, title: "4 days" },
  { id: "446655440005", day: 5, title: "5 days" },
  { id: "446655440006", day: 6, title: "6 days" },
  { id: "446655440007", day: 7, title: "7 days" },
  { id: "446655440008", day: 10, title: "10 days" },
  { id: "446655440009", day: 14, title: "14 days" },
  { id: "446655440010", day: 21, title: "21 days" },
  { id: "446655440011", day: 30, title: "30 days" },
  { id: "446655440012", day: 45, title: "45 days" },
  { id: "446655440013", day: 60, title: "60 days" },
  { id: "446655440014", day: 75, title: "75 days" },
  { id: "446655440015", day: 90, title: "90 days" },
  { id: "446655440016", day: 105, title: "105 days" },
  { id: "446655440017", day: 120, title: "120 days" },
];

const revisionsCount = [
  { id: "476655440001", count: 1 },
  { id: "476655440002", count: 2 },
  { id: "476655440003", count: 3 },
  { id: "476655440004", count: 4 },
  { id: "476655440005", count: 5 },
  { id: "476655440006", count: 6 },
  { id: "476655440007", count: 7 },
  { id: "476655440008", count: 8 },
  { id: "476655440009", count: 9 },
  { id: "476655440010", count: 10 },
  { id: "476655440011", count: 11 },
  { id: "476655440012", count: 12 },
  { id: "476655440013", count: 13 },
  { id: "476655440014", count: 14 },
  { id: "476655440015", count: 15 },
];

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
    package: "Description",
    basic: "",
    standard: "",
    premium: "",
  },
  {
    id: 3,
    package: "Delivery",
    basic: 3,
    standard: 2,
    premium: 1,
  },
  {
    id: 4,
    package: "Revisions",
    basic: 1,
    standard: 2,
    premium: 3,
  },
  {
    id: 5,
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

const RevisonRow = ({
  requiredInformation,
  setRequiredInformation,
}: {
  requiredInformation: any;
  setRequiredInformation: any;
}) => {
  const { basic, standard, premium } = requiredInformation[3];

  return (
    <>
      <tr>
        <td className="border p-2 text-center">-</td>
        <td className="border p-2">Revisions</td>
        <td className="border p-2">
          <Select
            value={basic.toString()}
            onValueChange={(value) => {
              setRequiredInformation(
                requiredInformation.map((_: RowData) =>
                  _.id === 4 ? { ..._, basic: Number(value) } : _,
                ),
              );
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select revisions" />
            </SelectTrigger>
            <SelectContent>
              {revisionsCount.map((_) => (
                <SelectItem key={_.id} value={_.count.toString()}>
                  {_.count}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </td>
        <td className="border p-2">
          <Select
            value={standard.toString()}
            onValueChange={(value) => {
              setRequiredInformation(
                requiredInformation.map((_: RowData) =>
                  _.id === 4 ? { ..._, standard: Number(value) } : _,
                ),
              );
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select revisions" />
            </SelectTrigger>
            <SelectContent>
              {revisionsCount.map((_) => (
                <SelectItem key={_.id} value={_.count.toString()}>
                  {_.count}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </td>
        <td className="border p-2">
          <Select
            value={premium.toString()}
            onValueChange={(value) => {
              setRequiredInformation(
                requiredInformation.map((_: RowData) =>
                  _.id === 4 ? { ..._, premium: Number(value) } : _,
                ),
              );
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select revisions" />
            </SelectTrigger>
            <SelectContent>
              {revisionsCount.map((_) => (
                <SelectItem key={_.id} value={_.count.toString()}>
                  {_.count}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </td>
        <td className="border p-2 text-center">-</td>
      </tr>
    </>
  );
};

const NameRow = ({
  requiredInformation,
  setRequiredInformation,
}: {
  requiredInformation: any;
  setRequiredInformation: any;
}) => {
  return (
    <>
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
                requiredInformation.map((_: RowData) =>
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
                requiredInformation.map((_: RowData) =>
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
                requiredInformation.map((_: RowData) =>
                  _.id === 1 ? { ..._, premium: e.target.value } : _,
                ),
              );
            }}
          />
        </td>
        <td className="border p-2 text-center">-</td>
      </tr>
    </>
  );
};

const DescriptionRow = ({
  requiredInformation,
  setRequiredInformation,
}: {
  requiredInformation: any;
  setRequiredInformation: any;
}) => {
  return (
    <>
      <tr>
        <td className="border p-2 text-center">-</td>
        <td className="border p-2">Description</td>
        <td className="border p-2">
          <textarea
            className="w-full outline-none"
            rows={8}
            placeholder="Describe the details of your offering"
            value={requiredInformation[1].basic}
            onChange={(e) => {
              setRequiredInformation(
                requiredInformation.map((_: RowData) =>
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
                requiredInformation.map((_: RowData) =>
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
                requiredInformation.map((_: RowData) =>
                  _.id === 2 ? { ..._, premium: e.target.value } : _,
                ),
              );
            }}
          />
        </td>
        <td className="border p-2 text-center">-</td>
      </tr>
    </>
  );
};

const DeliveryRow = ({
  requiredInformation,
  setRequiredInformation,
}: {
  requiredInformation: any;
  setRequiredInformation: any;
}) => {
  return (
    <>
      <tr>
        <td className="border text-center">-</td>
        <td className="border p-2">Delivery</td>
        <td className="border p-2">
          <Select
            value={requiredInformation[2].basic.toString()}
            onValueChange={(value) => {
              setRequiredInformation(
                requiredInformation.map((_: RowData) =>
                  _.id === 3 ? { ..._, basic: value } : _,
                ),
              );
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select delivery day" />
            </SelectTrigger>
            <SelectContent>
              {deliveryOptions.map((_) => (
                <SelectItem key={_.id} value={_.day.toString()}>
                  {_.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </td>
        <td className="border p-2">
          <Select
            value={requiredInformation[2].standard.toString()}
            onValueChange={(value) => {
              setRequiredInformation(
                requiredInformation.map((_: RowData) =>
                  _.id === 3 ? { ..._, standard: value } : _,
                ),
              );
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select delivery day" />
            </SelectTrigger>
            <SelectContent>
              {deliveryOptions.map((_) => (
                <SelectItem key={_.id} value={_.day.toString()}>
                  {_.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </td>
        <td className="border p-2">
          <Select
            value={requiredInformation[2].premium.toString()}
            onValueChange={(value) => {
              setRequiredInformation(
                requiredInformation.map((_: RowData) =>
                  _.id === 3 ? { ..._, premium: value } : _,
                ),
              );
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select delivery day" />
            </SelectTrigger>
            <SelectContent>
              {deliveryOptions.map((_) => (
                <SelectItem key={_.id} value={_.day.toString()}>
                  {_.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </td>
        <td className="border p-2 text-center">-</td>
      </tr>
    </>
  );
};

const PriceRow = ({
  requiredInformation,
  setRequiredInformation,
}: {
  requiredInformation: any;
  setRequiredInformation: any;
}) => {
  return (
    <>
      <tr>
        <td className="border p-2 text-center">-</td>
        <td className="border p-2">Price</td>
        <td className="border p-2">
          <div className="relative w-full">
            <span className="absolute top-1/2 left-2 -translate-y-1/2 text-gray-500">
              $
            </span>
            <input
              type="number"
              className="w-full rounded-sm border p-1 pl-6 outline-none"
              placeholder="50"
              value={requiredInformation[4].basic}
              onChange={(e) => {
                setRequiredInformation(
                  requiredInformation.map((_: RowData) =>
                    _.id === 5 ? { ..._, basic: e.target.value } : _,
                  ),
                );
              }}
            />
          </div>
        </td>
        <td className="border p-2">
          <div className="relative w-full">
            <span className="absolute top-1/2 left-2 -translate-y-1/2 text-gray-500">
              $
            </span>
            <input
              type="number"
              className="w-full rounded-sm border p-1 pl-6 outline-none"
              placeholder="100"
              value={requiredInformation[4].standard}
              onChange={(e) => {
                setRequiredInformation(
                  requiredInformation.map((_: RowData) =>
                    _.id === 5 ? { ..._, standard: e.target.value } : _,
                  ),
                );
              }}
            />
          </div>
        </td>
        <td className="border p-2">
          <div className="relative w-full">
            <span className="absolute top-1/2 left-2 -translate-y-1/2 text-gray-500">
              $
            </span>
            <input
              type="number"
              className="w-full rounded-sm border p-1 pl-6 outline-none"
              placeholder="150"
              value={requiredInformation[4].premium}
              onChange={(e) => {
                setRequiredInformation(
                  requiredInformation.map((_: RowData) =>
                    _.id === 5 ? { ..._, premium: e.target.value } : _,
                  ),
                );
              }}
            />
          </div>
        </td>
        <td className="border p-2 text-center">-</td>
      </tr>
    </>
  );
};

const transformValue = (value: any) => {
  if (value.toLowerCase() === "x" || value.toLowerCase() === "yes") {
    return <CheckCircle size={18} className="text-green-500" />;
  } else if (value.toLowerCase() === "") {
    return <X color="red" size={18} />;
  } else {
    return value;
  }
};

const AddtionalRow = ({
  additionalInformation,
  setAdditionalInformation,
  selectedRows,
  setSelectedRows,
  editId,
  editData,
  setEditData,
  setEditId,
}: {
  additionalInformation: any;
  setAdditionalInformation: any;
  selectedRows: any;
  setSelectedRows: any;
  editId: any;
  editData: any;
  setEditData: any;
  setEditId: any;
}) => {
  const handleRowSelection = (id: number | string) => {
    setSelectedRows((prev: any) =>
      prev.includes(id)
        ? prev.filter((rowId: any) => rowId !== id)
        : [...prev, id],
    );
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof EditData,
  ) => {
    e.preventDefault();
    setEditData({ ...editData, [field]: e.target.value });
  };

  const handleDelete = (id: number | string) => {
    setAdditionalInformation(
      additionalInformation.filter((r: any) => r.id !== id),
    );
  };

  const handleEdit = (id: number | string) => {
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

  const handleSave = (id: number | string) => {
    setAdditionalInformation(
      additionalInformation.map((r: any) =>
        r.id === id ? { ...r, ...editData } : r,
      ),
    );
    setEditId(null);
  };

  return (
    <>
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
                  className="w-full border"
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
                  onClick={(e) => {
                    e.preventDefault();
                    handleSave(row.id);
                  }}
                >
                  <Check size={16} />
                </button>
              </td>
            </>
          ) : (
            <>
              <td className="max-w-20 border p-2 break-words">{row.package}</td>
              <td className="max-w-10 border">
                <p className="flex items-center justify-center break-words">
                  {transformValue(row.basic)}
                </p>
              </td>
              <td className="max-w-10 border">
                <p className="flex items-center justify-center break-words">
                  {transformValue(row.standard)}
                </p>
              </td>
              <td className="max-w-10 border">
                <p className="flex items-center justify-center break-words">
                  {transformValue(row.premium)}
                </p>
              </td>

              <td className="max-w-10 border">
                <span className="flex items-center justify-center space-x-4">
                  <button
                    className="text-blue-500 hover:text-blue-700"
                    onClick={(e) => {
                      e.preventDefault();
                      handleEdit(row.id);
                    }}
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDelete(row.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </span>
              </td>
            </>
          )}
        </tr>
      ))}
    </>
  );
};

interface Props {
  pricingPackage?: any[];
  onPrincingPakageInputCb?: any;
}

export default function GigPricingInput({
  pricingPackage,
  onPrincingPakageInputCb,
}: Props) {
  let parseRequire: RowData[] = [];
  let parseFeatures: RowData[] = [];
  if (pricingPackage) {
    
    for (let index = 0; index < pricingPackage.length; index++) {
      const element: RowData = pricingPackage[index];
      if (
        element.package === "Name" ||
        element.package === "Description" ||
        element.package === "Delivery" ||
        element.package === "Revisions" ||
        element.package === "Price"
      ) {
        parseRequire.push(element);
      } else {
        parseFeatures.push(element);
      }
    }
  }

  const [requiredInformation, setRequiredInformation] = useState<RowData[]>(
    pricingPackage ? parseRequire : (initialRequiredInformation as any),
  );

  const [featuresInformation, setFeaturesInformation] = useState<RowData[]>(
    pricingPackage ? parseFeatures : [],
  );

  const [editId, setEditId] = useState<number | null>(null);

  const [editData, setEditData] = useState<EditData>(initialData);

  const [newRowData, setNewRowData] = useState(initialData);

  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const {
      basic: basicPrice,
      standard: standardPrice,
      premium: premiumPrice,
    } = requiredInformation[4];

    onPrincingPakageInputCb &&
      onPrincingPakageInputCb({
        basicPrice: Number(basicPrice),
        standardPrice: Number(standardPrice),
        premiumPrice: Number(premiumPrice),
        pricing: [...requiredInformation, ...featuresInformation],
      });
  }, [requiredInformation, featuresInformation]);

  const handleDeleteSelected = () => {
    setFeaturesInformation(
      featuresInformation.filter((r) => !selectedRows.includes(Number(r.id))),
    );
    setSelectedRows([]);
  };

  const handleAddRow = () => {
    if (
      newRowData.package &&
      (newRowData.basic || newRowData.standard || newRowData.premium)
    ) {
      newRowData.basic = newRowData.basic === "x" ? "Yes" : newRowData.basic;
      newRowData.standard =
        newRowData.standard === "x" ? "Yes" : newRowData.standard;
      newRowData.premium =
        newRowData.premium === "x" ? "Yes" : newRowData.premium;

      setFeaturesInformation([
        ...featuresInformation,
        { id: Date.now(), ...newRowData },
      ]);
      setNewRowData({ package: "", basic: "", standard: "", premium: "" });
    }
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddRow();
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      <button
        className="mb-2 w-fit cursor-pointer border border-red-500 bg-white p-2 text-red-500 hover:text-red-700"
        onClick={handleDeleteSelected}
        disabled={selectedRows.length === 0}
      >
        <Trash2 size={16} />
      </button>
      <table className="w-full">
        <thead>
          <tr className="h-[50px] bg-gray-200">
            <th>Select</th>
            <th>Package</th>
            <th>Basic</th>
            <th>Standard</th>
            <th>Premium</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <NameRow
            requiredInformation={requiredInformation}
            setRequiredInformation={setRequiredInformation}
          />

          <DescriptionRow
            requiredInformation={requiredInformation}
            setRequiredInformation={setRequiredInformation}
          />

          <DeliveryRow
            requiredInformation={requiredInformation}
            setRequiredInformation={setRequiredInformation}
          />

          <RevisonRow
            requiredInformation={requiredInformation}
            setRequiredInformation={setRequiredInformation}
          />

          <PriceRow
            requiredInformation={requiredInformation}
            setRequiredInformation={setRequiredInformation}
          />

          <AddtionalRow
            additionalInformation={featuresInformation}
            setAdditionalInformation={setFeaturesInformation}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
            editId={editId}
            editData={editData}
            setEditId={setEditId}
            setEditData={setEditData}
          />

          <tr>
            <td className="border text-center">-</td>
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
            <td className="border p-1">
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
            <td className="border p-1">
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
            <td className="border p-1">
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
            <td className="border">
              <span className="flex items-center justify-center">
                <button
                  className="text-blue-500 hover:text-blue-700"
                  onClick={handleAddRow}
                >
                  <PlusCircle size={16} />
                </button>
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
