/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ArrowLeft, Upload, X, ChevronDown } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL;

/* ================= CAR MASTER DATA ================= */
const CAR_DATA: Record<string, Record<string, string[]>> = {
  Toyota: {
    Fortuner: ["Petrol AT", "Diesel MT"],
    Innova: ["Crysta", "Hycross"],
    Camry: ["Hybrid"],
  },
  Honda: {
    City: ["V", "VX", "ZX"],
    Amaze: ["S", "VX"],
    Civic: ["Petrol"],
  },
  Hyundai: {
    Creta: ["E", "SX", "SX(O)"],
    Verna: ["Turbo", "NA"],
    i20: ["Sportz", "Asta"],
  },
  Kia: {
    Seltos: ["HTK", "HTX", "GTX"],
    Sonet: ["HTE", "GTX+"],
    Carens: ["Premium", "Luxury"],
  },
  Tata: {
    Nexon: ["Smart", "Creative"],
    Harrier: ["Pure", "Dark"],
    Safari: ["Adventure", "Accomplished"],
  },
  Mahindra: {
    Thar: ["AX", "LX"],
    Scorpio: ["Classic", "N"],
    XUV700: ["AX5", "AX7"],
  },
  BMW: {
    "3 Series": ["330i", "330Li"],
    X5: ["xDrive"],
  },
  Audi: {
    A4: ["Premium", "Technology"],
    Q7: ["55 TFSI"],
  },
  Mercedes: {
    "C Class": ["C200", "C300"],
    GLC: ["300", "220d"],
  },
  MG: {
    Hector: ["Sharp", "Savvy"],
    Astor: ["Style", "Super"],
  },
  Skoda: {
    Slavia: ["Active", "Style"],
    Kushaq: ["Ambition", "Monte Carlo"],
  },
  Volkswagen: {
    Virtus: ["Highline", "GT"],
    Taigun: ["Topline", "GT"],
  },
  Renault: {
    Duster: ["RXE", "RXZ"],
    Kiger: ["RXT", "RXZ"],
  },
  Nissan: {
    Magnite: ["XE", "XV"],
  },
  Jeep: {
    Compass: ["Sport", "Limited"],
  },
};

const GEARS = ["Manual", "Automatic"];
const FUELS = ["Petrol", "Diesel", "CNG", "Electric"];

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

  const brands = Object.keys(CAR_DATA);
  const carNames = form.brand ? Object.keys(CAR_DATA[form.brand] || {}) : [];
  const models =
    form.brand && form.name
      ? CAR_DATA[form.brand][form.name] || []
      : [];

  /* ================= FEATURE ================= */
  const addFeature = () => {
    if (!featureInput || features.length >= 7) return;
    setFeatures([...features, featureInput]);
    setFeatureInput("");
  };

  const removeFeature = (i: number) =>
    setFeatures(features.filter((_, idx) => idx !== i));

  /* ================= SUBMIT ================= */
  const submit = async () => {
    if (!image) return alert("Upload image");

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    fd.append("features", JSON.stringify(features));
    fd.append("image", image);

    await axios.post(`${API}/api/inventory`, fd, {
      headers: { Authorization: `Bearer ${token}` },
    });

    router.push("/inventory");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020b0a] via-[#052e2b] to-[#020b0a] p-4 text-white">
      <div className="max-w-5xl mx-auto bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-6 md:p-8 shadow-2xl">

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

        <div className="grid md:grid-cols-2 gap-6">
          {/* LEFT */}
          <div className="space-y-4">
            <Select label="Brand" value={form.brand} options={brands}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onChange={(v: any)=>setForm({ ...form, brand:v, name:"", model:"" })}/>
            <Select label="Car Name" value={form.name} options={carNames}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onChange={(v: any)=>setForm({ ...form, name:v, model:"" })}/>
            <Select label="Model" value={form.model} options={models}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onChange={(v: any)=>setForm({ ...form, model:v })}/>
            <Select label="Gear" value={form.gear} options={GEARS}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onChange={(v: any)=>setForm({ ...form, gear:v })}/>
            <Select label="Fuel" value={form.fuel} options={FUELS}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onChange={(v: any )=>setForm({ ...form, fuel:v })}/>
            <Input placeholder="Price per day" type="number"
              value={form.price}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onChange={(e:any)=>setForm({ ...form, price:e.target.value })}/>
          </div>

          {/* RIGHT */}
          <div className="space-y-4">
            <label className="h-40 flex items-center justify-center border-2 border-dashed border-white/20 rounded-2xl cursor-pointer hover:border-emerald-400">
              {preview ? (
                // eslint-disable-next-line jsx-a11y/alt-text
                <img src={preview} className="h-full object-cover rounded-2xl"/>
              ) : (
                <div className="text-center">
                  <Upload className="mx-auto text-emerald-300"/>
                  <p className="text-sm text-gray-300">Upload Car Image</p>
                </div>
              )}
              <input type="file" hidden accept="image/*"
                onChange={(e)=>{
                  const f=e.target.files?.[0];
                  if(f){ setImage(f); setPreview(URL.createObjectURL(f)); }
                }}/>
            </label>

            <Textarea placeholder="About this car"
              value={form.about}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onChange={(e:any)=>setForm({ ...form, about:e.target.value })}/>

            {/* FEATURES */}
            <div>
              <div className="flex gap-2 mb-2">
                <input
                  value={featureInput}
                  onChange={(e)=>setFeatureInput(e.target.value)}
                  placeholder="Add feature (max 7)"
                  className="flex-1 p-2 rounded-xl bg-white/10 border border-white/20 outline-none"
                />
                <button onClick={addFeature}
                  className="px-4 rounded-xl bg-emerald-500 text-black font-semibold">
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {features.map((f,i)=>(
                  <span key={i}
                    className="flex items-center gap-1 bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-xs">
                    {f}
                    <X size={12} onClick={()=>removeFeature(i)} className="cursor-pointer"/>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <button onClick={submit}
          className="mt-8 w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 font-bold shadow-xl">
          Save Inventory
        </button>
      </div>
    </div>
  );
}

/* ================= REUSABLE ================= */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
function Input(props:any){
  return <input {...props}
    className="w-full p-3 rounded-xl bg-white/10 border border-white/20 outline-none focus:ring-2 focus:ring-emerald-400/40"/>;
}
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
function Textarea(props:any){
  return <textarea {...props} rows={3}
    className="w-full p-3 rounded-xl bg-white/10 border border-white/20 outline-none focus:ring-2 focus:ring-emerald-400/40"/>;
}
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
function Select({ label, value, options, onChange }: any) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e)=>onChange(e.target.value)}
        className="w-full appearance-none p-3 rounded-xl bg-white/10 border border-white/20 outline-none text-white focus:ring-2 focus:ring-emerald-400/40"
      >
        <option value="">{label}</option>
        {options.map((o:string)=>(
          <option key={o} value={o} className="bg-[#052e2b] text-white">
            {o}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-4 top-4 text-gray-300 pointer-events-none"/>
    </div>
  );
}
