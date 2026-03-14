/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, X, ArrowLeft, ImageIcon } from "lucide-react";
import Link from "next/link";

export default function AddClaimPage(){

const router = useRouter();

const [form,setForm] = useState({
bookingId:"",
carName:"",
customerName:"",
reason:"",
description:"",
amount:""
});

const [images,setImages] = useState<File[]>([]);
const [loading,setLoading] = useState(false);

/* HANDLE IMAGE */

const handleImages = (files: FileList | null)=>{
if(!files) return;
setImages(prev=>[...prev,...Array.from(files)]);
};

const removeImage = (index:number)=>{
setImages(prev=>prev.filter((_,i)=>i!==index));
};

/* SUBMIT */

const submit = async()=>{

if(!form.bookingId || !form.carName){
alert("Booking ID and Car Name required");
return;
}

try{

setLoading(true);

const fd = new FormData();

Object.entries(form).forEach(([k,v])=>{
fd.append(k,v);
});

images.forEach(img=>{
fd.append("images",img);
});

await fetch(
`${process.env.NEXT_PUBLIC_API_URL}/api/claims/create`,
{
method:"POST",
headers:{
Authorization:`Bearer ${localStorage.getItem("token")}`
},
body:fd
}
);

alert("Claim created");

router.push("/claims");

}catch(err){

console.log(err);
alert("Claim failed");

}finally{
setLoading(false);
}

};

return(

<div className="min-h-screen bg-gradient-to-br from-[#020b0a] via-[#041f1e] to-[#020b0a] text-white py-10 px-6">

<div className="max-w-4xl mx-auto">

{/* HEADER */}

<div className="flex justify-between items-center mb-10">

<div>

<h1 className="text-3xl font-bold text-emerald-300">
Create Claim
</h1>

<p className="text-gray-400 text-sm">
Report vehicle damage or issue
</p>

</div>

<Link
href="/claims"
className="flex items-center gap-2 text-gray-300 hover:text-white transition"
>
<ArrowLeft size={18}/> Back
</Link>

</div>

{/* CARD */}

<div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-xl space-y-7">

{/* GRID */}

<div className="grid md:grid-cols-2 gap-6">

<Input
label="Booking ID"
placeholder="Enter booking id"
value={form.bookingId}
onChange={(e:any)=>setForm({...form,bookingId:e.target.value})}
/>

<Input
label="Car Name"
placeholder="Enter car name"
value={form.carName}
onChange={(e:any)=>setForm({...form,carName:e.target.value})}
/>

<Input
label="Customer Name"
placeholder="Enter customer name"
value={form.customerName}
onChange={(e:any)=>setForm({...form,customerName:e.target.value})}
/>

<Input
label="Claim Reason"
placeholder="Damage reason"
value={form.reason}
onChange={(e:any)=>setForm({...form,reason:e.target.value})}
/>

</div>

{/* DESCRIPTION */}

<div>

<label className="text-sm text-gray-400 mb-2 block">
Damage Description
</label>

<textarea
rows={4}
placeholder="Describe the damage..."
value={form.description}
onChange={(e)=>setForm({...form,description:e.target.value})}
className="w-full p-4 rounded-xl bg-white/10 border border-white/20 outline-none focus:ring-2 focus:ring-emerald-400 transition"
/>

</div>

{/* AMOUNT */}

<Input
label="Claim Amount"
type="number"
placeholder="Enter claim amount"
value={form.amount}
onChange={(e:any)=>setForm({...form,amount:e.target.value})}
/>

{/* IMAGE UPLOAD */}

<div>

<label className="text-sm text-gray-400 flex items-center gap-2 mb-3">
<ImageIcon size={16}/> Damage Images
</label>

<label className="flex flex-col items-center justify-center h-36 border-2 border-dashed border-white/20 rounded-2xl cursor-pointer hover:border-emerald-400 hover:bg-white/5 transition">

<Upload className="text-emerald-300 mb-2"/>

<p className="text-sm text-gray-300">
Click to upload images
</p>

<p className="text-xs text-gray-500 mt-1">
PNG, JPG allowed
</p>

<input
type="file"
hidden
multiple
accept="image/*"
onChange={(e)=>handleImages(e.target.files)}
/>

</label>

</div>

{/* IMAGE PREVIEW */}

{images.length>0 &&(

<div className="flex flex-wrap gap-3">

{images.map((img,i)=>{

const url = URL.createObjectURL(img);

return(

<div key={i} className="relative group">

<img
src={url}
className="w-24 h-24 rounded-xl object-cover border border-white/10"
/>

<button
onClick={()=>removeImage(i)}
className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
>
<X size={12}/>
</button>

</div>

);

})}

</div>

)}

{/* BUTTON */}

<button
onClick={submit}
disabled={loading}
className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 font-semibold text-black shadow-lg hover:scale-[1.02] active:scale-[0.98] transition"
>

{loading ? "Submitting..." : "Submit Claim"}

</button>

</div>

</div>

</div>

);

}

/* INPUT */

function Input({label,...props}:any){

return(

<div className="flex flex-col gap-2">

<label className="text-sm text-gray-400">
{label}
</label>

<input
{...props}
className="w-full p-4 rounded-xl bg-white/10 border border-white/20 outline-none focus:ring-2 focus:ring-emerald-400 transition"
/>

</div>

);

}