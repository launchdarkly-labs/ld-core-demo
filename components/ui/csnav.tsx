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
import experiment from "@/public/sidenav/experiment-navigate.svg";
import ai from "@/public/sidenav/ai-navigate.svg";
import remediate from "@/public/sidenav/remediate-navigate.svg";
import release from "@/public/sidenav/release-navigate.svg";
import Link from "next/link";

export function CSNav() {
  const router = useRouter();

  function goHome() {
    router.push("/");
  }

  function goRelease() {
    router.push("/bank");
  }

  function goRemediate() {
    router.push("/investment");
  }

  function goTargeting() {
    router.push("/airways");
  }

  function goExp() {
    router.push("/marketplace");
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Menu size={24} className="text-white cursor-pointer" />
      </SheetTrigger>
      <SheetContent className="overflow-y-scroll w-full" side="left">
        <SheetHeader className="">
          <SheetTitle className="font-sohne text-2xl">
            <img src="ldLogo_black.svg" className="w-64" />
          </SheetTitle>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid items-center gap-4">
          <div className="my-2">
              <h3 className="text-ldlightgray font-sohnelight tracking-widest">Core Service Demos</h3>
              <hr className="border border-1 border-ldlightgray/30 w-full mt-4" />
            </div>
            <Button onClick={goHome} variant={"secondary"} className="w-full rounded-2xl">
              Go Home
            </Button>

            <motion.div
              initial={{ x: -100, opacity: 0 }}
              whileHover={{ scale: 1.05 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <div onClick={goRelease}>
                <CSCard
                  className="bg-gradient-releases cursor-pointer"
                  cardTitle="Automate Releases"
                  cardSubtitle="Let developers move faster and more confidently with feature management."
                  icon={release}
                />
              </div>
            </motion.div>
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              whileHover={{ scale: 1.05 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <div onClick={goRemediate}>
                <CSCard
                  className="bg-gradient-investment cursor-pointer"
                  cardTitle="Monitor Features"
                  cardSubtitle="Uncover and remediate software errors before they become customer issues."
                  icon={remediate}
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
                  cardTitle="Accelerate AI"
                  cardSubtitle="Modernize AI solutions with control, visibility, and speed"
                  icon={ai}
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
                  cardTitle="Experiment Everywhere"
                  cardSubtitle="Continuously measure and improve the business value of digital products."
                  icon={experiment}
                />
              </div>
            </motion.div>
            <div className="my-2">
              <h3 className="text-ldlightgray font-sohnelight tracking-widest">Explore More</h3>
              <hr className="border border-1 border-ldlightgray/30 w-full mt-4" />
            </div>

            <Link href='/examples' className="text-2xl text-navblue hover:underline">
              Code Examples
            </Link>

            <Link  href='/architecture' className="text-2xl text-navblue hover:underline" >
              Architecture
            </Link>
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
