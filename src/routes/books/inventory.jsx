import { useEffect, useState } from "react";
import { supabase } from "@/supabase/client";
import { Check, Plus, ExternalLink } from "lucide-react";

const CATEGORY_OPTIONS = [
  "Pre-School",
  "Reception",
  "Year 1",
  "Year 2"
];

export default function BooksPage() {
  const [preSchoolBooks, setPreSchoolBooks] = useState([]);
  const [receptionBooks, setReceptionBooks] = useState([]);
  const [year1Books, setYear1Books] = useState([]);
  const [year2Books, setYear2Books] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newBookName, setNewBookName] = useState("");
  const [newBookCategory, setNewBookCategory] = useState(CATEGORY_OPTIONS[0]);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");

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

  // Helper to render table title with check icon if count is 5
  const TableTitle = ({ children, count }) => (
    <span className="flex items-center gap-2">
      {children}
      {count === 5 && <Check className="inline text-green-600" size={20} />}
    </span>
  );

  // Table rendering helper
  const BookTable = ({ title, count, books }) => (
    <div className="card">
      <div className="card-header">
        <p className="card-title">
          <TableTitle count={count}>{title}</TableTitle>
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
              </tr>
            </thead>
            <tbody className="table-body">
              {books.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center">No books found</td>
                </tr>
              ) : (
                books.map((book) => (
                  <tr key={book.id} className="table-row">
                    <td className="table-cell">{book.book_name}</td>
                    <td className="table-cell">{book.category}</td>
                    <td className="table-cell">
                      {book.created_at ? new Date(book.created_at).toLocaleString() : ""}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Add book handler
  async function handleAddBook(e) {
    e.preventDefault();
    setAdding(true);
    setError("");
    let table;
    if (newBookCategory === "Pre-School") table = "pre_school";
    else if (newBookCategory === "Reception") table = "reception";
    else if (newBookCategory === "Year 1") table = "year_1";
    else if (newBookCategory === "Year 2") table = "year_2";
    else {
      setError("Invalid category");
      setAdding(false);
      return;
    }
    const { error } = await supabase
      .from(table)
      .insert([{ book_name: newBookName, category: newBookCategory }]);
    if (error) {
      setError("Failed to add book");
      setAdding(false);
      return;
    }
    setShowAdd(false);
    setNewBookName("");
    setNewBookCategory(CATEGORY_OPTIONS[0]);
    setAdding(false);
    // Refresh books
    if (table === "pre_school") {
      const { data } = await supabase.from("pre_school").select("*").order("created_at", { ascending: false });
      setPreSchoolBooks(data || []);
    } else if (table === "reception") {
      const { data } = await supabase.from("reception").select("*").order("created_at", { ascending: false });
      setReceptionBooks(data || []);
    } else if (table === "year_1") {
      const { data } = await supabase.from("year_1").select("*").order("created_at", { ascending: false });
      setYear1Books(data || []);
    } else if (table === "year_2") {
      const { data } = await supabase.from("year_2").select("*").order("created_at", { ascending: false });
      setYear2Books(data || []);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="title">Inventory</h1>
        <button
          className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 px-4 py-2 rounded-lg font-semibold text-slate-700 dark:text-slate-200 transition-colors"
          onClick={() => setShowAdd(true)}
        >
          <Plus size={18} />
          Add Book
        </button>
      </div>
      {/* Add Book Popup */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg p-6 min-w-[320px]">
            <h2 className="text-lg font-bold mb-4">Add Book</h2>
            <form onSubmit={handleAddBook} className="flex flex-col gap-4">
              <div>
                <label className="block mb-1 font-medium">Book Name</label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2"
                  value={newBookName}
                  onChange={e => setNewBookName(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Category</label>
                <select
                  className="w-full border rounded px-3 py-2"
                  value={newBookCategory}
                  onChange={e => setNewBookCategory(e.target.value)}
                  required
                >
                  {CATEGORY_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              {/* Amazon Links */}
              <div className="flex flex-col gap-1">
                <a
                  href="https://www.amazon.co.uk/shop/booksfortopics/list/9EJ2F7YJJ2Q0?linkCode=spc&tag=facebook055e-21&domainId=influencer&asc_contentid=amzn1.ideas.9EJ2F7YJJ2Q0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-blue-600 hover:underline text-sm"
                >
                  Pre-School Amazon <ExternalLink size={14} />
                </a>
                <a
                  href="https://www.amazon.co.uk/shop/booksfortopics/list/264V0DV6SK1PS?linkCode=spc&tag=facebook055e-21&domainId=influencer&asc_contentid=amzn1.ideas.264V0DV6SK1PS"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-blue-600 hover:underline text-sm"
                >
                  Reception Amazon <ExternalLink size={14} />
                </a>
                <a
                  href="https://www.amazon.co.uk/shop/booksfortopics/list/3R74J87P01K25?linkCode=spc&tag=facebook055e-21&domainId=influencer&asc_contentid=amzn1.ideas.3R74J87P01K25"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-blue-600 hover:underline text-sm"
                >
                  Year 1 Amazon <ExternalLink size={14} />
                </a>
                <a
                  href="https://www.amazon.co.uk/shop/booksfortopics/list/19H61Y8R65BKS?linkCode=spc&tag=facebook055e-21&domainId=influencer&asc_contentid=amzn1.ideas.19H61Y8R65BKS"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-blue-600 hover:underline text-sm"
                >
                  Year 2 Amazon <ExternalLink size={14} />
                </a>
              </div>
              {error && <div className="text-red-600">{error}</div>}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
                  onClick={() => setShowAdd(false)}
                  disabled={adding}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700"
                  disabled={adding}
                >
                  {adding ? "Adding..." : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <BookTable
          title="Pre-School"
          count={preSchoolBooks.length}
          books={preSchoolBooks}
        />
        <BookTable
          title="Reception"
          count={receptionBooks.length}
          books={receptionBooks}
        />
        <BookTable
          title="Year 1"
          count={year1Books.length}
          books={year1Books}
        />
        <BookTable
          title="Year 2"
          count={year2Books.length}
          books={year2Books}
        />
      </div>
    </div>
  );
}