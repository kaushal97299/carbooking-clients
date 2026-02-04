"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Plus, Trash2, Car, Eye, Pencil } from "lucide-react";
// import { UltraEditPopup } from "./UltraEditPopup";

const API = process.env.NEXT_PUBLIC_API_URL;

export interface CarItem {
  _id: string;
  name: string;
  brand: string;
  model: string;
  gear: string;
  fuel: string;
  price: number;
  about: string;
  features: string[];
  image: string;
}

export default function InventoryPage() {
  const [cars, setCars] = useState<CarItem[]>([]);
  const [viewCar, setViewCar] = useState<CarItem | null>(null);

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

      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex justify-between items-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl px-6 py-5 shadow-xl">
          <div>
            <h1 className="text-3xl font-bold text-emerald-300">Inventory</h1>
            <p className="text-sm text-gray-400">
              Manage your cars inventory
            </p>
          </div>

          <Link
            href="/inventory/add"
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-cyan-500 px-5 py-2.5 rounded-xl font-semibold shadow-lg hover:scale-[1.02] transition"
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
            className="group bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-5 shadow-xl hover:shadow-emerald-500/10 transition relative"
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
                <h3 className="text-lg font-bold">{c.name}</h3>
                <p className="text-xs text-gray-400">
                  {c.brand} • {c.model}
                </p>
              </div>

              <div className="flex gap-2">
                <button onClick={() => setViewCar(c)}>
                  <Eye size={16} className="text-cyan-300 hover:text-cyan-400" />
                </button>
                <button onClick={() => deleteCar(c._id)}>
                  <Trash2 size={16} className="text-red-400 hover:text-red-500" />
                </button>
              </div>
            </div>

            {/* SPECS */}
            <div className="grid grid-cols-2 gap-3 text-xs text-gray-300 mt-4">
              <div className="bg-white/5 rounded-xl p-2">⚙ {c.gear}</div>
              <div className="bg-white/5 rounded-xl p-2">⛽ {c.fuel}</div>
            </div>

            {/* FEATURES */}
            {c.features?.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {c.features.map((f, i) => (
                  <span
                    key={i}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300"
                  >
                    {f}
                  </span>
                ))}
              </div>
            )}

            {/* PRICE */}
            <div className="mt-4 pt-4 border-t border-white/10 flex justify-between">
              <span className="text-emerald-300 font-bold text-lg">
                ₹{c.price}
              </span>
              <span className="text-xs text-gray-400">per day</span>
            </div>
          </div>
        ))}
      </div>

      {/* ULTRA POPUP */}
      {viewCar && (
        <UltraEditPopup
          car={viewCar}
          close={() => setViewCar(null)}
          updateLocal={(updated: CarItem) =>
            setCars((prev) =>
              prev.map((c) => (c._id === updated._id ? updated : c))
            )
          }
        />
      )}
    </div>
  );
}
