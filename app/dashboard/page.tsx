"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
BarChart,
Bar,
XAxis,
YAxis,
Tooltip,
ResponsiveContainer,
LineChart,
Line
} from "recharts";

import {
Car,
CheckCircle,
Clock,
IndianRupee,
Star,
MessageSquare
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL;

interface CarItem {
_id: string;
name: string;
brand: string;
price: number;
status: string;
rating?: number;
reviews?: number;
}

export default function DashboardPage(){

const [cars,setCars] = useState<CarItem[]>([]);
const [stats,setStats] = useState({
total:0,
approved:0,
pending:0,
revenue:0,
avgRating:0,
reviews:0,
bookings:0
});

const token =
typeof window !== "undefined"
? localStorage.getItem("token")
: null;

useEffect(()=>{

if(!token) return;

Promise.all([

axios.get(`${API}/api/inventory/my`,{
headers:{ Authorization:`Bearer ${token}` }
}),

axios.get(`${API}/api/booking/all`)

])
.then(([inventoryRes,bookingRes])=>{

const carsData = inventoryRes.data;
const bookingsData = bookingRes.data;

/* INVENTORY ANALYTICS */

const approvedCars =
carsData.filter((c:CarItem)=>c.status==="approved");

const pendingCars =
carsData.filter((c:CarItem)=>c.status==="pending");

/* BOOKINGS ANALYTICS */

const acceptedBookings =
// eslint-disable-next-line @typescript-eslint/no-explicit-any
bookingsData.filter((b:any)=>b.bookingStatus==="accepted");

/* REVENUE */

const revenue =
acceptedBookings.reduce(
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(sum:number,b:any)=>sum+b.amount,
0
);

/* RATINGS */

const avgRating =
approvedCars.reduce(
(sum:number,c:CarItem)=>sum+(c.rating||0),
0
)/(approvedCars.length||1);

const totalReviews =
approvedCars.reduce(
(sum:number,c:CarItem)=>sum+(c.reviews||0),
0
);

setCars(carsData);

setStats({

total:carsData.length,
approved:approvedCars.length,
pending:pendingCars.length,
revenue,
avgRating:Number(avgRating.toFixed(1)),
reviews:totalReviews,
bookings:acceptedBookings.length

});

});

},[token]);

/* GRAPH DATA */

const bookingGraph = [
{month:"Jan",bookings:12},
{month:"Feb",bookings:19},
{month:"Mar",bookings:10},
{month:"Apr",bookings:25},
{month:"May",bookings:30},
{month:"Jun",bookings:20}
];

const revenueGraph = [
{month:"Jan",revenue:20000},
{month:"Feb",revenue:30000},
{month:"Mar",revenue:15000},
{month:"Apr",revenue:45000},
{month:"May",revenue:50000},
{month:"Jun",revenue:35000}
];

/* TOP CAR */

const topCar =
cars
.filter(c=>c.status==="approved")
// eslint-disable-next-line @typescript-eslint/no-explicit-any
.sort((a:any,b:any)=>(b.rating||0)-(a.rating||0))[0];

return(

<div className="min-h-screen bg-gradient-to-br from-[#020b0a] via-[#041f1e] to-[#020b0a] text-white p-6">

<div className="max-w-7xl mx-auto space-y-8">

{/* HEADER */}

<div>

<h1 className="text-3xl font-bold text-emerald-300">
Dashboard
</h1>

<p className="text-gray-400 text-sm">
Business analytics overview
</p>

</div>

{/* STATS */}

<div className="grid md:grid-cols-6 gap-6">

<StatCard icon={<Car size={20}/>} title="Total Cars" value={stats.total}/>
<StatCard icon={<CheckCircle size={20}/>} title="Approved Cars" value={stats.approved}/>
<StatCard icon={<Clock size={20}/>} title="Pending Cars" value={stats.pending}/>
<StatCard icon={<IndianRupee size={20}/>} title="Revenue" value={`₹${stats.revenue}`}/>
<StatCard icon={<Star size={20}/>} title="Avg Rating" value={stats.avgRating}/>
<StatCard icon={<MessageSquare size={20}/>} title="Reviews" value={stats.reviews}/>

</div>

{/* GRAPHS */}

<div className="grid md:grid-cols-2 gap-6">

<div className="bg-white/10 border border-white/10 rounded-3xl p-6">

<h3 className="text-sm text-gray-300 mb-4">
Bookings Analytics
</h3>

<ResponsiveContainer width="100%" height={260}>

<BarChart data={bookingGraph}>
<XAxis dataKey="month" stroke="#9ca3af"/>
<YAxis stroke="#9ca3af"/>
<Tooltip/>
<Bar dataKey="bookings" fill="#10b981"/>
</BarChart>

</ResponsiveContainer>

</div>

<div className="bg-white/10 border border-white/10 rounded-3xl p-6">

<h3 className="text-sm text-gray-300 mb-4">
Revenue Analytics
</h3>

<ResponsiveContainer width="100%" height={260}>

<LineChart data={revenueGraph}>
<XAxis dataKey="month" stroke="#9ca3af"/>
<YAxis stroke="#9ca3af"/>
<Tooltip/>
<Line
type="monotone"
dataKey="revenue"
stroke="#06b6d4"
strokeWidth={3}
/>
</LineChart>

</ResponsiveContainer>

</div>

</div>

{/* TOP CAR */}

{topCar &&(

<div className="bg-white/10 border border-white/10 rounded-3xl p-6">

<h3 className="text-lg font-semibold text-emerald-300 mb-4">
Top Quality Car
</h3>

<div className="flex justify-between items-center">

<div>
<p className="font-semibold">{topCar.name}</p>
<p className="text-xs text-gray-400">{topCar.brand}</p>
</div>

<div className="text-right">
<p className="text-yellow-400">⭐ {topCar.rating||0}</p>
<p className="text-xs text-gray-400">
{topCar.reviews||0} reviews
</p>
</div>

</div>

</div>

)}

{/* LATEST INVENTORY */}

<div className="bg-white/10 border border-white/10 rounded-3xl p-6">

<h3 className="text-lg font-semibold text-emerald-300 mb-4">
Latest Inventory
</h3>

<div className="space-y-2">

{cars.slice(0,5).map((car)=>{

const statusColor =
car.status==="approved"
?"text-green-400"
:"text-yellow-400";

return(

<div
key={car._id}
className="flex justify-between items-center bg-white/5 rounded-xl px-4 py-3 hover:bg-white/10 transition"
>

<div>

<p className="font-semibold">
{car.name}
</p>

<p className="text-xs text-gray-400">
{car.brand}
</p>

</div>

<div className="flex items-center gap-6">

<span className="text-emerald-300 font-semibold">
₹{car.price}
</span>

<span className={`text-xs ${statusColor}`}>
{car.status} </span>

</div>

</div>

);

})}

</div>

</div>

</div>

</div>

);

}

function StatCard({
icon,
title,
value
}:{
icon:React.ReactNode;
title:string;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
value:any;
}){

return(

<div className="bg-white/10 border border-white/10 rounded-3xl p-6 flex items-center justify-between hover:bg-white/15 transition">

<div>

<p className="text-xs text-gray-400 mb-1">
{title}
</p>

<p className="text-2xl font-bold text-emerald-300">
{value}
</p>

</div>

<div className="text-emerald-400">
{icon}
</div>

</div>

);

}
