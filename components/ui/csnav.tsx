import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, Navigation } from "lucide-react";
import { useRouter } from "next/router";
import { CSCard } from "./ldcscard";
import { motion } from "framer-motion";
import { useState } from "react";

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

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Menu size={24} className="text-white cursor-pointer" />
      </SheetTrigger>
      <SheetContent className="" side="left">
        <SheetHeader>
          <SheetTitle className="font-sohne text-2xl">Demo Navigation</SheetTitle>
          <SheetDescription className="font-sohne">
            Explore the core services of LaunchDarkly
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid items-center gap-4">
            <div>
              <Button onClick={goHome} variant={"secondary"} className="w-full rounded-xl">
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
                  herotext="Navigate to De-Risked Releases"
                />
              </div>
            </motion.div>
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              whileHover={{ scale: 1.05 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <div onClick={goTargeting}>
                <CSCard
                  className="bg-gradient-targeting cursor-pointer"
                  herotext="Navigate to Targeted Experiences"
                />
              </div>
            </motion.div>
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              whileHover={{ scale: 1.05 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <div onClick={goExp}>
                <CSCard
                  className="bg-gradient-experimentation cursor-pointer"
                  herotext="Navigate to Product Experimentation"
                />
              </div>
            </motion.div>
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              whileHover={{ scale: 1.05 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <div onClick={goMobile}>
                <CSCard
                  className="bg-gradient-mobile cursor-pointer"
                  herotext="Navigate to Mobile Optimization"
                />
              </div>
            </motion.div>
            <div>
              <Button onClick={goCode} variant={"secondary"} className="w-full rounded-xl">
                Code Examples
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
