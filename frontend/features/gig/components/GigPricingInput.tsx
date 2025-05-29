import { CharCountTextarea } from "@/components/CharCountTextarea";
import InputNumberField from "@/components/InputNumberField";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { GigForm } from "@/pages/dashboard/freelancer/gigs/new";
import { Fragment } from "react";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { GigFeatureRowDetail } from "./feature/GigFeatureRowDetail";
import {
  GigFeatureRowCreateUpdate,
  FeatureRowType,
} from "./feature/GigFeatureRowCreateUpdate";

export const FeatureCell = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <TableCell className={cn("border-r border-gray-300", className)}>
    {children}
  </TableCell>
);

export const FeatureRow = ({
  noColumn,
  featureColumn,
  basicColumn,
  standardColumn,
  premiumColumn,
  actionColumn,
}: {
  noColumn: React.ReactNode;
  featureColumn: React.ReactNode;
  basicColumn: React.ReactNode;
  standardColumn: React.ReactNode;
  premiumColumn: React.ReactNode;
  actionColumn: React.ReactNode;
}) => (
  <TableRow className="w-full border-b border-gray-300">
    <FeatureCell className="w-[10] text-center">{noColumn}</FeatureCell>
    <FeatureCell className="w-[25%] break-words whitespace-normal">
      {featureColumn}
    </FeatureCell>
    <FeatureCell className="w-[25%] break-words whitespace-normal">
      {basicColumn}
    </FeatureCell>
    <FeatureCell className="w-[25%] break-words whitespace-normal">
      {standardColumn}
    </FeatureCell>
    <FeatureCell className="w-[25%] break-words whitespace-normal">
      {premiumColumn}
    </FeatureCell>
    <FeatureCell className="w-[100px] space-x-1 text-center">
      {actionColumn}
    </FeatureCell>
  </TableRow>
);

interface FeatureTableProps {
  form: UseFormReturn<GigForm>;
  row?: FeatureRowType;
  index: number;
}

const TitleFeatureRow = ({ form, index }: FeatureTableProps) => (
  <FeatureRow
    noColumn={index + 1}
    featureColumn={<span>Title</span>}
    basicColumn={
      <CharCountTextarea
        form={form}
        name={`features.${index}.basic`}
        placeholder="Describe your basic title"
        maxLength={150}
        className="h-[100px]"
      />
    }
    standardColumn={
      <CharCountTextarea
        form={form}
        name={`features.${index}.standard`}
        placeholder="Describe your standard title"
        maxLength={150}
        className="h-[100px]"
      />
    }
    premiumColumn={
      <CharCountTextarea
        form={form}
        name={`features.${index}.premium`}
        placeholder="Describe your premium title"
        maxLength={150}
        className="h-[100px]"
      />
    }
    actionColumn={<></>}
  />
);

const DescriptionFeatureRow = ({ form, index }: FeatureTableProps) => (
  <FeatureRow
    noColumn={index + 1}
    featureColumn={<span>Description</span>}
    basicColumn={
      <CharCountTextarea
        form={form}
        name={`features.${index}.basic`}
        placeholder="Describe your basic description"
        maxLength={300}
        className="h-[160px]"
      />
    }
    standardColumn={
      <CharCountTextarea
        form={form}
        name={`features.${index}.standard`}
        placeholder="Describe your standard description"
        maxLength={300}
        className="h-[160px]"
      />
    }
    premiumColumn={
      <CharCountTextarea
        form={form}
        name={`features.${index}.premium`}
        placeholder="Describe your premium description"
        maxLength={300}
        className="h-[160px]"
      />
    }
    actionColumn={<></>}
  />
);

const DeliveryFeatureRow = ({ form, index }: FeatureTableProps) => (
  <FeatureRow
    noColumn={index + 1}
    featureColumn={<span>Delivery Days</span>}
    basicColumn={
      <InputNumberField
        form={form}
        name={`features.${index}.basic`}
        placeholder="5"
        min={1}
        max={1000}
      />
    }
    standardColumn={
      <InputNumberField
        form={form}
        name={`features.${index}.standard`}
        placeholder="4"
        min={1}
        max={1000}
      />
    }
    premiumColumn={
      <InputNumberField
        form={form}
        name={`features.${index}.premium`}
        placeholder="3"
        min={1}
        max={1000}
      />
    }
    actionColumn={<></>}
  />
);

const RevisionsFeatureRow = ({ form, index }: FeatureTableProps) => (
  <FeatureRow
    noColumn={index + 1}
    featureColumn={<span>Revisions</span>}
    basicColumn={
      <InputNumberField
        form={form}
        name={`features.${index}.basic`}
        placeholder="1"
        min={1}
        max={10}
      />
    }
    standardColumn={
      <InputNumberField
        form={form}
        name={`features.${index}.standard`}
        placeholder="2"
        min={1}
        max={10}
      />
    }
    premiumColumn={
      <InputNumberField
        form={form}
        name={`features.${index}.premium`}
        placeholder="3"
        min={1}
        max={10}
      />
    }
    actionColumn={<></>}
  />
);

const PriceFeatureRow = ({ form, index }: FeatureTableProps) => (
  <FeatureRow
    noColumn={index + 1}
    featureColumn={<span>Price</span>}
    basicColumn={
      <InputNumberField
        form={form}
        name={`features.${index}.basic`}
        placeholder="50"
        min={50}
      />
    }
    standardColumn={
      <InputNumberField
        form={form}
        name={`features.${index}.standard`}
        placeholder="60"
        min={50}
      />
    }
    premiumColumn={
      <InputNumberField
        form={form}
        name={`features.${index}.premium`}
        placeholder="70"
        min={50}
      />
    }
    actionColumn={<></>}
  />
);

export default function FeatureTable({
  form,
}: {
  form: UseFormReturn<GigForm>;
}) {
  const {
    fields: features,
    append,
    update,
    remove,
  } = useFieldArray({
    control: form.control,
    name: "features",
    keyName: "keyId",
  });

  const { getValues } = form;

  const handleRemove = (id: string) => {
    const currentValues = getValues("features");
    const index = currentValues.findIndex((item) => item.id === id);

    if (index !== -1) remove(index);
  };

  const handleUpdate = (featureRow: FeatureRowType) => {
    const currentValues = getValues("features");

    const { id, ...others } = featureRow;
    const index = currentValues.findIndex((item) => item.id === id);

    if (index !== -1) {
      update(index, {
        ...currentValues[index],
        ...others,
      });
    } else {
      console.warn(`Can not find feature: ${featureRow.feature}`);
    }
  };

  const handleCreate = (featureRow: FeatureRowType) => {
    const currentValues = getValues("features");

    if (!currentValues.some((r) => r.feature === featureRow.feature)) {
      append(featureRow);
    } else {
      toast.error(`Feature ${featureRow.feature} already exists`);
    }
  };

  return (
    <Table className="w-full border border-gray-300">
      <TableHeader>
        <TableRow className="border-b border-gray-300">
          {["No", "Feature", "Basic", "Standard", "Premium", "Action"].map(
            (header, index) => (
              <TableHead
                key={index}
                className={`border-r border-gray-300 text-center font-bold`}
              >
                {header}
              </TableHead>
            ),
          )}
        </TableRow>
      </TableHeader>
      <TableBody className="w-full">
        {features.map((row, index) => {
          return (
            <Fragment key={row.id}>
              {row.feature === "Title" && (
                <TitleFeatureRow
                  key={row.id}
                  row={row}
                  index={index}
                  form={form}
                />
              )}

              {row.feature === "Description" && (
                <DescriptionFeatureRow
                  key={row.id}
                  row={row}
                  index={index}
                  form={form}
                />
              )}

              {row.feature === "Delivery" && (
                <DeliveryFeatureRow
                  key={row.id}
                  row={row}
                  index={index}
                  form={form}
                />
              )}

              {row.feature === "Revisions" && (
                <RevisionsFeatureRow
                  key={row.id}
                  row={row}
                  index={index}
                  form={form}
                />
              )}

              {row.feature === "Price" && (
                <PriceFeatureRow
                  key={row.id}
                  form={form}
                  row={row}
                  index={index}
                />
              )}

              {row.feature !== "Title" &&
                row.feature !== "Description" &&
                row.feature !== "Delivery" &&
                row.feature !== "Revisions" &&
                row.feature !== "Price" && (
                  <GigFeatureRowDetail
                    key={row.id}
                    form={form}
                    feature={row}
                    index={index}
                    onUpdate={handleUpdate}
                    onRemove={handleRemove}
                  />
                )}
            </Fragment>
          );
        })}

        <GigFeatureRowCreateUpdate onCreate={handleCreate} />
      </TableBody>
    </Table>
  );
}
