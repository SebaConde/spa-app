/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { supabase } from "../../src/config/supabase-config";
import bcrypt from "bcrypt";
import { formatError } from "../utils";
import jwt from "jsonwebtoken";

export const registerNewUser = async ({
  name,
  email,
  password,
  role,
}: {
  name: string;
  email: string;
  password: string;
  role: string;
}) => {
  //Checkear si existe el mail.
  try {
    const { data } = await supabase
      .from("user_profile")
      .select("email")
      .eq("email", email);
    if (data && data.length > 0) {
      return {
        success: false,
        message: "Usuario ya existe.",
      };
    }
    //Hash el password.
    const hashedPassword = bcrypt.hashSync(password, 10);

    //Crear usuario.
    const newUser = {
      name,
      email,
      password: hashedPassword,
      role,
      isActive: true,
    };

    //Agregar a la db.
    const { data: userData, error: userError } = await supabase
      .from("user_profile")
      .insert([newUser]);
    if (userError) {
      return {
        success: false,
        message: formatError(userError.message),
      };
    }

    return {
      success: true,
      message: "Usuario registrado correctamente.",
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const loginUser = async ({
  email,
  password,
  role,
}: {
  email: string;
  password: string;
  role: string;
}) => {
  try {
    const { data, error } = await supabase
      .from("user_profile")
      .select("*")
      .eq("email", email);
    if (error) {
      return {
        success: false,
        message: formatError(error.message),
      };
    }
    if (data.length === 0) {
      return {
        success: false,
        message: "No se encontró el usuario.",
      };
    }
    if (data[0].role !== role) {
      return {
        success: false,
        message: "Rol invalido.",
      };
    }

    const isPasswordValid = bcrypt.compareSync(password, data[0].password);
    if (!isPasswordValid) {
      return {
        success: false,
        message: "Contraseña incorrecta.",
      };
    }

    //Generar JWT Token
    const token = jwt.sign(
      {
        id: data[0].id,
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "1d",
      },
    );

    return {
      success: true,
      data: token,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const getCurrenUser = async (token: string) => {
  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = decoded.id;

    const { data, error } = await supabase
      .from("user_profile")
      .select("*")
      .eq("id", userId);
    if (!data || data?.length === 0 || error) {
      return {
        success: false,
        message: "Usuario no encontrado",
      };
    }
    return {
      success: true,
      data: data[0],
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};
