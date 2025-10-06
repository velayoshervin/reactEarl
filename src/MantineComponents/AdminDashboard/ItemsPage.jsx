import React, { useState } from "react";
import { Input, NumberInput, MultiSelect, Button } from "@mantine/core";

const ItemsPage = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [perUnitExcess, setPerUnitExcess] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [pax, setPax] = useState("");
  const [recommendedForEvents, setRecommendedForEvents] = useState([]);

  return (
    <div>
      <form className="flex flex-col gap-4">
        <Input.Wrapper label="Name">
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </Input.Wrapper>

        <Input.Wrapper label="Description">
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Input.Wrapper>

        <Input.Wrapper label="Price">
          <NumberInput
            value={price}
            onChange={(val) => setPrice(val)}
            placeholder="0.00"
          />
        </Input.Wrapper>

        <Input.Wrapper label="Per Unit Excess">
          <NumberInput
            value={perUnitExcess}
            onChange={(val) => setPerUnitExcess(val)}
            placeholder="0.00"
          />
        </Input.Wrapper>

        <Input.Wrapper label="Category">
          <Input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </Input.Wrapper>

        <Input.Wrapper label="Type">
          <Input value={type} onChange={(e) => setType(e.target.value)} />
        </Input.Wrapper>

        <Input.Wrapper label="Pax">
          <NumberInput value={pax} onChange={(val) => setPax(val)} />
        </Input.Wrapper>

        <MultiSelect
          label="Recommended for Events"
          placeholder="Select events..."
          value={recommendedForEvents}
          onChange={setRecommendedForEvents}
          // example options, replace with your actual events list:
          data={[
            { label: "Weddings", value: "weddings" },
            { label: "Birthdays", value: "birthdays" },
            { label: "Debut", value: "debut" },
          ]}
        />
        <Button variant="default">Submit</Button>
      </form>
    </div>
  );
};

export default ItemsPage;
