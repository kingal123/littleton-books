import SupabaseTable from "@/components/SupabaseTable";

export default function InventoryPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Inventory</h1>
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