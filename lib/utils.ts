/* eslint-disable @typescript-eslint/no-explicit-any */
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

//Darle formato a los errores.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function formatError(error: any) {
  // Verifica si es un error de Zod
  if (error?.issues && Array.isArray(error.issues)) {
    // Zod error - los errores están en error.issues
    const fieldErrors = error.issues.map((issue: any) => issue.message);
    return fieldErrors.join(". ");
  } else if (
    error?.name === "PrismaClientKnownRequestError" &&
    error.code === "P2002"
  ) {
    // Prisma error
    const field = error.meta?.target ? error.meta.target[0] : "Field";
    return `Ya existe ese ${field.charAt(0).toUpperCase() + field.slice(1)}`;
  } else {
    // Otros errores
    return typeof error?.message === "string"
      ? error.message
      : error
      ? JSON.stringify(error)
      : "Error desconocido";
  }
}
