import React, { useState } from "react";
import axios from "axios";
import TokenPage from "./TokenPage";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PasswordInput, Image } from "@mantine/core";
import w4 from "../.././assets/w4.jpg";
import slogo from "../.././assets/Slogo.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [userId, setUserId] = useState();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ email, password }) => {
      const { data } = await axios.post(
        "http://localhost:8080/public/user/login",
        { email, password },
        { withCredentials: true }
      );
      return data;
    },
    onSuccess: (userData) => {
      queryClient.setQueryData(["currentUser"], userData);

      queryClient
        .getQueryCache()
        .find(["currentUser"])
        ?.setState((old) => ({
          ...old,
          config: {
            ...old.config,
            staleTime: Infinity,
          },
        }));
      setUserId(userData.userId);
      setErrorMessage("");
      console.log(userData);
      navigate("/");
    },
    onError: (error) => {
      if (error.status === 409) {
        console.log(error.response.data);
        setUserId(error.response.data.userId);
        setShowModal(true);
      } else {
        setErrorMessage(error.response.data || "login failed");
        console.log(error);
      }
    },
  });

  function handleSubmit(e) {
    e.preventDefault();
    mutation.mutate({ email, password });
  }

  return (
    <div className="flex items-center w-[880px] rounded-[6px] border bg-white border-gray-300 justify-center m-auto h-[80vh] mt-[60px] ">
      <div className="login-side w-[50%] text-center">
        <h2 className="font-bold text-4xl text-[#110447] my-[32px]">
          Sign in to Silvestre
        </h2>
        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col px-12 gap-2 my-[16px]"
        >
          <label className="text-start px-2">Email</label>
          <input
            name="email"
            type="email"
            value={email}
            required
            onChange={(e) => {
              setEmail(e.target.value);
              setErrorMessage("");
            }}
            className="py-1 px-2 border border-gray-300 rounded-[6px]"
          />

          <div className="flex justify-between px-2">
            <label>Password</label>
            <button
              type="button"
              className="cursor-pointer hover:underline text-gray-600"
            >
              Forgot?
            </button>
          </div>
          <PasswordInput
            value={password}
            onChange={(event) => {
              setPassword(event.currentTarget.value);
              setErrorMessage("");
            }}
          ></PasswordInput>
          <p>
            {errorMessage && (
              <span className="text-red-500 text-sm mt-2">{errorMessage}</span>
            )}
          </p>
          <button
            type="submit"
            className="text-white border rounded-[8px] py-2 bg-[#090128] border-transparent opacity-80 cursor-pointer hover:bg-blue-700"
          >
            Sign in
          </button>

          <div className="flex gap-2 items-center justify-center">
            <div className="border-t-2 border-gray-400 w-[80px] "></div>
            <p className="text-gray-500">Or login with</p>
            <div className="border-t-2 border-gray-400 w-[80px] "></div>
          </div>
          <div className="flex flex-col gap-[8px]">
            <button className="google py-2 px-4 border border-gray-400 rounded cursor-pointer">
              Google
            </button>
            <button className="google py-2 px-4 border border-gray-400 rounded">
              Facebook
            </button>
          </div>
        </form>

        <p>
          Don't have an account yet?
          <strong
            className="text-orange-600 pl-1 cursor-pointer hover:underline"
            onClick={() => {
              navigate("/sign-up");
            }}
          >
            Sign up now
          </strong>
        </p>
      </div>

      <div className="picture-side w-[50%] bg-[#090128] relative">
        <Image src={w4}></Image>
        <img
          src={slogo}
          className="h-20 w-20 absolute top-4 right-0 opacity-100"
        />
      </div>
      {showModal && (
        <TokenPage
          userId={userId}
          token=""
          onClickHandler={() => setShowModal(!setShowModal)}
        ></TokenPage>
      )}
    </div>
  );
};

export default Login;
