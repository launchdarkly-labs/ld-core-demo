import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import ReactDOM from "react-dom";
import { motion } from "framer-motion";
import { XIcon } from "lucide-react";


export default function Modal({
  open,
  onClose,
  children,
  additionButtonOnTop,
  modalClassOverride = "",
  modalWrapperClassOverride = "",
}) {

   function insertModalRoot() {
    let modalRoot = document.getElementById("modal-root");
    if (!modalRoot) {
      modalRoot = document.createElement("div");
      modalRoot.setAttribute("id", "modal-root");
      document.body.appendChild(modalRoot);
    }
  }
  
  useEffect(() => {
    insertModalRoot();
  }, [open]);

  if (!open) return null;

  return ReactDOM.createPortal(
    <>
      <div
        className={`fixed top-0 right-0 bottom-0 left-[-20px] bg-black/75 z-[1000] cursor-pointer ${modalWrapperClassOverride}`}
        onClick={onClose}
      ></div>
      <motion.div
        className={`modal-box fixed bg-white z-[1000] overflow-auto 
        w-full h-full
        top-0 left-0 sm:top-[50%] sm:left-[50%] sm:translate-x-[-50%] sm:translate-y-[-50%] 
        px-4 pt-4 pb-20 sm:pb-4 
        sm:rounded-lg ${modalClassOverride} `}
        data-testid="modal-test-id"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="flex justify-end">
          {additionButtonOnTop}
          <Button
            className="!h-8 !w-8 !px-0 !py-0 !mr-1 !mt-[-5px] rounded-full !text-gray-500 !bg-transparent"
            type="button"
            title="Close Modal"
            onClick={onClose}
            dataTestId={"close-button-test-id"}
          >
            <XIcon aria-hidden="true" />
          </Button>
        </div>
        {children}
      </motion.div>
    </>,
    document.getElementById("modal-root")
  );
}
