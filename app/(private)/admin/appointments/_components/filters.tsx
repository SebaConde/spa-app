import { ISalon_Spa } from "@/src/interfaces";
import React from "react";
import { Input } from "@/components/ui/input";
import { appointmentSatuses } from "@/src/constants";
import { Button } from "@/components/ui/button";

function Filters({
  salonSpas,
  selectedSalon,
  setSelectedSalon,
  selectedStatus,
  setSelectedStatus,
  selectedDate,
  setSelectedDate,
  onFilter, onClearFilters
}: {
  salonSpas: ISalon_Spa[];
  selectedSalon: number | null;
  setSelectedSalon: React.Dispatch<React.SetStateAction<number | null>>;
  selectedStatus: string | null;
  setSelectedStatus: React.Dispatch<React.SetStateAction<string | null>>;
  selectedDate: string | null;
  setSelectedDate: React.Dispatch<React.SetStateAction<string | null>>;
  onFilter: ()=> void,
  onClearFilters: ()=> void,
}) {
  return (
    <div className="flex flex-wrap gap-5 items-end my-5">

      <div>
        <h1 className="text-sm">Salon</h1>
        <select
          value={selectedSalon || ""}
          onChange={(e) => setSelectedSalon(Number(e.target.value))}
          className="border border-gray-400 rounded-md p-1 text-sm w-full h-9"
        >
          <option value="">All</option>
          {salonSpas.map((salon) => (
            <option key={salon.id} value={salon.id} className="text-sm">
              {salon.name}
            </option>
          ))}
        </select>
      </div>
      
      <div>
        <h1 className="text-sm">Date</h1>
        <Input
          type="date"
          value={selectedDate || ""}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border border-gray-400 rounded-md p-1 text-sm w-full h-9"
        />
      </div>
      
      <div>
        <h1 className="text-sm">Status</h1>
        <select
          value={selectedStatus || ""}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="border border-gray-400 rounded-md p-1 text-sm w-full h-9"
        >
          <option value="">All</option>
          {appointmentSatuses.map((status) => (
            <option key={status.value} value={status.value} className="text-sm">
              {status.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-5">
        <Button variant='outline' onClick={onClearFilters}>Clear filters</Button>
        <Button variant='outline' onClick={onFilter}>Apply filters</Button>
      </div>
    </div>
  );
}

export default Filters;
