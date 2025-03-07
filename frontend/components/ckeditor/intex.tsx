// import dynamic from "next/dynamic";

// const CkEditorWithNoSSR = dynamic(import("./CkEditor"), { ssr: false });

// export default CkEditorWithNoSSR;

"use client";

import dynamic from "next/dynamic";

const CkEditorWithNoSSR = dynamic(import("./CkEditor"), { ssr: false });

import React, { useState } from "react";

const gig_description = "gig_description";

const MyCkEditorWithNoSSR: React.FC = () => {
  const [editorData, setEditorData] = useState<string>(() => {
    const savedData = localStorage.getItem(gig_description);

    if (savedData) {
      return savedData;
    }
    return "";
  });

  const handleOnUpdate = (editor: string, field: string): void => {
    if (field === "description") {
      console.log("Editor data field:", editor);
      setEditorData(editor);
      localStorage.setItem(gig_description, editor);
    }
  };

  return (
    <div className="mx-auto w-full">
      <CkEditorWithNoSSR
        editorData={editorData}
        setEditorData={setEditorData}
        handleOnUpdate={handleOnUpdate}
      />

      {/* Review Section /> */}
      {/* <div className="text-black" dangerouslySetInnerHTML={{ __html: data }} /> */}
    </div>
  );
};

export default MyCkEditorWithNoSSR;
