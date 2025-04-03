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
import Link from "next/link";
import { CSNAV_ITEMS } from "@/utils/constants";
import QuickCommandDialog from "@/components/quickcommand"; // Add this import


export function CSNav() {
	const router = useRouter();

	function goHome() {
		router.push("/");
	}

	return (
		<Sheet>
			<SheetTrigger asChild>
				<Menu size={24} className="text-navlink cursor-pointer" />
			</SheetTrigger>
			<SheetContent className="overflow-y-scroll w-full" side="left">
				<SheetHeader className="">
					<SheetTitle className="font-sohne text-2xl">
						<img src="ldLogo_black.svg" onClick={goHome} className="w-56 cursor-pointer" />
					</SheetTitle>
				</SheetHeader>
				<div className="grid gap-4 py-4">
					<div className="grid items-center gap-4">
						<div className="my-2">
							<h3 className="text-ldlightgray font-sohnelight text-sm tracking-widest">CORE SERVICES DEMO</h3>
						</div>
						{Object.entries(CSNAV_ITEMS).map(([key, item]) => {
							if (item.type === "usecase") {
								return (
									<motion.div
										key={key}
										initial={{ x: -100, opacity: 0 }}
										whileHover={{ scale: 1.05 }}
										animate={{ x: 0, opacity: 1 }}
										transition={{ delay: 0.05, duration: 0.2 }}
										className="cursor-pointer"
									>
										<div onClick={() => router.push(item.link)} className={`bg-gradient-to-r from-${key}-start to-${key}-end rounded-3xl shadow-lg`}>
											<CSCard
												className="cursor-pointer"
												cardTitle={item.title}
												icon={item.icon}
												iconHover={item.iconHover}
												hoverBackground={item.hoverBackground}
												noHoverBackground={item.noHoverBackground}
											/>
										</div>
									</motion.div>
								);
							}
							return null;
						})}

						<div className="my-2">
							<h3 className="text-ldlightgray font-sohnelight tracking-widest text-sm">EXPLORE MORE</h3>
						</div>

						{Object.entries(CSNAV_ITEMS).map(([key, item]) => {
							if (item.type === "resource") {
								return (
									<motion.div
										key={key}
										initial={{ x: -100, opacity: 0 }}
										whileHover={{ scale: 1.05 }}
										animate={{ x: 0, opacity: 1 }}
										transition={{ delay: 0.05, duration: 0.2 }}
										className="cursor-pointer"
									>
										<div onClick={() => router.push(item.link)} className={`bg-gradient-to-r from-${key}-start to-${key}-end rounded-3xl shadow-lg`}>
											<CSCard
												className="cursor-pointer"
												cardTitle={item.title}
												icon={item.icon}
												iconHover={item.icon}
												hoverBackground={item.hoverBackground}
												noHoverBackground={item.noHoverBackground}
											/>
										</div>
									</motion.div>
								);
							}
							return null;
						})}
            <div className="m-2">
							<h3 className="text-ldlightgray font-sohnelight tracking-widest text-sm">RESOURCES</h3>
						</div>
            <motion.div
										initial={{ x: -100, opacity: 0 }}
										whileHover={{ scale: 1.05 }}
										animate={{ x: 0, opacity: 1 }}
										transition={{ delay: 0.05, duration: 0.2 }}
										className="cursor-pointer"
									>
              <div
                className="cursor-pointer bottom-2 left-2 bg-gradient-to-r from-zinc-600 to-zinc-950 hover:bg-gradient-to-r hover:from-neutral-600 hover:to-neutral-300 hover:text-black text-white rounded-2xl shadow-lg p-2 pl-6 text-xl font-sohne flex-grow text-center mx-auto"
                onClick={() => {
                  const event = new KeyboardEvent('keydown', {
                    key: 'k',
                    ctrlKey: true,
                  });
                  document.dispatchEvent(event);
                }}
              >
                Demo Tools
              </div>
              </motion.div>
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
