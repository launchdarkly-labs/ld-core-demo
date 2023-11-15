import * as React from "react"

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

  const ldclient = useLDClient()

  function handleLogin() {
    setIsLoggedIn(true)
    const context: any = ldclient?.getContext();
    loginUser('Jenn')
    context.user.tier = 'Platinum'
    ldclient?.identify(context);
    setCookie("ldcontext", context);
  }

  return (
    <div className="w-[425px] bg-white font-audimat shadow-xl">
      <div className="flex flex-col justify-center mx-auto text-center">
        <img src='ToggleBankBlue.png' width={64} className="pt-10 mx-auto pb-4" />
        <p className="text-4xl font-sohnelight pb-12">Toggle<span className="font-bold">Bank</span></p>
      </div>
      <div>
        
      </div>
      <div className="w-full px-8">
        <div>
      <Input placeholder="Email" className="mb-8 outline-none border-0 border-b-2 text-xl" />
      </div>
        <Button onClick={handleLogin} className="w-full mx-auto font-audimat rounded-none bg-blue-500 text-xl">Login with SSO</Button>
      </div>
      <div className="flex flex-row justify-between px-8 pb-10 pt-4">
        <div>
          <p>Forgot Password?</p>
        </div>
        <div>
          <p>Don't have an account? <a href='/bank' className='text-blue-600'>Sign Up</a></p>
        </div>
      </div>
    </div>
  )
}
