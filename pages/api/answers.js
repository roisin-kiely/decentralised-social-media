import { web3 } from '../../lib/web3'
import MarkdownIt from 'markdown-it';

// make a new markdown renderer
const markdown = new MarkdownIt()

// a list of 3 answers by default
// usually this would come from a database
// but to keep things simple, we're setting it here
const answers = [
  `That's amazing progress for someone just starting out! Love this look and vibe!!! Keep it up!`,
  `OOTD, LOVE! 
  
  Great work so far, love to connect.`,
  `Love the entire vibe of this shoot — the mood, the outfit. You got this!! `
].map(a => markdown.render(a))


// what happens when we ask for /api/answers
export default function handler(req, res) {
  // Check if the site is in read-only mode
  const isReadOnly = true; // Set this flag to `true` to make the site read-only

  // if sent via a form, e.g. the reply form
  if (req.method === "POST" && isReadOnly) {
    // Respond with an error indicating that the site is read-only
    return res.status(403).json({ error: "The site is in read-only mode. You cannot post replies." });
  } else if (req.method === "POST") {
    const { signedMessage, confirmationMessage, account, reply = "", questionId = 1 } = req.body

    if (signedMessage !== null && confirmationMessage !== null && account !== null) {
      // get account from the confirmation message
      // and signed message
      const recoveredAccount = web3.eth.accounts.recover(confirmationMessage, signedMessage)

      // check if account is same
      if (account.toLowerCase() === recoveredAccount.toLowerCase()) {  
        // yep, so render reply
        // you would usually save to a database here
        let newReply = markdown.render(reply)
        
        // return all good
        res
          .status(200)
          .json({ account, reply: newReply, questionId, answerId: 3 })
      } else {  
        // incorrect account
        res
          .status(401)
          .json({ error: "incorrect account" })
      }
    } else {
      // need to sign that message!
      res
        .status(401)
        .json({ error: "need to sign message" })
    }
  } else {
    // if fetched normally using fetch()
    const data = [
      { questionId: 1, answerId: 1, reply: answers[0], account: "nezuko.eth" },
      { questionId: 1, answerId: 2, reply: answers[1], account: "josie.eth" },
      { questionId: 1, answerId: 3, reply: answers[2], account: "sam.eth" }
    ]
  
    res
      .setHeader('Content-Type', 'application/json')
      .status(200)
      .json({ answers: data })
  }
}
