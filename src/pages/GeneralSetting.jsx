import React, { useState, useEffect } from "react";
import "../pages/GeneralSetting.css";
import { updateUserInfoSettings } from "../ItemsAxios";
import {
  Group,
  PasswordInput,
  TextInput,
  Switch,
  Box,
  CloseButton,
  Tooltip,
} from "@mantine/core";
import { IconCheck, IconX, IconInfoCircle } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

const GeneralSetting = () => {
  // eslint-disable-next-line no-unused-vars
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState();
  const [formValues, setFormValues] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    enableEmailOtp: false,
    enableSmsOtp: false,
    password: "",
    updatedPassword: "",
    updatingPassword: false,
  });

  // address: null;
  // email: "admin@example.com";
  // enableEmailOtp: false;
  // enableSmsOtp: false;
  // firstname: "Admin";
  // id: 19;
  // lastname: "User";
  // phone: null;
  // role: "ADMIN";

  function handleCancelUpdatePassword() {
    setUpdatePassword(false);
    setFormValues((prev) => ({
      ...prev,
      password: "",
      updatedPassword: "",
      updatingPassword: false,
    }));
  }

  function saveUser() {
    notifications.show({
      title: "Success",
      message: "Your profile has been updated!",
      color: "green",
    });
  }

  function showError() {
    notifications.show({
      title: "Error",
      message: "Something went wrong.",
      color: "red",
    });
  }

  const [updatePassword, setUpdatePassword] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  function handleEditClick() {
    setIsEditing((prev) => !prev);
  }

  useEffect(() => {
    const userData = queryClient.getQueryData(["currentUser"]);
    if (userData) {
      setUser(userData); // then update state
      setFormValues((prev) => ({
        firstname: userData.firstname || "",
        lastname: userData.lastname || "",
        email: userData.email || "",
        phone: userData.phone || "",
        enableEmailOtp: userData.enableEmailOtp || false,
        enableSmsOtp: userData.enableSmsOtp || false,
        updatingPassword: prev.updatingPassword || false,
      }));
    } else {
      navigate("/login");
    }
  }, [navigate, queryClient]);
  // actual object
  // address: null;
  // email: "admin@example.com";
  // enableEmailOtp: false;
  // enableSmsOtp: false;
  // firstname: "Admin";
  // id: 19;
  // lastname: "User";
  // phone: null;
  // role: "ADMIN";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  function handleSubmit(e) {
    e.preventDefault();

    console.log("Submitting formValues:", formValues);
    updateUserInfoSettings({ payload: formValues, userId: user.id })
      .then((res) => {
        console.log(res.data);
        queryClient.setQueryData("currentUser", (oldData) => ({
          ...oldData,
          ...formValues,
        }));
        saveUser();
      })
      .catch((err) => {
        console.log(err);
        showError();
      });
  }

  return (
    <div className="max-w-[800px] mx-auto text-[16px] bg-white pb-5 rounded-xl border border-gray-300 overflow-hidden">
      <div className="">
        <div className="flex justify-between  text-[20px] border border-gray-300  px-5 py-[18px]">
          <p className="font-semibold">User Information</p>{" "}
          {isEditing ? (
            <button
              className="text-blue-500 hover:text-blue-600 hover:underline text-[14px]"
              onClick={() => {
                setIsEditing(false);
              }}
            >
              Cancel Edit
            </button>
          ) : (
            <button
              className="text-blue-500 hover:text-blue-600 hover:underline"
              onClick={handleEditClick}
            >
              Edit
            </button>
          )}
        </div>
        {/* {"id":19,"email":"admin@example.com","firstname":"Admin","lastname":"User","phone":null,"address":null,"role":"ADMIN"} */}
        <table className="border border-gray-300  w-full">
          <tbody className="gs-tbody">
            <tr>
              <td className="w-1/3  pl-[20px] py-[12px]">Name</td>
              <td className="w-2/3 border-l border-l-gray-300 pl-[24px]">
                {isEditing ? (
                  <div className="flex gap-2 py-2 w-full">
                    <TextInput
                      size="md"
                      name="firstname"
                      label="firstname"
                      value={formValues.firstname}
                      onChange={handleChange}
                    ></TextInput>
                    <TextInput
                      size="md"
                      name="lastname"
                      label="lastname"
                      value={formValues.lastname}
                      onChange={handleChange}
                    ></TextInput>
                  </div>
                ) : (
                  `${user?.firstname} ${user?.lastname}`
                )}
              </td>
            </tr>
            <tr>
              <td className="w-1/3 pl-[20px] py-[12px]">Email</td>
              <td className="w-2/3 border-l border-l-gray-300 pl-[24px]">
                {isEditing ? (
                  <TextInput
                    className="w-[80%]"
                    name="email"
                    required
                    value={formValues.email}
                    withAsterisk
                    onChange={handleChange}
                    placeholder="Enter your email"
                    rightSection={
                      <Tooltip
                        label="This will also be used to send you OTP if enabled  "
                        position="top"
                        withArrow
                      >
                        <IconInfoCircle
                          size={18}
                          style={{ cursor: "pointer" }}
                        />
                      </Tooltip>
                    }
                  />
                ) : (
                  user?.email
                )}
              </td>
            </tr>
            <tr>
              <td className="w-1/3 pl-[20px] py-[12px]">Mobile Number</td>
              <td className="w-2/3 border-l border-l-gray-300 pl-[24px]">
                {isEditing ? (
                  <TextInput
                    size="md"
                    name="phone"
                    value={formValues.phone}
                    onChange={handleChange}
                    className="w-[80%]"
                    placeholder="123456789"
                    type="number"
                    leftSection={<p>+639</p>}
                    leftSectionWidth={50}
                    rightSection={
                      <Tooltip
                        label="This will also be used to send you SMS OTP if enabled  "
                        position="top"
                        withArrow
                      >
                        <IconInfoCircle
                          size={18}
                          style={{ cursor: "pointer" }}
                        />
                      </Tooltip>
                    }
                  />
                ) : (
                  user?.phone || <p>na</p>
                )}
              </td>
            </tr>
            <tr>
              <td className="w-1/3 pl-[20px] py-[12px] ">Password</td>
              {isEditing ? (
                <td className="pl-[24px] py-[12px] border-l border-l-gray-300 w-[80%]">
                  <Box className="flex ">
                    {updatePassword ? (
                      <CloseButton
                        className="left-98"
                        onClick={handleCancelUpdatePassword}
                      ></CloseButton>
                    ) : (
                      <button
                        className=" text-blue-600  cursor-pointer"
                        onClick={() => {
                          setUpdatePassword(true);
                          setFormValues((prev) => ({
                            ...prev,
                            updatingPassword: true,
                          }));
                        }}
                      >
                        Update Password
                      </button>
                    )}
                  </Box>
                  {updatePassword && (
                    <>
                      <PasswordInput
                        size="md"
                        withAsterisk
                        label="New Password"
                        description="this will be your new password upon update"
                        placeholder="******"
                        name="updatedPassword"
                        onChange={handleChange}
                        className="w-[80%]"
                        required
                      />
                      <PasswordInput
                        size="md"
                        withAsterisk
                        label="Current Password"
                        description="type your currently in-use password"
                        placeholder="*******"
                        name="password"
                        onChange={handleChange}
                        className="w-[80%]"
                        required
                      />
                    </>
                  )}
                </td>
              ) : (
                <td className="w-2/3 border-l border-l-gray-300 pl-[24px]">
                  Keep your password secure
                </td>
              )}
            </tr>
            <tr>
              <td className="w-1/3 pl-[20px] py-[12px]">OTP Enabled</td>
              {isEditing ? (
                <td className="border border-gray-300 pl-[24px] py-[12px] flex gap-2">
                  <div className="py-[24x] px-2">
                    <Switch
                      checked={formValues.enableEmailOtp}
                      onChange={(event) => {
                        const checked = event.currentTarget.checked; // grab immediately
                        setFormValues((prev) => ({
                          ...prev,
                          enableEmailOtp: checked,
                        }));
                      }}
                      className=" py-[12px] px-[12px]"
                      color="teal"
                      size="md"
                      label="receive through email"
                      thumbIcon={
                        formValues.enableEmailOtp ? (
                          <IconCheck
                            size={12}
                            color="var(--mantine-color-teal-6)"
                            stroke={3}
                          />
                        ) : (
                          <IconX
                            size={12}
                            color="var(--mantine-color-red-6)"
                            stroke={3}
                          />
                        )
                      }
                    />
                  </div>
                  <div className="py-[24x] px-[12px] ">
                    <Switch
                      checked={formValues.enableSmsOtp}
                      onChange={(event) => {
                        const checked = event.currentTarget.checked; // grab immediately
                        setFormValues((prev) => ({
                          ...prev,
                          enableSmsOtp: checked,
                        }));
                      }}
                      color="teal"
                      size="md"
                      label="receive through SMS"
                      className="px-[12px] py-[12px]"
                      thumbIcon={
                        formValues.enableSmsOtp ? (
                          <IconCheck
                            size={12}
                            color="var(--mantine-color-teal-6)"
                            stroke={3}
                          />
                        ) : (
                          <IconX
                            size={12}
                            color="var(--mantine-color-red-6)"
                            stroke={3}
                          />
                        )
                      }
                    />
                  </div>
                </td>
              ) : (
                <td className="w-2/3 border-l border-l-gray-300 pl-[24px] ">
                  {!(formValues.enableEmailOtp || formValues.enableSmsOtp) && (
                    <p>Disable</p>
                  )}
                </td>
              )}
            </tr>
          </tbody>
        </table>
        {isEditing && (
          <div className="flex  justify-end gap-2 my-[16px] px-4">
            <button
              className="cursor-pointer py-1 px-[24px] border border-gray-400 rounded-[24px]"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>{" "}
            <button
              className="cursor-pointer py-1 px-[24px] border border-gray-400 rounded-[24px]"
              onClick={handleSubmit}
            >
              Update
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GeneralSetting;
