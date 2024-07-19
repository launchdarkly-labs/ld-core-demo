import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { useContext, useState } from "react";
import LoginContext from "@/utils/contexts/login";
import { getVariantClassName } from "@/utils/getVariantClassName";
import { STARTER_PERSONAS } from "@/utils/contexts/StarterUserPersonas";

interface Persona {
  personaname: string;
  personatier: string;
  personaimage: string;
  personaemail: string;
  personarole: string;
}

interface QuickLoginDialogProps {
  personas: Persona[];
  variant: "bank" | "airlines" | "market" | "investment";
}

export function QuickLoginDialog({ variant }: QuickLoginDialogProps) {
  const { user, loginUser } = useContext(LoginContext);
  const variantClass = getVariantClassName(variant);
  const [isDialogOpen, setIsDialogOpen] = useState(true);

  const personaClicked = (persona: Persona) => {
    loginUser(persona.personaname, persona.personaemail, persona.personarole);
  };
  return (
    <>
      {isDialogOpen ? (
        <Dialog>
          <DialogTrigger
            className={`w-full min-h-full p-1  font-audimat rounded-none text-xl border-2 border-loginComponentBlue text-black hover:text-white hover:bg-gray-800`}
          >
            Quick Login
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="mb-4">Quick Login SSO User</DialogTitle>
              <div className="overflow-y-auto h-64">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-6 justify-items-center py-4">
                  {STARTER_PERSONAS.filter((persona) => persona.personaname !== user).map(
                    (persona, index) => (
                      <DialogClose>
                        <div
                          key={index}
                          className="flex flex-col items-center cursor-pointer flex-shrink-0 hover:brightness-125 text-md font-sohnelight gap-y-2 text-center"
                          onClick={() => personaClicked(persona)}
                        >
                          <img
                            src={persona.personaimage}
                            className="w-20 h-20 rounded-full"
                            alt={persona.personaname}
                          />
                          <p className="">{persona.personaname}</p>
                          <p className="">{persona.personaemail}</p>
                          <p className="">Role: {persona.personarole}</p>
                          <p className="">{persona.personatier} Tier</p>
                        </div>
                      </DialogClose>
                    )
                  )}
                </div>
              </div>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      ) : null}
    </>
  );
}
