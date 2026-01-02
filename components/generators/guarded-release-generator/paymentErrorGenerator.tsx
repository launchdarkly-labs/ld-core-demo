import { useState, useEffect, useRef } from "react";
import { useFlags, useLDClient } from "launchdarkly-react-client-sdk";
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
		}, 10);
		}

		return () => {
			if (metricsInterval !== null) clearInterval(metricsInterval);
		};
	}, [client, flagKey, runDemo]);

	const simulateMetricsAndErrors = async (userContext: any, flagEnabled: boolean) => {
		if (!client) return;

		if (flagEnabled) {
			const errorRate = 100;

			if (Math.random() * 100 < errorRate) {
				throwPaymentError(userContext);
			}
		} else {
			client.track("transaction-monitor-baseline");
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

		const error = new Error(errorMessage);
		error.name = errorKind;

		recordErrorToLD(
			error,
			errorMessage,
			{
				component: "TransactionMonitoring",
				errorType: errorKind,
				severity: "high",
				flagKey: flagKey,
				userId: userContext.key,
				transactionId: `txn-${Math.floor(Math.random() * 1000000)}`,
				timestamp: new Date().toISOString(),
			}
		);

		(error as any).component = "TransactionMonitoring";
		(error as any).errorType = errorKind;
		(error as any).severity = "high";
		(error as any).flagKey = flagKey;
		(error as any).userId = userContext.key;
		(error as any).timestamp = new Date().toISOString();

		setTimeout(() => {
			throw error;
		}, 0);

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

