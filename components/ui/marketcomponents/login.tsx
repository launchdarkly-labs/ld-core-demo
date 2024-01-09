import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../avatar";
import LoginContext from "@/utils/contexts/login";
import { useContext } from "react";
import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
// import BookedFlights from "./bookedFlights";

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  password: z.string().min(4, { message: "Invalid email address" }),
});

export default function MarketLoginScreen() {
  const { isLoggedIn, setIsLoggedIn, loginUser, logoutUser, user } =
    useContext(LoginContext);
  const [username, setUsername] = useState("");
  const inputRef = useRef();

  const handleLogout = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    logoutUser();
    setUsername("");
  };

  function handleLogin(e) {
    setIsLoggedIn(true);
    let email = inputRef.current?.value;
    console.log(email);
    if (!email) {
      email = "jenn@launchmail.io";
    }
    loginUser("Jenn", email);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {isLoggedIn ? null : (
          <Button
            variant={"ghost"}
            className="text-white bg-gradient-to-r from-marketblue text-black to-marketgreen
             font-audimat text-sm uppercase px-4 sm:px-8 rounded-none ">
            Login
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="dark w-[400px] bg-white">
        <div>
          {!isLoggedIn ? (
            <div className="my-10 flex items-center text-3xl flex-col">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="138"
                width="230"
                className="pr-2"
              >
                <image
                  href="/galaxy-marketplace.svg"
                  height="138"
                  width="230"
                />
              </svg>
            </div>
          ) : null}
          {isLoggedIn && (
            <p className="outfitters text-2xl text-black font-sohne text-center py-4">
              Welcome Back!
            </p>
          )}
        </div>
        <div className="grid justify-center">
          {!isLoggedIn ? (
            <>
              <div className="w-full px-8">
                <div>
                  <Input
                    placeholder="Email"
                    defaultValue={"jenn@launchmail.io"}
                    ref={inputRef}
                    className="mb-8 3xl:mb-24 outline-none border-0 border-b-2 border-zinc-200 rounded-none text-lg bg-white"
                  />
                </div>
                <DialogTrigger asChild>
                  <Button
                    onClick={(e) => handleLogin(e)}
                    className="w-full mx-auto font-sohnelight text-black rounded-none bg-gradient-to-tr from-marketblue to-marketgreen text-lg"
                  >
                    Sign in with SSO
                  </Button>
                </DialogTrigger>
              </div>

              <div className="flex flex-row justify-between px-4 pb-8 pt-4 3xl:pt-14">
                <div className="text-blue-600 text-xs">
                  <p>Forgot Password?</p>
                </div>
                <div>
                  <p className="text-black text-xs">
                    Don't have an account?{" "}
                    <a href="/bank" className="text-blue-600">
                      Sign Up
                    </a>
                  </p>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="mx-auto text-center items-center align-center flex text-black font-sohnelight pt-4 font-robotobold text-xl items-center align-center">
                <p className="pt-4">
                  Thank you for shopping with us as a{" "}
                  <span className="text-2xl">Premium Member</span>!
                </p>
              </div>
              <div className="mx-auto text-center">
                <DialogTrigger asChild>
                  <Button
                    onClick={handleLogout}
                    className="text-xl bg-red-700 text-black items-center my-6 w-full bg-gradient-to-tr from-marketblue to-marketgreen text-lg rounded-none"
                  >
                    Logout
                  </Button>
                </DialogTrigger>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
