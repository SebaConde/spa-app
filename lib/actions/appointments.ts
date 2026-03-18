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
      .select("*, salons_spas(id,name)")
      .eq("user_id", userId).order('created_at', {ascending: false});
    if (error) throw new Error(error.message);
    return {
      success: true,
      data: data.map((appointment: any)=>({
        ...appointment,
        salon_spa_data: appointment.salons_spas
      })),
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const getAppointmentsByOwnerId = async (ownerId: number, filters:{
  status: string | null,
  salon_spa_id:number | null,
  date: string | null,
}) => {
  try {

    let qry = supabase
      .from("appointments")
      .select("*, salons_spas(id, name), user_profile(id, name)")
      .eq("owner_id", ownerId).order('created_at', {ascending: false});

    if(filters.status){
      qry = qry.eq('status', filters.status)
    }

    if (filters.salon_spa_id) {
      qry = qry.eq('salon_spa_id', filters.salon_spa_id)
    }

    if (filters.date) {
      qry = qry.eq('date', filters.date)
    }

    const { data, error } = await qry;
    if (error) throw new Error(error.message);
    return {
      success: true,
      data: data.map((appointment:any)=>({
        ...appointment,
        salon_spa_data: appointment.salons_spas,
        user_data: appointment.user_profile,
      })),
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

export const updateAppointmentStatus = async (id:number, status:string)=>{
  try {
    const{data, error} = await supabase.from('appointments').update({status}).eq('id', id);
    if (error) {
      throw new Error(error.message);
    }else{
      return{
        success:true,
        data,
        message: 'Estado de la reserva actualizado'
      }
    };
  } catch (error:any) {
    return{
      success:false,
      message: error.message,
    }
  }
}