"use client";

import type React from "react";
import { useLDClient } from "launchdarkly-react-client-sdk";
import { useState, useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSignup } from "@/components/SignUpProvider";
import SignUpProgressIndicator from "@/components/ui/bankcomponents/SignUpProgressIndicator";
import { COMPANY_LOGOS, BANK } from "@/utils/constants";
import Image from "next/image";
import LiveLogsContext from "@/utils/contexts/LiveLogsContext";
import { SIGN_UP_SERVICES_COMPLETED } from "@/components/generators/experimentation-automation/experimentationConstants";

export default function ServicesPage() {
	const router = useRouter();
	const { userData, updateUserData, toggleService } = useSignup();
	const ldClient = useLDClient();
	const { logLDMetricSent } = useContext(LiveLogsContext);

	const [selectedServices, setSelectedServices] = useState(
		userData.selectedServices.length > 0 ? userData.selectedServices : ["Checking Accounts"]
	);

	const services = [
		"Home Mortgage",
		"Checking Accounts", 
		"Savings Accounts",
		"Auto Loans",
		"Personal Loans",
		"Wire Transfers",
		"Commercial Lending",
		"Insurance"
	];

	const handleServiceToggle = (service: string) => {
		const updatedServices = selectedServices.includes(service)
			? selectedServices.filter((s) => s !== service)
			: [...selectedServices, service];
		
		setSelectedServices(updatedServices);
		updateUserData({ selectedServices: updatedServices });
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		
		updateUserData({ selectedServices });
		ldClient?.track(SIGN_UP_SERVICES_COMPLETED);
		logLDMetricSent({ metricKey: SIGN_UP_SERVICES_COMPLETED });
		router.push("/success");
	};

	return (
		<main className="flex flex-col items-center justify-center py-4 min-h-screen">
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
			{/* Progress indicator */}
			<SignUpProgressIndicator pageNumber={3} />
			{/* Heading */}
			<div className="mb-8 text-center">
				<h1 className="mb-2 text-2xl font-bold text-gray-800">
					What services can we help you with?
				</h1>
				<p className="text-sm text-gray-600">
					Select all that apply
				</p>
			</div>

			{/* Form */}
			<form onSubmit={handleSubmit} className="space-y-4 w-full lg:w-[60%]">
				{/* Services Grid */}
				<div className="grid gap-4 grid-cols-1 md:grid-cols-3 mb-8">
					{services.map((service) => (
						<button
							key={service}
							type="button"
							onClick={() => handleServiceToggle(service)}
							className={`p-4 rounded-lg border-2 text-center transition-all ${
								selectedServices.includes(service)
									? "border-blue-500 bg-blue-50 text-blue-700"
									: "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
							}`}
						>
							{service}
						</button>
					))}
				</div>

				{/* Submit Button */}
				<div className="flex flex-col items-center space-y-4 pt-6">
					<button
						type="submit"
						className="w-full rounded-full bg-blue-500 py-3 text-center font-medium text-white transition-colors hover:bg-blue-600"
					>
						Complete Setup
					</button>
					<Link
						href="/personal-details"
						className="text-sm text-gray-500 hover:text-gray-700"
					>
						Back
					</Link>
				</div>
			</form>
		</main>
	);
} 