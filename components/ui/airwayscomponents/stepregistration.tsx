import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useFlags, useLDClient } from "launchdarkly-react-client-sdk";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

type FormData1 = z.infer<typeof step1Schema>;
type FormData2 = z.infer<typeof step2Schema>;
type FormData3 = z.infer<typeof step3Schema>;

const step1Schema = z.object({
  username: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  // firstName: z.string(),
  // lastName: z.string(),
});

const step2Schema = z.object({
  preferredseating: z.string(),
  mealoption: z.string(),
});

const step3Schema = z.object({
  toggleclub: z.boolean(),
});

export function RegistrationForm() {
  const { newPreferenceControls } = useFlags();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});

  const form1 = useForm({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      //   firstName: "",
      //   lastName: "",
    },
  });

  const form2 = useForm({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      preferredseating: "",
      mealoption: "",
    },
  });
  const form3 = useForm({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      toggleclub: false,
    },
  });

  const onSubmit1 = async (values: FormData1) => {

    setFormData((prevState) => ({ ...prevState, ...values }));
    const usercheck = await fetch("/api/checkuser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });
    if (usercheck.status !== 200) {
      alert("Username or email is already registered");
    } else {
      setStep(2);
    }
  };

  const onSubmit2 = (values: FormData2) => {
    setFormData((prevState) => ({ ...prevState, ...values }));
    setStep(3);
  };

  const onSubmit3 = async (values: FormData3) => {
    const finalFormData = { ...formData, ...values };
    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalFormData),
      });

      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      const data = await response.json();
      setOpen(false);
      setStep(1);
      await setFormData({});
    } catch (error) {
      // Handle error here
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger><Button className="text-white bg-black text-xl font-audimat px-8 border-2 uppercase rounded-none items-center hover:bg-white hover:text-black">Register</Button></DialogTrigger>
      <DialogContent className="dark text-white font-roboto">
        <p className="text-2xl mx-auto text-center font-robotobold">
          Launch Airlines
        </p>
        <p className="mx-auto text-center text-xl font-roboto">
          Register for Launch Club today and start flying immediately. Receive early flight access, upgrades, and other special offers!
        </p>
        {step === 1 && (
          <Form {...form1}>
            <form onSubmit={form1.handleSubmit(onSubmit1)}>
              <FormField
                control={form1.control}
                name="username"
                render={({ field }) => (
                  <FormItem className="pb-4">
                    <FormLabel className="text-lg">Username</FormLabel>
                    <Input {...field} />
                  </FormItem>
                )}
              />
              <FormField
                control={form1.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="pb-4">
                    <FormLabel className="text-lg">Password</FormLabel>
                    <Input {...field} type="password" />
                  </FormItem>
                )}
              />
              <FormField
                control={form1.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="pb-4">
                    <FormLabel className="text-lg">Email</FormLabel>
                    <Input {...field} />
                  </FormItem>
                )}
              />
              <Button
                className="bg-blue-700 text-white text-xl mx-auto block text-center"
                type="submit"
              >
                Next
              </Button>
            </form>
          </Form>
        )}
        {step === 2 && (
          <Form {...form2}>
            <form onSubmit={form2.handleSubmit(onSubmit2)}>
              <FormField
                control={form2.control}
                name="preferredseating"
                render={({ field }) => (
                  <FormItem className="pb-4">
                    <FormLabel className="text-lg">Preferred Seating</FormLabel>
                    {newPreferenceControls ? (
                      <Select
                        value={field.value}
                        onValueChange={(value) => field.onChange(value)}
                      >
                        <SelectTrigger className="">
                          <SelectValue placeholder="Seating Preference" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="window">Window</SelectItem>
                          <SelectItem value="aisle">Aisle</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input {...field} />
                    )}
                  </FormItem>
                )}
              />
              <FormField
                control={form2.control}
                name="mealoption"
                render={({ field }) => (
                  <FormItem className="pb-4">
                    <FormLabel className="text-lg">Meal Option</FormLabel>
                    {newPreferenceControls ? (
                      <Select
                        value={field.value}
                        onValueChange={(value) => field.onChange(value)}
                      >
                        <SelectTrigger className="">
                          <SelectValue placeholder="Meal Preference" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="protein">Meat Protein</SelectItem>
                          <SelectItem value="vegetarian">Vegetarian</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input {...field} />
                    )}
                  </FormItem>
                )}
              />
              <Button
                className="bg-blue-700 text-white text-xl mx-auto block text-center"
                type="submit"
              >
                Next
              </Button>
            </form>
          </Form>
        )}
        {step === 3 && (
          <Form {...form3}>
            <form onSubmit={form3.handleSubmit(onSubmit3)}>
              {/* Form fields for step 3 */}
              <FormField
                control={form3.control}
                name="toggleclub"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Register for ToggleClub?</FormLabel>
                      <FormDescription>
                        Earn status, free upgrades, and other perks!
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              <Button
                className="bg-blue-700 text-white text-xl mx-auto block text-center"
                type="submit"
              >
                Complete Registration
              </Button>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}