//@ts-nocheck
import * as React from "react";
import { useRef, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QuickLoginDialog } from "./quicklogindialog";
import { useState } from "react";
import { COMPANY_LOGOS } from "@/utils/constants";
import LoginContext from "@/utils/contexts/login";
import  { VariantInterface } from "@/utils/typescriptTypesInterfaceLogin";

export function LoginComponent({ variant }: VariantInterface) {
  const inputRef = useRef();
  const [defaultEmail, setDefaultEmail] = useState<string>("user@launchmail.io");
  const { loginUser } = useContext(LoginContext);

  function handleLogin(): void {
    if (!defaultEmail) return;

    loginUser("user@launchmail.io");
  }

  return (
    <div className="w-full  bg-white font-audimat shadow-2xl mx-auto text-black p-4 sm:p-8 h-full flex flex-col">
      <div className=" mx-auto text-center mt-4 mb-8">
        <img src={COMPANY_LOGOS[variant].vertical.src} className=" mx-auto" />
      </div>
      <div className="w-full mb-4">
        <Input
          placeholder="Email"
          value={defaultEmail}
          ref={inputRef}
          required
          className="mb-4 outline-none border-0 border-b-2 text-xl"
          onChange={(e) => setDefaultEmail(e.target.value)}
        />

        <Button
          onClick={() => handleLogin()}
          className={`mb-4 w-full mx-auto font-sohnelight rounded-none  text-lg bg-loginComponentBlue text-white`}
        >
          Login with SSO
        </Button>
        <QuickLoginDialog variant={variant} />
      </div>
      <div className="flex flex-col items-start sm:items-baseline font-sohnelight font-extralight sm:flex-row text-xs justify-between">
        <div className="pb-3">
          <p>Forgot Password?</p>
        </div>
        <div>
          <p className="text-right flex flex-col">
            Don't have an account?{" "}
            <a href="#" className=" ml-2 cursor-auto">
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
