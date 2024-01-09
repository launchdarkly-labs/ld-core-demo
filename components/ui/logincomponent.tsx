//@ts-nocheck
import * as React from "react"
import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useLDClient } from "launchdarkly-react-client-sdk"
import { useState } from "react";


interface LoginComponentProps {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  loginUser: any
  variant: 'bank' | 'airlines' | 'market';
  name: string;
}

export function LoginComponent({ isLoggedIn, setIsLoggedIn, loginUser, variant, name }: LoginComponentProps) {
  const ldclient = useLDClient();
  const inputRef = useRef();
  const [activeElement, setActiveElement] = useState(null);
  const [defaultEmail, setDefaultEmail] = useState(null);


  function handleLogin(e) {
    setIsLoggedIn(true);
    let email = defaultEmail;
    if (email === null) {
      email = "jenn@launchmail.io";
      setActiveElement("Jenn");
    }
    loginUser(activeElement, email);
  }

  const handleSetActive = (element, email) => {
    setActiveElement(element);
    setDefaultEmail(email);
  };

  const variantToImageMap = {
    bank: "ToggleBankBlue.png",
    airlines: "/launch-airways.svg",
    market: "/market.png",
  };

  const imageSrc = variantToImageMap[variant];


  return (
    <div className="w-full sm:w-[425px] 3xl:h-[500px] bg-white font-audimat shadow-xl">
      <div className="flex flex-col justify-center mx-auto text-center">
        <img
          src={imageSrc}
          width={64}
          className="pt-10 mx-auto pb-4"
        />
        <p className="text-3xl sm:text-4xl font-sohnelight pb-12 3xl:pb-24 !font-thin">
          <span className="!font-extrabold">{name}</span>
        </p>
      </div>
      <div className="w-full px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 justify-items-center mb-4">
          <div className="flex flex-col items-center">
            <img
              src="woman.png"
              className={`w-24 rounded-full mb-4 ${activeElement === 'Jenn' ? 'border-4 border-black' : ''}`}
              onClick={() => handleSetActive('Jenn', "jenn@launchmail.io")}
            />
            <p className="text-xs sm:text-sm md:text-base text-center font-bold font-sohnelight ">Jenn</p>
            <p className="text-xs sm:text-sm md:text-base text-center font-bold font-sohnelight">Developer</p>
          </div>

          <div className="flex flex-col items-center">
            <img
              src="beta.png"
              className={`w-24 rounded-full mb-4 ${activeElement === 'Alysha' ? 'border-4 border-black' : ''}`}
              defaultValue={"alysha@launchmail.io"}
              ref={inputRef}
              onClick={() => handleSetActive('Alysha', "alysha@launchmail.io")}
            />
            <p className="text-xs sm:text-sm md:text-base text-center font-bold font-sohnelight ">Alysha</p>
            <p className="text-xs sm:text-sm md:text-base text-center font-bold font-sohnelight">Beta User</p>
          </div>

          <div className="flex flex-col items-center">
            <img
              src="standard.jpg"
              className={`w-24 rounded-full mb-4 ${activeElement === 'Cody' ? 'border-4 border-black' : ''}`}
              defaultValue={"cody@launchmail.io"}
              ref={inputRef}
              onClick={() => handleSetActive('Cody', "cody@launchmail.io")}
            />
            <p className="text-xs sm:text-sm md:text-base text-center font-bold font-sohnelight ">Cody</p>
            <p className="text-xs sm:text-sm md:text-base text-center font-bold font-sohnelight">Standard User</p>
          </div>
        </div>

        <Button
          onClick={handleLogin}
          className={` w-full h-full mx-auto font-audimat rounded-none  text-xl ${variant === 'bank' ? 'bg-blue-500' :
            variant === 'airlines' ? 'bg-gradient-to-r from-airlinepurple to-airlinepink' :
              variant === 'market' ? 'grid items-center justify-center bg-gradient-to-r from-marketblue text-black to-marketgreen' : ''
            } mb-[4rem]`}>
          Login with SSO
        </Button>
      </div>
      <div className="flex flex-col  sm:flex-row  justify-between px-8 pb-8">
        <div>
          <p>Forgot Password?</p>
        </div>
        <div>
          <p>
            Don't have an account?{" "}
            <a href={window.location.href} className="text-blue-600 ml-2">
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
