export interface IUser {
  id: number;
  name: string;
  email: string;
  password: string;
  role: "admin" | "user";
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ISalon_Spa {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  working_days: string[];
  start_time: string;
  end_time: string;
  break_start_time: string;
  break_end_time: string;
  minimum_service_price: number;
  maximum_service_price: number;
  slot_duration: number;
  max_bookings_per_slot: number;
  location_name: string;
  latitude: number;
  longitude: number;
}
