/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { supabase } from "@/src/config/supabase-config";
import { ISalon_Spa } from "@/src/interfaces";

export const bookNewAppointment = async (data: any) => {
  try {
    const { data: appointment, error } = await supabase
      .from("appointments")
      .insert([data]);
    if (error) throw new Error(error.message);
    return {
      success: true,
      data: appointment,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const getAppointmentsByUserId = async (userId: number) => {
  try {
    const { data, error } = await supabase
      .from("appointments")
      .select("*")
      .eq("user_id", userId);
    if (error) throw new Error(error.message);
    return {
      success: true,
      data: data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const getAppointmentsByOwnerId = async (ownerId: number) => {
  try {
    const { data, error } = await supabase
      .from("appointments")
      .select("*")
      .eq("owner_id", ownerId);
    if (error) throw new Error(error.message);
    return {
      success: true,
      data: data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const getSaloonAvailability = async ({
  date,
  time,
  salonSpaData,
}: {
  date: string;
  time: string;
  salonSpaData: ISalon_Spa;
}) => {
  try {
    const { data: bookedAppointments, error } = await supabase
      .from("appointments")
      .select("*")
      .eq("salon_spa_id", salonSpaData.id)
      .eq("date", date)
      .eq("time", time);
    if (error) {
      throw new Error(error.message);
    }
    if (salonSpaData.max_bookings_per_slot < bookNewAppointment.length) {
      return {
        success: false,
        message: "El turno esta completo.",
      };
    }

    return {
      success: true,
      data: {
        availableSlots:
          salonSpaData.max_bookings_per_slot - bookedAppointments.length,
      },
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};
