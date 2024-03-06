"use client"

import * as React from "react"
import {
    RotateCcw,
    FlaskConical,
} from "lucide-react"
import { useRouter } from "next/router";

import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command"
import { toast } from "./ui/use-toast";
import ExperimentGenerator from "@/components/ui/marketcomponents/experimentgenerator";

export function QuickCommandDialog({ children }) {
    const [open, setOpen] = React.useState(false)
    const location = useRouter();
    const [timer, setTimer] = React.useState(0);


    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }

        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    const resetFeatureFlags = async () => {
        toast({
            title: "Resetting",
            description:
                "Currently resetting all LaunchDarkly flags for this environment. Give us 30 seconds.",
        });

        setTimer(30); // Start the timer at 30 seconds
        const intervalId = setInterval(() => {
            setTimer((prevTimer) => {
                if (prevTimer <= 1) {
                    clearInterval(intervalId); // Clear interval when timer reaches 0
                    return 0;
                }
                return prevTimer - 1;
            });
        }, 1000);

        await fetch("/api/ldreset");
        location.reload();
        location.push('/');
    }

    return (
        <>
            {children}
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Type a command or search..." />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="Actions">
                        <CommandItem >
                            <RotateCcw className="mr-2 h-4 w-4" />
                            {timer > 0 ? (
                                <p>Resetting in {timer}</p>
                            ) : (
                                <div onClick={resetFeatureFlags}>Reset Feature Flags</div>
                            )}
                        </CommandItem>
                        <CommandItem>
                            <FlaskConical className="mr-2 h-4 w-4" />
                            <ExperimentGenerator />
                        </CommandItem>
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </>
    )
}