/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { supabase } from "@/src/config/supabase-config";
import { flightRouterStateSchema } from "next/dist/server/app-render/types";

export const createNewSalonSpa = async (payload: any) => {
  try {
    const { data, error } = await supabase.from("salons_spas").insert(payload);
    if (error) throw error;
    return {
      success: true,
      message: "Salon agregado con éxito",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const getSalonsByOwner = async (owner_id: number) => {
  try {
    const {data, error} = await supabase.from('salons_spas').select("*").eq('owner_id', owner_id);
    if(error) throw new Error('No se pudo encontrar ningún salón.');
    return{
        success: true,
        data: data,
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const getSalonSpaById = async (salon_id: string) => {
    try {
        const {data, error} = await supabase.from('salons_spas').select('*').eq('id', salon_id);
        if(error || data.length===0) throw new Error('No se pudo encontrar ningún salón con ese id.')
        return{
            success:true,
            data: data[0]
        }
    } catch (error: any) {
        return{
            success: false,
            message: error.message
        }
    }
};

export const editSalonSpaById = async ({id, payload} : {id: number,payload: any }) => {
try {
    const {data, error} = await supabase.from('salon_spas').update(payload).eq('id', id);
     if(error) throw new Error('No se pudo actualizar el salón.');
     return{
        success: true,
        message: 'Salon actualizado correctamente.'
     }
} catch (error:any) {
    return{
        success: false,
        message: error.message
    }
}
};

export const deleteSalonSpaById = async (salon_id: string) => {
    try {
        const {error} = await supabase.from('salons_spas').delete().eq('id',salon_id);
         if(error) throw new Error('No se pudo eliminar el salón.');
         return{
            success: true,
            message: 'Salón eliminado con éxito'
         }
    } catch (error: any) {
        return{
            success: false,
            message: error.message
        }
    }
};
