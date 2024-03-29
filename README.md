## Getting Started with hosting tinymce package

- Install the following packages.

[` npm install --save tinymce @tinymce/tinymce-react fs-extra `]

- Setup a [postinstall] script to copy TinyMCE to the main directory of the project for hosting

```javascript [postinstall.js]
const fse = require("fs-extra");
const path = require("path");
const topDir = __dirname;
fse.emptyDirSync(path.join(topDir, "public", "tinymce"));
fse.copySync(
  path.join(topDir, "node_modules", "tinymce"),
  path.join(topDir, "public", "tinymce"),
  { overwrite: true }
);
```

###

```package.json
{
  "scripts": {
    "postinstall": "node ./postinstall.js"
  }
}
```

###

```.gitignore
/public/tinymce/
```

-Using a text editor

```typescript - Nextjs EditorComponent.tsx
import React, { useRef } from "react";
import { Editor as CustomEditor } from "tinymce";

import { Editor } from "@tinymce/tinymce-react";

export default function EditorComponent() {
  const editorRef = useRef<CustomEditor | null>();
  const log = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
    }
  };
  return (
    <div className="w-full h-full items-center flex flex-col gap-5">
      <div className="w-full p-3 text-center font-bold text-lg text-gray-600">
        Your text editor
      </div>
      <Editor
        id="tiny-text-editor-next"
        tinymceScriptSrc={"./tinymce/tinymce.min.js"}
        onInit={(evt, editor) => (editorRef.current = editor)}
        initialValue=""
        init={{
          statusbar: false,
          promotion: false,
          height: 500,
          menubar: true,
          plugins: ["table", "image", "code", "anchor"],
          toolbar:
            "undo redo | blocks | link image | code | table | anchor" +
            ("bold italic forecolor | alignleft aligncenter " +
              "alignright alignjustify | bullist numlist outdent indent | " +
              "removeformat | help"),
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
                if (reader.result && editorRef.current) {
                  const id = "blobid" + new Date().getTime();
                  const blobCache = editorRef.current.editorUpload.blobCache;
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
      <button className="m-3 bg-slate-100 p-2 rounded-sm  " onClick={log}>
        Log editor content
      </button>
    </div>
  );
}
```
