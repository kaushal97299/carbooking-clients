"use client";

import { useEffect, useState } from "react";

export default function ClientBookingPage() {

  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/booking/all`
      );
      const data = await res.json();
      setBookings(data);
    } catch (err) {
      console.log("Fetch booking error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const acceptBooking = async (id:string) => {
    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/booking/accept/${id}`,
      { method: "PATCH" }
    );
    fetchBookings();
  };

  const rejectBooking = async (id:string) => {
    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/booking/reject/${id}`,
      { method: "PATCH" }
    );
    fetchBookings();
  };

  const downloadClientInvoice = (id:string) => {
    window.open(
      `${process.env.NEXT_PUBLIC_API_URL}/api/booking/invoice/${id}?type=client`,
      "_blank"
    );
  };

  const downloadUserInvoice = (id:string) => {
    window.open(
      `${process.env.NEXT_PUBLIC_API_URL}/api/booking/invoice/${id}?type=user`,
      "_blank"
    );
  };

  if (loading) {
    return <div className="p-10 text-lg">Loading bookings...</div>;
  }

  return (

    <div className="min-h-screen p-6 bg-gradient-to-br from-indigo-200 via-purple-200 to-fuchsia-200">

      <h1 className="text-3xl font-bold mb-6">
        Client Booking Panel
      </h1>

      {bookings.length === 0 && (
        <p>No bookings yet</p>
      )}

      <div className="grid gap-4">

        {bookings.map((b) => (

          <div
            key={b._id}
            className="bg-white p-5 rounded-xl shadow flex flex-col md:flex-row justify-between gap-4"
          >

            {/* LEFT DETAILS */}
            <div className="space-y-1">

              <h2 className="text-lg font-bold">
                🚗 {b.name}
              </h2>

              <p>👤 {b.fullName}</p>
              <p>📧 {b.email}</p>
              <p>📞 {b.phone}</p>

              <p className="text-sm">
                📅 {b.pickupDate} → {b.dropDate}
              </p>

              <p className="text-sm font-semibold">
                ₹{b.amount}
              </p>

              <p className="text-xs text-gray-500">
                Payment ID: {b.paymentIntentId}
              </p>

              <p className="text-xs text-gray-400">
                Created: {new Date(b.createdAt).toLocaleString()}
              </p>

              <span
                className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-bold
                ${
                  b.bookingStatus === "accepted"
                    ? "bg-green-100 text-green-700"
                    : b.bookingStatus === "rejected"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {b.bookingStatus.toUpperCase()}
              </span>

            </div>

            {/* ACTIONS */}
            <div className="flex flex-col gap-2 justify-center">

              {b.bookingStatus === "pending" && (
                <>
                  <button
                    onClick={() => acceptBooking(b._id)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg"
                  >
                    Accept
                  </button>

                  <button
                    onClick={() => rejectBooking(b._id)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg"
                  >
                    Reject
                  </button>
                </>
              )}

              {/* CLIENT INVOICE */}
              {b.bookingStatus === "accepted" && b.clientInvoiceUrl && (
                <button
                  onClick={() => downloadClientInvoice(b._id)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
                >
                  Download Client Invoice
                </button>
              )}

              {/* USER INVOICE */}
              {b.bookingStatus === "accepted" && b.invoiceUrl && (
                <button
                  onClick={() => downloadUserInvoice(b._id)}
                  className="bg-gray-800 text-white px-4 py-2 rounded-lg"
                >
                  Download User Invoice
                </button>
              )}

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}