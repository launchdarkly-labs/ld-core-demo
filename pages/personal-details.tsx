"use client";

import type React from "react";
import { useLDClient } from "launchdarkly-react-client-sdk";
import { useState, useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { useSignup } from "@/components/SignUpProvider";
import SignUpProgressIndicator from "@/components/ui/bankcomponents/SignUpProgressIndicator";
import { COMPANY_LOGOS, BANK } from "@/utils/constants";
import Image from "next/image";
import LiveLogsContext from "@/utils/contexts/LiveLogsContext";
import { SIGN_UP_PERSONAL_DETAIL_COMPLETED } from "@/components/generators/experimentation-automation/experimentationConstants";

export default function PersonalDetailsPage() {
	const router = useRouter();
	const { userData, updateUserData } = useSignup();
	const ldClient = useLDClient();
	const [formData, setFormData] = useState({
		firstName: userData.firstName || "Christine",
		lastName: userData.lastName || "Wilson",
		dob: userData.dob || "2/28/1998",
		ssn: userData.ssn || "***-**-****",
		phone: userData.phone || "220-415-9634",
		address: userData.address || "390 Fort St",
		apt: userData.apt || "245",
		zip: userData.zip || "94572",
	});

	const [error, setError] = useState("");
	const { logLDMetricSent } = useContext(LiveLogsContext);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!formData.firstName || !formData.lastName || !formData.phone) {
			setError("Please fill in all required fields");
			return;
		}

		updateUserData(formData);
		ldClient?.track(SIGN_UP_PERSONAL_DETAIL_COMPLETED);
		logLDMetricSent({ metricKey: SIGN_UP_PERSONAL_DETAIL_COMPLETED });
		router.push("/services");
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
			<SignUpProgressIndicator pageNumber={2} />
			{/* Heading */}
			<div className="mb-8 text-center">
				<h1 className="mb-2 text-2xl font-bold text-gray-800">
					Let's set up the rest of your details
				</h1>
				<p className="text-sm text-gray-600">
					You can update this information in your Account Portal
				</p>
			</div>

			{/* Form */}
			<form onSubmit={handleSubmit} className="space-y-4 w-full lg:w-[60%]">
				{error && (
					<div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
						{error}
					</div>
				)}

				<div className="grid gap-4 md:grid-cols-2">
					{/* Email */}
					<div className="relative">
						<label className="mb-1 block text-sm font-medium text-gray-700">
							Email
						</label>
						<div className="relative">
							<input
								type="email"
								value={userData.email}
								readOnly
								className="w-full rounded-md border border-gray-300 bg-gray-50 p-3 pr-10 focus:border-blue-500 focus:outline-none"
							/>
							<Check className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-green-500" />
						</div>
					</div>

					{/* Password */}
					<div className="relative">
						<label className="mb-1 block text-sm font-medium text-gray-700">
							Password
						</label>
						<div className="relative">
							<input
								type="password"
								value="••••••••••••"
								readOnly
								className="w-full rounded-md border border-gray-300 bg-gray-50 p-3 pr-10 focus:border-blue-500 focus:outline-none"
							/>
							<Check className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-green-500" />
						</div>
					</div>

					{/* First Name */}
					<div>
						<label className="mb-1 block text-sm font-medium text-gray-700">
							First Name
						</label>
						<input
							type="text"
							name="firstName"
							value={formData.firstName}
							onChange={handleChange}
							className="w-full rounded-md border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
							required
						/>
					</div>

					{/* Last Name */}
					<div>
						<label className="mb-1 block text-sm font-medium text-gray-700">
							Last Name
						</label>
						<input
							type="text"
							name="lastName"
							value={formData.lastName}
							onChange={handleChange}
							className="w-full rounded-md border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
							required
						/>
					</div>

					{/* DOB */}
					<div>
						<label className="mb-1 block text-sm font-medium text-gray-700">
							DOB
						</label>
						<input
							type="text"
							name="dob"
							value={formData.dob}
							onChange={handleChange}
							className="w-full rounded-md border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
						/>
					</div>

					{/* SSN */}
					<div>
						<label className="mb-1 block text-sm font-medium text-gray-700">
							SSN
						</label>
						<input
							type="text"
							name="ssn"
							value={formData.ssn}
							onChange={handleChange}
							className="w-full rounded-md border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
						/>
					</div>

					{/* Phone */}
					<div className="md:col-span-2">
						<label className="mb-1 block text-sm font-medium text-gray-700">
							Phone
						</label>
						<input
							type="tel"
							name="phone"
							value={formData.phone}
							onChange={handleChange}
							className="w-full rounded-md border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
							required
						/>
					</div>

					{/* Address */}
					<div className="md:col-span-2">
						<label className="mb-1 block text-sm font-medium text-gray-700">
							Address
						</label>
						<input
							type="text"
							name="address"
							value={formData.address}
							onChange={handleChange}
							className="w-full rounded-md border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
						/>
					</div>

					{/* Apt */}
					<div>
						<label className="mb-1 block text-sm font-medium text-gray-700">
							Apt
						</label>
						<input
							type="text"
							name="apt"
							value={formData.apt}
							onChange={handleChange}
							className="w-full rounded-md border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
						/>
					</div>

					{/* Zip */}
					<div>
						<label className="mb-1 block text-sm font-medium text-gray-700">
							Zip
						</label>
						<input
							type="text"
							name="zip"
							value={formData.zip}
							onChange={handleChange}
							className="w-full rounded-md border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
						/>
					</div>
				</div>

				{/* Submit Button */}
				<div className="flex flex-col items-center space-y-4 pt-6">
					<button
						type="submit"
						className="w-full rounded-full bg-blue-500 py-3 text-center font-medium text-white transition-colors hover:bg-blue-600"
					>
						Confirm details
					</button>
					<Link
						href="/signup"
						className="text-sm text-gray-500 hover:text-gray-700"
					>
						Back
					</Link>
				</div>
			</form>
		</main>
	);
} 