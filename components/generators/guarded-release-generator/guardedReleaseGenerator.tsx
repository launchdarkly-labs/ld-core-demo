import { useState, useEffect, useRef, useContext } from "react";
import { useFlags, useLDClient } from "launchdarkly-react-client-sdk";
import { wait, randomLatency } from "@/utils/utils";
import LoginContext from "@/utils/contexts/login";
import { Beaker } from "lucide-react";


const GuardedReleaseGenerator = ({ flagKey, title }) => {
	const { loginUser, userObject, updateUserContext } = useContext(LoginContext);
	const releaseFlag = useFlags()[flagKey];
	const client = useLDClient();
	const [trueCounter, setTrueCounter] = useState(0);

	useEffect(() => {
		if (releaseFlag) {
			setTrueCounter((prevCounter) => prevCounter + 1);
		}
	}, [releaseFlag]);

	const [runDemo, setRunDemo] = useState(false);
	const [elapsedTime, setElapsedTime] = useState(0);

	const elapsedTimeRef = useRef(elapsedTime);

	useEffect(() => {
		elapsedTimeRef.current = elapsedTime;
	}, [elapsedTime]);

	useEffect(() => {

		let loginInterval: NodeJS.Timeout | null = null;
		let errorInterval: NodeJS.Timeout | null = null;

		if (runDemo) {
			loginInterval = setInterval(() => {
				setElapsedTime((prevTime) => {
					const newTime = prevTime + 1;
					if (newTime % 1 === 0) {
						updateUserContext();
					}
					return newTime;
				});
			}, 100);

			errorInterval = setInterval(async () => {
				if (client) {
					if (releaseFlag) {
						// Simulate metrics for the release flag being enabled
						await simulateMetrics(client, true);
					} else {
						// Simulate metrics for the release flag being disabled
						await simulateMetrics(client, false);
					}
				}
				setElapsedTime((prevTime) => prevTime + 1);
			}, 50);
		}

		return () => {
			if (runDemo) {
				if (loginInterval !== null) clearInterval(loginInterval);
				if (errorInterval !== null) clearInterval(errorInterval);
			}
		};
	}, [client, releaseFlag, runDemo]);

	const simulateMetrics = async (client: any, isEnabled: boolean) => {
		let latency = 0;
		let errorRate = 0; 
		let errorMetric = "";
		let latencyMetric = "";

		if(flagKey === "togglebankAPIGuardedRelease"){
			errorMetric = "stocks-api-error-rates";
			latencyMetric = "stocks-api-latency";
			latency = isEnabled ? randomLatency(500, 600) : randomLatency(40, 50);
			errorRate = isEnabled ? 75 : 25;
		}
		if(flagKey === "togglebankDBGuardedRelease"){
			errorMetric = "recent-trades-db-errors";
			latencyMetric = "recent-trades-db-latency";
			latency = isEnabled ? randomLatency(10, 20) : randomLatency(34, 43);
			errorRate = isEnabled ? 5 : 15;
		}

		client.track(latencyMetric, undefined, latency);

		await client.flush();
		if (Math.random() * 100 < errorRate) {
			client.track(errorMetric);
			await client.flush();
		}
	};

	const toggleRunDemo = () => {
		setRunDemo((prev) => !prev);
	};

	return (
		<div onClick={toggleRunDemo}
			className="flex items-center"
			>
				<Beaker className="mr-2 h-4 w-4" />
			<div
				className="font-bold font-sohnelight text-lg ml-2"

			>
				{title}
			</div>
			{runDemo && (
				<div className="ml-4 flex justify-between w-full">
					<p className="font-medium">Generating Data...</p>
					<p className="text-sm text-gray-600">Users Exposed : {trueCounter}</p>
				</div>
			)}
		</div>
	);
};

export default GuardedReleaseGenerator;
