import { useEffect, useState } from "react";
import { supabase } from "@/supabase/client";
import { Check } from "lucide-react";

export default function BooksPage() {
  const [preSchoolBooks, setPreSchoolBooks] = useState([]);
  const [receptionBooks, setReceptionBooks] = useState([]);
  const [year1Books, setYear1Books] = useState([]);
  const [year2Books, setYear2Books] = useState([]);
  const [editingPreSchoolId, setEditingPreSchoolId] = useState(null);
  const [editingReceptionId, setEditingReceptionId] = useState(null);
  const [editingYear1Id, setEditingYear1Id] = useState(null);
  const [editingYear2Id, setEditingYear2Id] = useState(null);

  useEffect(() => {
    async function fetchPreSchoolBooks() {
      const { data, error } = await supabase
        .from("pre_school")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) setPreSchoolBooks(data);
    }
    async function fetchReceptionBooks() {
      const { data, error } = await supabase
        .from("reception")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) setReceptionBooks(data);
    }
    async function fetchYear1Books() {
      const { data, error } = await supabase
        .from("year_1")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) setYear1Books(data);
    }
    async function fetchYear2Books() {
      const { data, error } = await supabase
        .from("year_2")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) setYear2Books(data);
    }
    fetchPreSchoolBooks();
    fetchReceptionBooks();
    fetchYear1Books();
    fetchYear2Books();
  }, []);

  const handleEditPreSchoolClick = (book) => {
    setEditingPreSchoolId(book.id);
  };

  const handleCancelPreSchool = () => {
    setEditingPreSchoolId(null);
  };

  const handleEditReceptionClick = (book) => {
    setEditingReceptionId(book.id);
  };

  const handleCancelReception = () => {
    setEditingReceptionId(null);
  };

  const handleEditYear1Click = (book) => {
    setEditingYear1Id(book.id);
  };

  const handleCancelYear1 = () => {
    setEditingYear1Id(null);
  };

  const handleEditYear2Click = (book) => {
    setEditingYear2Id(book.id);
  };

  const handleCancelYear2 = () => {
    setEditingYear2Id(null);
  };

  // Helper to render table title with check icon if count is 5
  const TableTitle = ({ children, count }) => (
    <span className="flex items-center gap-2">
      {children}
      {count === 5 && <Check className="inline text-green-600" size={20} />}
    </span>
  );

  return (
    <div>
      <h1 className="title mb-6">Inventory</h1>
      {/* Pre-School Table */}
      <div className="card mb-8">
        <div className="card-header">
          <p className="card-title">
            <TableTitle count={preSchoolBooks.length}>Pre-School</TableTitle>
          </p>
        </div>
        <div className="card-body p-0">
          <div className="relative h-[400px] w-full flex-shrink-0 overflow-auto rounded-none [scrollbar-width:_thin]">
            <table className="table">
              <thead className="table-header">
                <tr className="table-row">
                  <th className="table-head">Book Name</th>
                  <th className="table-head">Category</th>
                  <th className="table-head">Created</th>
                  <th className="table-head">Actions</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {preSchoolBooks.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center">No books found</td>
                  </tr>
                ) : (
                  preSchoolBooks.map((book) => (
                    <tr key={book.id} className="table-row">
                      <td className="table-cell">{book.book_name}</td>
                      <td className="table-cell">{book.category}</td>
                      <td className="table-cell">
                        {book.created_at ? new Date(book.created_at).toLocaleString() : ""}
                      </td>
                      <td className="table-cell">
                        <button
                          className="bg-blue-500 text-white px-2 py-1 rounded"
                          onClick={() => handleEditPreSchoolClick(book)}
                        >
                          Edit
                        </button>
                        {editingPreSchoolId === book.id && (
                          <button
                            className="bg-gray-400 text-white px-2 py-1 rounded ml-2"
                            onClick={handleCancelPreSchool}
                          >
                            Cancel
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
      {/* Reception Table */}
      <div className="card mb-8">
        <div className="card-header">
          <p className="card-title">
            <TableTitle count={receptionBooks.length}>Reception</TableTitle>
          </p>
        </div>
        <div className="card-body p-0">
          <div className="relative h-[400px] w-full flex-shrink-0 overflow-auto rounded-none [scrollbar-width:_thin]">
            <table className="table">
              <thead className="table-header">
                <tr className="table-row">
                  <th className="table-head">Book Name</th>
                  <th className="table-head">Category</th>
                  <th className="table-head">Created</th>
                  <th className="table-head">Actions</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {receptionBooks.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center">No books found</td>
                  </tr>
                ) : (
                  receptionBooks.map((book) => (
                    <tr key={book.id} className="table-row">
                      <td className="table-cell">{book.book_name}</td>
                      <td className="table-cell">{book.category}</td>
                      <td className="table-cell">
                        {book.created_at ? new Date(book.created_at).toLocaleString() : ""}
                      </td>
                      <td className="table-cell">
                        <button
                          className="bg-blue-500 text-white px-2 py-1 rounded"
                          onClick={() => handleEditReceptionClick(book)}
                        >
                          Edit
                        </button>
                        {editingReceptionId === book.id && (
                          <button
                            className="bg-gray-400 text-white px-2 py-1 rounded ml-2"
                            onClick={handleCancelReception}
                          >
                            Cancel
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
      {/* Year 1 Table */}
      <div className="card mb-8">
        <div className="card-header">
          <p className="card-title">
            <TableTitle count={year1Books.length}>Year 1</TableTitle>
          </p>
        </div>
        <div className="card-body p-0">
          <div className="relative h-[400px] w-full flex-shrink-0 overflow-auto rounded-none [scrollbar-width:_thin]">
            <table className="table">
              <thead className="table-header">
                <tr className="table-row">
                  <th className="table-head">Book Name</th>
                  <th className="table-head">Category</th>
                  <th className="table-head">Created</th>
                  <th className="table-head">Actions</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {year1Books.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center">No books found</td>
                  </tr>
                ) : (
                  year1Books.map((book) => (
                    <tr key={book.id} className="table-row">
                      <td className="table-cell">{book.book_name}</td>
                      <td className="table-cell">{book.category}</td>
                      <td className="table-cell">
                        {book.created_at ? new Date(book.created_at).toLocaleString() : ""}
                      </td>
                      <td className="table-cell">
                        <button
                          className="bg-blue-500 text-white px-2 py-1 rounded"
                          onClick={() => handleEditYear1Click(book)}
                        >
                          Edit
                        </button>
                        {editingYear1Id === book.id && (
                          <button
                            className="bg-gray-400 text-white px-2 py-1 rounded ml-2"
                            onClick={handleCancelYear1}
                          >
                            Cancel
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
      {/* Year 2 Table */}
      <div className="card">
        <div className="card-header">
          <p className="card-title">
            <TableTitle count={year2Books.length}>Year 2</TableTitle>
          </p>
        </div>
        <div className="card-body p-0">
          <div className="relative h-[400px] w-full flex-shrink-0 overflow-auto rounded-none [scrollbar-width:_thin]">
            <table className="table">
              <thead className="table-header">
                <tr className="table-row">
                  <th className="table-head">Book Name</th>
                  <th className="table-head">Category</th>
                  <th className="table-head">Created</th>
                  <th className="table-head">Actions</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {year2Books.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center">No books found</td>
                  </tr>
                ) : (
                  year2Books.map((book) => (
                    <tr key={book.id} className="table-row">
                      <td className="table-cell">{book.book_name}</td>
                      <td className="table-cell">{book.category}</td>
                      <td className="table-cell">
                        {book.created_at ? new Date(book.created_at).toLocaleString() : ""}
                      </td>
                      <td className="table-cell">
                        <button
                          className="bg-blue-500 text-white px-2 py-1 rounded"
                          onClick={() => handleEditYear2Click(book)}
                        >
                          Edit
                        </button>
                        {editingYear2Id === book.id && (
                          <button
                            className="bg-gray-400 text-white px-2 py-1 rounded ml-2"
                            onClick={handleCancelYear2}
                          >
                            Cancel
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