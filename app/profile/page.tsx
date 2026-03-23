/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Camera,
  Save,
  Lock,
  MapPin,
  Phone,
  User,
  ShieldCheck,
} from "lucide-react";
import { motion } from "framer-motion";

const API = process.env.NEXT_PUBLIC_API_URL;

/* ================= TYPES ================= */

interface SingleDoc {
  number?: string;
  image?: string;
  status?: "pending" | "verified" | "rejected";
}

interface Documents {
  aadhaar?: SingleDoc;
  pan?: SingleDoc;
  drivingLicense?: SingleDoc;
}

interface UserProfile {
  name: string;
  email: string;

  phone?: string;
  address?: string;

  dob?: string;
  gender?: string;

  pincode?: string;
  city?: string;
  district?: string;
  state?: string;

  avatar?: string;

  documents?: Documents;

  status?: string;
}

/* ================= COMPONENT ================= */

export default function ProfilePage() {

  const [user, setUser] = useState<UserProfile | null>(null);

  const [loading, setLoading] = useState(false);
  const [pinLoading, setPinLoading] = useState(false);

  const [villages, setVillages] = useState<string[]>([]);

  /* FILES */

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState("");

  const [aadhaarFile, setAadhaarFile] = useState<File | null>(null);
  const [panFile, setPanFile] = useState<File | null>(null);
  const [dlFile, setDlFile] = useState<File | null>(null);

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;


  /* ================= LOAD ================= */

  useEffect(() => {
    if (!token) return;

    loadProfile().catch(() => {
      createProfile();
    });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

useEffect(() => {

  if (user?.pincode && user.pincode.length === 6) {
    handlePincode(user.pincode);
  }

}, [user?.pincode]);
  /* ================= CREATE PROFILE ================= */

  const createProfile = async () => {
    try {

      await axios.post(
        `${API}/api/profile/create`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      loadProfile();

    } catch (err) {
      console.log("Create profile error:", err);
    }
  };


  /* ================= GET PROFILE ================= */

  const loadProfile = async () => {

    const res = await axios.get(
      `${API}/api/profile/me`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = res.data;
 console.log("FROM BACKEND:", data.dateOfBirth);
    /* ✅ DOB FORMAT FIX */
   if (data.dateOfBirth) {
  data.dob = new Date(data.dateOfBirth)
    .toISOString()
    .split("T")[0];
}
  console.log("AFTER CONVERT:", data.dob);

    setUser({
  ...data,
  dob: data.dob || ""
});

   setAvatarPreview(
  data.avatar || ""
);
  };


  /* ================= PINCODE ================= */

const handlePincode = async (pin: string) => {

  if (!/^\d{6}$/.test(pin)) return;

  try {

    setPinLoading(true);

 const res = await axios.get(`${API}/api/pincodee${pin}`, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
    setVillages(res.data.locations || []);

    setUser((p: any) => ({
      ...p,
      city: "",
      district: res.data.district,
      state: res.data.state,
    }));

  } catch (err) {

    console.log("PINCODE ERROR", err);

  } finally {

    setPinLoading(false);

  }

};

  /* ================= SAVE ================= */

  const saveProfile = async () => {

    if (!user) return;

    try {

      setLoading(true);

      const fd = new FormData();


      /* BASIC */

      fd.append("name", user.name || "");
      fd.append("phone", user.phone || "");
      fd.append("address", user.address || "");

      fd.append("dob", user.dob || "");
      fd.append("gender", user.gender || "");

      fd.append("pincode", user.pincode || "");
      fd.append("city", user.city || "");
      fd.append("district", user.district || "");
      fd.append("state", user.state || "");


      /* DOC NUMBERS */

      fd.append(
        "aadhaarNumber",
        user.documents?.aadhaar?.number || ""
      );

      fd.append(
        "panNumber",
        user.documents?.pan?.number || ""
      );

      fd.append(
        "drivingLicenseNumber",
        user.documents?.drivingLicense?.number || ""
      );


      /* FILES */

      if (avatarFile) fd.append("avatar", avatarFile);
      if (aadhaarFile) fd.append("aadhaarImage", aadhaarFile);
      if (panFile) fd.append("panImage", panFile);
      if (dlFile) fd.append("dlImage", dlFile);


      await axios.put(
        `${API}/api/profile/update`,
        fd,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Profile Updated ✅");

      loadProfile();
      

    } catch (err) {

      console.log(err);

      alert("Update Failed ❌");

    } finally {

      setLoading(false);

    }
  };


  /* ================= LOADING ================= */

  if (!user) {
    return (
      <p className="text-center mt-24 text-gray-400">
        Loading Profile...
      </p>
    );
  }


  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950 p-3 sm:p-5 lg:p-8 text-white">

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto space-y-5"
      >

        {/* ── TOP CARD: avatar + name ── */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-5">

          {/* AVATAR */}
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0">
            <img
              src={avatarPreview || "https://cdn-icons-png.flaticon.com/512/847/847969.png"}
              className="w-full h-full rounded-full object-cover border-4 border-emerald-400"
            />
            <label className="absolute bottom-0 right-0 bg-emerald-500 text-black p-1.5 rounded-full cursor-pointer">
              <Camera size={14} />
              <input
                type="file" hidden accept="image/*"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) { setAvatarFile(f); setAvatarPreview(URL.createObjectURL(f)); }
                }}
              />
            </label>
          </div>

          {/* INFO */}
          <div className="text-center sm:text-left">
            <h2 className="text-lg sm:text-xl font-bold flex items-center justify-center sm:justify-start gap-2">
              <User size={18} /> {user.name}
            </h2>
            <p className="text-sm text-gray-400 mt-0.5">{user.email}</p>
            <span className="inline-block mt-2 text-xs px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-medium">
              Account: {user.status}
            </span>
          </div>

        </div>


        {/* ── PERSONAL INFORMATION ── */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 sm:p-6">

          <h3 className="text-base sm:text-lg font-semibold mb-4">Personal Information</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <Input label="Full Name" value={user.name}
              onChange={(v: string) => setUser({ ...user, name: v })} />

            <LockedInput label="Email" value={user.email} />

            <Input label="Phone" icon={<Phone size={14} />}
              value={user.phone || ""}
              onChange={(v: string) => setUser({ ...user, phone: v })} />

            <Input label="Address" icon={<MapPin size={14} />}
              value={user.address || ""}
              onChange={(v: string) => setUser({ ...user, address: v })} />

            <Input label="Date of Birth" value={user.dob || ""}
              onChange={(v: string) => setUser({ ...user, dob: v })} />

            {/* GENDER */}
            <div>
              <label className="label">Gender</label>
              <select
                value={user.gender || ""}
                onChange={(e) => setUser({ ...user, gender: e.target.value })}
                className="input"
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* PINCODE */}
            <div>
              <label className="label">Pincode</label>
              <input
                value={user.pincode || ""}
                maxLength={6}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, "");
                  setUser({ ...user, pincode: v });
                }}
                className="input"
                placeholder="6-digit pincode"
              />
              {pinLoading && <p className="text-xs text-emerald-400 mt-1">Fetching location...</p>}
            </div>

            {/* CITY */}
            <div>
              <label className="label">City / Village</label>
              <select
                value={user.city || ""}
                onChange={(e) => setUser({ ...user, city: e.target.value })}
                className="input"
              >
                <option value="">Select</option>
                {villages.map((v, i) => (
                  <option key={i} value={v}>{v}</option>
                ))}
              </select>
            </div>

            <Input label="District" value={user.district || ""}
              onChange={(v: string) => setUser({ ...user, district: v })} />

            <Input label="State" value={user.state || ""}
              onChange={(v: string) => setUser({ ...user, state: v })} />

          </div>
        </div>


        {/* ── KYC ── */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 sm:p-6">

          <h4 className="font-semibold flex items-center gap-2 mb-4">
            <ShieldCheck size={18} className="text-emerald-400" />
            KYC Verification
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">

            <KycBox title="Aadhaar"
              doc={user.documents?.aadhaar}
              onNum={(v: string) => setUser({ ...user, documents: { ...user.documents, aadhaar: { ...user.documents?.aadhaar, number: v } } })}
              onFile={setAadhaarFile}
            />

            <KycBox title="PAN"
              doc={user.documents?.pan}
              onNum={(v: string) => setUser({ ...user, documents: { ...user.documents, pan: { ...user.documents?.pan, number: v } } })}
              onFile={setPanFile}
            />

            <KycBox title="Driving License"
              doc={user.documents?.drivingLicense}
              onNum={(v: string) => setUser({ ...user, documents: { ...user.documents, drivingLicense: { ...user.documents?.drivingLicense, number: v } } })}
              onFile={setDlFile}
            />

          </div>
        </div>


        {/* ── SAVE ── */}
        <button
          onClick={saveProfile}
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl font-bold text-black text-sm sm:text-base disabled:opacity-60"
        >
          <Save size={16} className="inline mr-1.5" />
          {loading ? "Saving..." : "Save Changes"}
        </button>

      </motion.div>
    </div>
  );
}


/* ================= INPUT ================= */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Input({ label, value, onChange, icon }: any) {

  return (

    <div>

      <label className="label">{label}</label>

      <div className="relative">

        {icon && (
          <span className="absolute left-3 top-3 text-gray-400">
            {icon}
          </span>
        )}

        <input
          type={label === "Date of Birth" ? "date" : "text"}   // ✅ FIX
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`input ${icon ? "pl-9" : ""}`}
        />

      </div>

    </div>
  );
}


// eslint-disable-next-line @typescript-eslint/no-explicit-any
function LockedInput({ label, value }: any) {

  return (

    <div>

      <label className="label">{label}</label>

      <div className="relative">

        <input
          value={value}
          disabled
          className="input pr-10 opacity-60"
        />

        <Lock
          size={16}
          className="absolute right-3 top-3 text-gray-400"
        />

      </div>

    </div>
  );
}


/* ================= KYC BOX ================= */

function KycBox({
  title,
  doc,
  onNum,
  onFile,
// eslint-disable-next-line @typescript-eslint/no-explicit-any
}: any) {

  const [preview, setPreview] = useState(doc?.image || "");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPreview(doc?.image || "");
  }, [doc]);


  const status = doc?.status || "pending";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const statusColor: any = {
    pending: "bg-yellow-500/20 text-yellow-400",
    verified: "bg-green-500/20 text-green-400",
    rejected: "bg-red-500/20 text-red-400",
  };


  return (

    <div className="bg-white/5 border border-white/20 rounded-xl p-4 space-y-3">


      <div className="flex justify-between items-center">

        <h5 className="font-semibold text-sm text-emerald-300">
          {title}
        </h5>

        <span
          className={`px-2 py-1 rounded text-xs font-semibold ${statusColor[status]}`}
        >
          {status.toUpperCase()}
        </span>

      </div>


      <input
        placeholder={`${title} Number`}
        value={doc?.number || ""}
        onChange={(e) => onNum(e.target.value)}
        className="input"
      />


      {preview && (

       
       <img
  src={preview}
  className="w-full h-36 object-cover rounded border"
/>

      )}


      <input
        type="file"
        accept="image/*"
        onChange={(e) => {

          const f = e.target.files?.[0];

          if (f) {
            onFile(f);
            setPreview(URL.createObjectURL(f));
          }

        }}
        className="block w-full text-xs text-gray-300"
      />

    </div>
  );
}
