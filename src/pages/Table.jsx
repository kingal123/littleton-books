import SupabaseTable from "@/components/SupabaseTable";

export default function TablePage() {
  return (
    <div>
      <h1>Table</h1>

      <SupabaseTable
        table="book_list"
        columns={["book_name", "status", "category", "created_at"]}
        columnLabels={{
          book_name: "Book Name",
          status: "Status",
          category: "Category",
          created_at: "Created At",
        }}
      />
    </div>
  );
}
