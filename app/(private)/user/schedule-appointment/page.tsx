/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Loader from "@/components/ui/loader";
import PageTitle from "@/components/ui/page-title";
import { getAllSalonSpas } from "@/lib/actions/admin";
import { ISalon_Spa } from "@/src/interfaces";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

function ScheduleApointment() {
  const [salonSpa, setSalonSpa] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fetchData = async () => {
    try {
      setLoading(true);
      const response: any = await getAllSalonSpas();
      if (!response.success) {
        throw new Error(response.message);
      }
      setSalonSpa(response.data);
    } catch (error) {
      toast.error("Failed to fetch salon spas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <div className="flex justify-between">
        <PageTitle title="Schedule Appointmet" />
      </div>

      {loading && salonSpa.length === 0 && <Loader />}

      {!loading && salonSpa.length > 0 && (
        <div className="flex flex-col gap-7 mt-7">
          {salonSpa.map((salon: ISalon_Spa) => (
            <div
              key={salon.id}
              className="border border-gray-300 p-5 rounded cursor-pointer hover:border-gray-500"
              onClick={()=> router.push(`/user/schedule-appointment/${salon.id}`)}
            >
              <h1 className="text-sm font-bold! text-gray-800">{salon.name}</h1>
              <p className="text-xs text-gray-600">
                {salon.address}, {salon.city}, {salon.state}
              </p>
              <div className="mt-5">
                <span className="text-xs font-semibold">
                  Minimun Price: $ {salon.minimum_service_price}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ScheduleApointment;
