import { Box, Button } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const TextEditor = ({ initialContent, onSave }) => {
  const [content, setContent] = useState(initialContent || "");
  const editorRef = useRef(null);
  console.log(initialContent);

  useEffect(() => {
    if (editorRef.current && initialContent) {
      const getEditor = editorRef.current.getEditor(); //method to get the instance of editor for content
      getEditor.clipboard.dangerouslyPasteHTML(initialContent);
    }
  }, []);

  const handleChange = (e) => {
    setContent(e);
  };

  const handleSubmit = () => {
    if (editorRef.current) {
      const editorInstance = editorRef.current.getEditor();
      onSave(editorInstance.root.innerHTML); //This line retrieves the current content of the editor as HTML using editor.root.innerHTML
    }
  };

  const modules = {
    toolbar: [
      [{ font: [] }, { size: [] }],
      [{ header: "1" }, { header: "2" }],
      [{ list: "ordered" }, { list: "bullet" }],

      [{ indent: "-1" }, { indent: "+1" }],
      [{ direction: "rtl" }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }],
      ["link", "image", "video", "formula"],
      ["clean"],
    ],
    clipboard: {
      matchVisual: false,
    },
    history: {
      delay: 1000,
      maxStack: 100,
      userOnly: true,
    },
  };

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "script",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "color",
    "background",
    "align",
    "link",
    "image",
    "video",
    "formula",
    "direction",
  ];

  return (
    <Box>
      <ReactQuill
        ref={editorRef}
        theme="snow"
        modules={modules}
        formats={formats}
        value={content}
        onChange={handleChange}
        placeholder="Write something amazing..."
        style={{ height: "70vh", paddingBottom: "10vh" }}
      />
      <Button
        colorScheme="blue"
        aria-label="Save content"
        onClick={handleSubmit}
      >
        Save
      </Button>
    </Box>
  );
};

export default TextEditor;
