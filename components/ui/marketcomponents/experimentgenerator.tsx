

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import React, { useState, useEffect, useRef, useContext } from "react";
import LoginContext from "@/utils/contexts/login";
import { v4 as uuidv4 } from "uuid";
import { toast } from "@/components/ui/use-toast";
import { useFlags, useLDClient } from "launchdarkly-react-client-sdk";


export default function ExperimentGenerator() {

    const [numberOfResults, setNumberOfResults] = useState(0);
    const [metric1, setMetric1] = useState(0);
    const [metric2, setMetric2] = useState(0);
    const [metric3, setMetric3] = useState(0);
    const [metric4, setMetric4] = useState(0);
    const client = useLDClient();
    const { updateAudienceContext, loginUser, user, email } = useContext(LoginContext);
    const [loggedUser, setInitialUser] = useState();
    const [loggedEmail, setInitialEmail] = useState();


    const updateContext = async () => {

        const uniqueId = uuidv4();
        loginUser("test-exp" + uniqueId, "test-exp" + uniqueId + "@launchmail.io");

    }

    const generateResults = async () => {

        for (let i = 0; i < numberOfResults; i++) {
            const stage1metric = Math.random();
            if(stage1metric < metric1) {
                client?.track("store-accessed")
                const stage2metric = Math.random();
                if(stage2metric < metric2) {
                    client?.track("item-added")
                    const stage3metric = Math.random();
                    if(stage3metric < metric3) {
                        client?.track("cart-accessed")
                        const stage4metric = Math.random();
                        if(stage4metric < metric4) {
                            client?.track("customer-checkout")
                            console.log("Customer checked out")
                        }
                    }
                }
            }
            await new Promise(resolve => setTimeout(resolve, 100));
            await updateContext();
        }      
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <p>Funnel Results Generator</p>
            </DialogTrigger>
            <DialogContent>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    if (
                        numberOfResults > 0 && numberOfResults <= 5000 &&
                        metric1 > 0 && metric1 <= 1 &&
                        metric2 > 0 && metric2 <= 1 &&
                        metric3 > 0 && metric3 <= 1 &&
                        metric4 > 0 && metric4 <= 1
                    ) {
                        generateResults();
                    } else {
                        toast({
                            title: "Invalid Input",
                            description:
                                "Please ensure all metrics are between 0 and 1 and the number of results is between 0 and 5000 before generating results",
                        });
                    }
                }}>
                    <div className="flex flex-col space-y-4">
                        <label htmlFor="numberOfResults" className="block text-sm font-medium text-gray-700">
                            Number of Results to Generate
                        </label>
                        <input
                            type="number"
                            id="numberOfResults"
                            name="numberOfResults"
                            value={numberOfResults}
                            required
                            onChange={(e) => setNumberOfResults(Number(e.target.value))}
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Enter number of results"
                        />
                        <p>Probability of Metric 1 (Between 0 - 1)</p>
                        <input
                            type="number"
                            id="metric1"
                            name="metric1"
                            value={metric1}
                            required
                            onChange={(e) => setMetric1(Number(e.target.value))}
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Probability of Metric 1"
                        />
                        <p>Probability of Metric 2 (Between 0 - 1)</p>
                        <input
                            type="number"
                            id="metric2"
                            name="metric2"
                            value={metric2}
                            required
                            onChange={(e) => setMetric2(Number(e.target.value))}
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Probability of Metric 2"
                        />
                        <p>Probability of Metric 3 (Between 0 - 1)</p>
                        <input
                            type="number"
                            id="metric3"
                            name="metric3"
                            value={metric3}
                            required
                            onChange={(e) => setMetric3(Number(e.target.value))}
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Probability of Metric 3"
                        />
                        <p>Probability of Metric 4 (Between 0 - 1)</p>
                        <input
                            type="number"
                            id="metric4"
                            name="metric4"
                            value={metric4}
                            required
                            onChange={(e) => setMetric4(Number(e.target.value))}
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Probability of Metric 4"
                        />

                        <Button type="submit" className="mt-2">
                            Submit
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>


    )

}