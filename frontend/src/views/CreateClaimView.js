import React, { useState, useEffect, useRef } from "react";
import { Box, Typography, TextField, Button, keyframes } from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera"; // Import an icon for the upload button
import config from "../config";

const CreateClaimView = () => {
  const [image, setImage] = useState(null);
  // Initialize the messages state as an empty array
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const messagesEndRef = useRef(null);
  const [showSubmissionOptions, setShowSubmissionOptions] = useState(false);
  const [suggestedClaim, setSuggestedClaim] = useState(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]); // Depend on messages

  const handleSubmissionResponse = async (response) => {
    // Hide the buttons after selection
    setShowSubmissionOptions(false);

    if (response === "yes" && suggestedClaim) {
      // Process affirmative response
      console.log("Claim submission initiated.");
      try {
        const response = await fetch(`${config.API_BASE_URL}/submitClaim`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(suggestedClaim),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log("Claim submission successful:", result);

        // Inform the user that the claim creation is in progress
        setTimeout(() => {
          handleSendMessage(
            "System",
            `Claim creation in progress, check "My Claims" for status.`,
            "system",
            "text"
          );
        }, 400);
      } catch (error) {
        console.error("Claim submission failed:", error);
        handleSendMessage(
          "System",
          "Failed to submit claim. Please try again.",
          "system",
          "text"
        );
      }
    } else {
      // Handle negative response
      console.log("Claim submission cancelled.");
      setImage(null);
      setMessages([]);
      // Consider also resetting suggestedClaim if not needed anymore
      setSuggestedClaim(null);
    }
  };

  const slideUp = keyframes`
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
`;

  const slideIn = keyframes`
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

  const getSuggestedClaim = async (base64Image) => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/createClaim`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          base64Image.replace("data:image/jpeg;base64,", "")
        ),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data; // Returns the response from the endpoint
    } catch (error) {
      console.error("Error fetching suggested claim:", error);
      throw error; // Rethrow or handle error as needed
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Create a new FileReader instance
      const reader = new FileReader();

      // Define what happens on file load
      reader.onload = function (loadEvent) {
        const base64Image = loadEvent.target.result;
        setImage(base64Image); // You might want to display the image as a preview or directly in the chat

        // Send a system message indicating the image was uploaded successfully
        handleSendMessage(
          "System",
          "Image uploaded successfully.",
          "system",
          "text"
        );

        // Here, you send the image as a message
        handleSendMessage("User", base64Image, "user", "image");
        getSuggestedClaim(base64Image)
          .then((result) => {
            result.image_base64 = base64Image.replace(
              "data:image/jpeg;base64,",
              ""
            );

            setSuggestedClaim(result);
            const formattedMessage = `
Here is the suggested claim:

Title: ${result.title}

Description: ${result.description}

Cost estimate: $${Math.round(result.cost_estimate)}`;
            handleSendMessage("System", formattedMessage, "system", "text");
            setTimeout(() => {
              handleSendMessage(
                "System",
                "Would you like to submit this claim?",
                "system",
                "text"
              );
              setShowSubmissionOptions(true);
            }, 1000);
          })
          .catch((e) => {
            handleSendMessage(
              "System",
              `There was an error creating your claim:
              ${e}`,
              "system",
              "text"
            );
          });

        setTimeout(() => {
          handleSendMessage(
            "System",
            "Processing your image. Please wait.",
            "system",
            "text"
          );
        }, 1000);
      };

      // Read the file as a Data URL (base64 encoded string)
      reader.readAsDataURL(file);
    }
  };

  const handleSendMessage = (sender, content, type, contentType = "text") => {
    if (!content.trim() && contentType === "text") return;

    const newMessage = {
      sender,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      content,
      contentType, // Add contentType to the message structure
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  return (
    <>
      <Box
        sx={{
          width: "90vw",
          height: "calc(100vh - 200px)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          backgroundColor: "#f0f2f5",
          borderRadius: "10px",
          margin: "auto",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        }}
      >
        {/* Chat messages area */}
        <Box
          sx={{
            width: "100%",
            overflowY: "auto",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            flex: 1,
          }}
        >
          {messages.map((msg, index) => {
            return msg.contentType === "text" ? (
              <Typography
                key={index}
                variant="body1"
                sx={{
                  alignSelf: msg.sender === "User" ? "end" : "start",
                  backgroundColor:
                    msg.type === "llm"
                      ? "#e1f5fe"
                      : msg.type === "system"
                      ? "#eeeeee"
                      : "#ffffff",
                  padding: "8px",
                  borderRadius: "10px",
                  animation: `${slideIn} 0.3s ease-out forwards`,
                  whiteSpace: "pre-wrap", // Preserves whitespace and line breaks
                }}
              >
                {`${msg.sender} at ${msg.timestamp}: ${msg.content}`}
              </Typography>
            ) : (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  justifyContent:
                    msg.sender === "User" ? "flex-end" : "flex-start",
                  padding: "8px",
                }}
              >
                <img
                  src={msg.content}
                  alt=""
                  style={{
                    maxWidth: "90%",
                    maxHeight: "200px",
                    borderRadius: "10px",
                  }}
                />
              </Box>
            );
          })}
          <div ref={messagesEndRef} />
          {/* Image upload button, shown if no image has been selected */}
          {!image && (
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <input
                accept="image/*"
                style={{ display: "none" }}
                id="raised-button-file"
                multiple
                type="file"
                onChange={handleImageChange}
              />
              <label htmlFor="raised-button-file">
                <Button
                  variant="contained"
                  component="span"
                  startIcon={<PhotoCamera />}
                  sx={{ mb: 1 }}
                >
                  Upload Image
                </Button>
              </label>
              <Typography variant="caption" sx={{ textAlign: "center" }}>
                Upload an image to proceed with creating your claim.
              </Typography>
            </Box>
          )}
          {/* Conditional rendering of Yes and No buttons */}
          {showSubmissionOptions && (
            <Box
              sx={{
                display: "flex",
                width: "100%",
                justifyContent: "space-evenly",
                animation: `${slideUp} 0.5s ease-out forwards`,
                padding: "10px",
                backgroundColor: "#f0f2f5",
              }}
            >
              <Button
                variant="contained"
                color="success"
                size="large"
                sx={{ width: "100%", marginRight: "10px" }}
                onClick={() => handleSubmissionResponse("yes")}
              >
                Yes
              </Button>
              <Button
                variant="contained"
                color="error"
                size="large"
                sx={{ width: "100%", height: "55px" }}
                onClick={() => handleSubmissionResponse("no")}
              >
                No
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
};

export default CreateClaimView;
