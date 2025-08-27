"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { UserDataType } from "@/utils/typescriptTypesInterfaceIndustry"
import { INITIAL_USER_SIGNUP_DATA } from "@/utils/constants"

type SignupContextType = {
  userData: UserDataType
  updateUserData: (data: Partial<UserDataType>) => void
}

const SignupContext = createContext<SignupContextType | undefined>(undefined)

export function SignupProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<UserDataType>(INITIAL_USER_SIGNUP_DATA)

  const updateUserData = (data: Partial<UserDataType>) => {
    setUserData((prev: UserDataType) => ({ ...prev, ...data }))
  }

  return <SignupContext.Provider value={{ userData, updateUserData }}>{children}</SignupContext.Provider>
}

export function useSignup() {
  const context = useContext(SignupContext)
  if (context === undefined) {
    throw new Error("useSignup must be used within a SignupProvider")
  }
  return context
} 