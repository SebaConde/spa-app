import PageTitle from "@/components/ui/page-title";
import React from "react";
import SalonSpaForms from "../../_components/salon-spa-form";
import { getSalonSpaById } from "@/lib/actions/admin";
import ErrorMessage from "@/components/ui/error-message";

interface Props {
  params: Promise<{ id: number }>;
}

async function EditSalonSpa({ params }: Props) {
  const { id } = await params;
  const response = await getSalonSpaById(id);
  if (!response.success) {
    <ErrorMessage error="No se encontr ningun salon" />;
  }

  return (
    <div>
      <PageTitle title="Edit Salons & Spas" />
      <SalonSpaForms initialValues={response.data} formType="edit" />
    </div>
  );
}

export default EditSalonSpa;
