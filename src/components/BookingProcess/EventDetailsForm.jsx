// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   HoverCard,
//   Button,
//   Text,
//   Select,
//   NumberInput,
//   TextInput,
//   Textarea,
//   Avatar,
//   Group,
// } from "@mantine/core";
// import { IconCalendarEvent } from "@tabler/icons-react";
// import dayjs from "dayjs";
// import AvailableCalendar from "../../components/AvailableCalendar";

// const EventDetailsForm = ({ formData, updateFormData, onNext, onBack }) => {
//   const [venues, setVenues] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);

//   useEffect(() => {
//     const fetchVenues = async () => {
//       try {
//         setIsLoading(true);
//         const res = await axios.get("http://localhost:8080/api/venue", {
//           withCredentials: true,
//         });

//         if (res?.data) {
//           const venueOptions = res.data.map((venue) => ({
//             value: venue.venueId.toString(),
//             label: venue.name,
//             image: venue.imageUrl,
//             address: venue.address,
//           }));
//           setVenues(venueOptions);
//         }
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchVenues();
//   }, []);

//   const isFormValid = () => {
//     return formData.requestedDate && formData.eventType && formData.pax > 0;
//   };

//   return (
//     <div className="py-6">
//       <Text size="xl" fw={600} mb="md">
//         Event Details
//       </Text>

//       <div className="grid grid-cols-2 gap-6">
//         {/* Left Column */}
//         <div className="space-y-4">
//           <div className="flex gap-4">
//             <HoverCard shadow="xs" width={320} className="flex-1">
//               <HoverCard.Target>
//                 <div>
//                   <Text size="sm" mb={4}>
//                     Event date *
//                   </Text>
//                   <Button
//                     variant="default"
//                     className="!border !border-gray-400 !w-full"
//                     leftSection={<IconCalendarEvent size={16} />}
//                   >
//                     <Text fw={100} c="dimmed" size="xs">
//                       {formData.requestedDate
//                         ? dayjs(formData.requestedDate).format(
//                             "ddd, MMMM D, YYYY"
//                           )
//                         : "Pick Event date"}
//                     </Text>
//                   </Button>
//                 </div>
//               </HoverCard.Target>
//               <HoverCard.Dropdown>
//                 <AvailableCalendar
//                   isBooking={true}
//                   onDateSelect={(date) =>
//                     updateFormData({ requestedDate: date })
//                   }
//                 />
//               </HoverCard.Dropdown>
//             </HoverCard>

//             <Select
//               label="Venue"
//               placeholder="(Optional) Select venue"
//               value={formData.selectedVenue}
//               onChange={(value) => updateFormData({ selectedVenue: value })}
//               data={venues}
//               clearable
//               renderOption={({ option }) => (
//                 <Group>
//                   <Avatar src={option?.image} size="sm" />
//                   <div>
//                     <Text size="sm">{option.label}</Text>
//                     <Text size="xs" c="dimmed">
//                       {option.address}
//                     </Text>
//                   </div>
//                 </Group>
//               )}
//             />
//           </div>

//           <div className="flex gap-4">
//             <Select
//               label="Event Type *"
//               withAsterisk
//               data={[
//                 "Wedding",
//                 "Birthdays",
//                 "Baptismal",
//                 "BabyShower",
//                 "Party",
//                 "Reunion",
//                 "Corporate",
//               ]}
//               value={formData.eventType}
//               onChange={(value) => updateFormData({ eventType: value })}
//               className="flex-1"
//               clearable
//             />

//             <NumberInput
//               label="Number of Guests *"
//               withAsterisk
//               min={0}
//               value={formData.pax}
//               onChange={(value) => updateFormData({ pax: value })}
//             />
//           </div>

//           <TextInput
//             label="Celebrant/s"
//             placeholder="Name of celebrants"
//             value={formData.celebrants}
//             onChange={(event) =>
//               updateFormData({ celebrants: event.target.value })
//             }
//           />
//         </div>

//         {/* Right Column */}
//         <div className="space-y-4">
//           <TextInput
//             label="Customer's Full Name *"
//             withAsterisk
//             value={formData.customerName}
//             onChange={(event) =>
//               updateFormData({ customerName: event.target.value })
//             }
//           />

//           <TextInput
//             label="Contact Number *"
//             withAsterisk
//             placeholder="Enter 9-digit number"
//             leftSection={<Text size="sm">+639</Text>}
//             value={formData.contactNumber}
//             onChange={(event) => {
//               const numbersOnly = event.target.value
//                 .replace(/\D/g, "")
//                 .slice(0, 9);
//               updateFormData({ contactNumber: numbersOnly });
//             }}
//             styles={{
//               input: { paddingLeft: "3.5rem" },
//               section: { width: "3.5rem" },
//             }}
//           />

//           <Textarea
//             label="Address *"
//             withAsterisk
//             placeholder="Complete event address"
//             value={formData.address}
//             onChange={(event) =>
//               updateFormData({ address: event.target.value })
//             }
//             rows={4}
//           />
//         </div>
//       </div>

//       <Group position="apart" mt="xl">
//         <Button variant="default" onClick={onBack}>
//           Back
//         </Button>
//         <Button onClick={onNext} disabled={!isFormValid()}>
//           Next: Customize Package
//         </Button>
//       </Group>
//     </div>
//   );
// };

// export default EventDetailsForm;
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  HoverCard,
  Button,
  Text,
  Select,
  NumberInput,
  TextInput,
  Textarea,
  Avatar,
  Group,
} from "@mantine/core";
import { IconCalendarEvent } from "@tabler/icons-react";
import dayjs from "dayjs";
import AvailableCalendar from "../../components/AvailableCalendar";

const EventDetailsForm = ({ formData, updateFormData, onNext, onBack }) => {
  const [venues, setVenues] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCustomVenue, setShowCustomVenue] = useState(false);

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get("http://localhost:8080/api/venue", {
          withCredentials: true,
        });

        if (res?.data) {
          const venueOptions = res.data.map((venue) => ({
            value: venue.venueId.toString(),
            label: venue.name,
            image: venue.imageUrl,
            address: venue.address,
          }));
          // Add "Others" option
          venueOptions.push({
            value: "others",
            label: "Others (Specify your own venue)",
            image: null,
            address: "Custom venue location",
          });
          setVenues(venueOptions);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVenues();
  }, []);

  // Handle venue selection
  const handleVenueChange = (value) => {
    if (value === "others") {
      setShowCustomVenue(true);
      updateFormData({
        selectedVenue: value,
        customVenue: "",
      });
    } else {
      setShowCustomVenue(false);
      updateFormData({
        selectedVenue: value,
        customVenue: "",
      });
    }
  };

  const isFormValid = () => {
    return formData.requestedDate && formData.eventType && formData.pax > 0;
  };

  return (
    <div className="py-6">
      <Text size="xl" fw={600} mb="md">
        Event Details
      </Text>

      <div className="grid grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-4">
          <div className="flex gap-4">
            <HoverCard shadow="xs" width={320} className="flex-1">
              <HoverCard.Target>
                <div>
                  <Text size="sm" mb={4}>
                    Event date *
                  </Text>
                  <Button
                    variant="default"
                    className="!border !border-gray-400 !w-full"
                    leftSection={<IconCalendarEvent size={16} />}
                  >
                    <Text fw={100} c="dimmed" size="xs">
                      {formData.requestedDate
                        ? dayjs(formData.requestedDate).format(
                            "ddd, MMMM D, YYYY"
                          )
                        : "Pick Event date"}
                    </Text>
                  </Button>
                </div>
              </HoverCard.Target>
              <HoverCard.Dropdown>
                <AvailableCalendar
                  isBooking={true}
                  onDateSelect={(date) =>
                    updateFormData({ requestedDate: date })
                  }
                />
              </HoverCard.Dropdown>
            </HoverCard>

            <div className="flex-1">
              <Select
                label="Venue"
                placeholder="(Optional) Select venue"
                value={formData.selectedVenue}
                onChange={handleVenueChange}
                data={venues}
                clearable
                renderOption={({ option }) => (
                  <Group>
                    {option.image && <Avatar src={option.image} size="sm" />}
                    <div>
                      <Text size="sm">{option.label}</Text>
                      <Text size="xs" c="dimmed">
                        {option.address}
                      </Text>
                    </div>
                  </Group>
                )}
              />

              {/* Custom venue input field */}
              {showCustomVenue && (
                <TextInput
                  label="Specify Your Venue"
                  placeholder="Enter your venue name and address"
                  value={formData.customVenue}
                  onChange={(event) =>
                    updateFormData({ customVenue: event.target.value })
                  }
                  mt="sm"
                />
              )}
            </div>
          </div>

          <div className="flex gap-4">
            <Select
              label="Event Type *"
              withAsterisk
              data={[
                "Wedding",
                "Birthdays",
                "Baptismal",
                "BabyShower",
                "Party",
                "Reunion",
                "Corporate",
              ]}
              value={formData.eventType}
              onChange={(value) => updateFormData({ eventType: value })}
              className="flex-1"
              clearable
            />

            <NumberInput
              label="Number of Guests *"
              withAsterisk
              min={0}
              value={formData.pax}
              onChange={(value) => updateFormData({ pax: value })}
            />
          </div>

          <TextInput
            label="Celebrant/s"
            placeholder="Name of celebrants"
            value={formData.celebrants}
            onChange={(event) =>
              updateFormData({ celebrants: event.target.value })
            }
          />
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <TextInput
            label="Customer's Full Name *"
            withAsterisk
            value={formData.customerName}
            onChange={(event) =>
              updateFormData({ customerName: event.target.value })
            }
          />

          <TextInput
            label="Contact Number *"
            withAsterisk
            placeholder="Enter 9-digit number"
            leftSection={<Text size="sm">+639</Text>}
            value={formData.contactNumber}
            onChange={(event) => {
              const numbersOnly = event.target.value
                .replace(/\D/g, "")
                .slice(0, 9);
              updateFormData({ contactNumber: numbersOnly });
            }}
            styles={{
              input: { paddingLeft: "3.5rem" },
              section: { width: "3.5rem" },
            }}
          />

          <Textarea
            label="Address *"
            withAsterisk
            placeholder="Complete event address"
            value={formData.address}
            onChange={(event) =>
              updateFormData({ address: event.target.value })
            }
            rows={4}
          />
        </div>
      </div>

      <Group position="apart" mt="xl">
        <Button variant="default" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onNext} disabled={!isFormValid()}>
          Next: Customize Package
        </Button>
      </Group>
    </div>
  );
};

export default EventDetailsForm;
