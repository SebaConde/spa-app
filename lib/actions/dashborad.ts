/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { supabase } from "@/src/config/supabase-config";

export const getDashboard = async (id: number, type: "user" | "admin") => {
  try {
    let qry = supabase.from("appointments").select("*");

    if (type === "user") {
      qry = qry.eq("user_id", id);
    } else {
      qry = qry.eq("owner_id", id);
    }

    const { data, error } = await qry;
    if (error) throw new Error(error.message);

    const responseData = {
      totalAppointments: data.length,
      cancelledAppointments: data.filter(
        (appointment) => appointment.status === "cancelled",
      ).length,
      completedAppointments: data.filter(
        (appointments) => appointments.status === "completed",
      ).length,
      upcomingAppointments: data.filter(
        (appointments) => appointments.status === "booked",
      ).length,
    };
    return {
      success: true,
      data: responseData,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};
