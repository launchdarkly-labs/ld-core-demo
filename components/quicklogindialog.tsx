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
import { capitalizeFirstLetter } from "@/utils/utils";
import type { VariantInterface, Persona } from "@/utils/typescriptTypesInterfaceLogin";
import type { LoginContextType } from "@/utils/typescriptTypesInterfaceLogin";

export function QuickLoginDialog({ variant }: VariantInterface) {
  const { loginUser, isLoggedIn, userObject, allUsers }: LoginContextType =
    useContext(LoginContext);

  const personaClicked = (persona: Persona): void => {
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
            <DialogTitle className="mb-4">
              {" "}
              {isLoggedIn ? "Quick Login SSO User" : "Switch SSO User"}
            </DialogTitle>
            <div className="overflow-y-auto h-64">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-6 justify-items-center py-4">
                {allUsers
                  ?.filter((persona: any) => persona.personaname !== userObject.personaname)
                  .map((persona: any, index: number) => (
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
                        <p className="">
                          {variant?.includes("airlines")
                            ? capitalizeFirstLetter(persona.personalaunchclubstatus)
                            : capitalizeFirstLetter(persona.personatier)}{" "}
                          Tier
                        </p>
                      </div>
                    </DialogClose>
                  ))}
              </div>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
