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
import { SignupValidation } from "@/components/lib/validation";
import { z } from "zod";
import Loader from "@/components/shared/Loader";
import { Link, useNavigate } from "react-router-dom";
import { useCreateUserAccount, useSignInAccount } from "@/components/lib/react-query/queriesAndMutation";
import { useUserContext } from "@/context/AuthContext";

const SignupForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const {checkAuthUser, isLoading: isUserLoading} = useUserContext();

  const { mutateAsync: createUserAccount, isPending: isCreatingAccount } =
  useCreateUserAccount();

  const {mutateAsync: signInAccount } = useSignInAccount();

  // 1. Define your form.
  const form = useForm<z.infer<typeof SignupValidation>>({
    resolver: zodResolver(SignupValidation),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof SignupValidation>) {
    //create a new ACCOUNT
    const newUser = await createUserAccount(values);

    if (!newUser) {
      return toast({
        variant: "destructive",
        title: "Signup Failed! Please Try Again",
      });
    }

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
      console.log("Successfully Signed In");
      
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

        <p className="text-xl mt-2">Create a New Account</p>

        <p className="text-light-3 small-medium md:text-sm mt-2">
          To use CircleUp enter your details
        </p>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-2 w-full mt-4 h-full"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage className="  text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage className=" text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" className="shad-input" {...field} />
                </FormControl>
                <FormMessage className=" text-xs" />
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
            {isCreatingAccount ? (
              <div className="flex-center gap-2">
                <Loader /> Loading...
              </div>
            ) : (
              "Sign Up"
            )}
          </Button>

          <p className="text-small-regular text-light-2 text-center my-2">
            Already have an account?
            <Link
              className="text-primary-500 text-small-semibold ml-1"
              to="/sign-in"
            >
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};

export default SignupForm;
