/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import ErrorMessage from "@/components/ui/error-message";
import Loader from "@/components/ui/loader";
import PageTitle from "@/components/ui/page-title";
import { getAppointmentsByUserId, updateAppointmentStatus } from "@/lib/actions/appointments";
import { IAppointment } from "@/src/interfaces";
import userGlobalStore, {
  IUserGlobalStore,
} from "@/src/store/users-global-store";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import router from "next/router";
import dayjs from "dayjs";
import { appointmentSatuses } from "@/src/constants";



function UserAppointmentsList() {
  const [appointments, setAppointments] = useState<IAppointment[]>([]);
  const [loading, setLoading] = useState(false);

  const { user } = userGlobalStore() as IUserGlobalStore;

  const fetchData = async () => {
    if (!user) return; //si algun dia es null no se rompe todo el codigo.
    try {
      setLoading(true);
      const response: any = await getAppointmentsByUserId(user.id);
      if (response.success) {
        setAppointments(response.data);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Error fetching appointments");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const updateStatusHandler  = async(id:number, status: string)=>{
    try {
      setLoading(true);
      const response = await updateAppointmentStatus(id, status);
      if (!response.success) throw new Error (response.message);
      toast.success(response.message);
      const updateAppointments:any = appointments.map((appointment)=>{
        if (appointment.id === id) {
          return{...appointment, status};
        }return appointment;
      });
      setAppointments(updateAppointments);

    } catch (error:any) {
      toast.error(error.message)
    }finally{
      setLoading(false);
    }
  }
  const columns = ["Id", "Salon/Spa Name", "Date", "Time", "Status"];

  return (
    <div>
      <PageTitle title="User appointments list" />
      {loading && <Loader />}
      {!loading && appointments.length === 0 && (
        <ErrorMessage error="No se encontraron reservas." />
      )}

      {!loading && appointments.length > 0 && (
        <div>
          <Table className="mt-2">
            <TableHeader>
              <TableRow className="bg-gray-200">
                {columns.map((column) => (
                  <TableHead key={column} className="font-bold">
                    {column}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((appointment: IAppointment) => (
                <TableRow key={appointment.id} className="p-2">
                  <TableCell data-label="Id">{appointment.id}</TableCell>
                  <TableCell data-label="Id">
                    {appointment.salon_spa_data?.name}
                  </TableCell>
                  <TableCell data-label="Id">{appointment.date}</TableCell>
                  <TableCell data-label="Id">{appointment.time}</TableCell>
                  <TableCell data-label="Id">
                    <select className="border border-gray-400 rounded-md p-1" 
                    onChange={(e)=>updateStatusHandler(appointment.id, e.target.value)}
                    disabled={dayjs(appointment.date).isBefore(dayjs(), 'day')}
                    >
                      {appointmentSatuses.map((status)=>(
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

export default UserAppointmentsList;
