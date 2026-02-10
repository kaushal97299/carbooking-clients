"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Plus, Trash2, Eye } from "lucide-react";
import EditInventoryPopup from "./EditFeaturesPopup";

const API = process.env.NEXT_PUBLIC_API_URL;

export interface CarItem {
  _id: string;
  name: string;
  brand: string;
  model: string;
  gear: string;
  fuel: string;
  price: number;
  about?: string;
  image?: string;
  features?: string[];

  // ✅ NEW
  status: "pending" | "approved" | "rejected";
}

export default function InventoryPage() {
  const [cars, setCars] = useState<CarItem[]>([]);
  const [viewCar, setViewCar] = useState<CarItem | null>(null);

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  /* ================= FETCH ================= */
  useEffect(() => {
    if (!token) return;

    axios
      .get(`${API}/api/inventory/my`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setCars(res.data))
      .catch(() => {
        console.log("Failed to fetch inventory");
      });
  }, [token]);

  /* ================= DELETE ================= */
  const deleteCar = async (id: string) => {
    if (!confirm("Delete this car?")) return;

    try {
      await axios.delete(`${API}/api/inventory/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCars((prev) =>
        prev.filter((c) => c._id !== id)
      );
    } catch {
      alert("Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020b0a] via-[#041f1e] to-[#020b0a] text-white px-4 py-6">

      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex justify-between items-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl px-6 py-5 shadow-xl">

          <div>
            <h1 className="text-3xl font-bold text-emerald-300">
              Inventory
            </h1>
            <p className="text-sm text-gray-400">
              Manage your cars inventory
            </p>
          </div>

          <Link
            href="/inventory/add"
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-cyan-500 px-5 py-2.5 rounded-xl font-semibold shadow-lg"
          >
            <Plus size={18} /> Add Car
          </Link>

        </div>
      </div>

      {/* GRID */}
      <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

        {cars.map((c) => (
          <div
            key={c._id}
            className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-5 shadow-xl"
          >
            {/* IMAGE */}
            {c.image && (
              <img
                src={`${API}${c.image}`}
                className="w-full h-36 object-cover rounded-2xl mb-4"
              />
            )}

            {/* TOP */}
            <div className="flex justify-between items-start">

              <div>
                <h3 className="text-lg font-bold">
                  {c.name}
                </h3>

                <p className="text-xs text-gray-400">
                  {c.brand} • {c.model}
                </p>
              </div>

              {/* ACTIONS */}
              <div className="flex gap-3">

                {/* Only approved can edit/delete */}
                {c.status === "approved" && (
                  <>
                    <Eye
                      size={16}
                      className="text-cyan-300 cursor-pointer"
                      onClick={() => setViewCar(c)}
                    />

                    <Trash2
                      size={16}
                      className="text-red-400 cursor-pointer"
                      onClick={() => deleteCar(c._id)}
                    />
                  </>
                )}

              </div>
            </div>

            {/* INFO */}
            <div className="grid grid-cols-2 gap-3 text-xs text-gray-300 mt-4">
              <div className="bg-white/5 rounded-xl p-2">
                ⚙ {c.gear}
              </div>

              <div className="bg-white/5 rounded-xl p-2">
                ⛽ {c.fuel}
              </div>
            </div>

            {/* FEATURES */}
            {c.features && c.features.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">

                {c.features.map((f, i) => (
                  <span
                    key={i}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300"
                  >
                    {f}
                  </span>
                ))}

              </div>
            )}

            {/* STATUS */}
            <p className="text-xs mt-3">
              Status:{" "}

              <span
                className={
                  c.status === "approved"
                    ? "text-green-400"
                    : c.status === "pending"
                    ? "text-yellow-400"
                    : "text-red-400"
                }
              >
                {c.status}
              </span>
            </p>

            {/* MESSAGE */}
            {c.status !== "approved" && (
              <p className="text-[11px] text-gray-400 mt-1">
                Waiting for admin approval
              </p>
            )}

            {/* PRICE */}
            <div className="mt-4 pt-4 border-t border-white/10 flex justify-between">

              <span className="text-emerald-300 font-bold text-lg">
                ₹{c.price}
              </span>

              <span className="text-xs text-gray-400">
                per day
              </span>

            </div>
          </div>
        ))}

      </div>

      {/* POPUP */}
      {viewCar && (
        <EditInventoryPopup
          car={viewCar}
          close={() => setViewCar(null)}
          onUpdated={(updated) =>
            setCars((prev) =>
              prev.map((c) =>
                c._id === updated._id ? updated : c
              )
            )
          }
        />
      )}

    </div>
  );
}
