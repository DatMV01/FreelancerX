// import dynamic from "next/dynamic";

// const CkEditorWithNoSSR = dynamic(import("./CkEditor"), { ssr: false });

// export default CkEditorWithNoSSR;

"use client";

import { GigDto } from "@/dto/gig.dto";
import dynamic from "next/dynamic";

const CkEditorWithNoSSR = dynamic(import("./CkEditor"), { ssr: false });

import React, { useEffect, useState } from "react";

const gig_description = "gig_description";

const MyCkEditorWithNoSSR = ({ setGig }: { setGig: any }) => {
  const [editorData, setEditorData] = useState<string>(() => {
    const savedData = localStorage.getItem(gig_description);

    if (savedData) {
      return savedData;
    }
    return "";
  });

  const handleOnUpdate = (editor: string, field: string): void => {
    if (field === "description") {
      setEditorData(editor);
      localStorage.setItem(gig_description, editor);
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
