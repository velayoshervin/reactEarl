import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import "@mantine/notifications/styles.css";
import { IconX, IconCheck } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";

const VerificationLink = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token"); // ?token=abc123
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    if (!token) {
      setErrorMessage("Token not found in the URL");
      return;
    }

    axios
      .post(
        `http://localhost:8080/public/email-token/verify?token=${encodeURIComponent(
          token
        )}`
      )
      .then(() => {
        const id = notifications.show({
          loading: true,
          title: "Loading your data",
          message: "Waiting for response from the server",
          autoClose: false,
          withCloseButton: false,
        });

        setTimeout(() => {
          notifications.update({
            id,
            color: "teal",
            title: "Verification Successful",
            message: "You are now verified!",
            icon: <IconCheck size={18} />,
            loading: false,
            autoClose: 2000,
          });
        }, 3000);

        navigate("/login"); // Redirect after success
      })
      .catch((err) => {
        console.error(err);
        if (err.response && err.response.status === 403) {
          setErrorMessage("Invalid token. Please try again.");
        } else {
          setErrorMessage("An error occurred. Please try again later.");
        }
      });
  }, [token, navigate]);

  return (
    <div>
      <h1>Verification</h1>
      <div>{errorMessage ? <p>{errorMessage}</p> : <p>Validating...</p>}</div>
    </div>
  );
};

export default VerificationLink;
