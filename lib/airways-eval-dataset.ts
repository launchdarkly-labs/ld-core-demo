export type AirwaysIntent =
	| "flight_booking"
	| "manage_booking"
	| "flight_status"
	| "loyalty"
	| "baggage"
	| "check_in"
	| "customer_support";

export const AIRWAYS_INTENTS: AirwaysIntent[] = [
	"flight_booking",
	"manage_booking",
	"flight_status",
	"loyalty",
	"baggage",
	"check_in",
	"customer_support",
];

export const INTENT_LABELS: Record<AirwaysIntent, string> = {
	flight_booking: "Flight Booking",
	manage_booking: "Manage Booking",
	flight_status: "Flight Status",
	loyalty: "Loyalty Program",
	baggage: "Baggage",
	check_in: "Check-in",
	customer_support: "Customer Support",
};

export interface EvalTestCase {
	query: string;
	expectedIntent: AirwaysIntent;
}

export const AIRWAYS_EVAL_DATASET: EvalTestCase[] = [
	// flight_booking
	{ query: "Book a flight from New York to London next Friday", expectedIntent: "flight_booking" },
	{ query: "What flights are available to Tokyo in March?", expectedIntent: "flight_booking" },
	{ query: "I need a round trip to San Francisco for two people", expectedIntent: "flight_booking" },
	{ query: "How much is a one-way ticket to Paris?", expectedIntent: "flight_booking" },

	// manage_booking
	{ query: "I need to change my seat to a window", expectedIntent: "manage_booking" },
	{ query: "Can I upgrade to first class on my upcoming flight?", expectedIntent: "manage_booking" },
	{ query: "I want to cancel my reservation for next week", expectedIntent: "manage_booking" },
	{ query: "How do I add a meal to my existing booking?", expectedIntent: "manage_booking" },
	{ query: "Change my return flight to a day later", expectedIntent: "manage_booking" },

	// flight_status
	{ query: "Is flight LA-234 on time?", expectedIntent: "flight_status" },
	{ query: "What's the status of my flight to Chicago?", expectedIntent: "flight_status" },
	{ query: "Has my connecting flight been delayed?", expectedIntent: "flight_status" },
	{ query: "What gate does flight LA-891 depart from?", expectedIntent: "flight_status" },

	// loyalty
	{ query: "How many miles do I have in my LaunchClub account?", expectedIntent: "loyalty" },
	{ query: "What are the benefits of platinum tier?", expectedIntent: "loyalty" },
	{ query: "How do I earn miles faster?", expectedIntent: "loyalty" },
	{ query: "Can I transfer my LaunchClub points to a partner airline?", expectedIntent: "loyalty" },
	{ query: "When does my elite status expire?", expectedIntent: "loyalty" },

	// baggage
	{ query: "What's the baggage allowance for economy class?", expectedIntent: "baggage" },
	{ query: "Can I bring my guitar as a carry-on?", expectedIntent: "baggage" },
	{ query: "How much does an extra checked bag cost?", expectedIntent: "baggage" },
	{ query: "What are the size limits for hand luggage?", expectedIntent: "baggage" },

	// check_in
	{ query: "I need to check in for my flight tomorrow", expectedIntent: "check_in" },
	{ query: "When does online check-in open?", expectedIntent: "check_in" },
	{ query: "Can I get my boarding pass on my phone?", expectedIntent: "check_in" },
	{ query: "How early can I check in for an international flight?", expectedIntent: "check_in" },

	// customer_support
	{ query: "I need to file a complaint about my last flight", expectedIntent: "customer_support" },
	{ query: "How do I get a refund for a cancelled flight?", expectedIntent: "customer_support" },
	{ query: "I lost my bag at the airport, what do I do?", expectedIntent: "customer_support" },
	{ query: "I need to speak with a supervisor about my experience", expectedIntent: "customer_support" },
];

/** Return a stratified subset of n test cases (at least one per intent). */
export function getEvalSubset(n: number): EvalTestCase[] {
	const byIntent: Record<string, EvalTestCase[]> = {};
	for (const tc of AIRWAYS_EVAL_DATASET) {
		if (!byIntent[tc.expectedIntent]) byIntent[tc.expectedIntent] = [];
		byIntent[tc.expectedIntent].push(tc);
	}

	const result: EvalTestCase[] = [];

	// One per intent first
	for (const intent of AIRWAYS_INTENTS) {
		const cases = byIntent[intent];
		if (cases && cases.length > 0) {
			const idx = Math.floor(Math.random() * cases.length);
			result.push(cases[idx]);
		}
	}

	// Fill remaining slots randomly from unused cases
	const used = new Set(result.map((tc) => tc.query));
	const remaining = AIRWAYS_EVAL_DATASET.filter((tc) => !used.has(tc.query));
	while (result.length < n && remaining.length > 0) {
		const idx = Math.floor(Math.random() * remaining.length);
		result.push(remaining.splice(idx, 1)[0]);
	}

	return result;
}
