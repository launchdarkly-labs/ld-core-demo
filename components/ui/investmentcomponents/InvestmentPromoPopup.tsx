import React, { useState, useEffect, useContext } from "react";
import Modal from "@/components/ui/investmentcomponents/Modal";
import { Button } from "@/components/ui/button";

import * as amplitude from "@amplitude/analytics-browser";
import { ALERT_TYPES } from "@/utils/constants.js";
import { handleAlert } from "@/utils/utils";


const InvestmentPromoPopup = ({ alert }) => {
  
  const showInvestmentPromoPopUpLDFlag = true;
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    if (sessionStorage?.getItem("popup")?.includes("off")) return;

    let timer;
    if (showInvestmentPromoPopUpLDFlag) {
      timer = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem("popup", "off");
      }, "1000");
    }

    return () => {
      clearTimeout(timer);
    };
  }, [showInvestmentPromoPopUpLDFlag]);

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      modalClassOverride={`!pb-4 w-full sm:w-auto !h-auto !top-[50%] !left-[50%] translate-x-[-50%] translate-y-[-50%] `}
    >
      <div className="p-4 sm:p-8 sm:pt-4" data-testid = "salient-investment-promo-pop-up-test-id">
        <img
          src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3540&q=80"
          alt=""
          className="object-cover sm:h-[15rem] w-full mb-4 rounded-lg"
        />
        <div className="flex justify-center flex-col gap-y-2 mb-4 text-center">
          <h2 className="text-2xl text-primary font-semibold">New Investment Platform!</h2>
          <p className="text-gray-500">
            Get up to $50 when you enroll for the early access to the new investment platform.
          </p>
        </div>
        <Button
          handleClick={() => {
            amplitude.track(
              "Enroll Now in Pop Up for Early Access to Investment Platform Button Clicked"
            );

            handleAlert({
              alert: alert,
              type: ALERT_TYPES.SUCCESS,
              message:
                "Congratulations! You are enrolled in early access to the investment platform!",
              timeout: 5000,
            });

            onClose();
          }}
          color="customizedColor"
          classButtonOverride="w-full"
          dataTestId = "salient-investment-promo-pop-up-enroll-button-test-id"
        >
          Enroll Now
        </Button>
      </div>
    </Modal>
  );
};
//todo: repalce withalert with toast
export default InvestmentPromoPopup;
