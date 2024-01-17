//@ts-nocheck
import * as React from "react"
import { useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getVariantClassName } from '@/utils/getVariantClassName';
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Persona {
  id: string | number;
  personaName: string;
  personaType: string;
  personaImage: string;
  personaEmail: string;
}

interface LoginComponentProps {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  loginUser: any
  variant: 'bank' | 'airlines' | 'market';
  name: string;
}

export function LoginComponent({ isLoggedIn, setIsLoggedIn, loginUser, variant, name }: LoginComponentProps) {
  const inputRef = useRef();
  const [activeElement, setActiveElement] = useState(null);
  const [defaultEmail, setDefaultEmail] = useState(null);
  const variantClass = getVariantClassName(variant);
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [newPersona, setNewPersona] = useState({ name: '', type: '', image: '', email: '' });
  const [personas, setPersonas] = useState([]);
  const [isAddUserDropdownOpen, setIsAddUserDropdownOpen] = useState(false);
  const [submitError, setSubmitError] = useState(null);


  useEffect(() => {
    fetch("/api/personas?personaToQuery=all")
      .then((response) => response.json())
      .then((data) => setPersonas(data));
  }, []);

  const handleNewPersonaChange = (e) => {
    setNewPersona({ ...newPersona, [e.target.name]: e.target.value });
  };

  const handleSubmitNewPersona = () => {
    fetch('/api/personas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newPersona),
    })
      .then(response => response.json())
      .then(data => {
        if (data && data.error) {
          setSubmitError(data.error);
        } else {
          setPersonas(prevPersonas => [...prevPersonas, data]);
          setIsAddUserDialogOpen(false);
          setIsAddUserDropdownOpen(false);
          setSubmitError(null);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        setSubmitError('Failed to create new persona. Please try again.');
      });
  };

  function handleLogin(e) {
    setIsLoggedIn(true);
    let email;
    let name;
    const activePersona = personas.find(p => p.personaName === activeElement);
    if (activePersona) {
      email = activePersona.personaEmail;
      name = activePersona.personaName;
    }
    else {
      email = 'jenn@launchmail.io';
      name = 'Jenn';
    }
    loginUser(name, email);
  };

  const handleDeleteAllPersonas = () => {
    fetch('/api/personas', {
      method: 'DELETE',
    })
      .then(response => {
        if (response.ok) {
          setPersonas([]);
          console.log('All personas deleted successfully');
        } else {
          throw new Error('Failed to delete all personas');
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  const handleSetActive = (personaName, personaEmail) => {
    setActiveElement(personaName);
    setDefaultEmail(personaEmail);
  };

  useEffect(() => {
    if (activeElement) {
      handleLogin();
    }
  }, [activeElement]);

  const variantToImageMap = {
    bank: "ToggleBankBlue.png",
    airlines: "/launch-airways.svg",
    market: "/market.png",
  };
  const imageSrc = variantToImageMap[variant];

  const toggleAddUserDropdown = () => {
    setIsAddUserDropdownOpen(!isAddUserDropdownOpen);
  };

  return (
    <div className="w-full sm:w-[425px] 3xl:h-[500px] bg-white font-audimat shadow-xl">

      <div className="flex flex-col justify-center mx-auto text-center">
        <img
          src={imageSrc}
          width={64}
          className="pt-10 mx-auto pb-4"
        />
        <p className="text-3xl sm:text-4xl font-sohnelight pb-12 3xl:pb-24 !font-thin">
          <span className="!font-extrabold">{name}</span>
        </p>
      </div>
      <div className="w-full px-8">
        <div>
          <Input
            placeholder="Email"
            value={defaultEmail || "jenn@launchmail.io"}
            ref={inputRef}
            className="mb-8 3xl:mb-24 outline-none border-0 border-b-2 text-xl"
            onChange={(e) => setDefaultEmail(e.target.value)}
          />
        </div>

        <Button
          onClick={handleLogin}
          className={`mb-4 w-full h-full mx-auto font-audimat rounded-none  text-xl ${variantClass}`}>
          Login with SSO
        </Button>

        <Dialog onDismiss={() => { setIsAddUserDropdownOpen(false) }} className="z-10">
          <DialogTrigger className={`mb-4 p-2 w-full h-full mx-auto font-audimat rounded-none text-xl ${variantClass} hover:bg-gray-800`}>
            Switch SSO User
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Switch SSO User</DialogTitle>


              <div className="overflow-y-auto h-64">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 justify-items-center mb-4 pt-6">
                  {personas.map((item: Persona) => (
                    <div className="flex flex-col items-center" key={item.id}>
                      <img
                        src={item.personaImage}
                        className={`w-24 rounded-full mb-4 ${activeElement === item.personaName ? 'border-4 border-black' : ''}`}
                        onClick={() => handleSetActive(item.personaName, item.personaEmail)}
                        alt={item.personaName}
                      />
                      <p className="text-xs sm:text-sm md:text-base text-center font-bold font-sohnelight">
                        {item.personaName}
                      </p>
                      <p className="text-xs sm:text-sm md:text-base text-center font-bold font-sohnelight">
                        {item.personaType}
                      </p>
                    </div>
                  ))}

                  {isAddUserDropdownOpen && (
                    <div className="absolute z-100 left-0 top-0 bottom-0 pt-8 w-full bg-white shadow-lg">
                      <div className="p-4">
                        <div className="mb-2">
                          <input
                            type="text"
                            name="name"
                            placeholder="Name"
                            value={newPersona.name}
                            required
                            onChange={handleNewPersonaChange}
                            className="w-full p-2 border border-gray-300 rounded"
                          />
                        </div>
                        <div className="mb-2">
                          <input
                            type="text"
                            name="type"
                            placeholder="Type"
                            value={newPersona.type}
                            required
                            onChange={handleNewPersonaChange}
                            className="w-full p-2 border border-gray-300 rounded"
                          />
                        </div>
                        <div className="mb-2">
                          <input
                            type="text"
                            name="email"
                            placeholder="Email"
                            value={newPersona.email}
                            required
                            onChange={handleNewPersonaChange}
                            className="w-full p-2 border border-gray-300 rounded"
                          />
                        </div>
                        <div className="mb-0 overflow-x-auto rounded">
                          <div className="flex space-x-4 p-2">
                            {['persona1.png', 'persona2.png', 'persona3.png', 'persona4.png', 'persona5.png'].map((imageName) => (
                              <img
                                key={imageName}
                                src={`/personas/${imageName}`}
                                alt={imageName}
                                className={`w-24 h-24 rounded-full cursor-pointer ${newPersona.image === `/personas/${imageName}` ? 'border-4 border-blue-500' : ''}`}
                                onClick={() => setNewPersona({ ...newPersona, image: `/personas/${imageName}` })}
                              />
                            ))}
                          </div>
                        </div>
                        <Button onClick={handleSubmitNewPersona} className={`mb-2 w-full h-full mx-auto font-audimat mt-4 rounded-none text-xl ${variantClass}`}>
                          Submit
                        </Button>

                        {submitError && (
                          <p className="text-red-500 text-sm z-100">{submitError}</p>
                        )}
                      </div>

                    </div>
                  )}
                </div>
              </div>
            </DialogHeader>

            <DialogFooter>
              <Button onClick={toggleAddUserDropdown} className={`mb-4 w-full h-full mx-auto font-audimat rounded-none text-xl ${variantClass}`}>
                Add New User
              </Button>
              <Button onClick={handleDeleteAllPersonas} className={`w-full h-full mx-auto font-audimat rounded-none text-xl ${variantClass}`}>
                Reset Users
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>


      </div>
      <div className="flex flex-col  sm:flex-row  justify-between px-8 pb-8">
        <div>
          <p>Forgot Password?</p>
        </div>
        <div>
          <p>
            Don't have an account?{" "}
            <a href={window.location.href} className="text-blue-600 ml-2">
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
