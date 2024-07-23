import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { useContext } from "react";
import LoginContext from "@/utils/contexts/login";
import { STARTER_PERSONAS } from "@/utils/contexts/StarterUserPersonas";

interface Persona {
  personaname: string;
  personatier: string;
  personaimage: string;
  personaemail: string;
  personarole: string;
}

export function QuickLoginDialog() {
  const { loginUser, isLoggedIn, userObject } = useContext(LoginContext);

  const personaClicked = (persona: Persona) => {
    loginUser(persona.personaemail);
  };

  const homePageButtonStyling = `mb-4 p-2 w-full mx-auto font-audimat rounded-none text-xl border-2 border-loginComponentBlue text-black hover:bg-gray-800 hover:text-white`;
  const dashboardButtonStyling = `w-full min-h-full p-1  font-audimat rounded-none text-xl border-2 border-loginComponentBlue text-black hover:text-white hover:bg-gray-800`;
  
  return (
    <>
      <Dialog>
        <DialogTrigger className={isLoggedIn ? dashboardButtonStyling : homePageButtonStyling}>
          {isLoggedIn ? "Quick Login" : "Switch SSO User"}
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="mb-4">  {isLoggedIn ? "Quick Login SSO User" : "Switch SSO User"}</DialogTitle>
            <div className="overflow-y-auto h-64">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-6 justify-items-center py-4">
                {STARTER_PERSONAS.filter((persona) => persona.personaname !== userObject.personaname).map(
                  (persona, index) => (
                    <DialogClose key={index}>
                      <div
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
    </>
  );
}
