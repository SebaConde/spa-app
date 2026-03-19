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
  const [selectedFilter, setSelectedFilter] = useState("");
  const [allSalons, setAllSalons] = useState([]);
  const router = useRouter();

  const fetchData = async () => {
    try {
      setLoading(true);
      const response: any = await getAllSalonSpas();
      if (!response.success) {
        throw new Error(response.message);
      }
      setSalonSpa(response.data);
      setAllSalons(response.data);
    } catch (error) {
      toast.error("Failed to fetch salon spas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let filteredSalonsSpas = [...allSalons];
    if (selectedFilter === "price-low-to-high") {
      filteredSalonsSpas = filteredSalonsSpas.sort(
        (a: ISalon_Spa, b: ISalon_Spa) =>
          a.minimum_service_price - b.minimum_service_price,
      );
    }
    if (selectedFilter === "price-high-to-low") {
      filteredSalonsSpas = filteredSalonsSpas.sort(
        (a: ISalon_Spa, b: ISalon_Spa) =>
          b.minimum_service_price - a.minimum_service_price,
      );
    }

    if (selectedFilter === "with-offers") {
      filteredSalonsSpas = filteredSalonsSpas.filter((salonSpa: ISalon_Spa) =>
        salonSpa.offer_status === 'active'
      );
    }
    setSalonSpa(filteredSalonsSpas);
  }, [selectedFilter]);

  return (
    <div>
      <div className="flex justify-between">
        <PageTitle title="Schedule Appointmet" />
        <div>
        <h1 className="text-sm"> sort / filter</h1>
        <select
          value={selectedFilter}
          onChange={(e) => setSelectedFilter(e.target.value)}
          className="border border-gray-500 rounded p-2 text-sm"
        >
          <option value="">All</option>
          <option value="nearby">Nearby</option>
          <option value="price-low-to-high">Low to high</option>
          <option value="price-high-to-low">High to low</option>
          <option value="with-offers">With offers</option>
        </select>
      </div>
      </div>
      
      {loading && salonSpa.length === 0 && <Loader />}

      {!loading && salonSpa.length > 0 && (
        <div className="flex flex-col gap-7 mt-7">
          {salonSpa.map((salon: ISalon_Spa) => (
            <div
              key={salon.id}
              className="border border-gray-300 p-5 rounded cursor-pointer hover:border-gray-500"
              onClick={() =>
                router.push(`/user/schedule-appointment/${salon.id}`)
              }
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
              <div>
                <span className="text-xs font-semibold">
                  Active offer: {salon.offer_status==='active' ? "Active" : 'Inactive'}
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
