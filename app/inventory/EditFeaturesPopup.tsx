"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { X, Pencil, Upload, Image as ImageIcon } from "lucide-react";
import { CarItem } from "./page";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function EditInventoryPopup({
  car,
  close,
  onUpdated,
}: {
  car: CarItem;
  close: () => void;
  onUpdated: (c: CarItem) => void;
}) {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const [features, setFeatures] = useState<string[]>([]);
  const [featureInput, setFeatureInput] = useState("");
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFeatures(Array.isArray(car.features) ? car.features : []);
  }, [car]);

  /* ================= PATCH FIELD ================= */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateField = async (field: string, value: any) => {
    const res = await axios.patch(
      `${API}/api/inventory/${car._id}`,
      { field, value },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    onUpdated(res.data);
  };

  /* ================= PATCH IMAGE ================= */
  const uploadImage = async (file: File) => {
    const fd = new FormData();
    fd.append("image", file);

    const res = await axios.patch(
      `${API}/api/inventory/${car._id}/image`,
      fd,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    onUpdated(res.data);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xl flex items-center justify-center px-4">
      <div className="w-full max-w-4xl max-h-[85vh] rounded-3xl overflow-hidden
        bg-gradient-to-br from-[#0b2a26] via-[#071917] to-[#020b0a]
        border border-white/10 shadow-[0_30px_120px_rgba(0,0,0,0.9)]">

        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4
          border-b border-white/10 bg-black/40">
          <div>
            <h2 className="text-base font-semibold text-emerald-300">
              Edit Inventory
            </h2>
            <p className="text-[10px] text-gray-400">
              Update only required fields
            </p>
          </div>
          <X size={18} onClick={close}
            className="cursor-pointer text-gray-300 hover:text-white" />
        </div>

        {/* BODY */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(85vh-64px)]">

          {/* IMAGE */}
          <div className="flex gap-5 items-center">
            <div className="w-28 h-28 rounded-2xl overflow-hidden
              border border-white/10 bg-black/40 flex items-center justify-center">
              {preview || car.image ? (
                // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
                <img
                  src={preview || `${API}${car.image}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <ImageIcon className="text-gray-500" />
              )}
            </div>

            <label className="cursor-pointer">
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  setPreview(URL.createObjectURL(f));
                  uploadImage(f);
                }}
              />
              <div className="px-4 py-2 rounded-xl bg-white/10
                hover:bg-white/20 transition text-xs flex items-center gap-2">
                <Upload size={13} />
                Update Image
              </div>
            </label>
          </div>

          {/* DETAILS */}
          <div className="grid md:grid-cols-2 gap-4">
            <Editable label="Car Name" value={car.name} onSave={(v) => updateField("name", v)} />
            <Editable label="Brand" value={car.brand} onSave={(v) => updateField("brand", v)} />
            <Editable label="Model" value={car.model} onSave={(v) => updateField("model", v)} />
            <Editable label="Gear" value={car.gear} onSave={(v) => updateField("gear", v)} />
            <Editable label="Fuel" value={car.fuel} onSave={(v) => updateField("fuel", v)} />
            <Editable label="Price / Day" value={car.price} onSave={(v) => updateField("price", Number(v))} />
          </div>

          {/* ABOUT */}
          <Editable
            label="About"
            value={car.about || ""}
            textarea
            onSave={(v) => updateField("about", v)}
          />

          {/* FEATURES */}
          <div>
            <p className="text-xs font-medium text-emerald-300 mb-2">
              Features (max 7)
            </p>

            <div className="flex gap-2 mb-3">
              <input
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                className="flex-1 bg-white/10 border border-white/20
                  rounded-xl px-3 py-2 text-xs outline-none"
                placeholder="Add feature"
              />
              <button
                onClick={() => {
                  if (!featureInput || features.length >= 7) return;
                  const updated = [...features, featureInput];
                  setFeatures(updated);
                  setFeatureInput("");
                  updateField("features", updated);
                }}
                className="px-4 rounded-xl bg-emerald-500 text-black
                  text-xs font-semibold"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {features.map((f, i) => (
                <span
                  key={i}
                  className="flex items-center gap-1 px-3 py-1
                    rounded-full text-[11px]
                    bg-emerald-500/20 text-emerald-300"
                >
                  {f}
                  <X
                    size={11}
                    className="cursor-pointer"
                    onClick={() => {
                      const updated = features.filter((_, idx) => idx !== i);
                      setFeatures(updated);
                      updateField("features", updated);
                    }}
                  />
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

/* ================= FIELD ================= */

function Editable({
  label,
  value,
  onSave,
  textarea = false,
}: {
  label: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSave: (v: any) => void;
  textarea?: boolean;
}) {
  const [edit, setEdit] = useState(false);
  const [temp, setTemp] = useState(value);

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
      <div className="flex justify-between items-center mb-1">
        <span className="text-[10px] text-gray-400">{label}</span>
        <Pencil size={12}
          className="cursor-pointer text-gray-400 hover:text-white"
          onClick={() => setEdit(true)} />
      </div>

      {edit ? (
        textarea ? (
          <textarea
            autoFocus
            rows={3}
            value={temp}
            onChange={(e) => setTemp(e.target.value)}
            onBlur={() => {
              setEdit(false);
              if (temp !== value) onSave(temp);
            }}
            className="w-full bg-transparent outline-none text-[13px]"
          />
        ) : (
          <input
            autoFocus
            value={temp}
            onChange={(e) => setTemp(e.target.value)}
            onBlur={() => {
              setEdit(false);
              if (temp !== value) onSave(temp);
            }}
            className="w-full bg-transparent outline-none text-[13px]"
          />
        )
      ) : (
        <p className="text-[13px] text-white/90">{value || "—"}</p>
      )}
    </div>
  );
}
