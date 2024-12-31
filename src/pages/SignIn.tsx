import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import { signInValidation } from "../schema/signInSchema";

import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "../hooks/use-toast";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";

export default function SignIn() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof signInValidation>>({
    resolver: zodResolver(signInValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signInValidation>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/v1/user/signin", data);
      if (response.status === 200) {
        localStorage.setItem("_token_", response.data.token);
        toast({
          title: "Success",
          description: response.data.message,
          variant: "success",
        });
        navigate("/explore/Kanpur");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast({
          title: "Error",
          description: error.response?.data?.message ?? "Something went wrong",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md p-4">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Sign in</CardTitle>
          <CardDescription>Enter your credentials to login</CardDescription>
        </CardHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <CardFooter className="flex flex-col p-0 pt-6 space-y-4">
              <Button disabled={isSubmitting} type="submit" className="w-full">
                {isSubmitting ? "Please wait" : "Sign in"}
              </Button>
              <p className="text-sm text-center text-gray-600">
                Create an account{" "}
                <Link to="/signup" className="text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  )
}
