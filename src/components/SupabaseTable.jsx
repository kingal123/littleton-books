import { useEffect, useState } from "react";
import { supabase } from "@/supabase/client";

const STATUS_OPTIONS = ["New", "Delivered", "Dedication Written", "On Bus"];
const CATEGORY_OPTIONS = ["Pre-School", "Reception", "Year 1", "Year 2"];

export default function SupabaseTable({
  table = "users",
  columns = ["id", "email", "created_at"],
  columnLabels = {},
}) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inserting, setInserting] = useState(false);
  // Only show form fields for columns except 'id' and 'created_at'
  const insertableColumns = columns.filter(
    (col) => col !== "id" && col !== "created_at"
  );
  const [form, setForm] = useState(
    Object.fromEntries(insertableColumns.map((col) => [col, ""]))
  );

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [table, columns]);

  async function fetchData() {
    setLoading(true);
    const { data, error } = await supabase.from(table).select(columns.join(","));
    if (error) {
      console.error(error);
      setRows([]);
    } else {
      setRows(data);
    }
    setLoading(false);
  }

  async function handleInsert(e) {
    e.preventDefault();
    setInserting(true);
    const { error } = await supabase.from(table).insert([form]);
    if (error) {
      alert("Insert failed: " + error.message);
    } else {
      setForm(Object.fromEntries(insertableColumns.map((col) => [col, ""])));
      fetchData();
    }
    setInserting(false);
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  return (
    <div>
      <form
        className="mb-4 flex flex-wrap gap-2 items-end"
        onSubmit={handleInsert}
      >
        {insertableColumns.map((col) => (
          <div key={col} className="flex flex-col">
            <label className="text-sm font-medium mb-1" htmlFor={col}>
              {columnLabels[col] || col}
            </label>
            {col === "status" ? (
              <select
                className="border rounded px-2 py-1"
                id={col}
                name={col}
                value={form[col]}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select Status
                </option>
                {STATUS_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : col === "category" ? (
              <select
                className="border rounded px-2 py-1"
                id={col}
                name={col}
                value={form[col]}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select Category
                </option>
                {CATEGORY_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <input
                className="border rounded px-2 py-1"
                id={col}
                name={col}
                value={form[col]}
                onChange={handleChange}
                required
              />
            )}
          </div>
        ))}
        <button
          type="submit"
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
          disabled={inserting}
        >
          {inserting ? "Adding..." : "Add Book"}
        </button>
      </form>
      {loading ? (
        <div>Loading...</div>
      ) : !rows.length ? (
        <div>No data found.</div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col}>{columnLabels[col] || col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={row.id || idx}>
                {columns.map((col) => (
                  <td key={col}>{String(row[col])}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
