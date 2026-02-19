/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Button } from "@/components/ui/button";
import PageTitle from "@/components/ui/page-title";
import { deleteSalonSpaById, getSalonsByOwner } from "@/lib/actions/admin";
import usersGlobalStore, {
  IUserGlobalStore,
} from "@/src/store/users-global-store";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ISalon_Spa } from "@/src/interfaces";
import { useRouter } from "next/navigation";
import { Edit2, Trash2 } from "lucide-react";
import dayjs from "dayjs";
import Loader from "@/components/ui/loader";
import ErrorMessage from "@/components/ui/error-message";

function SalonsSpasList() {
  const { user } = usersGlobalStore() as IUserGlobalStore;
  const [salonsSpa, setSalonsSpa] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  const fetchData = async () => {
    try {
      setLoading(true);
      if (!user?.id) {
        toast.error("No se pudo obtener el usuario");
        return;
      }
      const response: any = await getSalonsByOwner(user?.id);
      if (!response.success) throw new Error(response.message);
      console.log(response.data);
      setSalonsSpa(response.data);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteSalonHandler = async (id: number)=>{
    try {
      setLoading(true);
      const response = await deleteSalonSpaById(id);
      if(!response.success)throw new Error('No se pudo borrar el salon')
        toast.success(response.message);
      setSalonsSpa((prev)=> prev.filter((item)=> item.id !== id))
    } catch (error:any) {
      toast.error(error.message);
    }
  }

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const columns = [
    "Id",
    "Name",
    "City",
    "State",
    "Zip",
    "Min service Price",
    "Max service Price",
    "Offer status",
    "Created at",
    "Actions",
  ];
  return (
    <div>
      <div className="flex justify-between items-center">
        <PageTitle title="Salons & Spas" />
        <Button>
          <Link href="/admin/salons-spas/add">Add Salon</Link>
        </Button>
      </div>

      {loading && <Loader />}
      {!loading && salonsSpa.length > 0 && (
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
            {salonsSpa.map((salon: ISalon_Spa) => (
              <TableRow key={salon.id} className="p-2">
                <TableCell data-label="Id">{salon.id}</TableCell>
                <TableCell data-label="Name">{salon.name}</TableCell>
                <TableCell data-label="City">{salon.city}</TableCell>
                <TableCell data-label="State">{salon.state}</TableCell>
                <TableCell data-label="Zip">{salon.zip}</TableCell>
                <TableCell data-label="Min Service Price">
                  $ {salon.minimum_service_price}
                </TableCell>
                <TableCell data-label="Max Service Price">
                  $ {salon.maximum_service_price}
                </TableCell>

                <TableCell data-label="Offer status">
                  {salon.offer_status}
                </TableCell>

                <TableCell data-label="Created At">
                  {dayjs(salon.created_at).format("MMM DD, YYYY hh:mm A")}
                </TableCell>

                <TableCell
                  data-label="actions"
                  className="flex gap-5 items-center"
                >
                  <Button variant={"outline"} size={"icon"} onClick={()=>deleteSalonHandler(Number(salon.id))}>

                    <Trash2 size={14} />
                  </Button>

                  <Button
                    variant={"outline"}
                    size={"icon"}
                    onClick={() =>
                      router.push(`/admin/salons-spas/edit/${salon.id}`)
                    }
                  >
                    <Edit2 size={14} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {!loading && salonsSpa.length === 0 && (
        <ErrorMessage error="No hay salones" />
      )}
    </div>
  );
}

export default SalonsSpasList;
