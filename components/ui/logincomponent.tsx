//@ts-nocheck
import * as React from "react"
import { useRef, useEffect, useContext } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getVariantClassName } from '@/utils/getVariantClassName';
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { PersonaContext } from "../personacontext";
import toggleBankVerticalLogo from '@/public/banking/toggleBank_logo_vertical.svg'
import frontierCapitalVerticalLogo from '@/public/investment/frontier_capital_logo_vertical.svg'
import launchAirwaysVerticalLogo from '@/public/airline/launch_airways_logo_vertical.svg'
import galaxyMarketplaceVerticalLogo from '@/public/marketplace/galaxy_marketplace_logo_vertical.svg'

const variantToImageMap = {
  bank: toggleBankVerticalLogo.src,
  airlines: launchAirwaysVerticalLogo.src,
  market: galaxyMarketplaceVerticalLogo.src,
  investment: frontierCapitalVerticalLogo.src,
};
interface LoginComponentProps {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  loginUser: any
  variant: 'bank' | 'airlines' | 'market' | 'investment';
  name: string;
}

export function LoginComponent({ isLoggedIn, setIsLoggedIn, loginUser, variant, name }: LoginComponentProps) {
  const inputRef = useRef();
  const [activeElement, setActiveElement] = useState(null);
  const [defaultEmail, setDefaultEmail] =  useState("user@launchmail.io");
  const variantClass = getVariantClassName(variant);
  const [newPersona, setNewPersona] = useState({ name: '', type: '', image: '', email: '' });
  const { personas, getPersonas } = useContext(PersonaContext);
  const [isAddUserDropdownOpen, setIsAddUserDropdownOpen] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleNewPersonaChange = (e) => {
    setNewPersona({ ...newPersona, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    getPersonas();
  }, [isLoading]);

  const showBackButton = () => {
    setIsAddUserDropdownOpen(false);
    setSubmitError(null);
  };


  function handleLogin(e) {
    setIsLoggedIn(true);
    let email;
    let name;
    let role;
    const activePersona = personas.find(p => p.personaname === activeElement);
    if (activePersona) {
      email = activePersona.personaemail;
      name = activePersona.personaname;
      role = activePersona.personarole;
    }
    else {
      email = defaultEmail;
      name = email.split('@')[0];
      name = name.charAt(0).toUpperCase() + name.slice(1);
      role = 'Standard'
    }
    loginUser(name, email, role);
  };

  const handleSetActive = (personaname, personaemail) => {
    setActiveElement(personaname);
    setDefaultEmail(personaemail);
  };

  useEffect(() => {
    if (activeElement) {
      handleLogin();
    }
  }, [activeElement]);

  const imageSrc = variantToImageMap[variant];

  const toggleAddUserDropdown = () => {
    setIsAddUserDropdownOpen(!isAddUserDropdownOpen);
  };

  return (
    <div className="w-full  bg-white font-audimat shadow-xl mx-auto text-black p-4 sm:p-8">

      <div className="flex flex-col justify-center mx-auto text-center">
        <img
          src={imageSrc}
          className="pt-10 mx-auto pb-4"
        />
      </div>
      <div className="w-full">
        <Input
          placeholder="Email"
          value={defaultEmail}
          ref={inputRef}
          required
          className="mb-8 outline-none border-0 border-b-2 text-xl"
          onChange={(e) => setDefaultEmail(e.target.value)}
        />

        <Button
          onClick={() => defaultEmail && handleLogin()}
          className={`mb-4 w-full h-full mx-auto font-audimat rounded-none  text-xl ${variantClass} text-white`}>
          Login with SSO
        </Button>

        <Dialog onDismiss={() => { setIsAddUserDropdownOpen(false) }} className="z-10">
          <DialogTrigger className={`mb-4 p-2 w-full h-full mx-auto font-audimat rounded-none text-xl ${variantClass} text-white hover:bg-gray-800`}>
            Switch SSO User
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Switch SSO User</DialogTitle>

              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <img src="loading-spinner.gif"></img>
                </div>
              ) : (
                <div className="overflow-y-auto h-64">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 justify-items-center mb-4 pt-6">
                    {personas.map((item: Persona, index: number) => (
                      <div className="flex flex-col items-center" key={index}>
                        <img
                          src={item.personaimage}
                          className={`w-24 rounded-full mb-4 ${activeElement === item.personaname
                            ? "border-4 border-black"
                            : ""
                            }`}
                          onClick={() =>
                            handleSetActive(item.personaname, item.personaemail)
                          }
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

                    {isAddUserDropdownOpen && (
                      <div className="absolute z-100 left-0 top-0 bottom-0 pt-8 w-full bg-white shadow-lg">
                        <Button
                          onClick={showBackButton}
                          className={`absolute top-3 text-xs  mx-auto font-audimat left-4 h-5 rounded-full ${variantClass}`}
                        >
                          &larr;
                        </Button>
                        <div className="p-4">
                          <div className="mb-2">
                            <input
                              type="text"
                              name="name"
                              placeholder="Name"
                              value={newPersona.name}
                              required
                              onChange={handleNewPersonaChange}
                              className="w-full p-2 border border-gray-300 rounded"
                            />
                          </div>
                          <div className="mb-2">
                            <input
                              type="text"
                              name="type"
                              placeholder="Role"
                              value={newPersona.type}
                              required
                              onChange={handleNewPersonaChange}
                              className="w-full p-2 border border-gray-300 rounded"
                            />
                          </div>
                          <div className="mb-2">
                            <input
                              type="text"
                              name="email"
                              placeholder="Email"
                              value={newPersona.email}
                              required
                              onChange={handleNewPersonaChange}
                              className="w-full p-2 border border-gray-300 rounded"
                            />
                          </div>
                          <div className="mb-0 overflow-x-auto rounded">
                            <div className="flex space-x-4 p-2">
                              {[
                                "persona1.png",
                                "persona2.png",
                                "persona3.png",
                                "persona4.png",
                                "persona5.png",
                              ].map((imageName) => (
                                <img
                                  key={imageName}
                                  src={`/personas/${imageName}`}
                                  alt={imageName}
                                  className={`w-24 h-24 rounded-full cursor-pointer ${newPersona.image ===
                                    `/personas/${imageName}`
                                    ? "border-4 border-blue-500"
                                    : ""
                                    }`}
                                  onClick={() =>
                                    setNewPersona({
                                      ...newPersona,
                                      image: `/personas/${imageName}`,
                                    })
                                  }
                                />
                              ))}
                            </div>
                          </div>
                          <Button
                            onClick={handleSubmitNewPersona}
                            className={`mb-2 w-full h-full mx-auto font-audimat mt-2 rounded-none text-xl ${variantClass}`}
                          >
                            Submit
                          </Button>

                          {submitError && (
                            <p className="text-red-500 text-sm z-100">
                              {submitError}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
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
            <a href="#" className="text-blue-600 ml-2">
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}