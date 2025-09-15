import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useEffect, useState } from "react";

import SupabaseTable from "@/components/SupabaseTable";
import { useTheme } from "@/hooks/use-theme";
import { supabase } from "@/supabase/client";

import { recentSalesData, topProducts } from "@/constants";

import { Footer } from "@/layouts/footer";

import { CreditCard, Bus, PencilLine, Star, Trash, TrendingUp, Users, LibraryBig, Check, X as XIcon } from "lucide-react";

const MONTHS = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

export default function DashboardPage() {
    const { theme } = useTheme();
    const [bookCount, setBookCount] = useState(null);
    const [onBusCount, setOnBusCount] = useState(null);
    const [newCount, setNewCount] = useState(null);
    const [recentBooks, setRecentBooks] = useState([]);
    const [overviewData, setOverviewData] = useState([]);
    const [preSchoolCount, setPreSchoolCount] = useState(null);
    const [receptionCount, setReceptionCount] = useState(null);
    const [year1Count, setYear1Count] = useState(null);
    const [year2Count, setYear2Count] = useState(null);

    useEffect(() => {
        async function fetchBookCount() {
            const { count, error } = await supabase
                .from("book_list")
                .select("*", { count: "exact", head: true });
            if (!error) setBookCount(count);
        }
        async function fetchOnBusCount() {
            const { count, error } = await supabase
                .from("book_list")
                .select("*", { count: "exact", head: true })
                .eq("status", "On Bus");
            if (!error) setOnBusCount(count);
        }
        async function fetchNewCount() {
            const { count, error } = await supabase
                .from("book_list")
                .select("*", { count: "exact", head: true })
                .eq("status", "New");
            if (!error) setNewCount(count);
        }
        async function fetchRecentBooks() {
            const { data, error } = await supabase
                .from("book_list")
                .select("*")
                .order("created_at", { ascending: false })
                .limit(5);
            if (!error && data) setRecentBooks(data);
        }
        async function fetchMonthlyBookCounts() {
            const { data, error } = await supabase
                .from("book_list")
                .select("id, created_at");
            if (error || !data) {
                setOverviewData([]);
                return;
            }
            // Count books per month
            const counts = Array(12).fill(0);
            data.forEach(book => {
                if (book.created_at) {
                    const month = new Date(book.created_at).getMonth();
                    counts[month]++;
                }
            });
            setOverviewData(
                MONTHS.map((name, i) => ({
                    name,
                    total: counts[i],
                }))
            );
        }
        async function fetchPreSchoolCount() {
            const { count, error } = await supabase
                .from("pre_school")
                .select("*", { count: "exact", head: true });
            if (!error) setPreSchoolCount(count);
        }
        async function fetchReceptionCount() {
            const { count, error } = await supabase
                .from("reception")
                .select("*", { count: "exact", head: true });
            if (!error) setReceptionCount(count);
        }
        async function fetchYear1Count() {
            const { count, error } = await supabase
                .from("year_1")
                .select("*", { count: "exact", head: true });
            if (!error) setYear1Count(count);
        }
        async function fetchYear2Count() {
            const { count, error } = await supabase
                .from("year_2")
                .select("*", { count: "exact", head: true });
            if (!error) setYear2Count(count);
        }
        fetchBookCount();
        fetchOnBusCount();
        fetchNewCount();
        fetchRecentBooks();
        fetchMonthlyBookCounts();
        fetchPreSchoolCount();
        fetchReceptionCount();
        fetchYear1Count();
        fetchYear2Count();
    }, []);

    // Check if all counts are exactly 5
    const allFive =
        preSchoolCount === 5 &&
        receptionCount === 5 &&
        year1Count === 5 &&
        year2Count === 5;

    // Helper for icon
    const TableStatus = ({ count, label }) => (
        <span className="flex items-center gap-2">
            <span className="font-bold">{label}</span>
            {count === 5 ? (
                <Check className="text-green-600" size={20} />
            ) : (
                <XIcon className="text-red-600" size={20} />
            )}
        </span>
    );

    return (
        <div className="flex flex-col gap-y-4">
            <h1 className="title">Dashboard</h1>
            {/* Change grid-cols-1 to grid-cols-2 for mobile */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                <div className="card p-2 sm:p-4">
                    <div className="card-header">
                        <div className="w-fit rounded-lg bg-blue-500/20 p-2 text-blue-500 transition-colors dark:bg-blue-600/20 dark:text-blue-600">
                            <LibraryBig size={26} />
                        </div>
                        <p className="card-title">Total Books</p>
                    </div>
                    <div className="card-body bg-slate-100 transition-colors dark:bg-slate-950">
                        <p className="text-3xl font-bold text-slate-900 transition-colors dark:text-slate-50">
                            {bookCount !== null ? bookCount : "…"}
                        </p>
                        <span className="flex w-fit items-center gap-x-2 rounded-full border border-blue-500 px-2 py-1 font-medium text-blue-500 dark:border-blue-600 dark:text-blue-600">
                            <TrendingUp size={18} />
                            2%
                        </span>
                    </div>
                </div>
                <div className="card p-2 sm:p-4">
                    <div className="card-header">
                        <div className="w-fit rounded-lg bg-blue-500/20 p-2 text-blue-500 transition-colors dark:bg-blue-600/20 dark:text-blue-600">
                            <Bus size={26} />
                        </div>
                        <p className="card-title">Books On Bus</p>
                    </div>
                    <div className="card-body bg-slate-100 transition-colors dark:bg-slate-950">
                        <p className="text-3xl font-bold text-slate-900 transition-colors dark:text-slate-50">
                            {onBusCount !== null ? onBusCount : "…"}
                        </p>
                        <span className="flex w-fit items-center gap-x-2 rounded-full border border-blue-500 px-2 py-1 font-medium text-blue-500 dark:border-blue-600 dark:text-blue-600">
                            <TrendingUp size={18} />
                            5%
                        </span>
                    </div>
                </div>
                <div className="card p-2 sm:p-4">
                    <div className="card-header">
                        <div className="rounded-lg bg-blue-500/20 p-2 text-blue-500 transition-colors dark:bg-blue-600/20 dark:text-blue-600">
                            <Star size={26} />
                        </div>
                        <p className="card-title">New Books</p>
                    </div>
                    <div className="card-body bg-slate-100 transition-colors dark:bg-slate-950">
                        <p className="text-3xl font-bold text-slate-900 transition-colors dark:text-slate-50">
                            {newCount !== null ? newCount : "…"}
                        </p>
                        <span className="flex w-fit items-center gap-x-2 rounded-full border border-blue-500 px-2 py-1 font-medium text-blue-500 dark:border-blue-600 dark:text-blue-600">
                            <TrendingUp size={18} />
                            15%
                        </span>
                    </div>
                </div>
                <div className="card p-2 sm:p-4">
                    <div className="card-header">
                        <div className="rounded-lg bg-blue-500/20 p-2 text-blue-500 transition-colors dark:bg-blue-600/20 dark:text-blue-600">
                            <CreditCard size={26} />
                        </div>
                        <p className="card-title text-slate-900 dark:text-slate-100">Book Float</p>
                    </div>
                    <div className="card-body bg-slate-100 dark:bg-slate-950 flex flex-col gap-2">
                        {/* Table status list, two per line, evenly aligned */}
                        <div className="mt-2 flex flex-col gap-2">
                            <div className="flex justify-between gap-8">
                                <div className="flex-1 flex justify-center">
                                    <TableStatus count={preSchoolCount} label={
                                        <span className="text-slate-900 dark:text-slate-100 font-bold">Pre-School</span>
                                    } />
                                </div>
                                <div className="flex-1 flex justify-center">
                                    <TableStatus count={receptionCount} label={
                                        <span className="text-slate-900 dark:text-slate-100 font-bold">Reception</span>
                                    } />
                                </div>
                            </div>
                            <div className="flex justify-between gap-8">
                                <div className="flex-1 flex justify-center">
                                    <TableStatus count={year1Count} label={
                                        <span className="text-slate-900 dark:text-slate-100 font-bold">Year 1</span>
                                    } />
                                </div>
                                <div className="flex-1 flex justify-center">
                                    <TableStatus count={year2Count} label={
                                        <span className="text-slate-900 dark:text-slate-100 font-bold">Year 2</span>
                                    } />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="card col-span-1 md:col-span-2 lg:col-span-4">
                    <div className="card-header">
                        <p className="card-title">Overview</p>
                    </div>
                    <div className="card-body p-0">
                        <ResponsiveContainer
                            width="100%"
                            height={300}
                        >
                            <AreaChart
                                data={overviewData}
                                margin={{
                                    top: 0,
                                    right: 0,
                                    left: 0,
                                    bottom: 0,
                                }}
                            >
                                <defs>
                                    <linearGradient
                                        id="colorTotal"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                    >
                                        <stop
                                            offset="5%"
                                            stopColor="#2563eb"
                                            stopOpacity={0.8}
                                        />
                                        <stop
                                            offset="95%"
                                            stopColor="#2563eb"
                                            stopOpacity={0}
                                        />
                                    </linearGradient>
                                </defs>
                                <Tooltip
                                    cursor={false}
                                    formatter={(value) => `${value}`}
                                />

                                <XAxis
                                    dataKey="name"
                                    strokeWidth={0}
                                    stroke={theme === "light" ? "#475569" : "#94a3b8"}
                                    tickMargin={6}
                                />
                                <YAxis
                                    dataKey="total"
                                    strokeWidth={0}
                                    stroke={theme === "light" ? "#475569" : "#94a3b8"}
                                    tickFormatter={(value) => `${value}`}
                                    tickMargin={6}
                                />

                                <Area
                                    type="monotone"
                                    dataKey="total"
                                    stroke="#2563eb"
                                    fillOpacity={1}
                                    fill="url(#colorTotal)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="card col-span-1 md:col-span-2 lg:col-span-3">
                    <div className="card-header">
                        <p className="card-title">Latest Books</p>
                    </div>
                    <div className="card-body h-[300px] overflow-auto p-0">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th className="text-left">Book</th>
                                    <th className="text-left">Status</th>
                                    <th className="text-left">Category</th>
                                    <th className="text-left">Created</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentBooks.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="text-center">No recent orders</td>
                                    </tr>
                                ) : (
                                    recentBooks.map((book) => (
                                        <tr key={book.id}>
                                            <td className="text-left">{book.book_name}</td>
                                            <td className="text-left">{book.status}</td>
                                            <td className="text-left">{book.category}</td>
                                            <td className="text-left">{book.created_at ? new Date(book.created_at).toLocaleString() : ""}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div className="card">
                <div className="card-header">
                    <p className="card-title">Recent Orders 2</p>
                </div>
                <div className="card-body p-0">
                    <div className="relative h-[500px] w-full flex-shrink-0 overflow-auto rounded-none [scrollbar-width:_thin]">
                        <table className="table">
                            <thead className="table-header">
                                <tr className="table-row">
                                    <th className="table-head">#</th>
                                    <th className="table-head">Book</th>
                                    <th className="table-head">Category</th>
                                    <th className="table-head">Status</th>
                                    <th className="table-head">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="table-body">
                                {topProducts.map((product) => (
                                    <tr
                                        key={product.number}
                                        className="table-row"
                                    >
                                        <td className="table-cell">{product.number}</td>
                                        <td className="table-cell">
                                            <div className="flex w-max gap-x-4">
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="size-14 rounded-lg object-cover"
                                                />
                                                <div className="flex flex-col">
                                                    <p>{product.name}</p>
                                                    <p className="font-normal text-slate-600 dark:text-slate-400">{product.description}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="table-cell">${product.price}</td>
                                        <td className="table-cell">{product.status}</td>
                                        <td className="table-cell">
                                            <div className="flex items-center gap-x-4">
                                                <button className="text-blue-500 dark:text-blue-600">
                                                    <PencilLine size={20} />
                                                </button>
                                                <button className="text-red-500">
                                                    <Trash size={20} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <Footer />
            
        </div>
    );
};

// Add this to your global CSS (e.g. index.css or tailwind.css) if not already present:
// .card { transition: padding 0.2s; }
// @media (max-width: 640px) { .card { padding: 0.5rem !important; } }
