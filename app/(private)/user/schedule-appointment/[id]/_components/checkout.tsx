/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Button } from "@/components/ui/button";
import { bookNewAppointment, getSaloonAvailability } from "@/lib/actions/appointments";
import { ISalon_Spa } from "@/src/interfaces";
import userGlobalStore, { IUserGlobalStore } from "@/src/store/users-global-store";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import {toast} from 'sonner';

import "react-datepicker/dist/react-datepicker.css";
import { useRouter } from "next/navigation";

function Checkout({ salonSpa }: { salonSpa: ISalon_Spa }) {
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState("09:00");
  const [loading, setLoading] = useState(false);
  const {user} = userGlobalStore() as IUserGlobalStore;
  const router = useRouter();
  const [availableSlots, setAvailableSlots] = useState(0);
  const [availabilityError, setAvailabilityError] = useState('');

  const timeOptions = [];
  //Slot es turno.
  const sampleDate = dayjs(date).format("YYYY-MM-DD");
  let currentSlot = dayjs(`${sampleDate} ${salonSpa.start_time}`)
  const endTime = dayjs(`${sampleDate} ${salonSpa.end_time}`)

  while(dayjs(currentSlot).isBefore(endTime)){
    timeOptions.push({
      label: dayjs(currentSlot).format('HH:mm'),
      value: dayjs(currentSlot).format('HH:mm'),
    });
    currentSlot = dayjs(currentSlot).add(salonSpa.slot_duration, 'minute')
  }

  const bookAppointmentHandler = async ()=>{
    try {
      setLoading(true);
      const payload = {
        user_id : user?.id,
        salon_spa_id: salonSpa.id,
        owner_id: salonSpa.owner_id,
        date: dayjs(date).format('YYYY-MM-DD'),
        time: time,
        status: 'booked'
      };
      const response = await bookNewAppointment(payload);
      if (response.success) {
        toast.success('Turno reservado con exito');
        router.push('/user/appointments')
      }else{
        throw new Error(response.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
    finally{
      setLoading(false);
    }
  }

  const fetchAvailableSlots = async ()=>{
    try {
      const response : any = await getSaloonAvailability({date: dayjs(date).format('YYYY-MM-DD'), salonSpaData: salonSpa, time: time})
      if(response.success){
        setAvailableSlots(response.data?.availableSlots);
      }else{
        setAvailableSlots(0);
        setAvailabilityError(response.message);
      }
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  useEffect(()=>{
    if(date && time){
      setAvailableSlots(0);
      setAvailabilityError('');
      fetchAvailableSlots();
    }
  }, [date,time]);

  return (
    <div className="border border-gray-500 flex flex-col gap-5 p-5">
      <div className="flex flex-col gap-1">
        <span className="text-sm">Select Date</span>
        <DatePicker
          selected={date}
          onChange={(value: Date | null) => setDate(value as Date)}
          className="border border-gray-700 p-2"
          minDate={new Date()}
          filterDate={(date) => {
            const day = dayjs(date).format("dddd").toLowerCase();
            return salonSpa.working_days.includes(day);
          }}
        />
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-sm">Select time</span>
        <select
          name=""
          id=""
          className="border border-gray-700 p-2"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        >
          {timeOptions.map((time) => (
            <option key={time.value} value={time.value}>
              {time.label}
            </option>
          ))}
        </select>
      </div>

      {availabilityError && (
        <span className="text-red-700! text-sm">{availabilityError}</span>
      )}

      {availableSlots>0 &&(
        <span className="text-green-700! text-sm">{availableSlots} turnos disponibles</span>
      )}
      <div className="flex justify-end">
        <Button variant="outline" disabled={loading}>Cancel</Button>
        <Button className="ml-3" disabled={loading || availableSlots===0} onClick={bookAppointmentHandler}>Book Appointment</Button>
      </div>
    </div>
  );
}

export default Checkout;
