import { Box, Button } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const TextEditor = ({ initialContent, onSave }) => {
  const [content, setContent] = useState(initialContent || "");
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current && initialContent) {
      const editor = editorRef.current.getEditor(); //method to get the instance of editor for content
      editor.clipboard.dangerouslyPasteHTML(initialContent);
    }
  }, [initialContent]);

  const handleChange = (value) => {
    setContent(value);
  };

  const handleSubmit = () => {
    if (editorRef.current) {
      const editorContent = editorRef.current.getEditor().root.innerHTML;
      onSave(editorContent);
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
  };

  return (
    <Box>
      <ReactQuill
        ref={editorRef}
        theme="snow"
        modules={modules}
        value={content}
        onChange={handleChange}
        placeholder="Write something amazing..."
        style={{
          height: "60vh",
          paddingBottom: "10vh",
          borderRadius: "md",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#ebf2ff",
        }}
      />
      <Button
        mt={4}
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
