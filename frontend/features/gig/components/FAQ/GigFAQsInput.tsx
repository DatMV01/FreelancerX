import { useEffect, useRef, useState } from "react";
import GigFAQCreateUpdate, { FAQType } from "./GigFAQCreateUpdate";
import GigFAQDetail from "./GigFAQDetail";
import { useSkipFirstEffect } from "@/hooks/useSkipFirstEffect";

interface GigFAQsInputProps {
  faqs?: FAQType[];
  onFAQsCb?: (faqs: FAQType[]) => void;
}

export default function GigFAQsInput({
  faqs = [],
  onFAQsCb,
}: GigFAQsInputProps) {
  const [faqList, setFaqList] = useState<FAQType[]>(faqs);

  useSkipFirstEffect(() => {
    if (onFAQsCb) onFAQsCb(faqList);
  }, [faqList]);

  const handleUpdate = (faq: FAQType) => {
    setFaqList((prev) =>
      prev.map((_) =>
        _.id === faq.id
          ? { ..._, question: faq.question, answer: faq.answer }
          : _,
      ),
    );
  };

  const handleCreate = (faq: FAQType) => {
    setFaqList((prev) => [...prev, faq]);
  };

  const handleDelete = (id: string) => {
    setFaqList((prev) => prev.filter((faq) => faq.id !== id));
  };

  return (
    <div>
      <GigFAQCreateUpdate onCreate={handleCreate} />

      <div className="mt-4">
        {faqList.map((faq) => (
          <GigFAQDetail
            key={faq.id}
            faq={faq}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
          />
        ))}
      </div>
    </div>
  );
}
