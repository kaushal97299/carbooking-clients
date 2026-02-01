/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ArrowLeft, Upload, X } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function AddInventoryPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    brand: "",
    model: "",
    gear: "",
    fuel: "",
    price: "",
    about: "",
  });

  const [features, setFeatures] = useState<string[]>([]);
  const [featureInput, setFeatureInput] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  /* ================= ADD FEATURE ================= */
  const addFeature = () => {
    if (!featureInput || features.length >= 7) return;
    setFeatures([...features, featureInput]);
    setFeatureInput("");
  };

  const removeFeature = (i: number) => {
    setFeatures(features.filter((_, idx) => idx !== i));
  };

  /* ================= SUBMIT (FIXED) ================= */
  const submit = async () => {
    if (!image) return alert("Please upload image");

    const fd = new FormData();

    // ✅ append ONE BY ONE (no duplicate)
    fd.append("name", form.name);
    fd.append("brand", form.brand);
    fd.append("model", form.model);
    fd.append("gear", form.gear);
    fd.append("fuel", form.fuel);
    fd.append("price", form.price); // 🔥 FIXED
    fd.append("about", form.about);
    fd.append("features", JSON.stringify(features));
    fd.append("image", image);

    try {
      await axios.post(`${API}/api/inventory`, fd, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      router.push("/inventory");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || "Upload failed");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center
      bg-gradient-to-br from-[#020b0a] via-[#052e2b] to-[#020b0a] p-4 text-white"
    >
      <div
        className="w-full max-w-4xl
        bg-white/10 backdrop-blur-2xl border border-white/20
        rounded-3xl shadow-2xl p-6 md:p-8"
      >
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-300 hover:text-white"
          >
            <ArrowLeft size={18} /> Back
          </button>

          <h1 className="text-2xl font-bold text-emerald-300">
            Add New Inventory
          </h1>
        </div>

        {/* GRID */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* LEFT */}
          <div className="space-y-4">
            <Input
              placeholder="Car Name"
              value={form.name}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onChange={(e: any) =>
                setForm({ ...form, name: e.target.value })
              }
            />
            <Input
              placeholder="Brand"
              value={form.brand}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onChange={(e: any) =>
                setForm({ ...form, brand: e.target.value })
              }
            />
            <Input
              placeholder="Model"
              value={form.model}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onChange={(e: any) =>
                setForm({ ...form, model: e.target.value })
              }
            />
            <Input
              placeholder="Gear (Manual / Auto)"
              value={form.gear}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onChange={(e: any) =>
                setForm({ ...form, gear: e.target.value })
              }
            />
            <Input
              placeholder="Fuel (Petrol / Diesel)"
              value={form.fuel}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onChange={(e: any) =>
                setForm({ ...form, fuel: e.target.value })
              }
            />
            <Input
              placeholder="Price per day"
              type="number"
              value={form.price}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onChange={(e: any) =>
                setForm({ ...form, price: e.target.value })
              }
            />
          </div>

          {/* RIGHT */}
          <div className="space-y-4">
            {/* IMAGE UPLOAD */}
            <label
              className="flex flex-col items-center justify-center
              h-40 border-2 border-dashed border-white/20 rounded-2xl
              cursor-pointer hover:border-emerald-400 transition"
            >
              {preview ? (
                // eslint-disable-next-line jsx-a11y/alt-text
                <img
                  src={preview}
                  className="h-full object-cover rounded-2xl"
                />
              ) : (
                <>
                  <Upload className="text-emerald-300 mb-2" />
                  <span className="text-sm text-gray-300">
                    Upload Car Image
                  </span>
                </>
              )}

              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setImage(file);
                    setPreview(URL.createObjectURL(file));
                  }
                }}
              />
            </label>

            {/* ABOUT */}
            <Textarea
              placeholder="About this car"
              value={form.about}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onChange={(e: any) =>
                setForm({ ...form, about: e.target.value })
              }
            />

            {/* FEATURES */}
            <div>
              <div className="flex gap-2 mb-2">
                <input
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  placeholder="Add feature (max 7)"
                  className="flex-1 p-2 rounded-xl bg-white/10 border border-white/20 outline-none"
                />
                <button
                  onClick={addFeature}
                  className="px-4 rounded-xl bg-emerald-500 text-black font-semibold"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {features.map((f, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-1
                    bg-emerald-500/20 text-emerald-300
                    px-3 py-1 rounded-full text-xs"
                  >
                    {f}
                    <X
                      size={12}
                      onClick={() => removeFeature(i)}
                      className="cursor-pointer"
                    />
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* SUBMIT */}
        <button
          onClick={submit}
          className="mt-8 w-full py-3 rounded-2xl
          bg-gradient-to-r from-emerald-500 to-cyan-500
          font-bold shadow-xl hover:scale-[1.01] transition"
        >
          Save Inventory
        </button>
      </div>
    </div>
  );
}

/* ================= UI ================= */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Input(props: any) {
  return (
    <input
      {...props}
      className="w-full p-3 rounded-xl bg-white/10
      border border-white/20 outline-none focus:ring-2
      focus:ring-emerald-400/40"
    />
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Textarea(props: any) {
  return (
    <textarea
      {...props}
      rows={3}
      className="w-full p-3 rounded-xl bg-white/10
      border border-white/20 outline-none focus:ring-2
      focus:ring-emerald-400/40"
    />
  );
}
