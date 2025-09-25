import { BookPlus } from "lucide-react";
import { useState } from "react";

export default function NewOrderPage() {
  const [status, setStatus] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [deliveredCount, setDeliveredCount] = useState(1);

  // Call the Supabase Edge Function to trigger Resend email with book count
  const handleSendEmail = async (e) => {
    e.preventDefault();
    setStatus("Sending...");
    setShowPopup(false);
    try {
      // Ensure deliveredCount is always a number
      const bookCount = Number(deliveredCount);

      const response = await fetch("https://lcdxpwjafmunhrurzmcz.supabase.co/functions/v1/smooth-function", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          book: bookCount,
        }),
      });

      const result = await response.json();

      if (response.ok && (result.status === "sent" || result.success)) {
        setStatus("Email sent successfully!");
      } else {
        setStatus(result.error || result.message || "Failed to send email.");
      }
    } catch (err) {
      setStatus("Network or API error.");
    }
    setDeliveredCount(1);
  };

  return (
    <div>
      <button
        className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 px-4 py-2 rounded-lg font-semibold text-slate-700 dark:text-slate-200 transition-colors"
        onClick={() => setShowPopup(true)}
        type="button"
      >
        <BookPlus size={18} />
        New Order Received
      </button>
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <form
            className="bg-white dark:bg-slate-900 rounded-lg shadow-lg p-6 min-w-[320px] flex flex-col gap-4"
            onSubmit={handleSendEmail}
          >
            <h2 className="text-lg font-bold mb-2 text-slate-900 dark:text-slate-100">
              How many books have been delivered?
            </h2>
            <select
              className="border rounded px-3 py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              value={deliveredCount}
              onChange={e => setDeliveredCount(Number(e.target.value))}
              required
              autoFocus
            >
              {[...Array(10)].map((_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}</option>
              ))}
            </select>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="px-4 py-2 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
                onClick={() => setShowPopup(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      )}
      {status && (
        <div className="mt-4 text-sm text-slate-700 dark:text-slate-200">{status}</div>
      )}
    </div>
  );
}