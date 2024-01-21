//@ts-nocheck
import * as React from "react";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLDClient } from "launchdarkly-react-client-sdk";
import { setCookie } from "cookies-next";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../dialog";

interface LoginComponentProps {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  loginUser: any;
}

export function LoginComponent({
  isLoggedIn,
  setIsLoggedIn,
  loginUser,
}: LoginComponentProps) {
  const ldclient = useLDClient();
  const inputRef = useRef();
  function handleLogin(e) {
    setIsLoggedIn(true);
    let email = inputRef.current?.value;
    console.log(inputRef.current.value);
    if (!email) {
      email = "jenn@launchmail.io";
    }
    loginUser("Jenn", email);
  }

  return (
    <div className="w-full sm:w-[425px] 3xl:h-[500px] bg-white font-audimat shadow-xl">
      <div className="flex flex-col justify-center mx-auto text-center">
        <img
          src="test-barclays-shield.png"
          
          className="pt-10 mx-auto w-1/2"
        />
        {/* <p className="text-3xl sm:text-4xl font-sohnelight pb-12 3xl:pb-24 !font-thin">
          Toggle<span className="!font-extrabold">Bank</span>
        </p> */}
      </div>
      <div></div>
      <div className="w-full px-8 ">
        <div className="flex py-12">
          <Input
            placeholder="Email"
            defaultValue={"jenn@launchmail.io"}
            ref={inputRef}
            className=" outline-none border-0 border-b-2 text-xl items-center"
          />
        </div>
        <Button
          onClick={handleLogin}
          className="w-full h-full mx-auto font-audimat rounded-none bg-blue-500 text-xl"
        >
          Login
        </Button>
        <Dialog>
          <DialogTrigger className="w-full h-full mx-auto font-audimat rounded-none bg-blue-500 text-xl mt-4 text-white px-4 py-2">
            Switch SSO User
          </DialogTrigger>
          <DialogContent className="flex max-w-4xl">
            <Card className="h-[400px] w-[400px] text-center">
              <CardHeader className="font-bold text-2xl"><CardTitle>User 1</CardTitle>
              <CardDescription className="text-xl">Developer</CardDescription></CardHeader>
              
            </Card>
            <Card className="h-[400px] w-[400px]">
            <CardHeader className="font-bold text-2xl">User 3</CardHeader>
            </Card>
            <Card className="h-[400px] w-[400px]">
            <CardHeader className="font-bold text-2xl">User 3</CardHeader>
            </Card>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex flex-col gap-y-2 sm:flex-row sm:gap-x-4 justify-between px-8 pb-8 pt-4 3xl:pt-14">
        <div>
          <p>Forgot Password?</p>
        </div>
        <div>
          <p>
            Don't have an account?{" "}
            <a href="/bank" className="text-blue-600 ml-2">
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
