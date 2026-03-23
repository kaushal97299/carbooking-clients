"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Eye } from "lucide-react";

export default function ClaimsPage(){

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const [claims,setClaims] = useState<any[]>([]);
const [loading,setLoading] = useState(true);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const [selected,setSelected] = useState<any>(null);

const [page,setPage] = useState(1);
const perPage = 8;

/* FETCH CLAIMS */

const fetchClaims = async()=>{

try{

const res = await fetch(
`${process.env.NEXT_PUBLIC_API_URL}/api/claims`
);

const data = await res.json();

setClaims(data);

}catch(err){

console.log("Claims fetch error",err);

}finally{

setLoading(false);

}

};

useEffect(()=>{
fetchClaims();
},[]);

/* PAGINATION */

const start = (page-1)*perPage;
const paginated = claims.slice(start,start+perPage);
const totalPages = Math.ceil(claims.length/perPage);

if(loading){

return(

<div className="min-h-screen flex items-center justify-center text-white bg-gradient-to-br from-[#020b0a] via-[#041f1e] to-[#020b0a]">

<div className="text-lg font-semibold animate-pulse">
Loading claims...
</div>

</div>

);

}

return(

<div className="min-h-screen bg-gradient-to-br from-[#020b0a] via-[#041f1e] to-[#020b0a] text-white px-6 py-8">

<div className="max-w-7xl mx-auto">

{/* HEADER */}

<div className="flex justify-between items-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl px-6 py-6 shadow-xl mb-8">

<div>

<h1 className="text-3xl font-bold text-emerald-300">
Claims
</h1>

<p className="text-sm text-gray-400 mt-1">
Damage & insurance claims
</p>

</div>

<Link
href="/claims/add"
className="bg-gradient-to-r from-emerald-500 to-cyan-500 px-5 py-2.5 rounded-xl font-semibold text-black shadow-lg"
>
+ Add Claim
</Link>

</div>

{/* TABLE */}

<div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl shadow-xl overflow-x-auto">

<table className="min-w-full text-sm">

<thead className="bg-white/5 text-gray-300 uppercase text-xs tracking-wider">

<tr>

<th className="px-6 py-4 text-left">Claim</th>
<th className="px-6 py-4 text-left">Car</th>
<th className="px-6 py-4 text-left">Customer</th>
<th className="px-6 py-4 text-left">Reason</th>
<th className="px-6 py-4 text-left">Amount</th>
<th className="px-6 py-4 text-left">Status</th>
<th className="px-6 py-4 text-center">View</th>

</tr>

</thead>

<tbody className="divide-y divide-white/10">

{paginated.length===0 &&(

<tr>

<td colSpan={7} className="text-center py-10 text-gray-400">
No claims found
</td>

</tr>

)}

{paginated.map((c)=>(

<tr key={c._id} className="hover:bg-white/5 transition">

<td className="px-6 py-4 text-xs text-gray-400">
#{c._id.slice(-6)}
</td>

<td className="px-6 py-4 font-semibold">
{c.carName}
</td>

<td className="px-6 py-4 text-gray-300">
{c.customerName}
</td>

<td className="px-6 py-4 text-xs text-gray-400">
{c.reason}
</td>

<td className="px-6 py-4 font-semibold text-emerald-300">
₹{c.amount}
</td>

<td className="px-6 py-4">

<span
className={`px-3 py-1 text-xs rounded-full font-semibold ${
c.status==="approved"
?"bg-green-500/20 text-green-300"
:c.status==="rejected"
?"bg-red-500/20 text-red-300"
:c.status==="paid"
?"bg-cyan-500/20 text-cyan-300"
:"bg-yellow-500/20 text-yellow-300"
}`}

>

{c.status}

</span>

</td>

<td className="px-6 py-4 text-center">

<Eye
size={18}
className="text-cyan-300 cursor-pointer hover:scale-110 transition"
onClick={()=>setSelected(c)}
/>

</td>

</tr>

))}

</tbody>

</table>

</div>

{/* PAGINATION */}

{totalPages>1 &&(

<div className="flex justify-center gap-3 mt-8">

{Array.from({length:totalPages}).map((_,i)=>(

<button
key={i}
onClick={()=>setPage(i+1)}
className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
page===i+1
?"bg-emerald-500 text-black shadow-lg"
:"bg-white/5 text-gray-300 hover:bg-white/10"
}`}

>

{i+1}

</button>

))}

</div>

)}

{/* VIEW MODAL */}

{selected &&(

<div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4">

<div className="bg-[#020b0a] border border-white/10 rounded-2xl p-7 w-full max-w-md shadow-2xl">

<h2 className="text-xl font-bold text-emerald-300 mb-5">
Claim Details
</h2>

<div className="space-y-2 text-sm">

<p><b>Car:</b> {selected.carName}</p>

<p><b>Customer:</b> {selected.customerName}</p>

<p><b>Reason:</b> {selected.reason}</p>

<p><b>Description:</b> {selected.description}</p>

<p><b>Amount:</b> ₹{selected.amount}</p>

</div>

{/* IMAGES */}

{selected.images?.length>0 &&(

<div className="flex gap-2 mt-4 flex-wrap">

{selected.images.map((img:string,i:number)=>(

<img
key={i}
src={img}
className="w-20 h-20 object-cover rounded-lg border border-white/10"
/>

))}

</div>

)}

<button
onClick={()=>setSelected(null)}
className="mt-6 bg-emerald-500 text-black px-5 py-2 rounded-lg font-medium hover:bg-emerald-400 transition"

>

Close

</button>

</div>

</div>

)}

</div>

</div>

);

}
