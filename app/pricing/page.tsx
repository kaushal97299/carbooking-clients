"use client";

import { useEffect, useState } from "react";
import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL;

interface CarItem {
  _id: string;
  name: string;
  brand: string;
  model: string;
  price: number;
  status: "pending" | "approved" | "rejected";
}

export default function PricingPage() {

  const [cars, setCars] = useState<CarItem[]>([]);
  const [increase, setIncrease] = useState<{[key:string]:number}>({});
  const [loading, setLoading] = useState(false);

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  /* ================= FETCH INVENTORY ================= */
  useEffect(() => {
    if (!token) return;

    axios
      .get(`${API}/api/inventory/my`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {

        const approved = res.data.filter(
          (c:CarItem)=>c.status === "approved"
        );

        setCars(approved);

      })
      .catch(()=>{
        console.log("Pricing fetch failed");
      });

  }, [token]);

  /* ================= PRICE CHANGE ================= */
  const changeIncrease = (id:string,value:number) => {
    setIncrease((prev)=>({
      ...prev,
      [id]:value
    }));
  };

  /* ================= UPDATE PRICE ================= */
  const updatePrice = async (car:CarItem) => {

    const inc = increase[car._id] || 0;

    const newPrice = Number(car.price) + Number(inc);

    try {

      setLoading(true);

      const res = await axios.patch(
        `${API}/api/inventory/${car._id}`,
        {
          field: "price",
          value: newPrice
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setCars(prev =>
        prev.map(c =>
          c._id === car._id ? res.data : c
        )
      );

      setIncrease(prev => ({
        ...prev,
        [car._id]:0
      }));

    } catch {
      alert("Price update failed");
    }

    setLoading(false);
  };

  return (

    <div className="min-h-screen bg-gradient-to-br from-[#020b0a] via-[#041f1e] to-[#020b0a] text-white px-4 py-6">

      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-8">

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl px-6 py-5 shadow-xl">

          <h1 className="text-3xl font-bold text-emerald-300">
            Pricing Management
          </h1>

          <p className="text-sm text-gray-400">
            Increase or update your approved car prices
          </p>

        </div>

      </div>

      {/* TABLE */}
      <div className="max-w-7xl mx-auto bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl overflow-x-auto">

        <table className="w-full text-sm">

          <thead className="text-gray-400 border-b border-white/10">

            <tr>
              <th className="text-left py-3">Car</th>
              <th className="text-left">Brand</th>
              <th className="text-left">Model</th>
              <th className="text-left">Current Price</th>
              <th className="text-left">Increase</th>
              <th className="text-left">New Price</th>
              <th className="text-left">Action</th>
            </tr>

          </thead>

          <tbody>

            {cars.map((car)=>{

              const inc = increase[car._id] || 0;

              const newPrice =
                Number(car.price) + Number(inc);

              return(

                <tr
                  key={car._id}
                  className="border-b border-white/5"
                >

                  <td className="py-4 font-semibold">
                    {car.name}
                  </td>

                  <td>{car.brand}</td>

                  <td>{car.model}</td>

                  <td className="text-emerald-300 font-bold">
                    ₹{car.price}
                  </td>

                  <td>

                    <input
                      type="number"
                      value={inc}
                      onChange={(e)=>
                        changeIncrease(
                          car._id,
                          Number(e.target.value)
                        )
                      }
                      className="w-24 px-2 py-1 rounded-lg bg-white/10 border border-white/20 outline-none"
                    />

                  </td>

                  <td className="text-cyan-300 font-semibold">
                    ₹{newPrice}
                  </td>

                  <td>

                    <button
                      onClick={()=>updatePrice(car)}
                      disabled={loading}
                      className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-semibold text-xs"
                    >
                      Update
                    </button>

                  </td>

                </tr>

              );

            })}

          </tbody>

        </table>

      </div>

    </div>
  );
}