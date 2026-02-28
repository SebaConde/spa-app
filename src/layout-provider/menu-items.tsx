import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Calendar,
  LayoutDashboard,
  List,
  MessageCircle,
  UserIcon,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { formatError } from "@/lib/utils";
import Cookies from "js-cookie";
import userGlobalStore, { IUserGlobalStore } from "../store/users-global-store";
import Link from "next/link";

interface MenuItemProps {
  openMenuItems: boolean;
  setOpenMenuItems: (openMenuItems: boolean) => void;
}

export default function MenuItems({
  openMenuItems,
  setOpenMenuItems,
}: MenuItemProps) {
  const userMenuItems = [
    {
      title: "Dashboard",
      route: "/user/dashboard",
      icon: <LayoutDashboard size={13} className="text-black" />,
    },
    {
      title: "Schedule Apointment",
      route: "/user/schedule-appointment",
      icon: <Calendar size={13} className="text-black" />,
    },
    {
      title: "My Appointments",
      route: "/user/my-appointments",
      icon: <List size={13} className="text-black" />,
    },
    {
      title: "Profile",
      route: "/user/profile",
      icon: <UserIcon size={13} className="text-black" />,
    },
  ];

  const adminMenuItems = [
    {
      title: "Dashboard",
      route: "/admin/dashboard",
      icon: <LayoutDashboard size={13} className="text-black" />,
    },
    {
      title: "Salons & Spas",
      route: "/admin/salons-spas",
      icon: <List size={13} className="text-black" />,
    },
    {
      title: "My Appointments",
      route: "/admin/appointments",
      icon: <Calendar size={13} className="text-black" />,
    },
    {
      title: "Feedback / Reviews",
      route: "/admin/feedback-reviews",
      icon: <MessageCircle size={13} className="text-black" />,
    },
    {
      title: "Profile",
      route: "/admin/profile",
      icon: <UserIcon size={13} className="text-black" />,
    },
  ];
  const { user } = userGlobalStore() as IUserGlobalStore;
  const pathName = usePathname();
  const router = useRouter();

  const onLogout = () => {
    try {
      Cookies.remove("token");
      Cookies.remove("role");
      router.push("/");
      toast.success("Sesion cerrada con exito");
    } catch (error) {
      toast.error(formatError(error));
    }
  };

  const menuItemsToRender =
    user?.role === "user" ? userMenuItems : adminMenuItems;
  return (
    <Sheet open={openMenuItems} onOpenChange={setOpenMenuItems}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle></SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-7 mt-20 px-7">
          {menuItemsToRender.map((menuItem) => (
            <div
              key={menuItem.route}
              onClick={() => {
                router.push(menuItem.route);
                setOpenMenuItems(false);
              }}
              className={`flex gap-5 items-center p-2 rounded-md cursor-pointer ${pathName === menuItem.route ? "bg-gray-100 border border-gray-500" : "text-gray-500"}`}
            >
              {menuItem.icon}
              <span className="text-sm! text-black">{menuItem.title}</span>
            </div>
          ))}
          <Button onClick={onLogout}>Logout</Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
