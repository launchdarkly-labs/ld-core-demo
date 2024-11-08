import { useContext } from "react";
import LoginContext from "@/utils/contexts/login";
import BankHomePage from "@/components/ui/bankcomponents/bankHomePage";
import BankUserDashboard from "@/components/ui/bankcomponents/bankUserDashboard";

export default function Bank() {
  const { isLoggedIn } = useContext(LoginContext);
  return (
    <>
        <div className="bg-bank-homepage-background min-h-screen  ">
          
        {!isLoggedIn ? (
          <BankHomePage/>
        ) : (
          <BankUserDashboard /> 
        )}
    </div>
      </>
    );    
  }