import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SigninValidation } from "@/components/lib/validation";
import { z } from "zod";
import Loader from "@/components/shared/Loader";
import { Link, useNavigate } from "react-router-dom";
import { useSignInAccount } from "@/components/lib/react-query/queriesAndMutation";
import { useUserContext } from "@/context/AuthContext";

const SigninForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const {checkAuthUser} = useUserContext();

  const {mutateAsync: signInAccount, isPending: isSigningIn} = useSignInAccount();

  // 1. Define your form.
  const form = useForm<z.infer<typeof SigninValidation>>({
    resolver: zodResolver(SigninValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof SigninValidation>) {
    const session = await signInAccount({
      email: values.email,
      password: values.password
    });

    if(!session){
      return toast({
        variant: "destructive",
        title: "Sign In Failed! Please Try Again",
      });
    }

    const isLoggedIn = await checkAuthUser();

    if(isLoggedIn) {
      form.reset();
      navigate('/');
      console.log("Successfully Signed IN");
      
    } else {
      return toast({
        variant: "destructive",
        title: "Sign Up Failed! Please Try Again",
      });
    }
  }

  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col h-fit">
        <div className="flex items-center mb-2">
          <img
            src="/assets/images/logo.png"
            className="h-10 w-10 self-center mr-4"
            alt="logo"
          />
          <p className="text-4xl text-light-1 font-semibold self-center h-fit mr-4">
            CircleUp
          </p>
        </div>

        <p className="text-xl mt-2">Log In to Account</p>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-2 w-full mt-4 h-full"
        >

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" className="shad-input" {...field} />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" className="shad-input" {...field} />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="shad-button_primary lg:w-fit w-full mx-auto mt-2"
          >
            {isSigningIn ? (
              <div className="flex-center gap-2">
                <Loader /> Loading...
              </div>
            ) : (
              "Sign In"
            )}
          </Button>

          <p className="text-small-regular text-light-2 text-center my-2">
            Don't have an account?
            <Link
              className="text-primary-500 text-small-semibold ml-1"
              to="/sign-up"
            >
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};

export default SigninForm;
