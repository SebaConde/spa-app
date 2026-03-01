/* eslint-disable @typescript-eslint/no-explicit-any */
import ErrorMessage from "@/components/ui/error-message";
import PageTitle from "@/components/ui/page-title";
import { getSalonSpaById } from "@/lib/actions/admin";
import { ISalon_Spa } from "@/src/interfaces";
import React from "react";
import Checkout from "./_components/checkout";

interface Props {
  params: Promise<{ id: string }>;
}

async function BookAppointmentPage({ params }: Props) {
  const { id } = await params;
  const response = await getSalonSpaById(Number(id));
  const salonData: ISalon_Spa = response.data;

  if (!response.success) {
    return <ErrorMessage error={response.message} />;
  }

  const renderProperty = (label: string, value: any) => {
    return (
      <div className="flex justify-between">
        <h1 className="text-gray-500 text-sm">{label}</h1>
        <h1 className="text-sm font-semibold">{value}</h1>
      </div>
    );
  };

  return (
    <div>
      <PageTitle title="Book appointment page" />
      <div className="mt-7 grid grid-cols-3 gap-10">
        <div className="col-span-2 p-5 border border-gray-400 flex flex-col gap-1">
          {renderProperty("Name", salonData.name)}
          {renderProperty("Address", salonData.address)}
          {renderProperty("City", salonData.city)}
          {renderProperty("State", salonData.state)}
          {renderProperty("Zip", salonData.zip)}
          {renderProperty("Minimum service price", salonData.minimum_service_price)}
          {renderProperty("Maximum service price", salonData.maximum_service_price)}
          {renderProperty("Offer status", salonData.offer_status)}
          {renderProperty("Start time", salonData.start_time)}
          {renderProperty("End time", salonData.end_time)}
          {renderProperty("Slot duration", salonData.slot_duration)}

          <hr className="border border-gray-300 my-5" />
          <p className="text-gray-700 text-sm">{salonData.description}</p>
        </div>
        <div className="cols-span-1">
          <Checkout salonSpa={salonData}/>
        </div>
      </div>
    </div>
  );
}

export default BookAppointmentPage;
