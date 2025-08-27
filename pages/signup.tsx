"use client";

import type React from "react";
import { useLDClient } from "launchdarkly-react-client-sdk";
import { useState, useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSignup } from "@/components/SignUpProvider";
import { COMPANY_LOGOS, BANK } from "@/utils/constants";
import Image from "next/image";
import WrapperMain from "@/components/ui/WrapperMain";
import LiveLogsContext from "@/utils/contexts/LiveLogsContext";
import { INITIAL_SIGN_UP_COMPLETED } from "@/components/generators/experimentation-automation/experimentationConstants";

export default function SignUpPage() {
	const router = useRouter();
	const ldClient = useLDClient();
	const { userData, updateUserData } = useSignup();
	const [email, setEmail] = useState(userData.email || "christine.wilson@email.com");
	const [password, setPassword] = useState(userData.password || "password123");
	const [acceptedTerms, setAcceptedTerms] = useState(true);
	const [error, setError] = useState("");
	const { logLDMetricSent } = useContext(LiveLogsContext);
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!email || !password) {
			setError("Please fill in all fields");
			return;
		}

		if (!acceptedTerms) {
			setError("Please accept the terms and conditions");
			return;
		}

		updateUserData({ email, password });
		ldClient?.track(INITIAL_SIGN_UP_COMPLETED);
		logLDMetricSent({ metricKey: INITIAL_SIGN_UP_COMPLETED });
		router.push("/personal-details");
	};

	return (
		<WrapperMain className={`flex flex-col px-0`}>
			<div className="flex px-4 sm:px-0 h-full items-center justify-center">
				{/* sign up form */}
				<div className="flex items-center justify-center w-full flex-col p-8 max-w-md">
					<Link href="/bank" title="Go Home">
						<Image
							src={COMPANY_LOGOS[BANK].horizontal}
							alt="ToggleBank Logo"
							className=" mb-10 h-10"
							priority
							style={{
								maxWidth: "100%",
								width: "auto",
							}}
						/>
					</Link>

					<h1 className="mb-8 text-2xl text-center font-bold text-gray-800 md:text-3xl">
						Start banking in less than five minutes
					</h1>
					<form onSubmit={handleSubmit} className="space-y-4 w-full max-w-sm">
						{error && (
							<div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
								{error}
							</div>
						)}
						<div>
							<input
								type="email"
								placeholder="Email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="w-full rounded-md border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
								readOnly
								onFocus={(e) => {
									(e.target as HTMLInputElement).removeAttribute("readOnly");
								}}
							/>
						</div>
						<div>
							<input
								type="password"
								placeholder="Password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="w-full rounded-md border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
								readOnly
								onFocus={(e) => {
									(e.target as HTMLInputElement).removeAttribute("readOnly");
								}}
							/>
						</div>
						<div className="flex items-start">
							<input
								type="checkbox"
								id="terms"
								checked={acceptedTerms}
								onChange={(e) => setAcceptedTerms(e.target.checked)}
								className="mt-1 h-4 w-4 rounded border-gray-300"
							/>
							<label htmlFor="terms" className="ml-2 text-sm text-gray-600">
								I accept the{" "}
								<Link href="#" className="text-blue-600 hover:underline">
									Terms of Service
								</Link>{" "}
								and{" "}
								<Link href="#" className="text-blue-600 hover:underline">
									Privacy Policy
								</Link>
							</label>
						</div>
						<div className="mt-8 flex flex-col items-center">
							<button
								type="submit"
								className="w-full rounded-full bg-blue-500 py-3 text-center font-medium text-white transition-colors hover:bg-blue-600"
							>
								Sign Up
							</button>
							<Link
								href="/bank"
								className="mt-4 text-sm text-gray-500 hover:text-gray-700"
								title="Go Home"
							>
								Back
							</Link>
						</div>
					</form>

					{/* login link */}
					<div className="mt-6 text-center text-sm">
						Already have an account?{" "}
						<Link href="/bank" className="text-blue-600 hover:underline">
							Log in
						</Link>
					</div>
				</div>
			</div>
		</WrapperMain>
	);
} 