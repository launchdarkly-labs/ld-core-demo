import React, { useState, useEffect } from "react";
import Modal from "Components/Modal";
// import ChatMessageLoader from "Components/Chatbot/ChatMessageLoader";

const InvestmentDevLog = ({ isOpen, onClose, logs  }) => {
  const [lineBGColor, setLineBGColor] = useState(false);

  const changeBGColor = (index) => {
    setLineBGColor((prev) => !prev);

    if (lineBGColor) {
      document.querySelector(`.investment-dev-line-${index}`).classList.add("bg-violet-700");
    } else if (!lineBGColor) {
      document.querySelector(`.investment-dev-line-${index}`).classList.remove("bg-violet-700");
    }
  };

  useEffect(()=>{
    document.querySelector(".modal-box").classList.remove("top-0")
    document.querySelector(".modal-box").classList.remove("sm:top-[50%]")
  },[])

//   {!isLoadingStocks && log.includes("[API]") ? (
//     <div
//       className={`investment-dev-line-${index} my-4 ${successCloudColor} ${successLocalColor} cursor-pointer`}
//       key={index}
//       onClick={() => changeBGColor(index)}
//     >
//       {log}
//     </div>
//   ) : (
//     <ChatMessageLoader key={index} />
//   )}

//   {!isLoadingRecentTrades && log.includes("[DATABASE]") ? (
//     <div
//       className={`investment-dev-line-${index} my-4 ${successCloudColor} ${successLocalColor} cursor-pointer`}
//       key={index}
//       onClick={() => changeBGColor(index)}
//     >
//       {log}
//     </div>
//   ) : (
//     <ChatMessageLoader key={index} />
//   )}

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      modalClassOverride={
        "bottom-[0] w-full h-full sm:w-[75vw] sm:h-[30rem] border-2 sm:!bottom-[0] sm:!translate-y-[0] !pb-4 sm:mb-4"
      }
      modalWrapperClassOverride="bg-black-original/0 "
    >
      <div className="bg-slate-900 h-[92vh] sm:h-[25rem] w-full text-white p-4 mt-2 font-mono overflow-auto ">
        {logs.map((log, index) => {
          const successCloudColor = log.includes("CLOUD") && !log.includes("FAILED") ? "text-green-500" : "";
          const successLocalColor = log.includes("LOCAL") ? "text-cyan-500" : "";
          const failedCloudColor = log.includes("FAILED") ? "text-red-500" : "";
          return (
            <div
              className={`investment-dev-line-${index} my-4 ${successCloudColor} ${successLocalColor}  ${failedCloudColor}  cursor-pointer`}
              key={index}
              onClick={() => changeBGColor(index)}
            >
              {log}
            </div>
          );
        })}
      </div>
    </Modal>
  );
};

export default InvestmentDevLog;

