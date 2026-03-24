/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import userGlobalStore, {
  IUserGlobalStore,
} from "@/src/store/users-global-store";
import dayjs from "dayjs";
import React from "react";

export default function ProfileCard() {
  const { user } = userGlobalStore() as IUserGlobalStore;
  const renderProperty = (label: string, value: any) => (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-gray-700">{label}</span>
      <span className="text-sm font-bold">{value}</span>
    </div>
  );
  return (
    <div className="mt-7 p-5 border border-gray-300 rounded grid grid-cols-1 lg:grid-cols-3 gap-7">
      {renderProperty("ID", user?.id)}
      {renderProperty("Name", user?.name)}
      {renderProperty("Email", user?.email)}
      {renderProperty("Role", user?.role)}
      {renderProperty("Fecha de registro",dayjs(user?.created_at).format("MMM DD, YYYY hh:,mm A"))}
    </div>
  );
}
