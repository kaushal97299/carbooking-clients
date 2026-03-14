"use client";

import { useEffect, useState } from "react";
import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL;

interface Car {
  _id: string;
  name: string;
  brand: string;
  model: string;
  rating: number;
  reviews: number;
  status: string;
}

export default function QualityPage() {

  const [cars,setCars] = useState<Car[]>([])
  const [page,setPage] = useState(1)

  const perPage = 5

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null

  useEffect(()=>{

    if(!token) return

    axios
      .get(`${API}/api/inventory/my`,{
        headers:{ Authorization:`Bearer ${token}` }
      })
      .then(res=>{

        const approved = res.data.filter(
          (c:Car)=>c.status==="approved"
        )

        setCars(approved)

      })

  },[token])

  const qualityScore = (rating:number,reviews:number)=>{

    const score = (rating * 20) + (reviews * 0.2)

    if(score > 90) return "Excellent"
    if(score > 70) return "Good"
    if(score > 50) return "Average"

    return "Low"
  }

  /* PAGINATION LOGIC */

  const totalPages = Math.ceil(cars.length / perPage)

  const start = (page - 1) * perPage
  const currentCars = cars.slice(start,start + perPage)

  return(

    <div className="min-h-screen bg-gradient-to-br from-[#020b0a] via-[#041f1e] to-[#020b0a] text-white px-4 py-6">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-emerald-300">
            Vehicle Quality
          </h1>
          <p className="text-sm text-gray-400">
            Quality analytics of your approved vehicles
          </p>
        </div>

        {/* TABLE */}

        <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl overflow-x-auto">

          <table className="w-full text-sm">

            <thead className="border-b border-white/10 text-gray-400">

              <tr>
                <th className="text-left py-3">Car</th>
                <th className="text-left">Brand</th>
                <th className="text-left">Model</th>
                <th className="text-left">Rating</th>
                <th className="text-left">Reviews</th>
                <th className="text-left">Quality</th>
              </tr>

            </thead>

            <tbody>

              {currentCars.map(car=>{

                const quality = qualityScore(
                  car.rating,
                  car.reviews
                )

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

                    <td className="text-yellow-300">
                      ⭐ {car.rating}
                    </td>

                    <td className="text-cyan-300">
                      {car.reviews}
                    </td>

                    <td className="text-emerald-300 font-semibold">
                      {quality}
                    </td>

                  </tr>

                )

              })}

            </tbody>

          </table>

        </div>

        {/* PAGINATION */}

        <div className="flex justify-center gap-3 mt-6">

          <button
            disabled={page === 1}
            onClick={()=>setPage(page - 1)}
            className="px-4 py-2 rounded-xl bg-white/10 disabled:opacity-40"
          >
            Prev
          </button>

          <span className="px-4 py-2 text-sm text-gray-300">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={()=>setPage(page + 1)}
            className="px-4 py-2 rounded-xl bg-white/10 disabled:opacity-40"
          >
            Next
          </button>

        </div>

      </div>

    </div>

  )

}