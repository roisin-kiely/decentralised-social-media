// for next.js's <head> tag and rendering images
import Head from 'next/head'
import Image from 'next/image'

// import the web3 library with setup from lib/web3.js
import { web3 } from '../lib/web3';

// import react hooks
import { useState, useEffect } from 'react';

// all from our components folder
import Account from '../components/Account'
import EthName from '../components/EthName'
import Answer from '../components/Answer'
import AnswerForm from '../components/AnswerForm'

export default function Home() {
  // todo:
  // 1. make the connect button work!
  // 2. get the answers from the API (see /api/answers.js file)
  // 3. add tipping like project 1
  // 4. make the user name look good
  // 5. let the user post their own reply

  const [accounts, setAccounts] = useState([])
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [answers, setAnswers] = useState([])

  const connect = async function () {
    let a = await window.ethereum.request({ method: "eth_requestAccounts" })
    setAccounts(a)
  }

  useEffect(function () {
    if (accounts.length > 0) {
      setIsLoggedIn(true)
    } else {
      setIsLoggedIn(false)
    }
  }, [accounts])

  useEffect(async function () {
    let a = await window.ethereum.request({ method: "eth_accounts" })
    setAccounts(a)

    window.ethereum.on("accountsChanged", function (a) {
      setAccounts(a)
    })


    fetch("/api/answers")
      .then(response => response.json())
      .then(data => { 
        setAnswers(data.answers) 
        setIsLoading(false)
      })
  }, [])


  let answersArea = (
    <div className="loading">Loading the answers...</div>
  )

  if (!isLoading) {
    answersArea = answers.map(function (answer, index) {
      return <Answer number={index + 1} answer={answer} accounts={accounts} isLoggedIn={isLoggedIn} />
    })
  }



  return (
    <main>
      <header>
        <h1>STYLESTOP</h1>

        <form>
          <input type="text" placeholder="Search" />
        </form>

        <Account accounts={accounts} isLoggedIn={isLoggedIn} connect={connect} />
      </header>

      <section className="question">
        <div className="main">
          <h3>Feedback forum</h3>
          <h2>Looking for feedback as a beginner</h2>
          <p>Hey everyone, I&apos;m Stylist based in Paris, just 4 weeks into my journey, and I&apos;m looking to get some feedback on outfits I&apos;ve styled so far. I&apos;d love to connect with other Fashion Creatives!</p>

          <div className="slides">
            <Image src="/simeon-asenov-7w-RUcJoNoI-unsplash.jpg" width="600" height="800" />
            <Image src="/simeon-asenov-70pxFfrigyw-unsplash.jpg" width="600" height="800" />
            <Image src="/simeon-asenov-UzAQ8ogtxbg-unsplash.jpg" width="600" height="800" />
            <Image src="/simeon-asenov-RQXekJxZmk8-unsplash.jpg" width="600" height="800" />
          </div>
        </div>
        <div className="meta">
          
          {/* EthName */}
          <div className="eth-name">
            <img src="https://bronze-imperial-snail-7.mypinata.cloud/ipfs/bafkreiaxtbvy3dwwueypdxsaizcwy4puicktqbexczn5j2bjbcghdd5fxm" alt="Avatar of nomirose.eth" />
            <div className="name">
              <span className="primary">nomirose.eth</span>
              <span className="secondary">0x43B30a...6987</span>
            </div>
          </div>
          {/* end EthName */}

        </div>
      </section>

      <section className="answers">
        {answersArea}

        <AnswerForm accounts={accounts} setAnswers={setAnswers} isLoggedIn={isLoggedIn} />
      </section>

      <Head>
        <title>Looking for feedback as a beginner – Feedback forum – StyleStop </title>
        <meta property="og:title" content="StyleStop: Decentralised Social Media" />
        <meta property="og:description" content="This is a project on the SuperHi Crypto + Web3 for Creatives course" />
        <meta property="og:image" content="/Social.png" />
      </Head>
    </main>
  )
}

