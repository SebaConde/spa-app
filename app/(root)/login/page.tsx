/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Link from "next/link";
import { toast } from "sonner";
import { loginUser } from "@/lib/actions/user";
import Cookies from 'js-cookie';
import { useRouter } from "next/navigation";


export default function LoginPage() {
  const [loading, setLoading] = React.useState(false);

  const router = useRouter();

  const formSchema = z.object({
    email: z.string().min(3, 'Debe tener al menos 3 caracteres').max(30, 'Debe tener como maximo 30 caracteres'),
    password: z.string().min(8, 'La clave debe tener al menos 8 caracertes.'),
    role: z.enum(['user', 'admin'])
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      role: 'user'
    },
  });
 async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      const response = await loginUser(data);
      if(response.success){
        toast.success('Usuario ingresado correctamente.');
        Cookies.set('token', response.data || "");
        Cookies.set('role', data.role.toString() || "" )
        router.push(`/${data.role}/dashboard`);
         
      }else{
        toast.error(response.message);
      }
    } catch (error:any) {
      toast.error(error.message);
    }finally{
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
    
    <div className="bg-white p-8 rounded-lg shadow-md w-125">
      <h1 className="text-2xl font-bold">Login</h1>
      <hr className="my-7 border-t border-gray-300"/>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>email</FormLabel>
                <FormControl>
                  <Input placeholder="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>password</FormLabel>
                <FormControl>
                  <Input placeholder="password" {...field} type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
         
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-20"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="user" />
                        </FormControl>
                        <FormLabel className="font-normal">User</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="admin" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Admin
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-between items-center">
              <div className="flex gap-5 text-sm">
                No tiene una cuenta?<Link href='/register' className="underline">Register</Link>
              </div>
               <Button type="submit" disabled={loading}>LOGIN</Button>
            </div>
        </form>
      </Form>
    </div>
  </div>
  );
}
