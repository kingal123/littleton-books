import { useState } from "react";
import { supabase } from "@/supabase/client";
import { Plus } from "lucide-react";

const CATEGORY_OPTIONS = [
  { label: "Pre-School", table: "pre_school" },
  { label: "Reception", table: "reception" },
  { label: "Year 1", table: "year_1" },
  { label: "Year 2", table: "year_2" }
];

export default function OrdersPage() {
  const [showMove, setShowMove] = useState(false);
  const [selectedRow, setSelectedRow] = useState("");
  const [rows, setRows] = useState([]);
  const [loadingRows, setLoadingRows] = useState(false);
  const [moving, setMoving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch all rows from all tables
  async function fetchAllRows() {
    setLoadingRows(true);
    setError("");
    setRows([]);
    setSelectedRow("");
    let allRows = [];
    for (const opt of CATEGORY_OPTIONS) {
      const { data, error } = await supabase
        .from(opt.table)
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) {
        allRows = allRows.concat(
          data.map(row => ({
            ...row,
            _table: opt.table,
            _category: opt.label
          }))
        );
      }
    }
    setRows(allRows);
    setLoadingRows(false);
  }

  // Move row from selected table to book_list
  async function handleMove(e) {
    e.preventDefault();
    setMoving(true);
    setError("");
    setSuccess("");
    const row = rows.find(r => r.id === selectedRow);
    if (!row) {
      setError("Please select a book to move.");
      setMoving(false);
      return;
    }
    // Insert into book_list
    const { error: insertError } = await supabase
      .from("book_list")
      .insert([{
        book_name: row.book_name,
        category: row.category || row._category,
        status: row.status || "New",
        created_at: row.created_at
      }]);
    if (insertError) {
      setError("Failed to add to book_list.");
      setMoving(false);
      return;
    }
    // Delete from original table
    const { error: deleteError } = await supabase
      .from(row._table)
      .delete()
      .eq("id", row.id);
    if (deleteError) {
      setError("Failed to remove from original table.");
      setMoving(false);
      return;
    }
    setSuccess("Book moved to book_list!");
    setShowMove(false);
    setMoving(false);
  }

  return (
    <div>
      <h1 className="title mb-6">Orders</h1>
      <button
        className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 px-4 py-2 rounded-lg font-semibold text-slate-700 dark:text-slate-200 transition-colors mb-4"
        onClick={() => {
          setShowMove(true);
          fetchAllRows();
        }}
      >
        <Plus size={18} />
        New Order
      </button>
      {showMove && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg p-6 min-w-[320px]">
            <h2 className="text-lg font-bold mb-4 text-slate-900 dark:text-slate-100">
              Move Book to Orders
            </h2>
            <form onSubmit={handleMove} className="flex flex-col gap-4">
              <div>
                <label className="block mb-1 font-medium text-slate-900 dark:text-slate-100">Book</label>
                <select
                  className="w-full border rounded px-3 py-2 mt-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  value={selectedRow}
                  onChange={e => setSelectedRow(e.target.value)}
                  required
                  disabled={loadingRows}
                >
                  <option value="">Select a book</option>
                  {rows.map(row => (
                    <option key={row._table + "-" + row.id} value={row.id}>
                      {row.book_name} ({row._category})
                    </option>
                  ))}
                </select>
              </div>
              {error && <div className="text-red-600 dark:text-red-400">{error}</div>}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
                  onClick={() => setShowMove(false)}
                  disabled={moving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700"
                  disabled={moving || !selectedRow}
                >
                  {moving ? "Moving..." : "Move"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <a
        href="https://www.amazon.co.uk/shop/booksfortopics/list/9EJ2F7YJJ2Q0?linkCode=spc&tag=facebook055e-21&domainId=influencer&asc_contentid=amzn1.ideas.9EJ2F7YJJ2Q0"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline"
      >
        Visit Books for Topics Amazon List
      </a>
      {success && <div className="mt-4 text-green-600 dark:text-green-400">{success}</div>}
    </div>
  );
}