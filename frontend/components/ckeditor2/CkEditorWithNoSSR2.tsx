"use client";

import React, { FC, useEffect } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  ClassicEditor,
  Autoformat,
  Bold,
  Italic,
  Underline,
  BlockQuote,
  Base64UploadAdapter,
  CloudServices,
  Essentials,
  Heading,
  Image,
  ImageCaption,
  ImageResize,
  ImageStyle,
  ImageToolbar,
  ImageUpload,
  PictureEditing,
  Indent,
  IndentBlock,
  Link,
  List,
  Font,
  Mention,
  Paragraph,
  PasteFromOffice,
  Table,
  TableColumnResize,
  TableToolbar,
  TextTransformation,
  SourceEditing,
  WordCount,
} from "ckeditor5";
import "ckeditor5/ckeditor5.css";
import { Control, useController } from "react-hook-form";

const editorConfig = {
  licenseKey: "GPL",
  plugins: [
    Autoformat,
    BlockQuote,
    Bold,
    CloudServices,
    Essentials,
    Heading,
    Image,
    ImageCaption,
    ImageResize,
    ImageStyle,
    ImageToolbar,
    ImageUpload,
    Base64UploadAdapter,
    Indent,
    IndentBlock,
    Italic,
    Link,
    Font,
    List,
    Mention,
    Paragraph,
    PasteFromOffice,
    PictureEditing,
    Table,
    TableColumnResize,
    TableToolbar,
    TextTransformation,
    Underline,
    SourceEditing,
  ],
  toolbar: [
    "undo",
    "redo",
    "|",
    "heading",
    "|",
    "bold",
    "italic",
    "underline",
    "|",
    "link",
    "uploadImage",
    "insertTable",
    "blockQuote",
    "|",
    "fontColor",
    "fontBackgroundColor",
    "|",
    "bulletedList",
    "numberedList",
    "|",
    "outdent",
    "indent",
    "sourceEditing",
  ],
  heading: {
    options: [
      {
        model: "paragraph",
        view: "p",
        title: "Paragraph",
        class: "ck-heading_paragraph",
      },
      ...Array.from({ length: 6 }, (_, i) => {
        const level = i + 1;
        return {
          model: `heading${level}`,
          view: `h${level}`,
          title: `Heading ${level}`,
          class: `ck-heading_heading${level}`,
        };
      }),
    ],
  },

  image: {
    resizeOptions: [
      {
        name: "resizeImage:original",
        label: "Default image width",
        value: null,
      },
      {
        name: "resizeImage:50",
        label: "50% page width",
        value: "50",
      },
      {
        name: "resizeImage:75",
        label: "75% page width",
        value: "75",
      },
    ],
    toolbar: [
      "imageTextAlternative",
      "toggleImageCaption",
      "|",
      "imageStyle:inline",
      "imageStyle:wrapText",
      "imageStyle:breakText",
      "|",
      "resizeImage",
    ],
  },
  fontColor: {
    colors: [
      { color: "hsl(0, 0%, 0%)", label: "Black" },
      { color: "hsl(0, 0%, 30%)", label: "Dim grey" },
      { color: "hsl(0, 0%, 60%)", label: "Grey" },
      { color: "hsl(0, 0%, 90%)", label: "Light grey" },
      { color: "hsl(0, 0%, 100%)", label: "White", hasBorder: true },
      { color: "hsl(0, 75%, 60%)", label: "Red" },
      { color: "hsl(30, 75%, 60%)", label: "Orange" },
      { color: "hsl(60, 75%, 60%)", label: "Yellow" },
      { color: "hsl(90, 75%, 60%)", label: "Light green" },
      { color: "hsl(120, 75%, 60%)", label: "Green" },
    ],
  },
  fontBackgroundColor: {
    colors: [
      { color: "hsl(0, 75%, 60%)", label: "Red" },
      { color: "hsl(30, 75%, 60%)", label: "Orange" },
      { color: "hsl(60, 75%, 60%)", label: "Yellow" },
      { color: "hsl(90, 75%, 60%)", label: "Light green" },
      { color: "hsl(120, 75%, 60%)", label: "Green" },
      { color: "hsl(0, 0%, 0%)", label: "Black" },
      { color: "hsl(0, 0%, 30%)", label: "Dim grey" },
      { color: "hsl(0, 0%, 60%)", label: "Grey" },
      { color: "hsl(0, 0%, 90%)", label: "Light grey" },
    ],
  },
  link: {
    addTargetToExternalLinks: true,
    defaultProtocol: "https://",
  },
  table: {
    contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
  },
};

interface CkEditorProps {
  name: string;
  control: Control<any>;
}

export const CkEditorWithNoSSR2 = ({ name, control }: CkEditorProps) => {
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({ name, control });

  const wordCountRef = React.useRef<HTMLDivElement | null>(null);

  return (
    <div>
      <CKEditor
        editor={ClassicEditor}
        data={value || ""}
        onChange={(_event, editor) => {
          const html = editor.getData();

          const plainText = html
            .replaceAll(/<[^>]*>/g, "")
            .replaceAll(/&nbsp;/g, " ");

          if (plainText.length <= 5000) {
            onChange(html); // React Hook Form update
          }
        }}
        config={
          {
            ...editorConfig,
            extraPlugins: [WordCount],

            //initialData: value || "",
          } as any
        }
        onReady={(editor) => {
          const wordCountPlugin = editor.plugins.get("WordCount");
          if (wordCountRef.current) {
            wordCountRef.current.innerHTML = "";
            wordCountRef.current.appendChild(
              wordCountPlugin!.wordCountContainer,
            );
          }

          editor.model.document.on("change:data", () => {
            const html = editor.getData();
            const plainText = html
              .replace(/<[^>]*>/g, "")
              .replace(/&nbsp;/g, " ")
              .trim();

            if (plainText.length > 5000) {
              editor.execute("undo");
            }
          });
        }}
      />
      <div
        className="mt-2 text-right text-sm text-gray-500"
        ref={wordCountRef}
      />

      {error && (
        <span className="mt-1 text-sm text-red-500">{error.message}</span>
      )}
    </div>
  );
};

export default CkEditorWithNoSSR2;
