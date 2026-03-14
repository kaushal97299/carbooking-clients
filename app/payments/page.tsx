"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";

export default function PaymentsPage(){

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const [payments,setPayments] = useState<any[]>([]);
const [loading,setLoading] = useState(true);

const [page,setPage] = useState(1);
const perPage = 8;

useEffect(()=>{

fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/booking/all`)
.then(res=>res.json())
.then(data=>{

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const paid = data.filter((b:any)=>b.bookingStatus==="accepted");

setPayments(paid);
setLoading(false);

});

},[]);

const start = (page-1)*perPage;
const paginated = payments.slice(start,start+perPage);
const totalPages = Math.ceil(payments.length/perPage);

const totalRevenue = payments.reduce(
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(sum:number,p:any)=>sum+p.amount,
0
);

if(loading){

return(

<div className="min-h-screen flex items-center justify-center text-white bg-gradient-to-br from-[#020b0a] via-[#041f1e] to-[#020b0a]">

Loading payments...

</div>

)

}

return(

<div className="min-h-screen bg-gradient-to-br from-[#020b0a] via-[#041f1e] to-[#020b0a] text-white px-6 py-8">

<div className="max-w-7xl mx-auto">

{/* HEADER */}

<div className="flex justify-between items-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl px-6 py-6 shadow-xl mb-8">

<div>

<h1 className="text-3xl font-bold text-emerald-300">
Payments
</h1>

<p className="text-sm text-gray-400 mt-1">
All completed payments
</p>

</div>

<div className="text-right">

<p className="text-xs text-gray-400">Total Revenue</p>

<p className="text-xl font-bold text-emerald-300">
₹{totalRevenue}
</p>

</div>

</div>

{/* TABLE */}

<div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl shadow-xl overflow-x-auto">

<table className="min-w-full text-sm">

<thead className="bg-white/5 text-gray-300 uppercase text-xs">

<tr>

<th className="px-6 py-4 text-left">Order</th>
<th className="px-6 py-4 text-left">Car</th>
<th className="px-6 py-4 text-left">Customer</th>
<th className="px-6 py-4 text-left">Amount</th>
<th className="px-6 py-4 text-left">Payment ID</th>
<th className="px-6 py-4 text-center">Invoice</th>

</tr>

</thead>

<tbody className="divide-y divide-white/10">

 {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
{paginated.map((p:any)=>(

<tr key={p._id} className="hover:bg-white/5">

<td className="px-6 py-4 text-xs text-gray-400">
#{p._id.slice(-6)}
</td>

<td className="px-6 py-4 font-medium">
{p.name}
</td>

<td className="px-6 py-4 text-gray-300">
{p.fullName}
</td>

<td className="px-6 py-4 font-semibold text-emerald-300">
₹{p.amount}
</td>

<td className="px-6 py-4 text-xs text-gray-400">
{p.paymentIntentId}
</td>

<td className="px-6 py-4 text-center">

{p.invoiceUrl &&(

<button
onClick={()=>window.open(
`${process.env.NEXT_PUBLIC_API_URL}/api/booking/invoice/${p._id}`
)}

>

<Download
size={18}
className="text-emerald-300 hover:scale-110 transition"
/>

</button>

)}

</td>

</tr>

))}

</tbody>

</table>

</div>

{/* PAGINATION */}

<div className="flex justify-center gap-3 mt-8">

{Array.from({length:totalPages}).map((_,i)=>(

<button
key={i}
onClick={()=>setPage(i+1)}
className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
page===i+1
?"bg-emerald-500 text-black"
:"bg-white/5 text-gray-300 hover:bg-white/10"
}`}

>

{i+1}

</button>

))}

</div>

</div>

</div>

);

}
