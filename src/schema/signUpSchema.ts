import { z } from "zod";

export const signUpValidation = z.object({
  name: z.string().min(5),
  email : z.string().email({message: "Invalid email address"}),
  password: z.string().min(8, "Password must be at least 8 characters"),
});  