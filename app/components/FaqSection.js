"use client";

import { useState } from "react";

const FAQ_ITEMS = [
  {
    question: "What is the benefit of a plan that includes SiriusXM in-car service?",
    answer:
      "With SiriusXM in-car service, you can tune in to your favorite channels and enjoy quality audio coast to coast in the 48 contiguous United States, the District of Columbia, and Puerto Rico (with some limitations).",
  },
  {
    question: "What are the benefits of streaming on the SiriusXM app?",
    answer:
      "Besides providing great flexibility in how you choose to listen, the SiriusXM app gives you even more exclusive content to explore, including streaming-only channels, podcasts, and SiriusXM video. To listen in your car with a streaming-only subscription, connect your phone to your car stereo or use Apple CarPlay® or Android Auto.",
  },
  {
    question: "Which plans let me listen to SiriusXM on my streaming devices?",
    answer:
      "All our popular plans include streaming with the SiriusXM app. If you prefer listening exclusively on your phone and other smart home and mobile devices, choose a streaming-only plan. Plans with in-car service also include the SiriusXM app.",
  },
  {
    question: "How do I know the plan I choose contains the programming I want?",
    answer:
      "To learn more about what's included in our All Access plan, as well as our All Music plan (including optional Sports, Talk, and News add-ons), check out the full list of available channels.",
  },
  {
    question: "What other subscriptions are available?",
    answer:
      "We have plans for a variety of listeners. You can explore additional subscription options on our More Plans page.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="faq-section" id="help">
      <h2>You&apos;ve got questions?</h2>
      <p className="faq-subtitle">We&apos;ve got answers.</p>
      <div className="faq-list">
        {FAQ_ITEMS.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={item.question} className={`faq-item${isOpen ? " open" : ""}`}>
              <button
                type="button"
                className="faq-question"
                aria-expanded={isOpen}
                onClick={() => setOpenIndex(isOpen ? null : index)}
              >
                <span>{item.question}</span>
                <span className="faq-icon" aria-hidden>
                  {isOpen ? "−" : "+"}
                </span>
              </button>
              {isOpen && <p className="faq-answer">{item.answer}</p>}
            </div>
          );
        })}
      </div>
    </section>
  );
}
