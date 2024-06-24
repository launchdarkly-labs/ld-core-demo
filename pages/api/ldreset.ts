import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const BASE_URL = "https://app.launchdarkly.com/api/v2";
    const CALL_THRESHOLD = 1;
    const API_KEY = process.env.LD_API_KEY;
    const SOURCE_ENVIRONMENT = "template-env";
    const DESTINATION_ENVIRONMENT = process.env.DESTINATIONENV;
    const PROJECT_KEY = process.env.PROJECT_KEY;

    class RateLimitError extends Error {
        constructor(message: any) {
            super(message);
            this.name = "RateLimitError";
        }
    }

    async function timeToNextReset(nextReset: any) {
        let currentMilliTime = Date.now();
        return nextReset - currentMilliTime > 0
            ? Math.round((nextReset - currentMilliTime) / 1000)
            : 0;
    }

    async function runAPICall(method: string, url: string, apikey: string, body: any) {
            
        let response;
        if (method === "GET") {
            response = await fetch(BASE_URL + url, {
                method: method,
                headers: {
                    Authorization: apikey,
                    "Content-Type": "application/json",
                },
            });
        } else {
            response = await fetch(BASE_URL + url, {
                method: method,
                headers: {
                    Authorization: apikey,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });
        }
        return response;
    }

    async function get_flag_list(url: string) {
        const response = await runAPICall("GET", url, API_KEY!, {});
        const responseData = await response!.json();
        //console.log(responseData); // Add this line
        const items = responseData.items;
        const keys = items.map((item: any) => item.key);
        return keys;
    }

    async function copy_all_flag_targets() {
        let flag_list = await get_flag_list(`/flags/${PROJECT_KEY}`);
        //console.log(flag_list)
        const flag_copy_body = {
            "source": {
                "key": SOURCE_ENVIRONMENT
            },
            "target": {
                "key": DESTINATION_ENVIRONMENT
            },
            "includedActions": [
                "updateOn",
                "updatePrerequisites",
                "updateTargets",
                "updateRules",
                "updateFallthrough",
                "updateOffVariation"
            ]
        };

        for (let i of flag_list) {
            let flag_copy_url = `/flags/${PROJECT_KEY}/${i}/copy`;
            //console.log(`Trying at url ${flag_copy_url}`);
            await runAPICall("POST", flag_copy_url, API_KEY!, flag_copy_body);
            //console.log(`Successfully copied settings for ${i}`);
        }
    }

    try {
        const response = await runAPICall("GET", `/flags/${PROJECT_KEY}`, API_KEY!, {});
        if (!response) {
            throw new Error('No response received from runAPICall');
        }
        const responseData = await response.json();
        if (!responseData || !responseData.items) {
            throw new Error('Invalid or empty JSON response');
        }
        const items = responseData.items;
        const flag_list = items.map((item: any) => item.key);

        const flag_copy_body = {
            "source": {
                "key": SOURCE_ENVIRONMENT
            },
            "target": {
                "key": DESTINATION_ENVIRONMENT
            },
            "includedActions": [
                "updateOn",
                "updatePrerequisites",
                "updateTargets",
                "updateRules",
                "updateFallthrough",
                "updateOffVariation"
            ]
        };

        for (let i of flag_list) {
            let flag_copy_url = `/flags/${PROJECT_KEY}/${i}/copy`;
            //console.log(`Trying at url ${flag_copy_url}`);
            await runAPICall("POST", flag_copy_url, API_KEY!, flag_copy_body);
            //console.log(`Successfully copied settings for ${i}`);
        }

        res.status(200).json({ message: 'All flags reset' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error: ' + error });
    }

}
