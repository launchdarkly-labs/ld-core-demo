import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import React, { useState, useEffect, useRef, useContext } from "react";
import LoginContext from "@/utils/contexts/login";
import { useFlags, useLDClient } from "launchdarkly-react-client-sdk";


export default function FunnelExperimentGenerator() {
    const client = useLDClient();
    const { updateAudienceContext } = useContext(LoginContext);
    const [expGenerator, setExpGenerator] = useState(false);
    const [progress, setProgress] = useState(0);

    const updateContext = async () => {
        updateAudienceContext();
    }

    useEffect(() => {
        if (expGenerator) {
            generateResults();
        }
    }, [expGenerator]);

    const generateResults = async () => {
        setProgress(0);
        setExpGenerator(true);
        let totalPrice = 0;
        let metric1 = 0;
        let metric2 = 0;
        let metric3 = 0;
        let metric4 = 0;

        for (let i = 0; i < 500; i++) {

            let flagvariation = client?.variation("storeAttentionCallout", "New Items");

            if (flagvariation === "Final Hours!") {
                console.log('final hours')
                metric1 = 90;
                metric2 = 80;
                metric3 = 60;
                metric4 = 50;
                totalPrice = Math.floor(Math.random() * (500 - 300 + 1)) + 300;
            }
            if (flagvariation === "Sale") {
                console.log('sale')
                metric1 = 60;
                metric2 = 50;
                metric3 = 30;
                metric4 = 15;
                totalPrice = Math.floor(Math.random() * (300 - 200 + 1)) + 200;
            }
            if (flagvariation === "New Items") {
                console.log('new items')
                metric1 = 60;
                metric2 = 30;
                metric3 = 20;
                metric4 = 10;
                totalPrice = Math.floor(Math.random() * (200 - 100 + 1)) + 100;
            }

            let stage1metric = Math.random() * 100;
            console.log('metric 1 ' + metric1)
            if (stage1metric < metric1) {
                client?.track("store-accessed", client.getContext());
                let stage2metric = Math.random() * 100;

                if (stage2metric < metric2) {
                    client?.track("item-added", client.getContext())
                    let stage3metric = Math.random() * 100;

                    if (stage3metric < metric3) {
                        client?.track("cart-accessed", client.getContext())
                        let stage4metric = Math.random() * 100;

                        if (stage4metric < metric4) {
                            client?.track("customer-checkout", client.getContext())
                            client?.track("in-cart-total-price", client.getContext(), totalPrice)
                            
                        }
                    }
                }
            }
            await client?.flush();
            setProgress((prevProgress) => prevProgress + (1 / 500) * 100);
            await new Promise(resolve => setTimeout(resolve, 100));
            await updateContext();
        }
        setExpGenerator(false);
    }

    return (

        <Dialog>
            <DialogTrigger asChild>
                <p className="font-bold font-sohnelight text-lg">Funnel Results Generator</p>
            </DialogTrigger>
            <DialogContent>
                {expGenerator ? (
                    <div className="flex justify-center items-center h-52">
                        <div className=" font-bold font-sohne justify-center items-center text-xl">
                            Generating Data
                            <br />
                            <div className="flex items-center mt-2 justify-center">
                                <p>{progress.toFixed(0)}% Complete</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex justify-center text-xl font-bold items-center h-full">
                        <button onClick={() => setExpGenerator(true)} className="mt-2 bg-gradient-experimentation p-2 rounded-sm hover:text-black hover:brightness-125 text-white">
                            Generate Funnel Experiment Results
                        </button>
                    </div>
                )}
            </DialogContent>
        </Dialog>


    )

}