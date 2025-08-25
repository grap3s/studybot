document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("chatInput");
  const messages = document.getElementById("chatMessages");

  function basicSummarise(text) {
    // Split into sentences
    const sentences = text.split(/(?<=[.!?])\s+/);
    // If very short, just return it
    if (sentences.length <= 3) return text;
    // Pick first, middle, and last sentences for variety
    const midIndex = Math.floor(sentences.length / 2);
    return `${sentences[0]} ${sentences[midIndex]} ${sentences[sentences.length - 1]}`;
  }

  if (input) {
    input.setAttribute("maxlength", "1000");

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const userInput = input.value.trim();
        const userMsg = document.createElement("div");
        const botMsg = document.createElement("div");

    userMsg.classList.add("user-message");
    botMsg.classList.add("bot-message");

        // No input
        if (userInput === "" || !userInput.replace(/\s/g, '').length) {
          userMsg.textContent = "You: ";
          botMsg.textContent = "StudyBot: Please enter a message";
        }

        // Too long
        else if (userInput.length >= 1000) {
          userMsg.textContent = "You: " + userInput.slice(0, 100) + "...";
          botMsg.textContent = "StudyBot: Too many characters";
        }

        // Valid input
        else {
          userMsg.textContent = "You: " + userInput;
          const lowerInput = userInput.toLowerCase();

          // Summarise feature
          if (lowerInput.startsWith("summarise:")) {
            const textToSummarise = userInput.slice(10).trim();
            if (textToSummarise.length < 20) {
              botMsg.textContent = "StudyBot: Please provide a longer text to summarise.";
            } else {
              const summary = basicSummarise(textToSummarise);
              botMsg.textContent = "StudyBot (Summary): " + summary;
            }
          }

          // Redirect conditions
        else if (lowerInput.includes("flashcards")) {
            botMsg.textContent = "StudyBot: Redirecting to flashcards...";
            messages.appendChild(userMsg);
            messages.appendChild(botMsg);
            input.value = "";
            messages.scrollTop = messages.scrollHeight;
            setTimeout(() => {
              window.location.href = "flashcards.html";
            }, 1500);
            return;
         } else if (lowerInput.includes("quiz")) {
            botMsg.textContent = "StudyBot: Redirecting to quiz...";
            messages.appendChild(userMsg);
            messages.appendChild(botMsg);
            input.value = "";
            messages.scrollTop = messages.scrollHeight;
            setTimeout(() => {
              window.location.href = "quizzes.html";
            }, 1500);
            return;
          }

          // Basic math handling
          else if (/^[0-9+\-*/().\s]+$/.test(userInput)) {
            try {
              const result = Function('"use strict"; return (' + userInput + ')')();
              botMsg.textContent = "StudyBot: " + result;
            } catch {
              botMsg.textContent = "StudyBot: Invalid math expression.";
            }
          }

          // Flashcard keyword
          else if (lowerInput.includes("make flashcards")) {
            botMsg.textContent = "StudyBot: Flashcards feature activated!";
          }

          // Spelling error demo
          else if (userInput.match(/[a-z]{3,}[^ ]{2,}/gi)) {
            botMsg.textContent = "StudyBot: Did you mean...? (spelling correction demo)";
          }

          // General input
          else if (/^[a-zA-Z0-9 ?!@#$%^&*()_\-=+{}[\]:";'<>.,/\\|`~]*$/.test(userInput)) {
            botMsg.textContent = "StudyBot: I am a demo chatbot!";
          }

          // Unrecognized input
          else {
            botMsg.textContent = "StudyBot: Sorry, I don’t understand.";
          }
        }

        messages.appendChild(userMsg);
        messages.appendChild(botMsg);
        input.value = "";
        messages.scrollTop = messages.scrollHeight;
      }
    });
  }
});

