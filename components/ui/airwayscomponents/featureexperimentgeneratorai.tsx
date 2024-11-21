import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import React, { useState, useEffect, useRef, useContext } from "react";
import LoginContext from "@/utils/contexts/login";
import { useLDClient } from "launchdarkly-react-client-sdk";

export default function FeatureExperimentGeneratorAI() {

    const client = useLDClient();
    const { updateUserContext } = useContext(LoginContext);
    const [expGenerator2, setExpGenerator2] = useState(false);
    const [progress, setProgress] = useState(0);

    const updateContext = async () => {
        updateUserContext();
    }

    useEffect(() => {
        if (expGenerator2) {
            generateResults();
        }
    }, [expGenerator2]);


    const generateResults = async () => {
        setProgress(0);
        setExpGenerator2(true);
        for (let i = 0; i < 500; i++) {

            let aiModelVariation = client?.variation("ai-chatbot", '{ "max_tokens_to_sample": 500, "modelId": "anthropic.claude-instant-v1", "temperature": 0.3, "top_p": 1 }');

            if (aiModelVariation.modelId === "meta.llama2-13b-chat-v1") {
                let probablity = Math.random() * 100;
                if( probablity < 40 ) {
                    client?.track("AI chatbot good service", client.getContext());
                }
                else {
                    client?.track("AI Chatbot Bad Service", client.getContext());
                }
            }
            else if(aiModelVariation.modelId === "anthropic.claude-instant-v1") {
                let probablity = Math.random() * 100;
                if( probablity < 70 ) {
                    client?.track("AI chatbot good service", client.getContext());
                }
                else {
                    client?.track("AI Chatbot Bad Service", client.getContext());
                }
            }
            else {
                let probablity = Math.random() * 100;
                if( probablity < 60 ) {
                    client?.track("AI chatbot good service", client.getContext());
                }
                else {
                    client?.track("AI Chatbot Bad Service", client.getContext());
                }
            }
            await client?.flush();
            setProgress((prevProgress) => prevProgress + (1 / 500) * 100);
            await new Promise(resolve => setTimeout(resolve, 100));
            await updateContext();
       }
        setExpGenerator2(false);
    }

    return (

        <Dialog>
            <DialogTrigger asChild>
                <p className="font-bold font-sohnelight text-lg">Feature Results Generator (AI Models - Airways)</p>
            </DialogTrigger>
            <DialogContent>
                {expGenerator2 ? (
                    <div className="flex justify-center items-center h-52 ">
                        <div className=" font-bold font-sohne justify-center items-center text-xl">
                            Generating Data
                            <br />
                            <div className="flex items-center mt-2 justify-center">
                                <p>{progress.toFixed(0)}% Complete</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex justify-center text-xl font-bold items-center h-full ">
                        <button onClick={() => setExpGenerator2(true)} className="mt-2 bg-gradient-airways p-2 rounded-sm hover:text-black hover:brightness-125 text-white">
                            Generate Feature Experiment Results (AI Models - Airways)
                        </button>
                    </div>
                )}
            </DialogContent>
        </Dialog>


    )

}