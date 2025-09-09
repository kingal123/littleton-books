import { useEffect, useState } from "react";
import { supabase } from "@/supabase/client";

const STATUS_OPTIONS = ["New", "Delivered", "Dedication Written", "On Bus"];

export default function BooksPage() {
  const [books, setBooks] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editStatus, setEditStatus] = useState("");

  useEffect(() => {
    async function fetchBooks() {
      const { data, error } = await supabase
        .from("book_list")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) setBooks(data);
    }
    fetchBooks();
  }, []);

  const handleEditClick = (book) => {
    setEditingId(book.id);
    setEditStatus(book.status);
  };

  const handleStatusChange = (e) => {
    setEditStatus(e.target.value);
  };

  const handleSave = async (book) => {
    const { error } = await supabase
      .from("book_list")
      .update({ status: editStatus })
      .eq("id", book.id);
    if (!error) {
      setBooks((prev) =>
        prev.map((b) =>
          b.id === book.id ? { ...b, status: editStatus } : b
        )
      );
      setEditingId(null);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  return (
    <div>
      <h1 className="title mb-6">Books</h1>
      <div className="card">
        <div className="card-body p-0">
          <div className="relative h-[500px] w-full flex-shrink-0 overflow-auto rounded-none [scrollbar-width:_thin]">
            <table className="table">
              <thead className="table-header">
                <tr className="table-row">
                  <th className="table-head">Book Name</th>
                  <th className="table-head">Category</th>
                  <th className="table-head">Status</th>
                  <th className="table-head">Created</th>
                  <th className="table-head">Actions</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {books.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center">No books found</td>
                  </tr>
                ) : (
                  books.map((book) => (
                    <tr key={book.id} className="table-row">
                      <td className="table-cell">{book.book_name}</td>
                      <td className="table-cell">{book.category}</td>
                      <td className="table-cell">
                        {editingId === book.id ? (
                          <select
                            value={editStatus}
                            onChange={handleStatusChange}
                            className="border rounded px-2 py-1"
                          >
                            {STATUS_OPTIONS.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        ) : (
                          book.status
                        )}
                      </td>
                      <td className="table-cell">
                        {book.created_at ? new Date(book.created_at).toLocaleString() : ""}
                      </td>
                      <td className="table-cell">
                        {editingId === book.id ? (
                          <>
                            <button
                              className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                              onClick={() => handleSave(book)}
                            >
                              Save
                            </button>
                            <button
                              className="bg-gray-400 text-white px-2 py-1 rounded"
                              onClick={handleCancel}
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button
                            className="bg-blue-500 text-white px-2 py-1 rounded"
                            onClick={() => handleEditClick(book)}
                          >
                            Edit
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
