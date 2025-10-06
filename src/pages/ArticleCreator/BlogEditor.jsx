// src/BlogEditor.jsx
import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Quill default styles

export default function BlogEditor() {
  const [content, setContent] = useState("");

  const handleChange = (value) => {
    setContent(value);
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ script: "sub" }, { script: "super" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ align: [] }],
      [{ color: [] }, { background: [] }],
      ["link", "image", "video"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "script",
    "indent",
    "align",
    "color",
    "background",
    "link",
    "image",
    "video",
  ];

  return (
    <div className="max-w-[800px] m-auto p-[20px]">
      <h1 className="text-[24px] font-bold">Create A Blog Post</h1>

      <form className=" flex flex-col gap-4 text-start">
        <div className="ml-2">
          <input
            className="border border-gray-400 rounded py-1 px-2 ml-2 focus:outline-none"
            placeholder="Title"
          ></input>
        </div>
        <div className="ml-2">
          <input
            className="border border-gray-400 rounded py-1 px-2 ml-2 focus:outline-none"
            placeholder="Author"
          ></input>
        </div>
        <textarea
          className="border border-gray-400 rounded-2 mx-5 p-2"
          placeholder="short-description"
        ></textarea>

        <div
          style={{
            maxWidth: "800px",
            margin: "auto",
            padding: "10px 20px",
          }}
        >
          <h2 className="text-[16px] font-semibold m-[16px 0] text-start">
            Body
          </h2>
          <ReactQuill
            className="my-quill "
            value={content}
            onChange={handleChange}
            theme="snow"
            formats={formats}
            modules={modules}
          />
        </div>
        <button className="border border-gray-400 w-80 m-auto py-2 rounded-2xl">
          Submit
        </button>
      </form>
    </div>
  );
}
