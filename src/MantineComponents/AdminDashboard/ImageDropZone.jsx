import React, { useState } from "react";
import { Group, Text, Image, SimpleGrid, Button } from "@mantine/core";
import { IconUpload, IconPhoto, IconX } from "@tabler/icons-react";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";

export default function ImageDropZone(props) {
  const [files, setFiles] = useState([]);

  const handleDrop = (acceptedFiles) => {
    setFiles((prev) => [...prev, ...acceptedFiles]);
  };

  const handleRemoveFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="px-12 py-2">
      <Dropzone
        onDrop={handleDrop}
        onReject={(rejectedFiles) =>
          console.log("rejected files", rejectedFiles)
        }
        maxSize={5 * 1024 ** 2}
        accept={IMAGE_MIME_TYPE}
        {...props}
      >
        <Group
          justify="center"
          gap="xl"
          mih={110}
          style={{ pointerEvents: "none" }}
        >
          <Dropzone.Accept>
            <IconUpload
              size={52}
              color="var(--mantine-color-blue-6)"
              stroke={1.5}
            />
          </Dropzone.Accept>
          <Dropzone.Reject>
            <IconX size={52} color="var(--mantine-color-red-6)" stroke={1.5} />
          </Dropzone.Reject>
          <Dropzone.Idle>
            <IconPhoto
              size={52}
              color="var(--mantine-color-dimmed)"
              stroke={1.5}
            />
          </Dropzone.Idle>

          <div className="text-center">
            <Text size="xl" inline>
              Drag images here or click to select files
            </Text>
            <Text size="sm" color="dimmed" inline mt={7}>
              file should not exceed 5mb
            </Text>
          </div>
        </Group>
      </Dropzone>

      {files.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <Text size="lg" weight={500} mb={10}>
            Preview:
          </Text>
          <SimpleGrid cols={4} spacing="sm">
            {files.map((file, index) => (
              <div key={index} style={{ position: "relative" }}>
                <Image
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  height={100}
                  fit="cover"
                  radius="sm"
                />
                <Button
                  size="xs"
                  variant="filled"
                  color="red"
                  style={{
                    position: "absolute",
                    top: 5,
                    right: 5,
                    minWidth: "auto",
                    padding: "0 6px",
                  }}
                  onClick={() => handleRemoveFile(index)}
                >
                  X
                </Button>
              </div>
            ))}
          </SimpleGrid>
        </div>
      )}
    </div>
  );
}
