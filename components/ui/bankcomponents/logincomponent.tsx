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
    <Card className="w-[275px] rounded-none font-audimat">
      <CardHeader className="text-center">
        <CardTitle>Global Scale Login</CardTitle>
        <CardDescription>Access your account here</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid justify-center">
            <img src='woman.png' className="rounded-full h-36" /> 
        </div>
        
      </CardContent>
      <CardFooter className="">
        <Button onClick={handleLogin} className="w-2/3 mx-auto font-audimat text-xl">Login with SSO</Button>
      </CardFooter>
    </Card>
  )
}
