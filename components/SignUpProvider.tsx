"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { UserDataType } from "@/utils/typescriptTypesInterfaceIndustry"
import { INITIAL_USER_SIGNUP_DATA } from "@/utils/constants"


type SignupContextType = {
  userData: UserDataType
  updateUserData: (data: Partial<UserDataType>) => void
  toggleService: (service: string) => void
}

const SignupContext = createContext<SignupContextType | undefined>(undefined)

export function SignupProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<UserDataType>(INITIAL_USER_SIGNUP_DATA)

  const updateUserData = (data: Partial<UserDataType>) => {
    setUserData((prev: UserDataType) => ({ ...prev, ...data }))
  }

  const toggleService = (service: string) => {
    setUserData((prev: UserDataType) => {
      const services = [...prev.selectedServices]

      if (services.includes(service)) {
        return {
          ...prev,
          selectedServices: services.filter((s) => s !== service),
        }
      } else {
        return {
          ...prev,
          selectedServices: [...services, service],
        }
      }
    })
  }

  return <SignupContext.Provider value={{ userData, updateUserData, toggleService }}>{children}</SignupContext.Provider>
}

export function useSignup() {
  const context = useContext(SignupContext)
  if (context === undefined) {
    throw new Error("useSignup must be used within a SignupProvider")
  }
  return context
} 