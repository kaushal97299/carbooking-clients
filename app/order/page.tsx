"use client";

import { useEffect, useState } from "react";
import { Check, X, Download, FileText, Eye } from "lucide-react";

export default function ClientBookingPage(){

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const [bookings,setBookings] = useState<any[]>([]);
const [loading,setLoading] = useState(true);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

/* PAGINATION LOGIC */

const start = (page-1)*perPage;
const paginated = bookings.slice(start,start+perPage);
const totalPages = Math.ceil(bookings.length/perPage);

if(loading){

return(

<div className="min-h-screen flex items-center justify-center text-white bg-gradient-to-br from-[#020b0a] via-[#041f1e] to-[#020b0a]">
Loading bookings...
</div>

);

}

return(

<div className="min-h-screen bg-gradient-to-br from-[#020b0a] via-[#041f1e] to-[#020b0a] text-white px-6 py-8">

<div className="max-w-7xl mx-auto">

{/* HEADER */}

<div className="flex justify-between items-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl px-6 py-5 shadow-xl mb-8">

<div>

<h1 className="text-3xl font-bold text-emerald-300">
Client Booking Panel
</h1>

<p className="text-sm text-gray-400">
Manage all booking requests
</p>

</div>

</div>


{/* TABLE */}

<div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl shadow-xl overflow-hidden">

<table className="w-full text-sm">

<thead className="bg-white/5 text-gray-300">

<tr>

<th className="p-4 text-left">Car</th>
<th>User</th>
<th>Contact</th>
<th>Dates</th>
<th>Amount</th>
<th>Status</th>
<th>Actions</th>

</tr>

</thead>

<tbody>

{paginated.map((b)=>(

<tr
key={b._id}
className="border-t border-white/10 hover:bg-white/5 transition"
>

<td className="p-4 font-semibold">
🚗 {b.name}
</td>

<td>
{b.fullName}
</td>

<td className="text-xs text-gray-400">

<p>{b.email}</p>
<p>{b.phone}</p>

</td>

<td className="text-xs">
{b.pickupDate} → {b.dropDate}
</td>

<td className="text-emerald-300 font-semibold">
₹{b.amount}
</td>

<td>

<span
className={`text-xs px-2 py-1 rounded ${
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

<td>

<div className="flex gap-3 items-center">

{/* VIEW */}

<Eye
size={18}
className="text-cyan-300 cursor-pointer hover:scale-110"
onClick={()=>setSelected(b)}
/>

{/* ACCEPT */}

{b.bookingStatus==="pending" &&(

<Check
size={18}
className="text-emerald-300 cursor-pointer hover:scale-110"
onClick={()=>acceptBooking(b._id)}
/>

)}

{/* REJECT */}

{b.bookingStatus==="pending" &&(

<X
size={18}
className="text-red-400 cursor-pointer hover:scale-110"
onClick={()=>rejectBooking(b._id)}
/>

)}

{/* CLIENT INVOICE */}

{b.bookingStatus==="accepted" && b.clientInvoiceUrl &&(

<FileText
size={18}
className="text-cyan-300 cursor-pointer hover:scale-110"
onClick={()=>downloadClientInvoice(b._id)}
/>

)}

{/* USER INVOICE */}

{b.bookingStatus==="accepted" && b.invoiceUrl &&(

<Download
size={18}
className="text-emerald-300 cursor-pointer hover:scale-110"
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


{/* PAGINATION */}

<div className="flex justify-center gap-2 mt-6">

{Array.from({length:totalPages}).map((_,i)=>(

<button
key={i}
onClick={()=>setPage(i+1)}
className={`px-4 py-1 rounded ${
page===i+1
?"bg-emerald-500 text-black"
:"bg-white/5 text-gray-300"
}`}
>

{i+1}

</button>

))}

</div>


{/* VIEW MODAL */}

{selected &&(

<div className="fixed inset-0 bg-black/60 flex items-center justify-center">

<div className="bg-[#020b0a] border border-white/10 rounded-2xl p-6 w-[450px]">

<h2 className="text-xl font-bold text-emerald-300 mb-4">
Booking Details
</h2>

<p><b>Car:</b> {selected.name}</p>
<p><b>Name:</b> {selected.fullName}</p>
<p><b>Email:</b> {selected.email}</p>
<p><b>Phone:</b> {selected.phone}</p>

<p className="mt-2">
<b>Dates:</b> {selected.pickupDate} → {selected.dropDate}
</p>

<p className="mt-2">
<b>Amount:</b> ₹{selected.amount}
</p>

<p className="text-xs text-gray-400 mt-2">
Payment ID: {selected.paymentIntentId}
</p>

<button
onClick={()=>setSelected(null)}
className="mt-5 bg-emerald-500 text-black px-4 py-2 rounded"
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