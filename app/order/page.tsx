/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Check, X, Download, FileText, Eye } from "lucide-react";

export default function ClientBookingPage(){

const [bookings,setBookings] = useState<any[]>([]);
const [loading,setLoading] = useState(true);
const [selected,setSelected] = useState<any>(null);

/* PAGINATION */

const [page,setPage] = useState(1);
const perPage = 8;

/* FETCH */

const fetchBookings = async()=>{

try{

const res = await fetch(
`${process.env.NEXT_PUBLIC_API_URL}/api/booking/all`
);

const data = await res.json();

setBookings(data);

}catch(err){

console.log("Fetch booking error",err);

}finally{

setLoading(false);

}

};

useEffect(()=>{
fetchBookings();
},[]);

/* ACTIONS */

const acceptBooking = async(id:string)=>{

await fetch(
`${process.env.NEXT_PUBLIC_API_URL}/api/booking/accept/${id}`,
{method:"PATCH"}
);

fetchBookings();

};

const rejectBooking = async(id:string)=>{

await fetch(
`${process.env.NEXT_PUBLIC_API_URL}/api/booking/reject/${id}`,
{method:"PATCH"}
);

fetchBookings();

};

const downloadClientInvoice = (id:string)=>{

window.open(
`${process.env.NEXT_PUBLIC_API_URL}/api/booking/invoice/${id}?type=client`,
"_blank"
);

};

const downloadUserInvoice = (id:string)=>{

window.open(
`${process.env.NEXT_PUBLIC_API_URL}/api/booking/invoice/${id}?type=user`,
"_blank"
);

};

/* PAGINATION */

const start = (page-1)*perPage;
const paginated = bookings.slice(start,start+perPage);
const totalPages = Math.ceil(bookings.length/perPage);

/* LOADING */

if(loading){

return(

<div className="min-h-screen flex items-center justify-center text-white bg-gradient-to-br from-[#020b0a] via-[#041f1e] to-[#020b0a]">

<div className="text-lg font-semibold animate-pulse">
Loading bookings...
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
Client Booking Panel
</h1>

<p className="text-sm text-gray-400 mt-1">
Manage all booking requests
</p>

</div>

</div>

{/* TABLE */}

<div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl shadow-xl overflow-hidden">

<div className="overflow-x-auto">

<table className="w-full text-sm table-fixed">

<thead className="bg-white/5 text-gray-300 text-xs uppercase tracking-wider">

<tr>

<th className="px-6 py-4 text-left w-[280px]">Car</th>
<th className="px-6 py-4 text-left w-[160px]">Customer</th>
<th className="px-6 py-4 text-left w-[220px]">Contact</th>
<th className="px-6 py-4 text-left w-[200px]">Dates</th>
<th className="px-6 py-4 text-left w-[120px]">Amount</th>
<th className="px-6 py-4 text-left w-[120px]">Status</th>
<th className="px-6 py-4 text-center w-[160px]">Actions</th>

</tr>

</thead>

<tbody>

{paginated.map((b,i)=>(

<tr
key={b._id}
className={`border-t border-white/10 hover:bg-white/5 transition ${
i%2===0 ? "bg-white/[0.02]" : ""
}`}
>

{/* CAR */}

<td className="px-6 py-5 align-top">

<div className="flex gap-3 max-w-[260px]">

<div className="text-lg mt-[2px]">🚗</div>

<div className="flex flex-col">

<span className="font-semibold text-white">
{b.name}
</span>

<span className="text-xs text-gray-400 mt-1 break-all font-mono">
Booking ID: {b._id}
</span>

</div>

</div>

</td>

{/* CUSTOMER */}

<td className="px-6 py-5 font-medium text-white">
{b.fullName}
</td>

{/* CONTACT */}

<td className="px-6 py-5 text-sm">

<div className="text-gray-300">{b.email}</div>

<div className="text-gray-500 text-xs mt-1">
{b.phone}
</div>

</td>

{/* DATES */}

<td className="px-6 py-5 text-sm text-gray-300">

<div>
{new Date(b.pickupDate).toLocaleDateString()}
</div>

<div className="text-gray-500 text-xs mt-1">
→ {new Date(b.dropDate).toLocaleDateString()}
</div>

</td>

{/* AMOUNT */}

<td className="px-6 py-5 font-semibold text-emerald-300 text-base">
₹{b.amount}
</td>

{/* STATUS */}

<td className="px-6 py-5">

<span
className={`px-3 py-1 text-xs rounded-full font-semibold capitalize ${
b.bookingStatus==="accepted"
?"bg-green-500/20 text-green-300"
:b.bookingStatus==="rejected"
?"bg-red-500/20 text-red-300"
:"bg-yellow-500/20 text-yellow-300"
}`}
>

{b.bookingStatus}

</span>

</td>

{/* ACTIONS */}

<td className="px-6 py-5">

<div className="flex items-center justify-center gap-3 bg-white/5 px-3 py-2 rounded-xl">

<Eye
size={18}
className="text-cyan-300 hover:scale-110 cursor-pointer"
onClick={()=>setSelected(b)}
/>

{b.bookingStatus==="pending" &&(

<Check
size={18}
className="text-emerald-300 hover:scale-110 cursor-pointer"
onClick={()=>acceptBooking(b._id)}
/>

)}

{b.bookingStatus==="pending" &&(

<X
size={18}
className="text-red-400 hover:scale-110 cursor-pointer"
onClick={()=>rejectBooking(b._id)}
/>

)}

{b.bookingStatus==="accepted" && b.clientInvoiceUrl &&(

<FileText
size={18}
className="text-cyan-300 hover:scale-110 cursor-pointer"
onClick={()=>downloadClientInvoice(b._id)}
/>

)}

{b.bookingStatus==="accepted" && b.invoiceUrl &&(

<Download
size={18}
className="text-emerald-300 hover:scale-110 cursor-pointer"
onClick={()=>downloadUserInvoice(b._id)}
/>

)}

</div>

</td>

</tr>

))}

</tbody>

</table>

</div>

</div>

{/* PAGINATION */}

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

{/* MODAL */}

{selected &&(

<div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">

<div className="bg-[#020b0a] border border-white/10 rounded-2xl p-7 w-[450px] shadow-2xl">

<h2 className="text-xl font-bold text-emerald-300 mb-5">
Booking Details
</h2>

<div className="space-y-2 text-sm">

<p><b>Car:</b> {selected.name}</p>
<p><b>Name:</b> {selected.fullName}</p>
<p><b>Email:</b> {selected.email}</p>
<p><b>Phone:</b> {selected.phone}</p>

<p>
<b>Dates:</b> {new Date(selected.pickupDate).toLocaleDateString()} → {new Date(selected.dropDate).toLocaleDateString()}
</p>

<p>
<b>Amount:</b> ₹{selected.amount}
</p>

<p className="text-xs text-gray-400">
Payment ID: {selected.paymentIntentId}
</p>

</div>

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