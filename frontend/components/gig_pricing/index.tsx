"use client";

import { Gig } from "@/dto/gig";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { Check, Pencil, PlusCircle, Trash2 } from "lucide-react";
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
  { id: "550e8400-e29b-41d4-a716-446655440001", day: 1, title: "1 day" },
  { id: "550e8400-e29b-41d4-a716-446655440002", day: 2, title: "2 days" },
  { id: "550e8400-e29b-41d4-a716-446655440003", day: 3, title: "3 days" },
  { id: "550e8400-e29b-41d4-a716-446655440004", day: 4, title: "4 days" },
  { id: "550e8400-e29b-41d4-a716-446655440005", day: 5, title: "5 days" },
  { id: "550e8400-e29b-41d4-a716-446655440006", day: 6, title: "6 days" },
  { id: "550e8400-e29b-41d4-a716-446655440007", day: 7, title: "7 days" },
  { id: "550e8400-e29b-41d4-a716-446655440008", day: 10, title: "10 days" },
  { id: "550e8400-e29b-41d4-a716-446655440009", day: 14, title: "14 days" },
  { id: "550e8400-e29b-41d4-a716-446655440010", day: 21, title: "21 days" },
  { id: "550e8400-e29b-41d4-a716-446655440011", day: 30, title: "30 days" },
  { id: "550e8400-e29b-41d4-a716-446655440012", day: 45, title: "45 days" },
  { id: "550e8400-e29b-41d4-a716-446655440013", day: 60, title: "60 days" },
  { id: "550e8400-e29b-41d4-a716-446655440014", day: 75, title: "75 days" },
  { id: "550e8400-e29b-41d4-a716-446655440015", day: 90, title: "90 days" },
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
    package: "Description",
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
    package: "Revision",
    basic: 0,
    standard: 0,
    premium: 0,
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

const gig_requiredInformation = "gig_requiredInformation";
const gig_additionalInformation = "gig_additionalInformation";

const RevisonRow = ({
  requiredInformation,
  setRequiredInformation,
}: {
  requiredInformation: any;
  setRequiredInformation: any;
}) => {
  const revisionsCount = [
    { id: "3f1a3b17-8c92-4c3b-9e15-d9a1e62a5c1c", count: 0 },
    { id: "3f1a3b17-8c92-4c3b-9e15-d9a1e62a5c1d", count: 1 },
    { id: "7b2c56d4-5f84-45d8-8e6b-6d1e89c2a8a3", count: 2 },
    { id: "ae8d3a55-4f42-4c3d-b9b3-ef1c8f90e7b4", count: 3 },
    { id: "d2b63f4e-7115-4d24-90f9-7b8f3ea658c7", count: 4 },
    { id: "49f5a162-6a3c-4a2f-8ef4-fd3e5b2a9f21", count: 5 },
    { id: "5b9e6c41-8f74-41c3-89f5-d2c8a3e72b91", count: 6 },
    { id: "8a3d4c92-5e71-4f38-b1d7-6f9c5e3a2b84", count: 7 },
    { id: "e17f3a6d-2c95-4d81-b9f2-4c8d7a5e3b61", count: 8 },
    { id: "9b5c7d3a-81e4-4f29-90b3-6d2f8a1c75e3", count: 9 },
    { id: "6d4a7c8b-51f2-42e9-b3d9-8f3a2e75c14d", count: 10 },
    { id: "3a9f7b2c-4d81-4f52-95e3-8c6d1a5e7b49", count: 11 },
    { id: "4f6d8c7a-3b52-42e9-b915-2a9f7e5d3c81", count: 12 },
    { id: "2b5e7a9c-6d81-4f42-93d4-7f1a8c3e5b25", count: 13 },
    { id: "7c3a5d9f-4b81-42e6-b215-8f2d7a6c9e53", count: 14 },
    { id: "5e4c8a7b-9f21-4d62-b315-3a7f2d6c81e9", count: 15 },
  ];

  const { basic, standard, premium } = requiredInformation[3];

  return (
    <>
      <tr>
        <td className="border p-2 text-center">-</td>
        <td className="border p-2">Revision</td>
        <td className="border p-2">
          <FormControl variant="standard" sx={{ p: 1, width: "100%" }}>
            <InputLabel id="demo-simple-select-standard-label" sx={{ p: 1 }}>
              Revision
            </InputLabel>
            <Select
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              sx={{ width: 100 }}
              value={basic}
              onChange={(e) => {
                setRequiredInformation(
                  requiredInformation.map((_: RowData) =>
                    _.id === 4 ? { ..._, basic: e.target.value } : _,
                  ),
                );
              }}
              label="Revision"
              MenuProps={{
                PaperProps: {
                  sx: {
                    maxHeight: 200,
                  },
                },
              }}
            >
              {revisionsCount.map((_, i) => (
                <MenuItem key={_.id} value={_.count}>
                  {_.count}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </td>
        <td className="border p-2">
          <FormControl variant="standard" sx={{ p: 1, width: "100%" }}>
            <InputLabel id="demo-simple-select-standard-label" sx={{ p: 1 }}>
              Revision
            </InputLabel>
            <Select
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              sx={{ width: 100 }}
              value={standard}
              onChange={(e) => {
                setRequiredInformation(
                  requiredInformation.map((_: RowData) =>
                    _.id === 4 ? { ..._, standard: e.target.value } : _,
                  ),
                );
              }}
              label="Revision"
              MenuProps={{
                PaperProps: {
                  sx: {
                    maxHeight: 200,
                  },
                },
              }}
            >
              {revisionsCount.map((_, i) => (
                <MenuItem key={_.id} value={_.count}>
                  {_.count}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </td>
        <td className="border p-2">
          <FormControl variant="standard" sx={{ p: 1, width: "100%" }}>
            <InputLabel id="demo-simple-select-standard-label" sx={{ p: 1 }}>
              Revision
            </InputLabel>
            <Select
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              sx={{ width: 100 }}
              value={premium}
              onChange={(e) => {
                setRequiredInformation(
                  requiredInformation.map((_: RowData) =>
                    _.id === 4 ? { ..._, premium: e.target.value } : _,
                  ),
                );
              }}
              label="Revision"
              MenuProps={{
                PaperProps: {
                  sx: {
                    maxHeight: 200,
                  },
                },
              }}
            >
              {revisionsCount.map((_, i) => (
                <MenuItem key={_.id} value={_.count}>
                  {_.count}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
        <td className="border p-2 text-center">-</td>
        <td className="border p-2">Delivery</td>
        <td className="border p-2">
          <FormControl variant="standard" sx={{ p: 1, width: "100%" }}>
            <InputLabel id="demo-simple-select-standard-label" sx={{ p: 1 }}>
              Delivery
            </InputLabel>
            <Select
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              sx={{ width: 100 }}
              value={requiredInformation[2].basic}
              onChange={(e) => {
                setRequiredInformation(
                  requiredInformation.map((_: RowData) =>
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
                <MenuItem key={_.id} value={_.day}>
                  {_.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </td>
        <td className="border p-2">
          <FormControl variant="standard" sx={{ p: 1, width: "100%" }}>
            <InputLabel id="demo-simple-select-standard-label" sx={{ p: 1 }}>
              Delivery
            </InputLabel>
            <Select
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              sx={{ width: 100 }}
              value={requiredInformation[2].standard}
              onChange={(e) => {
                setRequiredInformation(
                  requiredInformation.map((_: RowData) =>
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
                <MenuItem key={_.id} value={_.day}>
                  {_.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </td>
        <td className="border p-2">
          <FormControl variant="standard" sx={{ p: 1, width: "100%" }}>
            <InputLabel id="demo-simple-select-standard-label" sx={{ p: 1 }}>
              Delivery
            </InputLabel>
            <Select
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              sx={{ width: 100 }}
              value={requiredInformation[2].premium}
              onChange={(e) => {
                setRequiredInformation(
                  requiredInformation.map((_: RowData) =>
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
                <MenuItem key={_.id} value={_.day}>
                  {_.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500">
              $
            </span>
            <input
              type="number"
              className="w-full rounded-sm border-2 p-1 pl-6 outline-none"
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
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500">
              $
            </span>
            <input
              type="number"
              className="w-full rounded-sm border-2 p-1 pl-6 outline-none"
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
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500">
              $
            </span>
            <input
              type="number"
              className="w-full rounded-sm border-2 p-1 pl-6 outline-none"
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
  if (value.toLowerCase() === "x") {
    return <Check size={16} className="text-green-500" />;
  } else if (value.toLowerCase() === "") {
    return "-";
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
              <td className="max-w-20 break-words border p-2">{row.package}</td>
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
    </>
  );
};

export default function GigPricing({ switchToTab, tabs }: Props) {
  const [gig, setGig] = useState<Gig>(() => {
    const gigLocalStorage = localStorage.getItem("gig");
    return gigLocalStorage ? JSON.parse(gigLocalStorage) : new Gig({});
  });

  const [requiredInformation, setRequiredInformation] = useState<RowData[]>(
    () => {
      const gig_requiredInformationLs = localStorage.getItem(
        gig_requiredInformation,
      );
      return gig_requiredInformationLs
        ? JSON.parse(gig_requiredInformationLs)
        : initialRequiredInformation;
    },
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
    localStorage.setItem("gig", JSON.stringify(gig));
  }, [gig]);

  useEffect(() => {
    localStorage.setItem(
      gig_requiredInformation,
      JSON.stringify(requiredInformation),
    );

    const {
      basic: basicName,
      standard: standardName,
      premium: premiumName,
    } = requiredInformation[0];

    const {
      basic: basicDescription,
      standard: standardDescription,
      premium: premiumDescription,
    } = requiredInformation[1];

    const {
      basic: basicDelivery,
      standard: standardDelivery,
      premium: premiumDelivery,
    } = requiredInformation[2];

    const {
      basic: basicRevision,
      standard: standardRevision,
      premium: premiumRevision,
    } = requiredInformation[3];

    const {
      basic: basicPrice,
      standard: standardPrice,
      premium: premiumPrice,
    } = requiredInformation[4];

    setGig((prev) => ({
      ...prev,
      pricing: {
        basic: {
          name: basicName,
          description: basicDescription,
          deliveryTime: Number(basicDelivery),
          price: Number(basicPrice),
          revisions: Number(basicRevision),
        },
        standard: {
          name: standardName,
          description: standardDescription,
          deliveryTime: Number(standardDelivery),
          price: Number(standardPrice),
          revisions: Number(standardRevision),
        },
        premium: {
          name: premiumName,
          description: premiumDescription,
          deliveryTime: Number(premiumDelivery),
          price: Number(premiumPrice),
          revisions: Number(premiumRevision),
        },
      },
    }));
  }, [requiredInformation]);

  useEffect(() => {
    localStorage.setItem(
      gig_additionalInformation,
      JSON.stringify(additionalInformation),
    );

    const basicExtra = additionalInformation.map((_) => {
      return {
        package: _.package,
        value: _.basic,
      };
    });

    const standardExtra = additionalInformation.map((_) => {
      return {
        package: _.package,
        value: _.standard,
      };
    });

    const premiumExtra = additionalInformation.map((_) => {
      return {
        package: _.package,
        value: _.premium,
      };
    });

    setGig((prev) => ({
      ...prev,
      pricing: {
        basic: {
          ...prev.pricing?.basic,
          extras: basicExtra,
        },
        standard: {
          ...prev.pricing?.standard,
          extras: standardExtra,
        },
        premium: {
          ...prev.pricing?.premium,
          extras: premiumExtra,
        },
      } as any,
    }));
  }, [additionalInformation]);

  const handleDeleteSelected = () => {
    setAdditionalInformation(
      additionalInformation.filter((r) => !selectedRows.includes(Number(r.id))),
    );
    setSelectedRows([]);
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
            additionalInformation={additionalInformation}
            setAdditionalInformation={setAdditionalInformation}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
            editId={editId}
            editData={editData}
            setEditId={setEditId}
            setEditData={setEditData}
          />

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
        onClick={() => {
          if (true) {
            const isRequiredInformationEmpty = requiredInformation.some(
              (_) => _.basic === "" || _.standard === "" || _.premium === "",
            );
            if (!isRequiredInformationEmpty) switchToTab(tabs[2].label);
          }
        }}
      >
        Save & Continue
      </Button>
    </div>
  );
}
