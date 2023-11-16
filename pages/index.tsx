//@ts-nocheck
import Image from "next/image";
import { Inter } from "next/font/google";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Globe } from "lucide-react";
import { useRouter } from "next/router";
import { CSNav } from "@/components/ui/csnav";
import NavBar from "@/components/ui/navbar";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const router = useRouter();

  const goToBank = () => {
    router.push("/bank");
  };

  const goToNext = () => {
    router.push("/devs");
  };

  const variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.5, // This will create the staggered effect
      },
    },
  };

  const childVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1 },
  };

  const pageVariants = {
    initial: { x: 0 },
    in: { x: 0 },
    out: { x: "-100%" },
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5,
  };

  return (
    <main className="h-full flex-col items-center justify-center bg-ldblack overflow-y sm:overflow-y-hidden">
      <div className="w-full text-white flex h-20 shadow-2xl">
        <NavBar />
      </div>

      <header className="banner mx-auto w-full sm:w-1/3 ">
        <div>
          <h1>Connecting code to customers</h1>
          <p>
            Maximize the value of every software feature through safer releases, targeted
            experiences, experimentation, and more.
          </p>
        </div>
      </header>
      <section className="py-8 bg-ldblack h-full">
        <div className="mx-auto flex flex-col w-1/2 ">
          <div className="flex flex-col sm:flex-row gap-x-0 gap-y-8 sm:gap-x-8 sm:gap-y-0 mb-8">
            <div className="w-full sm:w-1/2 home-card">
              <svg
                width="44"
                height="44"
                viewBox="0 0 44 44"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="44" height="44" rx="22" fill="url(#paint0_linear_2085_52)" />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M17.0093 15.9556C13.671 15.9556 10.9648 18.6617 10.9648 22C10.9648 25.3382 13.671 28.0444 17.0093 28.0444H26.9917C30.33 28.0444 33.0362 25.3382 33.0362 22C33.0362 18.6617 30.33 15.9556 26.9917 15.9556H17.0093ZM26.8194 26.5812C29.3495 26.5812 31.4005 24.5302 31.4005 22.0001C31.4005 19.47 29.3495 17.4189 26.8194 17.4189C24.2893 17.4189 22.2383 19.47 22.2383 22.0001C22.2383 24.5302 24.2893 26.5812 26.8194 26.5812Z"
                  fill="white"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M17.0093 15.9556C13.671 15.9556 10.9648 18.6617 10.9648 22C10.9648 25.3382 13.671 28.0444 17.0093 28.0444H26.9917C30.33 28.0444 33.0362 25.3382 33.0362 22C33.0362 18.6617 30.33 15.9556 26.9917 15.9556H17.0093ZM26.8194 26.5812C29.3495 26.5812 31.4005 24.5302 31.4005 22.0001C31.4005 19.47 29.3495 17.4189 26.8194 17.4189C24.2893 17.4189 22.2383 19.47 22.2383 22.0001C22.2383 24.5302 24.2893 26.5812 26.8194 26.5812Z"
                  fill="url(#paint1_linear_2085_52)"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear_2085_52"
                    x1="52.7292"
                    y1="-11.66"
                    x2="5.64921"
                    y2="44"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset="0.123144" stop-color="#3DD6F5" />
                    <stop offset="1" stop-color="#A34FDE" />
                  </linearGradient>
                  <linearGradient
                    id="paint1_linear_2085_52"
                    x1="22.0005"
                    y1="15.9556"
                    x2="22.0005"
                    y2="28.0444"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stop-color="white" />
                    <stop offset="1" stop-color="white" stop-opacity="0" />
                  </linearGradient>
                </defs>
              </svg>

              <h2>De-Risk Deploys</h2>
              <p>Deploy more often and release without risk.</p>
            </div>
            <div className="w-full sm:w-1/2 home-card">
              <svg
                width="44"
                height="44"
                viewBox="0 0 44 44"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="44" height="44" rx="22" fill="url(#paint0_linear_2085_26)" />
                <path
                  d="M32.6847 22.2292L34.0001 23.5217L27.8646 29.5625L24.6043 26.3542L25.9197 25.0617L27.8646 26.9683L32.6847 22.2292ZM22.2553 26.3542L25.0741 29.1042H15.6782V27.2708C15.6782 25.245 19.0419 23.6042 23.1949 23.6042L24.9707 23.705L22.2553 26.3542ZM23.1949 14.4375C24.1917 14.4375 25.1476 14.8238 25.8524 15.5114C26.5573 16.1991 26.9532 17.1317 26.9532 18.1042C26.9532 19.0766 26.5573 20.0093 25.8524 20.6969C25.1476 21.3845 24.1917 21.7708 23.1949 21.7708C22.1981 21.7708 21.2422 21.3845 20.5373 20.6969C19.8325 20.0093 19.4366 19.0766 19.4366 18.1042C19.4366 17.1317 19.8325 16.1991 20.5373 15.5114C21.2422 14.8238 22.1981 14.4375 23.1949 14.4375Z"
                  fill="white"
                />
                <path
                  d="M32.6847 22.2292L34.0001 23.5217L27.8646 29.5625L24.6043 26.3542L25.9197 25.0617L27.8646 26.9683L32.6847 22.2292ZM22.2553 26.3542L25.0741 29.1042H15.6782V27.2708C15.6782 25.245 19.0419 23.6042 23.1949 23.6042L24.9707 23.705L22.2553 26.3542ZM23.1949 14.4375C24.1917 14.4375 25.1476 14.8238 25.8524 15.5114C26.5573 16.1991 26.9532 17.1317 26.9532 18.1042C26.9532 19.0766 26.5573 20.0093 25.8524 20.6969C25.1476 21.3845 24.1917 21.7708 23.1949 21.7708C22.1981 21.7708 21.2422 21.3845 20.5373 20.6969C19.8325 20.0093 19.4366 19.0766 19.4366 18.1042C19.4366 17.1317 19.8325 16.1991 20.5373 15.5114C21.2422 14.8238 22.1981 14.4375 23.1949 14.4375Z"
                  fill="url(#paint1_linear_2085_26)"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear_2085_26"
                    x1="3.5"
                    y1="-1"
                    x2="40.0963"
                    y2="37.678"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset="0.123144" stop-color="#405BFF" />
                    <stop offset="1" stop-color="#3DD6F5" />
                  </linearGradient>
                  <linearGradient
                    id="paint1_linear_2085_26"
                    x1="24.8392"
                    y1="14.4375"
                    x2="24.8392"
                    y2="29.5625"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stop-color="white" />
                    <stop offset="1" stop-color="white" stop-opacity="0" />
                  </linearGradient>
                </defs>
              </svg>

              <h2>Targeted Experiences</h2>
              <p>Deliver targeted product experiences to any customer segment.</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-x-0 gap-y-8 sm:gap-x-8 sm:gap-y-0">
            <div className="w-full sm:w-1/2 home-card">
              <svg
                width="44"
                height="44"
                viewBox="0 0 44 44"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="44" height="44" rx="22" fill="url(#paint0_linear_2085_38)" />
                <g filter="url(#filter0_d_2085_38)">
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M21.4121 22.9989C20.8789 22.3654 20.3308 21.714 19.404 21.714C18.1385 21.714 17.5366 22.9865 16.7785 24.5892C16.4558 25.2713 16.1049 26.0132 15.6625 26.7423C15.3702 27.224 15.0936 27.623 14.8379 27.9533L14.8379 14.497L12.9998 14.497V29.5032H14.8379V29.503H31.0004V15.4892C31.0004 15.4892 29.0487 12.8973 27.3247 16.0908C26.6795 17.2859 26.1649 18.7198 25.6889 20.0463C24.893 22.2643 24.2048 24.1821 23.1935 24.1821C22.4077 24.1821 21.9166 23.5985 21.4121 22.9989Z"
                    fill="white"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M21.4121 22.9989C20.8789 22.3654 20.3308 21.714 19.404 21.714C18.1385 21.714 17.5366 22.9865 16.7785 24.5892C16.4558 25.2713 16.1049 26.0132 15.6625 26.7423C15.3702 27.224 15.0936 27.623 14.8379 27.9533L14.8379 14.497L12.9998 14.497V29.5032H14.8379V29.503H31.0004V15.4892C31.0004 15.4892 29.0487 12.8973 27.3247 16.0908C26.6795 17.2859 26.1649 18.7198 25.6889 20.0463C24.893 22.2643 24.2048 24.1821 23.1935 24.1821C22.4077 24.1821 21.9166 23.5985 21.4121 22.9989Z"
                    fill="url(#paint1_linear_2085_38)"
                  />
                </g>
                <defs>
                  <filter
                    id="filter0_d_2085_38"
                    x="7"
                    y="7"
                    width="30"
                    height="30"
                    filterUnits="userSpaceOnUse"
                    color-interpolation-filters="sRGB"
                  >
                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                    <feColorMatrix
                      in="SourceAlpha"
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                      result="hardAlpha"
                    />
                    <feOffset />
                    <feGaussianBlur stdDeviation="1.5" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                    />
                    <feBlend
                      mode="normal"
                      in2="BackgroundImageFix"
                      result="effect1_dropShadow_2085_38"
                    />
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="effect1_dropShadow_2085_38"
                      result="shape"
                    />
                  </filter>
                  <linearGradient
                    id="paint0_linear_2085_38"
                    x1="-9.5"
                    y1="-5"
                    x2="36"
                    y2="42.5"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset="0.123144" stop-color="#DDF21E" />
                    <stop offset="1" stop-color="#18D3F9" />
                  </linearGradient>
                  <linearGradient
                    id="paint1_linear_2085_38"
                    x1="22.0001"
                    y1="14.4968"
                    x2="22.0001"
                    y2="29.5032"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stop-color="white" />
                    <stop offset="1" stop-color="white" stop-opacity="0" />
                  </linearGradient>
                </defs>
              </svg>

              <h2>Measure & Experiment</h2>
              <p>Customize the business impact of every product feature through experimentation.</p>
            </div>
            <div className="w-full sm:w-1/2 home-card">
              <svg
                width="44"
                height="44"
                viewBox="0 0 44 44"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="44" height="44" rx="22" fill="url(#paint0_linear_2085_129)" />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M18.1176 12.9412H26.3529C26.7898 12.9412 27.2087 13.1147 27.5176 13.4236C27.8265 13.7325 28 14.1514 28 14.5882V29.4118C28 29.8486 27.8265 30.2675 27.5176 30.5764C27.2087 30.8853 26.7898 31.0588 26.3529 31.0588H18.1176C17.6808 31.0588 17.2619 30.8853 16.953 30.5764C16.6441 30.2675 16.4706 29.8486 16.4706 29.4118V26.9412H18.1176V29.4118H26.3529V14.5882H18.1176V17.0588H16.4706V14.5882C16.4706 14.1514 16.6441 13.7325 16.953 13.4236C17.2619 13.1147 17.6808 12.9412 18.1176 12.9412ZM16 17.8823C14.8954 17.8823 14 18.7778 14 19.8823V24.1176C14 25.2222 14.8954 26.1176 16 26.1176H20.2353C21.3399 26.1176 22.2353 25.2222 22.2353 24.1176V19.8823C22.2353 18.7778 21.3399 17.8823 20.2353 17.8823H16Z"
                  fill="white"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M18.1176 12.9412H26.3529C26.7898 12.9412 27.2087 13.1147 27.5176 13.4236C27.8265 13.7325 28 14.1514 28 14.5882V29.4118C28 29.8486 27.8265 30.2675 27.5176 30.5764C27.2087 30.8853 26.7898 31.0588 26.3529 31.0588H18.1176C17.6808 31.0588 17.2619 30.8853 16.953 30.5764C16.6441 30.2675 16.4706 29.8486 16.4706 29.4118V26.9412H18.1176V29.4118H26.3529V14.5882H18.1176V17.0588H16.4706V14.5882C16.4706 14.1514 16.6441 13.7325 16.953 13.4236C17.2619 13.1147 17.6808 12.9412 18.1176 12.9412ZM16 17.8823C14.8954 17.8823 14 18.7778 14 19.8823V24.1176C14 25.2222 14.8954 26.1176 16 26.1176H20.2353C21.3399 26.1176 22.2353 25.2222 22.2353 24.1176V19.8823C22.2353 18.7778 21.3399 17.8823 20.2353 17.8823H16Z"
                  fill="url(#paint1_linear_2085_129)"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear_2085_129"
                    x1="4.5"
                    y1="-3.5"
                    x2="48.1935"
                    y2="43.6107"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset="0.123144" stop-color="#FF386B" />
                    <stop offset="1" stop-color="#EBFF38" />
                  </linearGradient>
                  <linearGradient
                    id="paint1_linear_2085_129"
                    x1="21"
                    y1="12.9412"
                    x2="21"
                    y2="31.0588"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stop-color="white" />
                    <stop offset="1" stop-color="white" stop-opacity="0" />
                  </linearGradient>
                </defs>
              </svg>

              <h2>Mobile App Control</h2>
              <p>Release mobile features and fixes on your schedule, not theirs</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
