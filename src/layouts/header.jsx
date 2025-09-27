import { useTheme } from "@/hooks/use-theme";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/config";
import { supabase } from "@/supabase/client";

import {
  Bell,
  ChevronsLeft,
  Moon,
  Search,
  Sun,
  LogOut,
} from "lucide-react";

import profileImg from "@/assets/profile-image.jpg";

import PropTypes from "prop-types";
import { useEffect, useState, useRef } from "react";

export const Header = ({ collapsed, setCollapsed }) => {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const bellRef = useRef(null);
  const [showOrders, setShowOrders] = useState(false);
  const [recentBooks, setRecentBooks] = useState([]);
  const [newBooksCount, setNewBooksCount] = useState(0);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error.message);
    }
  };

  useEffect(() => {
    async function fetchRecentBooks() {
      // Fetch last 5 books with status "New" from "book_list"
      const { data, error } = await supabase
        .from("book_list")
        .select("id, book_name, created_at")
        .eq("status", "New")
        .order("created_at", { ascending: false })
        .limit(5);
      if (!error && data) setRecentBooks(data);

      // Count books with status "New" added in last 72 hours
      const since = new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString();
      const { count } = await supabase
        .from("book_list")
        .select("id", { count: "exact", head: true })
        .eq("status", "New")
        .gte("created_at", since);
      setNewBooksCount(count || 0);
    }
    fetchRecentBooks();
  }, [showOrders]);

  return (
    <header className="relative z-10 flex h-[60px] items-center justify-between bg-white px-4 shadow-md transition-colors dark:bg-slate-900">
      <div className="flex items-center gap-x-3">
        <button
          className="btn-ghost size-10"
          onClick={() => setCollapsed(!collapsed)}
        >
          <ChevronsLeft className={collapsed && "rotate-180"} />
        </button>
        <div className="input">
          <Search
            size={20}
            className="text-slate-300"
          />
          <input
            type="text"
            name="search"
            id="search"
            placeholder="Search..."
            className="w-full bg-transparent text-slate-900 outline-0 placeholder:text-slate-300 dark:text-slate-50"
          />
        </div>
      </div>

      <div className="flex items-center gap-x-3">
        <button
          className="btn-ghost size-10"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          <Sun
            size={20}
            className="dark:hidden"
          />
          <Moon
            size={20}
            className="hidden dark:block"
          />
        </button>
        {/* Bell/Alert Dropdown */}
        <div className="relative" ref={bellRef}>
          <button
            className="btn-ghost size-10 relative"
            onClick={() => setShowOrders((v) => !v)}
            aria-label="Show last 5 books added"
          >
            <Bell size={20} />
            {newBooksCount > 0 && (
              <span className="absolute top-1 right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                {newBooksCount}
              </span>
            )}
          </button>
          {showOrders && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-50 p-3">
              <div className="font-semibold mb-2 text-slate-900 dark:text-slate-100">Last 5 Books Added</div>
              {recentBooks.length === 0 ? (
                <div className="text-slate-500 text-sm">No recent books</div>
              ) : (
                <ul className="space-y-1">
                  {recentBooks.map((book) => (
                    <li key={book.id} className="flex justify-between text-sm text-slate-700 dark:text-slate-200">
                      <span>
                        {book.book_name}
                      </span>
                      <span className="text-xs text-slate-400">
                        {book.created_at ? new Date(book.created_at).toLocaleString() : ""}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
        {/* 🚀 Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <LogOut size={18} />
          <span className="hidden sm:block">Logout</span>
        </button>
      </div>
    </header>
  );
};

Header.propTypes = {
  collapsed: PropTypes.bool,
  setCollapsed: PropTypes.func,
};
