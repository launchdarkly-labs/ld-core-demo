//@ts-nocheck
import * as React from "react"
import { useRef } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useLDClient } from "launchdarkly-react-client-sdk"
import { setCookie } from "cookies-next";

interface LoginComponentProps {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  loginUser: any
}

export function LoginComponent({isLoggedIn, setIsLoggedIn, loginUser}: LoginComponentProps) {
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
          src="ToggleBankBlue.png"
          width={64}
          className="pt-10 mx-auto pb-4"
        />
        <p className="text-3xl sm:text-4xl font-sohnelight pb-12 3xl:pb-24 !font-thin">
          Toggle<span className="!font-extrabold">Bank</span>
        </p>
      </div>
      <div></div>
      <div className="w-full px-8">
        <div>
          <Input
            placeholder="Email"
            defaultValue={"jenn@launchmail.io"}
            ref={inputRef}
            className="mb-8 3xl:mb-24 outline-none border-0 border-b-2 text-xl"
          />
        </div>
        <Button
          onClick={handleLogin}
          className="w-full h-full mx-auto font-audimat rounded-none bg-blue-500 text-xl"
        >
          Login with SSO
        </Button>
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
