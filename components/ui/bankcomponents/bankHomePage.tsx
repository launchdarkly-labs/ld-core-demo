import { useState } from 'react';
import { motion } from "framer-motion";
import NavBar from "@/components/ui/navbar";
import Image from "next/image";
import { useFlags } from "launchdarkly-react-client-sdk";
import iconBackground from "@/public/banking/icons/icon-background.svg";
import heroBackgroundCreditcard from "@/public/banking/backgrounds/bank-hero-background-creditcard.svg";
import heroBackgroundDollarSign from "@/public/banking/backgrounds/bank-hero-background-dollarsign.svg";
import iconBackgroundOnHover from "@/public/banking/icons/icon-background-on-hover.svg";
import checking from "@/public/banking/icons/checking.svg";
import checkingOnHover from "@/public/banking/icons/checking-on-hover.svg";
import creditcard from "@/public/banking/icons/creditcard.svg";
import creditcardOnHover from "@/public/banking/icons/creditcard-on-hover.svg";
import mortgage from "@/public/banking/icons/mortgage.svg";
import mortgageOnHover from "@/public/banking/icons/mortgage-on-hover.svg";
import business from "@/public/banking/icons/business.svg";
import businessOnHover from "@/public/banking/icons/business-on-hover.svg";
import savings from "@/public/banking/icons/savings.svg";
import savingsOnHover from "@/public/banking/icons/savings-on-hover.svg";
import retirmentBackground from "@/public/banking/backgrounds/bank-homepage-retirment-card-background.svg";
import specialOfferBackground from "@/public/banking/backgrounds/bank-homepage-specialoffer-background.svg";

export default function BankHomePage() {

    return (
        <motion.main
            className={`relative min-w-screen min-h-screen overflow-hidden`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >

            <header className={`w-full relative `}>
                <Image src={heroBackgroundCreditcard} className='absolute right-0 w-2/6 xl:w-2/6 min-w-lg max-w-lg' alt="Icon Background" />
                <Image src={heroBackgroundDollarSign} className='absolute left-0 bottom-0 w-2/6 xl:w-2/6 max-w-lg' alt="Icon Background" />

                <div
                    className="w-full max-w-7xl py-14 sm:py-[8rem] px-4 xl:px-0 xl:mx-auto flex flex-col sm:flex-row justify-between items-center">
                    <div className="grid grid-cols-2 sm:flex flex-row sm:flex-col text-white w-full sm:w-1/2 justify-start mb-4 pr-10 sm:mb-0 gap-y-10 z-10">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl  font-audimat col-span-1 sm:col-span-0 w-full bg-bank-gradient-text-color bg-clip-text text-transparent px-2 sm:px-6 md:px-8 lg:px-10 xl:px-8">
                            Spend smart with Toggle Bank
                        </h1>
                        <h2 className="text-sm sm:text-md md:text-xl lg:text-xl col-span-2 sm:col-span-0 font-sohnelight w-full text-black px-6 sm:px-6 md:px-8 lg:px-10 xl:px-8 ">
                            {bankHomePageValues?.industryMessages}
                        </h2>
                        <div className="flex space-x-4 px-6 sm:px-2 md:px-4 lg:px-6 xl:px-8">
                            <button className="bg-bank-gradient-blue-background hover:bg-bank-gradient-text-color hover:text-white text-white rounded-3xl font-sohnelight w-28 h-10 sm:w-32 sm:h-11 md:w-36 md:h-12 lg:w-40 lg:h-14 xl:w-36 xl:h-12 text-xs sm:text-md md:text-lg lg:text-xl xl:text-xl">
                                Join Now
                            </button>
                            <button className="border hover:bg-bank-gradient-text-color border-blue-800 hover:border-bankhomepagebuttonblue hover:text-white text-blue-800  rounded-3xl font-sohnelight w-28 h-10 sm:w-32 sm:h-11 md:w-36 md:h-12 lg:w-40 lg:h-14 xl:w-36 xl:h-12 text-xs sm:text-md md:text-lg lg:text-xl xl:text-xl">
                                Learn More
                            </button>
                        </div>
                    </div>

                    <div className="w-full sm:w-auto z-10">
                        {/* <BankLoginComponent /> */}
                    </div>
                </div>
            </header>

            <div className="z-20 2xl:mt-20" >
                <div className="flex justify-center mb-6 text-bankhomepagebuttonblue font-sohne tracking-widest">
                    EXPLORE   SOMETHING   NEW
                </div>

                <section
                    className="w-3/4 grid grid-cols-2 sm:flex sm:flex-row font-sohnelight text-center justify-center mx-auto gap-y-8 
            sm:gap-y-0 gap-x-8
          sm:gap-x-12 lg:gap-x-24 py-8 z-20"
                >
                    {bankHomePageValues?.bankingServicesArr.map((ele: any, i: number) => {
                        return (
                            <motion.div
                                className="grid items-center justify-items-center"
                                key={i}
                                whileHover={{ scale: 1.2 }}
                            >
                                <div className="relative w-24 h-24 cursor-pointer">
                                    <Image src={iconBackground} width={160} height={120} className="absolute inset-0 m-auto" alt="Icon Background" />
                                    <Image src={ele?.imgSrc} width={40} height={96} className="absolute left-1 bottom-1 inset-0 m-auto" alt={ele?.title} />
                                </div>
                                <p className="text-xl mt-2 font-sohnelight">{ele?.title}</p>
                            </motion.div>
                        );
                    })}
                </section>
            </div>

            <div className="container mx-auto my-10 p-4">
                <div className="flex flex-col sm:flex-row mb-4 gap-x-8 p-4 mx-10 sm:mx-20 sm:pb-8 gap-y-10 sm:gap-y-0">
                    <div className="w-full sm:w-1/3 bg-blue-500 p-4 rounded-2xl bg-bank-gradient-blue-background shadow-2xl">
                        <div className="flex flex-col gap-y-6 mt-4 ">
                            <div className="mx-8 text-sm text-gray-300 tracking-widest font-sohnelight">
                                MORTGAGE
                            </div>
                            <div className="mx-8 mt-4 text-white font-sohne text-xl">
                                Set down new roots
                            </div>
                            <div className="text-gray-300 mx-8 mb-4 font-sohne text-md">
                                From finding your new place to getting the keys – we're here to help.
                            </div>
                        </div>
                    </div>
                    <div className="w-full sm:w-2/3 bg-white p-4 rounded-2xl shadow-2xl flex">
                        <div className="flex flex-col gap-y-6 mt-4 w-full sm:w-1/2">
                            <div className="mx-8 text-sm text-gray-400 tracking-widest font-sohnelight">
                                RETIREMENT
                            </div>
                            <div className="mx-8 mt-4 text-blue-600 font-sohne text-xl">
                                Prepare for retirement
                            </div>
                            <div className="text-black mx-8 mb-4 font-sohne text-md">
                                Plan for the future by using our Retirement Planning Calculator.
                            </div>
                        </div>
                        <div className="w-1/2 items-center justify-center hidden sm:flex">
                            <Image src={retirmentBackground} width={200} height={50} alt="Retirement Background" />
                        </div>
                    </div>
                </div>
                {/* Second Row */}
                <div className="p-4 mx-10 sm:mx-20 sm:pb-20">
                    <div className="flex flex-col sm:flex-row shadow-2xl p-y-10 sm:p-y-0 rounded-2xl sm:rounded-2xl ">
                        <div className="w-full sm:w-1/3 bg-white p-4 rounded-2xl sm:rounded-r-none">
                            <div className="flex flex-col gap-y-4 mt-4">
                                <div className="mx-8 text-sm text-gray-400 tracking-widest font-sohnelight">
                                    SPECIAL OFFER
                                </div>
                                <div className="mx-8 mt-4 text-blue-600 font-sohne text-xl">
                                    Take advantage
                                </div>
                                <div className="text-black mx-8 mb-4 font-sohne text-md">
                                    Exclusive credit card offer with premium service from Toggle Bank. Terms apply.
                                </div>
                            </div>
                        </div>
                        <div className="w-full hidden sm:block mt-4 sm:mt-0 sm:w-2/3 bg-purple-500 p-4 rounded-2xl relative">
                            <Image src={specialOfferBackground} className='rounded-r-2xl' layout="fill" objectFit="cover" alt="Retirement Background" />
                        </div>
                    </div>
                </div>
            </div>



        </motion.main>



    );

}

const bankHomePageValues: any = {
    name: "ToggleBank",
    industryMessages: "More than 100,000 customers worldwide",
    gradiantColor: "bg-gradient-bank",
    bankingServicesArr: [
        { imgSrc: checking, title: "Checking" },
        { imgSrc: business, title: "Business" },
        { imgSrc: creditcard, title: "Credit Card" },
        { imgSrc: mortgage, title: "Savings" },
        { imgSrc: savings, title: "Mortgages" },
    ],
    bankingServicesArrOnHover: [
        { imgSrc: checkingOnHover, title: "Checking" },
        { imgSrc: businessOnHover, title: "Business" },
        { imgSrc: creditcardOnHover, title: "Credit Card" },
        { imgSrc: mortgageOnHover, title: "Savings" },
        { imgSrc: savingsOnHover, title: "Mortgages" },
    ]
}