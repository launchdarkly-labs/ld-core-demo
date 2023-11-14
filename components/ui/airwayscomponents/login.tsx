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
import LoginContext from "@/utils/contexts/login";
import { useContext } from "react";
import { useState } from "react";
import BookedFlights from "./bookedFlights";

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  password: z.string().min(4, { message: "Invalid email address" }),
});

export default function LoginScreen() {
  const { isLoggedIn, setIsLoggedIn, loginUser, logoutUser, user } =
    useContext(LoginContext);
  const [username, setUsername] = useState("");

  const handleLogout = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    logoutUser();
    setUsername("");
  };

  const handleLogin = async () => {
    await setIsLoggedIn(true);
    await loginUser("Jenn");
  };

  return (
    <Popover>
      <PopoverTrigger>
        <Button
          variant={"ghost"}
          className="text-white bg-blue-700 font-audimat text-md uppercase px-8 rounded-none"
        >
          {isLoggedIn ? "Account" : "Log In"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="dark w-[600px]">
        <div>
          <p className="text-sm mx-auto text-center font-robotobold">
            Launch Airways
          </p>
          {isLoggedIn && (
            <p className="outfitters text-2xl font-robotobold text-center py-4">
              Welcome Back!
            </p>
          )}
        </div>
        <div className="grid justify-center">
          <div className="mx-auto">
            <img src="woman.png" className="rounded-full h-48" />
          </div>
          {isLoggedIn && (
            <div className="mx-auto text-center pt-4 font-robotobold text-xl">
              <BookedFlights />
              <p className="pt-4">
                Thank you for flying Launch Airways at{" "}
                <span className="text-2xl">Platinum Tier</span>!
              </p>
            </div>
          )}

          <div className="mx-auto pt-8 font-audimat">
            {!isLoggedIn ? (
              <Button
                onClick={handleLogin}
                className="text-xl bg-blue-700 text-white items-center"
              >
                Login with SSO
              </Button>
            ) : (
              <Button
                onClick={handleLogout}
                className="text-xl bg-red-700 text-white items-center"
              >
                Logout
              </Button>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
