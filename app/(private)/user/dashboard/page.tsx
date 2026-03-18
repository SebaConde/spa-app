/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import DashboardCard from "@/components/ui/dashboard-card";
import Loader from "@/components/ui/loader";
import PageTitle from "@/components/ui/page-title";
import { getDashboard } from "@/lib/actions/dashborad";
import userGlobalStore, { IUserGlobalStore } from "@/src/store/users-global-store";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

export default function AdminDashboard() {
  const initialData = {
    totalAppointments: 0,
    cancelledAppointments: 0,
    completedAppointments: 0,
    upcomingAppointments: 0,
  };
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const {user} = userGlobalStore() as IUserGlobalStore


  const fetchData = async () => {
    try {
      setLoading(true);
      const response: any = await getDashboard(user!.id, "user");
      if (response.success) {
        setData(response.data)
      }else{
        throw new Error (response.message)
      }

    } catch (error: any) {
      toast.error(error.message);
      setData(initialData)
    }finally{
      setLoading(false);
    }
  };

  useEffect(()=>{
    if (user) {
    fetchData()  
    }
  },[user]);


  return <div><PageTitle title="dashboard"/>
  {loading && <Loader />}
  
  {!loading && (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-7">
      <DashboardCard title="Total appointments" value={data.totalAppointments} caption="Total appointments"/>
      <DashboardCard title="Cancelled appointments" value={data.cancelledAppointments} caption="Cancelled appointments"/>
      <DashboardCard title="Completed appointments" value={data.completedAppointments} caption="Completed appointments"/>
      <DashboardCard title="Upcoming appointments" value={data.upcomingAppointments} caption="Upcoming appointments"/>
    </div>
  )}
  </div>;
}
