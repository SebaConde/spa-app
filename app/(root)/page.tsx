"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Home() {
  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center bg-gray-200 py-5 px-20">
        <h1 className="font-bold text-2xl text-black">SPA</h1>
        <Button>
          <Link href='/login'> Login</Link>
        </Button>
      </div>
      <div className="bg-white mt-20 lg:grid-cols-2 grid-cols-1 px-20 min-h-[70vh] items-center grid gap-10">
        <div className="col-span-1">
          <div className="flex flex-col gap-5">
            <h1 className="text-2xl font-bold">Welcome to the spa</h1>
            <p className="text-sm text-gray-600">
              Is a platfrom that connects with costumers
            </p>
            <Button className="w-max">Find a salon</Button>
          </div>
        </div>
        <div className="col-span-1 flex justify-end items-center">
          <Image src="/logo.jpg" alt="logo" width={300} height={300} />
        </div>
      </div>
    </div>
  );
}
