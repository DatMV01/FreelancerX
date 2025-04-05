// import dynamic from "next/dynamic";

// const CkEditorWithNoSSR = dynamic(import("./CkEditor"), { ssr: false });

// export default CkEditorWithNoSSR;

"use client";

import dynamic from "next/dynamic";

const CkEditorWithNoSSR = dynamic(import("./CkEditor"), { ssr: false });

import { useEffect, useState } from "react";

interface Props {
  content?: any;
  onInputContentCb?: any;
}

const MyCkEditorWithNoSSR = ({ content, onInputContentCb }: Props) => {
  const [editorData, setEditorData] = useState<string>(content || "");

  const handleOnUpdate = (editor: string, field: string): void => {
    if (field === "description") {
      setEditorData(editor);
    }
  };

  useEffect(() => {
    onInputContentCb && onInputContentCb(editorData);
  }, [editorData]);

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
