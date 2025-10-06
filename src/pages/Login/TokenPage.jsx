import { React, useState, useEffect } from "react";
import axios from "axios";

const TokenPage = ({ userId, onClickHandler, token }) => {
  const [countdown, setCountdown] = useState(20);

  //change param later need to provide user data
  function resend(userId) {
    return axios.post(
      "http://localhost:8080/public/email-token/resend",
      {
        userId,
      },
      {
        withCredentials: true,
      }
    );
  }

  useEffect(() => {
    if (countdown === 0) return;
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval); // Stop the interval
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, [countdown]);

  const handleResend = async () => {
    setCountdown(20); // Reset to 60 and restart timer
    try {
      const response = await resend(userId, token);
      console.log(response.data);
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-white/10  rounded text-white ">
      <div className=" p-8 rounded-lg shadow-lg max-w-md text-center  relative space-y-4 bg-[#120746]">
        <p className="font-semibold">Your account is currently disabled</p>
        <button
          onClick={onClickHandler}
          className=" bg-white border border-red-500 rounded-full h-8 w-8 items-center box-border absolute right-4 top-4 cursor-pointer hover:bg-red-500"
        >
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3Abs7xReQpahtM1KlPZjm-q5uJjy5JPN6UQ&s"
            className="rounded-full p-1"
          ></img>
        </button>
        <p className="mb-4 mt-[16px] text-[14px]">
          Please check your email and click the confirm button to activate your
          account.
        </p>

        <p className="text-[14px]">
          Click resend if you didn't receive a message.
        </p>
        <button
          onClick={handleResend}
          disabled={countdown > 0}
          className={`px-8 py-2 rounded-[24px] border border-blue-900 text-white bg-[#0c023f]  cursor-pointer ${
            countdown > 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-white hover:bg-green-600"
          }`}
        >
          Resend in{" "}
          <span className={countdown > 0 ? "text-black" : "text-gray-500"}>
            {countdown}s
          </span>
        </button>
      </div>
    </div>
  );
};

export default TokenPage;
