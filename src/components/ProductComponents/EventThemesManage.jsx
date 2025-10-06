import React, { useState } from "react";
import { TextInput } from "@mantine/core";

const EventThemesManage = () => {
  const [value, setValue] = useState("");

  return (
    <div className="grid grid-cols-2">
      <div>
        <div className="border border-gray-200 rounded">
          <TextInput
            label="Theme name"
            value={value}
            onChange={(event) => setValue(event.currentTarget.value)}
          />
        </div>
      </div>
      <div></div>
    </div>
  );
};

export default EventThemesManage;
