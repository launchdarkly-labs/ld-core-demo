import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useRouter } from "next/router";
import { CSCard } from "./ldcscard";
import { motion } from "framer-motion";

export function CSNav() {
  const router = useRouter();

  function goHome() {
    router.push("/");
  }

  function goRelease() {
    router.push("/bank");
  }

  function goTargeting() {
    router.push("/airways");
  }

  function goExp() {
    router.push("/marketplace");
  }

  function goMobile() {
    router.push("/mobile");
  }

  function goCode() {
    router.push("/examples");
  }

  function goArchitecture() {
    router.push("/architecture");
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Menu size={24} className="text-white cursor-pointer" />
      </SheetTrigger>
      <SheetContent className="overflow-y-scroll" side="left">
        <SheetHeader className="mx-4">
          <SheetTitle className="font-sohne text-2xl">
            <img src='logo.png' className='w-64' />
          </SheetTitle>
          
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid items-center gap-4">
            <div>
              <Button onClick={goHome} variant={"secondary"} className="w-full rounded-2xl">
                Go Home
              </Button>
            </div>
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              whileHover={{ scale: 1.05 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <div onClick={goRelease}>
                <CSCard
                  className="bg-gradient-releases cursor-pointer"
                  herotext="Navigate to Release Confidently and Consistently"
                  
                />
              </div>
            </motion.div>
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              whileHover={{ scale: 1.05 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <div onClick={goRelease}>
                <CSCard
                  className="bg-gradient-mobile cursor-pointer"
                  herotext="Navigate to Automatically Remediate"
                />
              </div>
              
            </motion.div>
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              whileHover={{ scale: 1.05 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <div onClick={goTargeting}>
                <CSCard
                  className="bg-gradient-targeting cursor-pointer"
                  herotext="Navigate to Targeted and Personalized Experiences"
                />
              </div>
              
            </motion.div>
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              whileHover={{ scale: 1.05 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <div onClick={goExp}>
                <CSCard
                  className="bg-gradient-experimentation cursor-pointer"
                  herotext="Navigate to Product Experimentation"
                />
              </div>
            </motion.div>
            <div>
              <Button onClick={goCode} variant={"secondary"} className="w-full rounded-xl">
                Code Examples
              </Button>
            </div>
            <div>
              <Button onClick={goArchitecture} variant={"secondary"} className="w-full rounded-xl">
                Architecture
              </Button>
            </div>
          </div>
        </div>
        <SheetFooter>
          {/* <SheetClose asChild>
            <Button type="submit">Save changes</Button>
          </SheetClose> */}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
