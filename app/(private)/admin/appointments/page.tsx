/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import ErrorMessage from "@/components/ui/error-message";
import Loader from "@/components/ui/loader";
import PageTitle from "@/components/ui/page-title";
import {
  getAppointmentsByOwnerId,
  updateAppointmentStatus,
} from "@/lib/actions/appointments";
import { IAppointment, ISalon_Spa } from "@/src/interfaces";
import userGlobalStore, {
  IUserGlobalStore,
} from "@/src/store/users-global-store";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import dayjs from "dayjs";
import { appointmentSatuses } from "@/src/constants";
import Filters from "./_components/filters";
import { getSalonsByOwner } from "@/lib/actions/admin";

const AppointmentsLista = () => {
  const { user } = userGlobalStore() as IUserGlobalStore;
  const [appointments, setAppointments] = useState<IAppointment[]>([]);
  const [salonSpas, setSalonSpas] = useState<ISalon_Spa[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSalon, setSelectedSalon] = useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [filtersCleared, setFiltersCleared] = useState(false);

  const fetchData = async () => {
    if (!user) return; //si algun dia es null no se rompe todo el codigo.
    try {
      setLoading(true);
      const response: any = await getAppointmentsByOwnerId(user.id, {
        salon_spa_id: selectedSalon,
        status: selectedStatus,
        date: selectedDate,
      });
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

  const fetchSalonSpa = async () => {
    try {
      const response = await getSalonsByOwner(user!.id);
      if (!response.success) throw new Error(response.message);
      setSalonSpas(response.data!);
    } catch (error) {
      toast.error("Error fetching salon spa data");
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
      fetchSalonSpa();
    }
  }, [user]);

  useEffect(() => {
    if (filtersCleared) {
      fetchData();
      setFiltersCleared(false);
    }
  }, [filtersCleared]);

  const updateStatusHandler = async (id: number, status: string) => {
    try {
      setLoading(true);
      const response = await updateAppointmentStatus(id, status);
      if (!response.success) throw new Error(response.message);
      toast.success(response.message);
      const updateAppointments: any = appointments.map((appointment) => {
        if (appointment.id === id) {
          return { ...appointment, status };
        }
        return appointment;
      });
      setAppointments(updateAppointments);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  const columns = [
    "Id",
    "Salon/Spa Name",
    "Customer Namer",
    "Date",
    "Time",
    "Booked on",
    "Status",
  ];

  return (
    <div>
      <PageTitle title="Appointments" />

      {loading && <Loader />}

      {!loading && (
        <Filters
          salonSpas={salonSpas}
          selectedSalon={selectedSalon}
          setSelectedSalon={setSelectedSalon}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          onFilter={fetchData}
          onClearFilters={() => {
            setSelectedSalon(null);
            setSelectedStatus(null);
            setSelectedDate(null);
            setFiltersCleared(true);
          }}
        />
      )}

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
                  <TableCell data-label="SalonSpaData">
                    {appointment.salon_spa_data?.name}
                  </TableCell>
                  <TableCell data-label="Customer Name">
                    {appointment.user_data?.name}
                  </TableCell>
                  <TableCell data-label="Date">
                    {dayjs(appointment.date).format("DD-MM-YYYY")}
                  </TableCell>
                  <TableCell data-label="Time">{appointment.time}</TableCell>
                  <TableCell data-label="Booked on">
                    {dayjs(appointment.created_at).format("DD-MM-YYYY hh:mm A")}
                  </TableCell>
                  <TableCell data-label="Status">
                    <select
                      value={appointment.status}
                      className={`border border-gray-400 rounded-md p-1 ${appointment.status === "cancelled" ? "opacity-50 pointer-events-none" : ""}`}
                      onChange={(e) =>
                        updateStatusHandler(appointment.id, e.target.value)
                      }
                      disabled={
                        dayjs(appointment.date).isBefore(dayjs(), "day") ||
                        appointment.status === "cancelled"
                      }
                    >
                      {appointmentSatuses.map((status) => (
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
};

export default AppointmentsLista;
