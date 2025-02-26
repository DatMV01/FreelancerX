import React, { useState } from "react";
import { X } from "lucide-react"; // Import icon từ Lucide (có thể dùng heroicons nếu thích)

const initialTags = ["Booking", "Events", "Calendar", "Level 1"];

const TagList = ({tagList}:{tagList?: any[]}) => {
  const [tags, setTags] = useState(tagList || initialTags);

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  return (
    <div className="flex gap-2 p-4">
      {tags.map((tag, index) => (
        <div
          key={index}
          className="flex items-center gap-2 bg-gray-100 text-gray-900 font-semibold px-3 py-1 rounded-full text-sm"
        >
          {tag}
          <button
            onClick={() => removeTag(index)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default TagList;
