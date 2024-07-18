//@ts-nocheck
import * as React from "react";
import { useRef, useEffect, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getVariantClassName } from "@/utils/getVariantClassName";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PersonaContext } from "../personacontext";
import { STARTER_PERSONAS } from "@/utils/contexts/StarterUserPersonas";
import { STANDARD, COMPANY_LOGOS } from "@/utils/constants";
import LoginContext from "@/utils/contexts/login";

interface LoginComponentProps {
  variant: "bank" | "airlines" | "market" | "investment";
}

export function LoginComponent({ variant }: LoginComponentProps) {
  const inputRef = useRef();
  const [activeElement, setActiveElement] = useState(null);
  const [defaultEmail, setDefaultEmail] = useState("user@launchmail.io");
  const { setIsLoggedIn, loginUser } = useContext(LoginContext);


  function handleLogin(e) {
    if (!defaultEmail) return;

    setIsLoggedIn(true);
    let email;
    let name;
    let role;
    const activePersona = STARTER_PERSONAS.find((p) => p.personaname === activeElement);

    if (activePersona) {
      email = activePersona.personaemail;
      name = activePersona.personaname;
      role = activePersona.personarole;
    } else {
      //TODO: fix this to change from user to christine
      email = defaultEmail;
      name = email.split("@")[0];
      name = name.charAt(0).toUpperCase() + name.slice(1);
      role = STANDARD;
    }
    loginUser(name, email, role);
  }

  const handleSetActive = (personaname, personaemail) => {
    setActiveElement(personaname);
    setDefaultEmail(personaemail);
  };

  useEffect(() => {
    if (activeElement) {
      handleLogin();
    }
  }, [activeElement]);

  return (
    <div className="w-full  bg-white font-audimat shadow-xl mx-auto text-black p-4 sm:p-8 h-full flex flex-col">
      <div className=" mx-auto text-center my-8">
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
{/* TODO: make this into one component */}
        <Dialog className="z-10">
          <DialogTrigger
            className={`mb-4 p-2 w-full mx-auto font-audimat rounded-none text-xl border-2 border-loginComponentBlue text-black hover:bg-gray-800 hover:text-white`}
          >
            Switch SSO User
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Switch SSO User</DialogTitle>
              <div className="overflow-y-auto h-64">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 justify-items-center mb-4 pt-6">
                  {STARTER_PERSONAS.map((item: Persona, index: number) => (
                    <div className="flex flex-col items-center cursor-pointer hover:brightness-125" key={index}>
                      <img
                        src={item.personaimage}
                        className={`w-24 rounded-full mb-4 ${
                          activeElement === item.personaname ? "border-4 border-black" : ""
                        }`}
                        onClick={() => handleSetActive(item.personaname, item.personaemail)}
                        alt={item.personaname}
                      />
                      <p className="text-xs sm:text-sm md:text-base text-center font-bold font-sohnelight">
                        {item.personaname}
                      </p>
                      <p className="text-xs sm:text-sm md:text-base text-center font-bold font-sohnelight">
                        {item.personatype}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </DialogHeader>
          </DialogContent>
        </Dialog>
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
