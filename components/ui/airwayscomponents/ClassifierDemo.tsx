import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PulseLoader } from "react-spinners";
import {
	AIRWAYS_EVAL_DATASET,
	INTENT_LABELS,
	type AirwaysIntent,
	type EvalTestCase,
} from "@/lib/airways-eval-dataset";
import type {
	ClassifyResult,
	EvalResult,
	ImproveResult,
} from "@/lib/airways-classifier";

interface TurnResult {
	query: string;
	expectedIntent?: AirwaysIntent;
	classification?: ClassifyResult;
	eval?: EvalResult;
	improvement?: ImproveResult;
}

const INTENT_COLORS: Record<AirwaysIntent, string> = {
	flight_booking: "bg-blue-500",
	manage_booking: "bg-purple-500",
	flight_status: "bg-amber-500",
	loyalty: "bg-emerald-500",
	baggage: "bg-orange-500",
	check_in: "bg-cyan-500",
	customer_support: "bg-gray-500",
};

export default function ClassifierDemo() {
	const [input, setInput] = useState("");
	const [expectedIntent, setExpectedIntent] = useState<AirwaysIntent | null>(null);
	const [turns, setTurns] = useState<TurnResult[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [status, setStatus] = useState("");
	const [accuracy, setAccuracy] = useState({ correct: 0, total: 0 });
	const resultsEndRef = useRef<HTMLDivElement | null>(null);

	// Setup state
	const [showSetup, setShowSetup] = useState(false);
	const [setupProjectKey, setSetupProjectKey] = useState("");
	const [setupLoading, setSetupLoading] = useState(false);
	const [setupResult, setSetupResult] = useState<{ ok: boolean; message: string } | null>(null);

	useEffect(() => {
		resultsEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [turns]);

	// Queue for queries from the hero input
	const [pendingQuery, setPendingQuery] = useState<string | null>(null);

	useEffect(() => {
		const handler = (e: Event) => {
			const query = (e as CustomEvent).detail;
			if (query && typeof query === "string") {
				const match = AIRWAYS_EVAL_DATASET.find(
					(tc) => tc.query.toLowerCase() === query.toLowerCase(),
				);
				setExpectedIntent(match?.expectedIntent ?? null);
				setInput(query);
				setPendingQuery(query);
			}
		};
		window.addEventListener("airways-ai-query", handler);
		return () => window.removeEventListener("airways-ai-query", handler);
	}, []);

	// Auto-submit when pendingQuery is set and input has updated
	useEffect(() => {
		if (pendingQuery && input === pendingQuery && !isLoading) {
			setPendingQuery(null);
			submit();
		}
	}, [pendingQuery, input]);

	async function runSetup() {
		if (!setupProjectKey.trim()) return;
		setSetupLoading(true);
		setSetupResult(null);
		try {
			const res = await fetch("/api/setup-airways-classifier", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ projectKey: setupProjectKey.trim() }),
			});
			const data = await res.json();
			setSetupResult({ ok: data.ok ?? res.ok, message: data.message || data.error || "Unknown result" });
		} catch (e: any) {
			setSetupResult({ ok: false, message: e.message || "Request failed" });
		}
		setSetupLoading(false);
	}

	function selectTestCase(tc: EvalTestCase) {
		setInput(tc.query);
		setExpectedIntent(tc.expectedIntent);
	}

	async function submit() {
		if (!input.trim() || isLoading) return;

		const userInput = input;
		const expected = expectedIntent;
		setInput("");
		setExpectedIntent(null);
		setIsLoading(true);
		setStatus("Starting classification...");

		const turnId = Date.now();
		const turn: TurnResult = { query: userInput, expectedIntent: expected ?? undefined };

		// Add placeholder turn immediately
		setTurns((prev) => [...prev, { ...turn }]);

		try {
			const response = await fetch("/api/airways-classifier", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					userInput,
					expectedIntent: expected ?? undefined,
				}),
			});

			const reader = response.body?.getReader();
			if (!reader) throw new Error("No reader");

			const decoder = new TextDecoder();
			let buffer = "";

			while (true) {
				const { done, value } = await reader.read();
				if (done) break;

				buffer += decoder.decode(value, { stream: true });
				const parts = buffer.split("\n\n");
				buffer = parts.pop() || "";

				for (const event of parts) {
					if (!event.trim() || !event.startsWith("data:")) continue;
					const jsonStr = event.replace(/^data:\s*/, "");
					try {
						const data = JSON.parse(jsonStr);

						if (data.status) {
							setStatus(data.status);
						}
						if (data.classification) {
							turn.classification = data.classification;
						}
						if (data.eval) {
							turn.eval = data.eval;
						}
						if (data.improvement) {
							turn.improvement = data.improvement;
						}
						if (data.done && turn.eval) {
							setAccuracy((prev) => ({
								correct: prev.correct + (turn.eval!.correct ? 1 : 0),
								total: prev.total + 1,
							}));
						}

						// Update the last turn in place
						setTurns((prev) => {
							const updated = [...prev];
							updated[updated.length - 1] = { ...turn };
							return updated;
						});
					} catch {
						// skip parse errors
					}
				}
			}
		} catch (error) {
			console.error("Classifier error:", error);
		}

		setIsLoading(false);
		setStatus("");
	}

	const accuracyPct = accuracy.total > 0 ? ((accuracy.correct / accuracy.total) * 100).toFixed(0) : "—";

	return (
		<div className="w-full max-w-4xl mx-auto px-4 mt-8">
			<Card className="border border-airlinedarkblue/20 bg-white/95 backdrop-blur shadow-xl">
				<CardHeader className="pb-3">
					<div className="flex items-center justify-between">
						<div>
							<h2 className="text-xl font-audimat text-airlinedarkblue">
								Self-Improving Intent Classifier
							</h2>
							<p className="text-sm text-gray-500 mt-1">
								Classify → Eval → Improve — powered by LaunchDarkly AI Configs
							</p>
						</div>
						<div className="flex items-center gap-3">
							{accuracy.total > 0 && (
								<div className="text-right">
									<div className="text-2xl font-bold text-airlinedarkblue">{accuracyPct}%</div>
									<div className="text-xs text-gray-500">
										{accuracy.correct}/{accuracy.total} correct
									</div>
								</div>
							)}
							<Button
								variant="outline"
								size="sm"
								onClick={() => setShowSetup(!showSetup)}
								className="text-xs"
							>
								{showSetup ? "Hide Setup" : "Setup"}
							</Button>
						</div>
					</div>
				</CardHeader>

				{/* Setup panel */}
				{showSetup && (
					<CardContent className="border-b pb-4">
						<p className="text-xs text-gray-500 mb-2">
							Provision the 3 AI configs (triage, eval, improver) into your LaunchDarkly project.
						</p>
						<div className="flex gap-2">
							<Input
								value={setupProjectKey}
								onChange={(e: any) => setSetupProjectKey(e.target.value)}
								onKeyDown={(e: any) => e.key === "Enter" && runSetup()}
								placeholder="LD Project Key (e.g. gyeutter-ld-demo)"
								className="text-sm"
							/>
							<Button
								onClick={runSetup}
								disabled={setupLoading || !setupProjectKey.trim()}
								className="bg-gradient-airways text-white hover:opacity-90 text-sm whitespace-nowrap"
							>
								{setupLoading ? <PulseLoader size={4} color="white" /> : "Create AI Configs"}
							</Button>
							{setupResult && (
								<div className={`text-xs px-2 py-1.5 rounded ${setupResult.ok ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
									{setupResult.message}
								</div>
							)}
						</div>
					</CardContent>
				)}

				<CardContent className="space-y-4">
					{/* Test case suggestions */}
					<div>
						<p className="text-xs font-medium text-gray-500 mb-2">Test queries (click to use):</p>
						<div className="flex flex-wrap gap-1.5">
							{AIRWAYS_EVAL_DATASET.slice(0, 14).map((tc, i) => (
								<button
									key={i}
									onClick={() => selectTestCase(tc)}
									className="text-xs px-2 py-1 rounded-full border border-gray-200 hover:border-airlinedarkblue hover:bg-airlinedarkblue/5 transition-colors text-gray-600 hover:text-airlinedarkblue truncate max-w-[220px]"
									title={`Expected: ${INTENT_LABELS[tc.expectedIntent]}`}
								>
									{tc.query}
								</button>
							))}
						</div>
					</div>

					{/* Input */}
					<div className="flex gap-2">
						<div className="flex-1 relative">
							<Input
								value={input}
								onChange={(e: any) => {
									setInput(e.target.value);
									if (!expectedIntent) setExpectedIntent(null);
								}}
								onKeyDown={(e: any) => e.key === "Enter" && submit()}
								placeholder="Type a query or select one above..."
								className="pr-24"
								disabled={isLoading}
							/>
							{expectedIntent && (
								<span className="absolute right-2 top-1/2 -translate-y-1/2">
									<Badge className={`${INTENT_COLORS[expectedIntent]} text-white text-[10px]`}>
										{INTENT_LABELS[expectedIntent]}
									</Badge>
								</span>
							)}
						</div>
						<Button
							onClick={submit}
							disabled={isLoading || !input.trim()}
							className="bg-gradient-airways text-white hover:opacity-90"
						>
							{isLoading ? <PulseLoader size={6} color="white" /> : "Classify"}
						</Button>
					</div>

					{/* Status */}
					{status && (
						<div className="text-sm text-airlinedarkblue flex items-center gap-2">
							<PulseLoader size={4} color="#405BFF" />
							{status}
						</div>
					)}

					{/* Results */}
					{turns.length > 0 && (
						<div className="space-y-3 max-h-[400px] overflow-y-auto">
							{turns.map((turn, i) => (
								<TurnCard key={i} turn={turn} index={i} />
							))}
							<div ref={resultsEndRef} />
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}

function TurnCard({ turn, index }: { turn: TurnResult; index: number }) {
	const [showImprovement, setShowImprovement] = useState(false);
	const cls = turn.classification;
	const ev = turn.eval;
	const imp = turn.improvement;

	return (
		<div className="border rounded-lg p-3 bg-gray-50/50 space-y-2">
			{/* Query */}
			<div className="flex items-start justify-between gap-2">
				<div className="text-sm">
					<span className="text-gray-400 mr-2">#{index + 1}</span>
					<span className="text-gray-800">{turn.query}</span>
				</div>
			</div>

			{/* Classification result */}
			{cls && (
				<div className="flex items-center gap-2 flex-wrap">
					<Badge className={`${INTENT_COLORS[cls.intent]} text-white`}>
						{INTENT_LABELS[cls.intent]}
					</Badge>
					<span className="text-xs text-gray-500">
						{(cls.confidence * 100).toFixed(0)}% confidence
					</span>
					{turn.expectedIntent && (
						<span className="text-xs text-gray-400">
							expected: {INTENT_LABELS[turn.expectedIntent]}
						</span>
					)}
					{cls.durationMs > 0 && (
						<span className="text-xs text-gray-400">
							{cls.durationMs}ms
						</span>
					)}
				</div>
			)}

			{/* Eval result */}
			{ev && (
				<div className={`text-xs px-2 py-1.5 rounded ${ev.correct ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
					<span className="font-medium">{ev.correct ? "✅ Correct" : "❌ Incorrect"}</span>
					{ev.reasoning && (
						<span className="ml-2 text-gray-600">— {ev.reasoning}</span>
					)}
				</div>
			)}

			{/* Improvement */}
			{imp && (
				<div className={`text-xs px-2 py-1.5 rounded ${imp.pushedToLD ? "bg-blue-50 text-blue-700" : imp.reverted ? "bg-amber-50 text-amber-700" : "bg-gray-100 text-gray-600"}`}>
					{imp.pushedToLD && (
						<>
							<span className="font-medium">🔧 Pushed improved prompt to LaunchDarkly</span>
							<span className="ml-2">
								accuracy: {(imp.oldAccuracy * 100).toFixed(0)}% → {(imp.newAccuracy * 100).toFixed(0)}%
							</span>
						</>
					)}
					{imp.reverted && (
						<>
							<span className="font-medium">↩️ Reverted — new prompt didn't improve</span>
							<span className="ml-2">
								old: {(imp.oldAccuracy * 100).toFixed(0)}% vs new: {(imp.newAccuracy * 100).toFixed(0)}%
							</span>
						</>
					)}
					{!imp.pushedToLD && !imp.reverted && !imp.improved && (
						<span className="font-medium">Improver skipped</span>
					)}
					{imp.newPrompt && (
						<button
							onClick={() => setShowImprovement(!showImprovement)}
							className="ml-2 underline hover:no-underline"
						>
							{showImprovement ? "hide prompt" : "show prompt"}
						</button>
					)}
				</div>
			)}

			{/* Expanded improvement prompt */}
			{imp && showImprovement && imp.newPrompt && (
				<div className="text-xs bg-gray-900 text-green-400 p-3 rounded font-mono max-h-[200px] overflow-y-auto whitespace-pre-wrap">
					{imp.newPrompt}
				</div>
			)}
		</div>
	);
}
