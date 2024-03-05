import React, { useState, useEffect, useRef } from "react";
import { Box, Typography, TextField, Button, keyframes } from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera"; // Import an icon for the upload button

const CreateClaimView = () => {
  const [image, setImage] = useState(null);
  // Initialize the messages state as an empty array
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]); // Depend on messages

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

  // Simulate sending a message to an LLM and receiving a response
  const sendMessageToLLM = (userMessage) => {
    // Simulate LLM processing delay
    setTimeout(() => {
      handleSendMessage(
        "LLM",
        "This is a simulated response based on your input.",
        "llm",
        "text"
      );
    }, 1000);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Create a new FileReader instance
      const reader = new FileReader();

      // Define what happens on file load
      // This part remains inside the handleImageChange
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

    // If the message is from the user and it's text, simulate sending it to the LLM
    if (contentType === "text" && sender === "User") {
      sendMessageToLLM(content);
    }

    // Clear the message input if the sender is the user and it's text
    if (contentType === "text") {
      setMessageText("");
    }
  };

  // Handle sending a user message when the "Send" button is clicked
  const handleUserMessageSend = () => {
    handleSendMessage("User", messageText, "user", "text");
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
        </Box>

        {/* Chat input and send button */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "8px",
            backgroundColor: "#ffffff",
            boxShadow: "0 -2px 10px rgba(0,0,0,0.1)",
          }}
        >
          <TextField
            variant="outlined"
            placeholder="Type your message here..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            sx={{ mr: 2, flex: 1 }}
            fullWidth
            disabled={!image} // Keep disabled until an image is uploaded
          />
          <Button
            variant="contained"
            color="primary"
            disabled={!image || !messageText.trim()}
            onClick={handleUserMessageSend}
          >
            Send
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default CreateClaimView;
