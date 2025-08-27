import React from "react";
import { cn } from "@/utils/utils";
import { motion } from "framer-motion";

const WrapperMain = ({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) => {
	return (
		<motion.main
			className={cn(
				"relative w-full min-h-screen overflow-hidden mx-auto max-w-7xl px-4 xl:px-0",
				className
			)}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.5 }}
		>
			{children}
		</motion.main>
	);
};

export default WrapperMain; 