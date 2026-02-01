"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Plus, Trash2, Car } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL;

interface CarItem {
  _id: string;
  name: string;
  brand: string;
  model: string;
  gear: string;
  fuel: string;
  price: number;
}

export default function InventoryPage() {
  const [cars, setCars] = useState<CarItem[]>([]);
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!token) return;
    axios
      .get(`${API}/api/inventory/my`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setCars(res.data));
  }, [token]);

  const deleteCar = async (id: string) => {
    await axios.delete(`${API}/api/inventory/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setCars((prev) => prev.filter((c) => c._id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020b0a] via-[#041f1e] to-[#020b0a] text-white px-4 py-6">

      {/* ===== HEADER ===== */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex justify-between items-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl px-6 py-5 shadow-xl">
          <div>
            <h1 className="text-3xl font-bold text-emerald-300">Inventory</h1>
            <p className="text-sm text-gray-400">Manage your cars inventory</p>
          </div>

          <Link
            href="/inventory/add"
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-cyan-500 px-5 py-2.5 rounded-xl font-semibold shadow-lg hover:scale-[1.02] transition"
          >
            <Plus size={18} /> Add Car
          </Link>
        </div>
      </div>

      {/* ===== CONTENT ===== */}
      <div className="max-w-7xl mx-auto">
        {cars.length === 0 ? (
          /* EMPTY STATE */
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <div className="p-6 rounded-full bg-white/10 mb-4">
              <Car size={40} className="text-emerald-300" />
            </div>
            <h2 className="text-xl font-semibold mb-1">No inventory yet</h2>
            <p className="text-gray-400 text-sm mb-4">
              Start by adding your first car
            </p>
            <Link
              href="/inventory/add"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 font-semibold shadow"
            >
              Add Inventory
            </Link>
          </div>
        ) : (
          /* GRID */
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map((c) => (
              <div
                key={c._id}
                className="group bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-5 shadow-xl hover:shadow-emerald-500/10 transition"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {c.name}
                    </h3>
                    <p className="text-xs text-gray-400">
                      {c.brand} • {c.model}
                    </p>
                  </div>
                  <button onClick={() => deleteCar(c._id)}>
                    <Trash2
                      size={16}
                      className="text-red-400 hover:text-red-600"
                    />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs text-gray-300 mt-4">
                  <div className="bg-white/5 rounded-xl p-2">
                    ⚙ {c.gear}
                  </div>
                  <div className="bg-white/5 rounded-xl p-2">
                    ⛽ {c.fuel}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
                  <span className="text-emerald-300 font-bold text-lg">
                    ₹{c.price}
                  </span>
                  <span className="text-xs text-gray-400">per day</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
