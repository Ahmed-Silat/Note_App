import { useState } from "react";
import { CloseOutlined } from "@ant-design/icons";
import TagInput from "../../components/Input/TagInput";
import toast from "react-hot-toast";
import { createNotes, updateUserNotes } from "../../Service/NotesService";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const AddEditNotes = ({ onClose, noteData, type, getAllNotes }) => {
  const [title, setTitle] = useState(noteData?.title || "");
  const [content, setContent] = useState(noteData?.content || "");
  const [tags, setTags] = useState(noteData?.tags || []);
  const [error, setError] = useState(null);

  const editNote = async () => {
    try {
      const res = await updateUserNotes(noteData._id, title, content, tags);
      if (!res.data.success) {
        setError(res.data.message);
        toast.error(res.data.message);
        return;
      }
      toast.success(res.data.message);
      getAllNotes();
      onClose();
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
    }
  };

  const addNewNote = async () => {
    try {
      const res = await createNotes(title, content, tags);
      if (!res.data.success) {
        setError(res.data.message);
        toast.error(res.data.message);
        return;
      }
      toast.success(res.data.message);
      getAllNotes();
      onClose();
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
    }
  };

  const handleAddNote = () => {
    if (!title) {
      setError("Please enter the title");
      return;
    }
    if (!content) {
      setError("Please enter the content");
      return;
    }
    setError("");
    type === "edit" ? editNote() : addNewNote();
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ script: "sub" }, { script: "super" }],
      ["blockquote", "code-block"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ align: [] }],
      ["clean"],
    ],
  };

  return (
    <div className="relative p-6">
      {/* Close Button */}
      <button
        className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition"
        onClick={onClose}
      >
        <CloseOutlined className="text-gray-500 text-lg" />
      </button>

      {/* Title */}
      <div className="flex flex-col gap-2 mt-6">
        <label className="text-xs font-semibold text-gray-500 uppercase">
          Title
        </label>
        <input
          type="text"
          className="text-lg border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          placeholder="Enter note title..."
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2 mt-4">
        <label className="text-xs font-semibold text-gray-500 uppercase">
          Content
        </label>
        <ReactQuill
          value={content}
          onChange={setContent}
          className="min-h-[200px]"
          theme="snow"
          modules={modules}
        />
      </div>

      {/* Tags */}
      <div className="mt-4">
        <label className="text-xs font-semibold text-gray-500 uppercase">
          Tags
        </label>
        <TagInput tags={tags} setTags={setTags} />
      </div>

      {error && <p className="text-red-500 text-sm pt-2">{error}</p>}

      {/* Submit Button */}
      <button
        className="w-full mt-5 py-3 rounded-md bg-blue-500 hover:bg-blue-600 text-white font-semibold shadow-md transition"
        onClick={handleAddNote}
      >
        {type === "edit" ? "Update Note" : "Add Note"}
      </button>
    </div>
  );
};

export default AddEditNotes;
