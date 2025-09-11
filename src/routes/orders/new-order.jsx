import { BookPlus } from "lucide-react";
import { useState } from "react";

export default function NewOrderPage() {
  const [status, setStatus] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [deliveredCount, setDeliveredCount] = useState(1);

  const handleSendEmail = async (e) => {
    e.preventDefault();
    setStatus("Sending...");
    setShowPopup(false);
    try {
      const MAILERSEND_API_KEY = "mlsn.07d1c12c6838555a8e689721fdbc41e24ace4dfe2f6bfc1fe2b97cef6636c47a";
      const recipient = "alex.gallagher@me.com";

      const response = await fetch("https://api.mailersend.com/v1/email", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${MAILERSEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: { email: "books@littletonhsa.co.uk", name: "Dashboard" },
          to: [{ email: recipient, name: "Alex Gallagher" }],
          subject: "New Order Received",
          text: `A new order has been received.\n\nBooks delivered: ${deliveredCount}`,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setStatus(`Error: ${errorData.message || response.statusText}`);
      } else {
        setStatus("Email sent successfully!");
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
            <h2 className="text-lg font-bold mb-2">How many books have been delivered?</h2>
            <select
              className="border rounded px-3 py-2"
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