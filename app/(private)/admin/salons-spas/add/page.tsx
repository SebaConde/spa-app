import PageTitle from "@/components/ui/page-title";
import React from "react";
import SalonSpaForms from "../_components/salon-spa-form";

function AddSalonSpa() {
  return (
    <div>
      <PageTitle title="Agregar Salons & Spas" />
      <SalonSpaForms formType='add' />
    </div>
  );
}

export default AddSalonSpa;
