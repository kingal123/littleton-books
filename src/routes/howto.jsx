import { Link } from "react-router-dom";

export default function HowToPage() {
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">How To Use This Site</h1>
      <ol className="list-decimal list-inside space-y-4 text-base">
        <li>
          <span className="font-semibold">Dashboard Overview:</span>
          <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
            <li>
              The <span className="font-semibold">Dashboard</span> shows key stats such as Total Books, Books On Bus, New Books, and Book Float.
            </li>
            <li>
              The <span className="font-semibold">Latest Books</span> table displays the most recently added books.
            </li>
            <li>
              The graph visualizes books added each month.
            </li>
          </ul>
        </li>
        <li>
          <span className="font-semibold">Adding a New Order:</span>
          <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
            <li>
              Click the <span className="font-semibold">New Order Received</span> button at the top right of the dashboard.
            </li>
            <li>
              Enter the number of books delivered and submit.
            </li>
          </ul>
        </li>
        <li>
          <span className="font-semibold">Viewing and Managing Books:</span>
          <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
            <li>
              Go to the <Link to="/books" className="text-blue-600 underline">Books</Link> page to see all books.
            </li>
            <li>
              Use filters and actions as needed to manage your book list.
            </li>
          </ul>
        </li>
        <li>
          <span className="font-semibold">Inventory & Book Float:</span>
          <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
            <li>
              The <Link to="/inventory" className="text-blue-600 underline">Inventory</Link> page shows book float and class breakdowns.
            </li>
          </ul>
        </li>
        <li>
          <span className="font-semibold">Notifications:</span>
          <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
            <li>
              Click the bell icon in the header to see the last 5 books added with status "New".
            </li>
            <li>
              A badge will appear if new books have been added in the last 72 hours.
            </li>
          </ul>
        </li>
        <li>
          <span className="font-semibold">Orders:</span>
          <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
            <li>
              Visit the <Link to="/orders" className="text-blue-600 underline">Orders</Link> page to move books between categories and manage orders.
            </li>
          </ul>
        </li>
      </ol>
      <div className="mt-8">
        <Link to="/" className="text-blue-600 underline">Back to Dashboard</Link>
      </div>
    </div>
  );
}