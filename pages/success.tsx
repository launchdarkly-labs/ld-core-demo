"use client";
import { useContext } from "react";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { useSignup } from "@/components/SignUpProvider";
import { INITIAL_USER_SIGNUP_DATA } from "@/utils/constants";
import { STARTER_PERSONAS } from "@/utils/contexts/StarterUserPersonas";
import { wait } from "@/utils/utils";
import { COMPANY_LOGOS, BANK } from "@/utils/constants";
import Image from "next/image";
import LoginContext from "@/utils/contexts/login";

export default function SuccessPage() {
	const { userData, updateUserData } = useSignup();
    const { isLoggedIn, loginUser } = useContext(LoginContext);

	return (
		<main className="flex flex-col items-center justify-center py-4 min-h-screen">
			<div className="flex flex-col items-center justify-center space-y-4 text-center">
				<Link
					href="/"
					title="Go Home"
					onClick={async () => {
						await wait(0.5);
						updateUserData(INITIAL_USER_SIGNUP_DATA);
					}}
				>
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
				<div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
					<CheckCircle className="h-10 w-10 text-green-600" />
				</div>

				<h1 className="text-2xl font-bold text-gray-800">
					Account Created Successfully!
				</h1>

				<p className="text-gray-600">
					Welcome to ToggleBank, {userData.firstName}! Your account has been
					created and you're ready to start banking.
				</p>

				<div className="mt-4 w-full rounded-lg bg-blue-50 p-4 text-left">
					<h2 className="mb-2 font-semibold text-blue-800">
						Selected Services:
					</h2>
					<ul className="list-inside list-disc text-blue-700">
						{userData.selectedServices.map((service) => (
							<li key={service}>{service}</li>
						))}
					</ul>
				</div>

				<p className="text-sm text-gray-500">
					You'll receive a confirmation email at {userData.email} with your
					account details.
				</p>

				<Link
					href="/"
					className="mt-4 w-full rounded-full bg-blue-500 py-3 text-center font-medium text-white transition-colors hover:bg-blue-600"
					onClick={async () => {
						!isLoggedIn && loginUser(STARTER_PERSONAS[0].personaemail);
						await wait(0.5);
						updateUserData(INITIAL_USER_SIGNUP_DATA);
					}}
				>
					Go to Dashboard
				</Link>
			</div>
		</main>
	);
} 