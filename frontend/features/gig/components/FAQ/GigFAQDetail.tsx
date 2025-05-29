import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { useState } from "react";
import GigFAQCreateUpdate, { FAQType } from "./GigFAQCreateUpdate";

const GigFAQDetail = ({
  faq,
  onDelete,
  onUpdate,
}: {
  faq: FAQType;
  onDelete: (id: string) => void;
  onUpdate: (faq: FAQType) => void;
}) => {
  const [isEditing, setEditing] = useState(false);

  if (isEditing) {
    return (
      <GigFAQCreateUpdate
        faq={faq}
        onUpdate={(faq) => {
          onUpdate(faq);
          setEditing(false);
        }}
      />
    );
  }

  return (
    <div className="mb-2 flex flex-col gap-2 rounded-lg border bg-white p-3 shadow-sm">
      <div className="flex">
        <p className="mr-2 flex min-w-1/12 justify-between font-semibold">
          <span>Question</span>
          <span>:</span>
        </p>
        <p className="flex-1">{faq.question}</p>
      </div>
      <div className="flex">
        <p className="mr-2 flex min-w-1/12 justify-between font-semibold">
          <span>Answer</span>
          <span>:</span>
        </p>
        <p className="flex-1">{faq.answer}</p>
      </div>

      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();

            setEditing(true);
          }}
          className="border-blue-500 text-blue-500 hover:text-blue-700"
        >
          <Edit size={16} /> Edit
        </Button>
        <Button
          variant="outline"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();

            onDelete(faq.id);
          }}
          className="border-red-500 text-red-500 hover:text-red-700"
        >
          <Trash size={16} /> Delete
        </Button>
      </div>
    </div>
  );
};

export default GigFAQDetail;
