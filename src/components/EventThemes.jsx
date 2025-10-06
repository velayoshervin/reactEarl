import { useEffect, useState } from "react";
import React from "react";
import axios from "axios";
import { queryClient } from "../AxiosTanstack";

const EventThemes = () => {
  const [themes, setThemes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const user = queryClient.getQueryData(["currentUser"]);

  useEffect(() => {}, []);

  return <div>EventThemes</div>;
};

export default EventThemes;
