/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import Header from "./header";
import Cookies from "js-cookie";
import { getCurrenUser } from "@/lib/actions/user";
import Loader from "@/components/ui/loader";
import ErrorMessage from "@/components/ui/error-message";
import userGlobalStore, { IUserGlobalStore } from "../store/users-global-store";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

function PrivateLayout({ children }: { children: React.ReactNode }) {
  const {user, setUser} = userGlobalStore() as IUserGlobalStore;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter()

  const fetchUser = async () => {
    try {
      setLoading(true);
      const token = Cookies.get("token");
      const response = await getCurrenUser(token!);
      if (response.success) {
        setUser(response.data);
      } else {
        setError(response.message);
      }
    } catch (error: any) {
      Cookies.remove('token');
      toast.error(error.message);
      router.push('/login');
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }
  if (error) {
    <ErrorMessage error={error}/>
  }
  return (
    <div>
      <Header />
      <div className="p-5">{children}</div>
    </div>
  );
}

export default PrivateLayout;
