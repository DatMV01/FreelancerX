// import dynamic from "next/dynamic";

// const CkEditorWithNoSSR = dynamic(import("./CkEditor"), { ssr: false });

// export default CkEditorWithNoSSR;

"use client";

import dynamic from "next/dynamic";

const CkEditorWithNoSSR = dynamic(import("./CkEditor"), { ssr: false });

import { useEffect, useState } from "react";

const MyCkEditorWithNoSSR = ({ gig, setGig }: { gig: any; setGig: any }) => {
  const [editorData, setEditorData] = useState<string>(gig?.description || "");

  const handleOnUpdate = (editor: string, field: string): void => {
    if (field === "description") {
      setEditorData(editor);
    }
  };

  useEffect(() => {
    setGig((prev: any) => ({ ...prev, description: editorData }));
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
