import { useState, useEffect, useRef } from "react";
import { useFlags, useLDClient } from "launchdarkly-react-client-sdk";
import { randomLatency } from "@/utils/utils";
import { Beaker } from "lucide-react";
import { recordErrorToLD } from "@/utils/observability/client";

const PaymentErrorGenerator = ({ flagKey, title }: { flagKey: string; title: string }) => {
	const flags = useFlags();
	const paymentFlag = flags[flagKey];
	const client = useLDClient();
	const [errorCounter, setErrorCounter] = useState(0);
	const [userCounter, setUserCounter] = useState(0);
	const [runDemo, setRunDemo] = useState(false);
	const userCounterRef = useRef(0);

	const generateSyntheticUser = (index: number) => {
		const locations = ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"];
		const accountTypes = ["personal", "business"];
		const deviceTypes = ["mobile", "desktop", "tablet"];
		
		return {
			kind: "user",
			key: `txn-monitor-user-${index}`,
			name: `Transaction User ${index}`,
			email: `txnuser${index}@togglebank.com`,
			accountType: accountTypes[Math.floor(Math.random() * accountTypes.length)],
			location: locations[Math.floor(Math.random() * locations.length)],
			deviceType: deviceTypes[Math.floor(Math.random() * deviceTypes.length)]
		};
	};

	useEffect(() => {
		let metricsInterval: NodeJS.Timeout | null = null;

		if (runDemo && client) {
			metricsInterval = setInterval(async () => {
				const userIndex = userCounterRef.current;
				const syntheticUser = generateSyntheticUser(userIndex);
				
				await client.identify(syntheticUser);
				
				const flagValue = client.variation(flagKey, false);
				
				await simulateMetricsAndErrors(syntheticUser, flagValue);
				
				userCounterRef.current += 1;
				setUserCounter(userCounterRef.current);
			}, 100);
		}

		return () => {
			if (metricsInterval !== null) clearInterval(metricsInterval);
		};
	}, [client, flagKey, runDemo]);

	const simulateMetricsAndErrors = async (userContext: any, flagEnabled: boolean) => {
		if (!client) return;

		if (flagEnabled) {
			const errorRate = 20;
			const latency = randomLatency(3000, 5000);
			const successRate = 80;

			client.track("transaction-monitor-latency", undefined, latency);

			if (Math.random() * 100 < successRate) {
				client.track("transaction-monitor-success-rate");
			}

			if (Math.random() * 100 < errorRate) {
				client.track("transaction-monitor-error-rate");
				throwPaymentError(userContext);
			}
		} else {
			const errorRate = 0.5;
			const latency = randomLatency(100, 200);
			const successRate = 99.5;

			client.track("transaction-monitor-latency", undefined, latency);

			if (Math.random() * 100 < successRate) {
				client.track("transaction-monitor-success-rate");
			}

			if (Math.random() * 100 < errorRate) {
				client.track("transaction-monitor-error-rate");
			}
		}

		await client.flush();
	};

	const throwPaymentError = (userContext: any) => {
		const errorTypes = [
			"PaymentGatewayTimeout",
			"TransactionValidationError",
			"DatabaseConnectionError",
			"PaymentProcessorException",
			"InsufficientFundsError"
		];
		const errorMessages = [
			"Payment gateway timed out after 30 seconds",
			"Transaction validation failed: invalid card number format",
			"Database connection pool exhausted",
			"Payment processor returned 500 Internal Server Error",
			"Insufficient funds for transaction amount"
		];

		const errorIdx = Math.floor(Math.random() * errorTypes.length);
		const errorKind = errorTypes[errorIdx];
		const errorMessage = errorMessages[errorIdx];

		const err = new Error(errorMessage);
		err.name = errorKind;

		const errorData = {
			"error.kind": errorKind,
			"error.message": errorMessage,
			"service.name": "transaction-monitoring",
			"component": "TransactionMonitoring",
			"user.id": userContext.key,
			"flag.key": flagKey,
			"severity": "high"
		};

		if (client) {
			client.track("$ld:telemetry:error", errorData);
		}

		recordErrorToLD(err, errorMessage, {
			component: "TransactionMonitoring",
			errorType: errorKind,
			flagKey: flagKey,
			severity: "high",
			userId: userContext.key
		});

		queueMicrotask(() => {
			throw err;
		});

		setErrorCounter((prev) => prev + 1);
	};

	const toggleRunDemo = () => {
		if (!runDemo) {
			userCounterRef.current = 0;
			setUserCounter(0);
			setErrorCounter(0);
		}
		setRunDemo((prev) => !prev);
	};

	return (
		<div onClick={toggleRunDemo} className="flex items-center">
			<Beaker className="mr-2 h-4 w-4" />
			<div className="font-bold font-sohnelight text-lg ml-2">
				{title}
			</div>
			{runDemo && (
				<div className="ml-4 flex justify-between w-full">
					<p className="font-medium">Generating Errors...</p>
					<p className="text-sm text-gray-600">Errors Generated: {errorCounter}</p>
				</div>
			)}
		</div>
	);
};

export default PaymentErrorGenerator;

