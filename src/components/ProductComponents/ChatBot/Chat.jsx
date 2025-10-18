import React, { useState, useEffect, useRef } from "react";
import "./Chatbot.css";

const SCRIPT = {
  welcome: {
    text: `Welcome to Silvestre’s Events and Exquisite Styles!
I can help you plan your perfect celebration from Weddings, Birthdays, Debuts and other special events.
Would you like to explore our services?`,
    quick: [
      "Yes",
      "No",
      "Hi",
      "Main Menu",
      "Payment Methods",
      "Cancellation Policy",
      "Guidelines",
    ],
  },
  servicesList: {
    text: `We offer a variety of event services:
• Weddings
• Birthdays
• Debuts
• Corporate & Private Events
You can browse our packages, prices, offers and book directly through our Booking page. (insrtlink)`,
    quick: [
      "Show Packages",
      "Customize Package",
      "Main Menu",
      "Payment Methods",
      "Cancellation Policy",
      "Guidelines",
      "FAQs",
    ],
  },
  packages: {
    text: `Our featured packages include:
- Platinum Package
- Diamond Package
Request a quotation for more details on inclusions and pricing. (insrtlink)`,
    quick: [
      "Request Quotation",
      "Customize Package",
      "Main Menu",
      "Payment Methods",
      "Cancellation Policy",
      "Guidelines",
    ],
  },
  customize: {
    text: `You can request a custom quotation through our Booking Page, and our team will get in touch with tailored options. Kindly check this link (insrtlink).`,
    quick: [
      "Request Quotation",
      "Main Menu",
      "Payment Methods",
      "Cancellation Policy",
      "Guidelines",
    ],
  },
  howToBook: {
    text: `Booking your event is easy! Simply visit our Booking Page, choose your preferred event type (Wedding, Birthday, Debut, or others), choose your theme, for how many pax, and select the package that best fits your needs. Once submitted, our team will get in touch to confirm your details and assist you with the next steps. (insrtlink)`,
    quick: [
      "Request Quotation",
      "Main Menu",
      "Payment Methods",
      "Cancellation Policy",
      "Guidelines",
    ],
  },
  advanceBooking: {
    text: `We recommend booking your event at least 1–3 months in advance to secure your preferred date and allow enough time for preparation. For larger or themed events, booking an event in advance is encouraged to ensure everything is perfectly arranged.`,
    quick: ["How do I book", "Main Menu"],
  },
  mainMenu: {
    text: `What would you like to do next?`,
    quick: [
      "Show Services",
      "Packages",
      "FAQs",
      "Payment Methods",
      "Cancellation Policy",
      "Guidelines",
    ],
  },
  faqs: {
    text: `Frequently Asked Questions. Type your question or choose an option:`,
    quick: [
      "How do I book an event?",
      "What packages do you offer?",
      "Can I customize a package?",
      "What payment methods do you accept?",
      "Do you have a cancellation policy?",
      "What are your guidelines?",
      "Main Menu",
    ],
  },
  guidelines: {
    text: `Our guidelines/terms & conditions include:
• Packages upgradeable but not downgradable
• Early ingress required for setup
• Corkage to be shouldered by clients
• Crew meals excluded on wedding day (3 meals)
• Exclusive 1 event per day to achieve 100% client satisfaction
• Date of event must be final upon inquiry
• Venue needs approval
• Reservation fees non-refundable but rebooking allowed due to pandemic or supplier availability
• Out-of-town fees may apply
• Prices may change without prior notice
• Prices vary based on guests, tables, theme, location, requirements
• Scheduled meetings only, no appointment no meeting
• Prenups weekdays (Manila restricted on Mondays)`,
    quick: ["Main Menu", "Payment Methods", "Cancellation Policy"],
  },
  paymentMethods: {
    text: `Payment Methods:
• Bank Transfer
• GCash / PayMaya
• Credit Card (Visa, Mastercard)
• Cash on site (if applicable)
Payments must be settled according to your booking agreement.`,
    quick: ["Main Menu", "Guidelines", "Cancellation Policy"],
  },
  cancellationPolicy: {
    text: `Cancellation Policy:
• Cancellation is not allowed unless the reason is about unforeseen events such as pandemic or natural calamities
• Changes or downgrades may incur additional charges`,
    quick: ["Main Menu", "Guidelines", "Payment Methods"],
  },
  salamatT: {
    text: `You’re very welcome! We’re always here to help you make your celebration extraordinary.`,
    quick: ["Main Menu", "FAQs"],
  },
  fullPlanning: {
    text: `Yes, we offer complete event service — from planning and coordination to styling, catering, photo/video coverage, and entertainment.`,
    quick: ["Show Services", "FAQs", "Main Menu"],
  },
  requestQuotation: {
    text: `You can request a free quotation anytime through our booking page, and our team will provide all the details you need.`,
    quick: ["Customize Package", "Main Menu"],
  },
  location: {
    text: `Our office is located in Centro, Balucuc, Apalit, Pampanga. You may visit us or contact us online for inquiries and bookings.`,
    quick: ["Main Menu", "FAQs"],
  },
  outOfTown: {
    text: `Yes, we do! We cater to events both within and outside our main area, depending on your preferred venue. However, the location needs approval from us before we proceed. Out-of-town fees may apply for distant locations or Prenups.`,
    quick: ["FAQs", "Main Menu"],
  },
  downPayment: {
    text: `A 10% Reservation fee is required to secure your date. The remaining balance can be settled closer to your event.`,
    quick: ["Pay Reservation", "Booking Page", "Main Menu"],
  },
  bookingPage: {
    text: `For our booking page you can access it through the link below. You can just click it and you will be directed to our page, thank you so much!
(insrtlink)`,
    quick: ["Pay Reservation", "Booking Page", "Main Menu"],
  },
  goodbye: {
    text: `Thank you for chatting with us today! 🎉
We hope you have a wonderful day and a fantastic upcoming event.
If you have more questions later, feel free to come back anytime!`,
    quick: ["Main Menu", "Book Now", "FAQs"],
  },
  noExplore: {
    text: `No worries! If you change your mind, you can explore our services anytime. You can also browse packages, FAQs, or return to the Main Menu.`,
    quick: ["Main Menu", "Show Services", "Packages", "FAQs"],
  },
};

const keywordMap = {
  yes: [
    "yes",
    "yeah",
    "yup",
    "sure",
    "ok",
    "okay",
    "alright",
    "lets go",
    "please show",
    "of course",
  ],
  no: [
    "no",
    "nah",
    "not now",
    "maybe later",
    "not interested",
    "nope",
    "dont show",
  ],
  services: [
    "show services",
    "services list",
    "list services",
    "our services",
    "what do you offer",
    "service options",
    "service",
    "event",
    "event offers",
    "offers",
  ],
  packages: [
    "show packages",
    "package options",
    "event packages",
    "featured packages",
    "packages",
    "package",
  ],
  booking: [
    "book event",
    "reserve",
    "schedule",
    "make reservation",
    "how do i book",
    "how to book",
    "reservation",
  ],
  customize: [
    "customize",
    "custom quotation",
    "tailored package",
    "custom package",
    "personalize package",
  ],
  faq: ["faq", "faqs", "questions", "frequently asked questions", "help"],
  guidelines: [
    "guidelines",
    "rules",
    "terms and conditions",
    "terms & conditions",
    "tnc",
  ],
  payment: ["payment", "payment methods", "how to pay", "payments"],
  cancellation: ["cancellation", "cancel", "cancellation policy", "reschedule"],
  salamatT: ["thank you", "thanks", "ty", "thankyou", "appreciate it"],
  fullplanning: [
    "full planning",
    "event planning",
    "do you plan events",
    "complete service",
    "coordination",
  ],
  quotation: [
    "quotation",
    "quote",
    "request quote",
    "how much",
    "pricing",
    "price",
  ],
  location: ["location", "where are you", "office", "address", "visit"],
  outoftown: ["out of town", "destination", "travel", "outside area", "prenup"],
  downpayment: [
    "down payment",
    "reservation fee",
    "deposit",
    "initial payment",
    "dp",
    "pay reservation",
    "pay",
  ],
  page: ["booking page", "website", "site"],
  advanceBooking: ["advance booking", "book in advance", "early booking"],
  goodbye: ["bye", "goodbye", "see you"],
};

function similarity(s1, s2) {
  if (!s1 || !s2) return 0;
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();
  const len1 = s1.length;
  const len2 = s2.length;
  const dp = Array.from({ length: len1 + 1 }, () => Array(len2 + 1).fill(0));
  for (let i = 0; i <= len1; i++) dp[i][0] = i;
  for (let j = 0; j <= len2; j++) dp[0][j] = j;
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      dp[i][j] =
        s1[i - 1] === s2[j - 1]
          ? dp[i - 1][j - 1]
          : Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + 1);
    }
  }
  return 1 - dp[len1][len2] / Math.max(len1, len2);
}

export default function Chatbot() {
  const [showWidget, setShowWidget] = useState(false);
  const [conversation, setConversation] = useState([]);
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const chatRef = useRef();

  const appendMessage = (text, sender = "bot") => {
    setConversation((prev) => [...prev, { text, sender }]);
  };

  const showScript = (key) => {
    const node = SCRIPT[key];
    if (!node) {
      appendMessage("Sorry — I don't have that section.", "bot");
      return;
    }
    appendMessage(node.text, "bot");
    const list = [...(node.quick || [])];
    if (!list.includes("Main Menu")) list.push("Main Menu");
    setSuggestions(list);
  };

  const detectKeywords = (text) => {
    const low = text.toLowerCase();
    const found = [];
    for (const key in keywordMap) {
      for (const word of keywordMap[key]) {
        if (low.includes(word) || similarity(low, word) > 0.7) found.push(key);
      }
    }
    return [...new Set(found)];
  };

  const handleUserInput = (raw) => {
    const text = raw.trim();
    if (!text) return;
    appendMessage(text, "user");
    setInput("");
    const lower = text.toLowerCase();
    const directMap = {
      hi: "welcome",
      hello: "welcome",
      yes: "servicesList",
      no: "noExplore",
      "how do i book": "howToBook",
      "how to book": "howToBook",
      "main menu": "mainMenu",
      "payment methods": "paymentMethods",
      "customize package": "customize",
    };
    if (directMap[lower]) return showScript(directMap[lower]);
    const keys = detectKeywords(lower);
    if (keys.length === 0) {
      appendMessage("Sorry, I don't fully understand that.", "bot");
      return showScript("mainMenu");
    }
    keys.forEach((k) => {
      switch (k) {
        case "yes":
          showScript("servicesList");
          break;
        case "no":
          showScript("noExplore");
          break;
        case "services":
          showScript("servicesList");
          break;
        case "packages":
          showScript("packages");
          break;
        case "customize":
          showScript("customize");
          break;
        case "booking":
          showScript("howToBook");
          break;
        case "faq":
          showScript("faqs");
          break;
        case "guidelines":
          showScript("guidelines");
          break;
        case "payment":
          showScript("paymentMethods");
          break;
        case "cancellation":
          showScript("cancellationPolicy");
          break;
        case "salamatT":
          showScript("salamatT");
          break;
        case "fullplanning":
          showScript("fullPlanning");
          break;
        case "quotation":
          showScript("requestQuotation");
          break;
        case "location":
          showScript("location");
          break;
        case "outoftown":
          showScript("outOfTown");
          break;
        case "downpayment":
          showScript("downPayment");
          break;
        case "page":
          showScript("bookingPage");
          break;
        case "advanceBooking":
          showScript("advanceBooking");
          break;
        case "goodbye":
          showScript("goodbye");
          break;
        default:
          showScript("mainMenu");
          break;
      }
    });
  };

  useEffect(() => {
    chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
  }, [conversation]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (conversation.length === 0) {
        setShowWidget(true);
        showScript("welcome");
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {!showWidget && (
        <button className="chat-btn" onClick={() => setShowWidget(true)}>
          <img src="/silv.jpg" alt="Chat" />
        </button>
      )}

      {showWidget && (
        <div className="widget">
          <div className="header">
            <div className="title">Silvestre’s Events — Assistant</div>
            <button className="closeBtn" onClick={() => setShowWidget(false)}>
              &times;
            </button>
          </div>

          <div className="chat-area" ref={chatRef}>
            {conversation.map((msg, i) => (
              <div
                key={i}
                className={`message ${msg.sender}`}
                dangerouslySetInnerHTML={{
                  __html: msg.text.replace(/\n/g, "<br>"),
                }}
              />
            ))}
          </div>

          <div className="quick">
            {suggestions.map((s, i) => (
              <button key={i} onClick={() => handleUserInput(s)}>
                {s}
              </button>
            ))}
          </div>

          <div className="controls">
            <input
              type="text"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleUserInput(input)}
            />
            <button className="send" onClick={() => handleUserInput(input)}>
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
