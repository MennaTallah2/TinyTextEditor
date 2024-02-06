import React, { useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";

export default function EditorComp() {
  const editorRef = useRef<any>();
  const log = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
    }
  };
  return (
    <div className="w-full h-full">
      <Editor
        tinymceScriptSrc={
          process.env.NEXT_PUBLIC_BASE_URL + "/tinymce/tinymce.min.js"
        }
        onInit={(evt, editor) => (editorRef.current = editor)}
        initialValue=""
        init={{
          height: 500,
          menubar: true,
          plugins: ["table", "image", "code"],
          toolbar:
            "undo redo | blocks | link image | code | ßtable " +
            "bold italic forecolor | alignleft aligncenter " +
            "alignright alignjustify | bullist numlist outdent indent | " +
            "removeformat | help",
          table_toolbar:
            "tableprops tabledelete | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol",
          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
          table_appearance_options: false,
          file_picker_types: "image",
          image_title: true,
          automatic_uploads: true,
          file_picker_callback: (cb, value, meta) => {
            const input = document.createElement("input");
            input.setAttribute("type", "file");
            input.setAttribute("accept", "image/*");
            input.addEventListener("change", (e: any) => {
              const file = e.target.files[0];
              const reader = new FileReader();

              reader.addEventListener("load", () => {
                if (reader.result) {
                  const id = "blobid" + new Date().getTime();
                  const blobCache = editorRef?.current.editorUpload.blobCache;
                  const base64 = (reader.result as string).split(",")[1];
                  const blobInfo = blobCache.create(id, file, base64);
                  blobCache.add(blobInfo);
                  cb(blobInfo.blobUri(), { title: file.name });
                }
              });
              reader.readAsDataURL(file);
            });

            input.click();
          },
        }}
      />
      <button className="m-3 bg-slate-100 p-2 rounded-sm " onClick={log}>
        Log editor content
      </button>
    </div>
  );
}
