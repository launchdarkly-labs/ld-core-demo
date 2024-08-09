import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalizeFirstLetter(string: string) {
  return string?.charAt(0).toUpperCase() + string?.slice(1);
}

export function truncateString(str: string, num: number) {
  // If the length of str is less than or equal to num
  // just return str--don't truncate it.
  if (str?.length <= num) {
    return str;
  }
  // Return str truncated with '...' concatenated to the end of str.
  return str?.slice(0, num) + "...";
}

export const formatMoneyTrailingZero = (number: number) => {
  const splitNum = number.toString().split(".");
  const firstNum = splitNum[0];
  let secondNum = splitNum[1];

  if (secondNum === undefined) secondNum = "0";
  if (secondNum?.length === 2 && secondNum?.includes("0")) return number;
  if (secondNum?.length === 2) return number;
  return `${firstNum}.${secondNum}0`;
};

export function handleAlert({
  response,
  alert,
  type,
  message,
  callback,
  timeout,
}: {
  response: any;
  alert: any;
  type: any;
  message: any;
  callback: any;
  timeout: any;
}) {
  //to not allow multiple message pop up at the same time
  const alertTemplateEle = document
    ?.querySelector(".alert-template")
    ?.querySelector("#banner-message")?.innerHTML;
  if (alertTemplateEle === message) return;

  if (response instanceof Error && alert?.error) {
    return alert?.error(response.message);
  }

  if (alert?.show)
    alert?.show(message, {
      type,
      timeout: timeout ? timeout : 3000,
    });

  setTimeout(() => {
    if (callback) {
      callback();
    }
  }, 3000);
}

export function wait(seconds: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, seconds * 1000);
  });
}

export   const randomLatency = (min: number, max: number) =>
  max === undefined ? Math.random() * min : min + Math.random() * (max - min + 1);

export function delay(low: number, high: number) {
  const min = low * 1000;
  const max = high * 1000;
  const randomDelay = Math.floor(Math.random() * (max - min + 1)) + min;
  //console.log("Delay is: "+randomDelay)
  return new Promise((resolve) => setTimeout(resolve, randomDelay));
}