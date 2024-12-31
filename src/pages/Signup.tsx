import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "../components/ui/card";

import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {useDebounceCallback } from "usehooks-ts";
import { useToast } from "../hooks/use-toast";
import { signUpValidation } from "../schema/signUpSchema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { Check, CircleX } from "lucide-react";

export default function SignupPage() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [email, setEmail] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isEmailUnique, setIsEmailUnique] = useState(false);

  const debounced = useDebounceCallback(setEmail, 300);

  // zod Implementation
  const form = useForm<z.infer<typeof signUpValidation>>({
    resolver: zodResolver(signUpValidation),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const checkIsEmailUnique = async () => {
    if (email) {
      const controller = new AbortController();
      try {
        const res = await axios.get("/api/v1/user/check/email-unique", {
          signal: controller.signal,
          params: {
            email,
          },
        });
        if (res.data.status == true) {
          setIsEmailUnique(true);
        } else {
          setIsEmailUnique(false);
        }
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("Request canceled", error.message);
          return;
        }
      }
      return () => controller.abort();
    }
  };

  const onSubmit = async (data: z.infer<typeof signUpValidation>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/v1/user/signup", data);
      if (response.status === 200) {
        toast({
          title: "Success",
          description: response.data.message,
          variant: "success",
        });
        navigate("/");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast({
          title: "Error",
          description: error.response?.data?.message,
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
          <CardTitle className="text-2xl font-bold">Sign Up</CardTitle>
          <CardDescription>Create your account to get started</CardDescription>
        </CardHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Email"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        debounced(e.target.value);
                        checkIsEmailUnique();
                      }}
                    />
                  </FormControl>
                  <Button
                    type="button"
                    variant="ghost"
                    className="absolute right-0 top-2 h-full px-3 py-2 hover:bg-transparent"
                  >
                    { isEmailUnique ? (
                      <Check className="h-5 w-5 text-green-500" />
                    ) : (
                      <CircleX className="h-5 w-5 text-red-500" />
                    )}
                  </Button>
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
              <Button
                disabled={isSubmitting || !email || !isEmailUnique}
                type="submit"
                className="w-full"
              >
                {isSubmitting ? "Please wait" : "Sign up"}
              </Button>
              <p className="text-sm text-center text-gray-600">
                Already have an account?{" "}
                <Link to="/" className="text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
