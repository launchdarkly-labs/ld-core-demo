"use client";

import type React from "react";
import { useFlags, useLDClient } from "launchdarkly-react-client-sdk";
import { useState, useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSignup } from "@/components/SignUpProvider";
import { COMPANY_LOGOS, BANK, RELEASE_NEW_SIGNUP_PROMO_LDFLAG_KEY } from "@/utils/constants";
import Image from "next/image";
import WrapperMain from "@/components/ui/WrapperMain";
import LiveLogsContext from "@/utils/contexts/LiveLogsContext";
import { INITIAL_SIGN_UP_COMPLETED } from "@/components/generators/experimentation-automation/experimentationConstants";

export default function SignUpPage() {
	const router = useRouter();
	const ldClient = useLDClient();
	const { userData, updateUserData } = useSignup();
	const [email, setEmail] = useState(userData.email || "user@launchmail.io");
	const [password, setPassword] = useState(userData.password || "password123");
	const [acceptedTerms, setAcceptedTerms] = useState(true);
	const [error, setError] = useState("");
	const releaseNewSignUpPromoLDFlag = useFlags()[RELEASE_NEW_SIGNUP_PROMO_LDFLAG_KEY];
	const { logLDMetricSent } = useContext(LiveLogsContext);
	const currentDatePlus30 = new Date(
		new Date().setDate(new Date().getDate() + 30)
	).toLocaleDateString();
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
			{/* Mobile banner */}
			<div className="w-full block sm:hidden text-center bg-gradient-to-r from-white via-[#E2E6FF] to-[#CCD3FF] text-blue-600 p-3">
				<span className="text-sm">
					Sign up for an account today to receive 50,000 reward points. Offer ends on {currentDatePlus30}
				</span>
			</div>
			
			<div
				className={`flex px-4 sm:px-0 h-full ${
					releaseNewSignUpPromoLDFlag ? " p-0" : " items-center justify-center"
				}`}
			>
				{/* Left side - Sign up form */}
				<div
					className={`flex items-center justify-center w-full flex-col p-8  ${
						releaseNewSignUpPromoLDFlag && "md:w-7/12 md:p-12"
					}`}
				>
					<Link href="/" title="Go Home">
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

					{/* Heading */}
					<h1 className="mb-8 text-2xl text-center font-bold text-gray-800 md:text-3xl">
						Start banking in less than five minutes
					</h1>

									{/* Form */}
				<form onSubmit={handleSubmit} className="space-y-4 max-w-sm">
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
								href="/"
								className="mt-4 text-sm text-gray-500 hover:text-gray-700"
								title="Go Home"
							>
								Back
							</Link>
						</div>
					</form>

					{/* Login link */}
					<div className="mt-6 text-center text-sm">
						Already have an account?{" "}
						<Link href="/" className="text-blue-600 hover:underline">
							Log in
						</Link>
					</div>
				</div>

				{/* Right side - Promo */}
				{releaseNewSignUpPromoLDFlag && (
					<div className={`relative  w-5/12 h-[100vh] hidden sm:block `}>
						<div className="w-full aspect-[9/16] bg-gradient-to-br from-white via-[#E2E6FF] to-[#CCD3FF] h-full p-4 shadow-lg">
							<div className="flex items-start justify-center h-full">
								<div className="absolute bottom-[50%] left-[3rem]  text-start z-10">
									<h2 className="text-3xl text-blue-600">
										Sign up for an account today to receive
									</h2>
									<p className="text-3xl font-semibold text-purple-600">
										50,000 reward points
									</p>
									<p className="mt-6 text-sm text-gray-600">
										Offer ends {currentDatePlus30}
									</p>
								</div>
								<Image
									src={"/banking/offerBanner/bankCard.svg"}
									alt="Banking Offer Banner"
									width={100}
									height={100}
									priority
									className={` absolute bottom-[10%] lg:bottom-[5%] left-0 w-[80%]`}
								/>
								<Image
									src={"/banking/offerBanner/bankCircle.svg"}
									alt="Banking Offer Banner"
									width={100}
									height={100}
									priority
									className={`absolute bottom-[18%] lg:bottom-[18%] left-[40%] lg:left-[40%] w-[60%]`}
								/>
							</div>
						</div>
					</div>
				)}
			</div>
		</WrapperMain>
	);
} 