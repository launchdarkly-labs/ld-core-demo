import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
  } from "@/components/ui/alert-dialog";
  import { PersonStanding, PlaneIcon, Wifi } from "lucide-react";
  import { useContext } from "react";
  import LoginContext from "@/utils/contexts/login";
  import { useFlags, useLDClient } from "launchdarkly-react-client-sdk";
  
  export default function CheckIn({ trip }: any) {
    const { priorityBoarding, mealPromoExperience } =
      useFlags();
    const { enrolledInLaunchClub } = useContext(LoginContext);
    const client = useLDClient();
  
    const handleCheckIn = async () => {
        if (!client) return; // Ensure client is not undefined
        const context = await client.getContext();
      
        context.experience = {
          key: trip.id,
          airplane: trip.airplane,
          flightNumber: trip.flightNumber,
        };
        client.identify(context);
      };
      
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 w-full"
            onClick={handleCheckIn}
          >
            Check In
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ready to Check In?</AlertDialogTitle>
            <AlertDialogDescription>
              <div className="grid lg:flex mx-auto items-center justify-center space-x-4 mt-4">
                {enrolledInLaunchClub && (
                  <>
                    {priorityBoarding && (
                      <p className="flex text-black  py-2 font-sohne bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600   ">
                        <PersonStanding className="text-blue-700 mr-2" /> Launch
                        Priority
                      </p>
                    )}
  
                    <p className="flex text-black  py-2 font-sohne bg-clip-text text-transparent bg-gradient-to-r from-blue-800 to-red-600  ">
                      <Wifi className="text-green-700 mr-2" /> Free WiFi
                    </p>
                  </>
                )}
                {mealPromoExperience && (
                  <p className="flex text-black  py-2 font-sohne bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-yellow-600  ">
                    <PlaneIcon className="text-green-700 mr-2" /> A330 Meal Promo
                  </p>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Check In</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }
  