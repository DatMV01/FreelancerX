// import dynamic from "next/dynamic";

// const CkEditorWithNoSSR = dynamic(import("./CkEditor"), { ssr: false });

// export default CkEditorWithNoSSR;

"use client";

import dynamic from "next/dynamic";

const CkEditorWithNoSSR = dynamic(import("./CkEditor"), { ssr: false });

import React, { useState } from "react";

const MyCkEditorWithNoSSR: React.FC = () => {
  const [editorData, setEditorData] = useState<string>("");
  const [data, setData] = useState<string>("");

  const handleOnUpdate = (editor: string, field: string): void => {
    if (field === "description") {
      console.log("Editor data field:", editor);
      setData(editor);
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
