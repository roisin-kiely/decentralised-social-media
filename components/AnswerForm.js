import { useState } from 'react';

export default function AnswerForm({ accounts, setAnswers, isLoggedIn, isReadOnly }) {
  const [reply, setReply] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isReadOnly) {
      // Make sure the reply is submitted only when not in read-only mode
      fetch("/api/answers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          signedMessage: "some-signed-message", // Replace with actual signed message logic
          confirmationMessage: "some-confirmation-message", // Replace with actual confirmation message
          account: accounts[0], // Use the first account in the list (if logged in)
          reply,
          questionId: 1
        })
      })
        .then((res) => res.json())
        .then((data) => {
          setAnswers((prevAnswers) => [
            ...prevAnswers,
            {
              answerId: data.answerId,
              reply: data.reply,
              account: data.account
            }
          ]);
        });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={reply}
        onChange={(e) => setReply(e.target.value)}
        placeholder="Write your reply..."
        disabled={isReadOnly}  // Disable textarea if in read-only mode
      />
      <button type="submit" disabled={isReadOnly}>Post Reply</button>
    </form>
  );
}
