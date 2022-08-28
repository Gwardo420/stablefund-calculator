import React, { useEffect, useState } from 'react';
import axios from 'axios';
import numeral from 'numeral';
import logo from './logo.svg';
import './App.css';

function App() { 

  //// COMPOUND LENGTH
  const [days, setDays] = useState(182.5);
  //// DEPOSIT
  const [amount, setAmount] = useState(0);
  //// COMPOUND TIMES
  const [compoundTimes, setComoundTimes] = useState(2);
  //// RESULTS
  const [results, setResults] = useState(0);
  //// RESULTS PER DAY
  const [perDay, setPerDay] = useState(0);
  //// COMPOUND INTERVAL
  const [interval, setInterval] = useState(0);
  //// SELECT A CRYPTO
  const [cryptoSelectedShow, cryptoSelected] = useState(false);
  //// CURRENT CRYPTO PRICES
  const [price, setPrice] = useState(0);
  //// CRYPTO SELECTION
  const [selection, cryptoSelection] = useState("");
  //// RESULTS AMOUNT
  const [resultsAmount, resultsAmountSet] = useState(0);

  useEffect(() => {
    async function calculateReturns() {
      //At = $1,000 × (1 + 6%)2 = $1,123.60
      const results = Number(amount) * (1 + 0.015*Number(compoundTimes))**Number(days);
      const per_day = 0.015 * results;
      setResults(Number(results).toFixed(6));
      setPerDay(Number(per_day).toFixed(6));
      setInterval(24/compoundTimes);
    }
    calculateReturns();
  }, [days, compoundTimes, amount])

  async function select_bnb() {
    cryptoSelected(true)
    await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd').then((coin_gecko_results) => {
      console.log(coin_gecko_results.data.binancecoin.usd)
      const futureOutcome = results * coin_gecko_results.data.binancecoin.usd;
      const bnbPrice = coin_gecko_results.data.binancecoin.usd;
      cryptoSelection("BNB")
      setPrice(bnbPrice)
      resultsAmountSet(futureOutcome.toFixed(2))
    })
  }

  async function select_matic() {
    cryptoSelected(true)
    await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=usd').then((coin_gecko_results) => {
      const futureOutcome = results * coin_gecko_results.data['matic-network'].usd;
      const maticPrice = coin_gecko_results.data['matic-network'].usd;
      cryptoSelection("MATIC")
      setPrice(maticPrice)
      resultsAmountSet(futureOutcome.toFixed(2))
    })
  }

  async function select_busd() {
    cryptoSelected(true)
    await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=binance-usd&vs_currencies=usd').then((coin_gecko_results) => {
      const futureOutcome = results * coin_gecko_results.data["binance-usd"].usd;
      const busdPrice = coin_gecko_results.data["binance-usd"].usd;
      cryptoSelection("BUSD")
      setPrice(busdPrice)
      resultsAmountSet(futureOutcome.toFixed(2))
    })
  }

  return (
    <div className="App">
      <header className="App-header">
        StableFund Compound Calculator
      </header>

      <div className="amount__div">
        <header className="stable__text__header">
          Total Deposited
        </header>

        <input onChange={(e) => setAmount(e.target.value)} className="amount__input"></input>
      </div>

      <div className="stable__div">
        <header className="stable__text">
          Compound Days <span className="days__compound">{days}</span>
        </header>

        <input min="0" max="365" onChange={(e) => setDays(e.target.value)} className="stable__compound" type={'range'}></input>
      </div>

      <div className="stable__div">
        <header className="stable__text">
          Coumpounds / Day <span className="days__compound">{compoundTimes}</span>
        </header>

        <input min="1" max="3" onChange={(e) => setComoundTimes(e.target.value)} className="stable__compound" type={'range'}></input>
      </div>

      <div className="stable__buttons">
        <button onClick={() => select_bnb()} className="stable__button">BNB</button>
        <button onClick={() => select_busd()} className="stable__button">BUSD</button>
        <button onClick={() => select_matic()} className="stable__button">MATIC</button>
      </div>

      <div className="display__amount stable__div">
        <div className="days__compound display__div">
          {cryptoSelectedShow === false && (
            <div>
              Please select either BNB/MATIC or BUSD!
            </div>
          )}

          {cryptoSelectedShow === true && (
            <div>
              {selection} Price: {price}
            </div>
          )}

          {cryptoSelectedShow === true && (
            <div>
              Potential Earnings: ${resultsAmount - amount}
            </div>
          )}
        </div>

        <div className="display__div__total">
          Initial Deposit: <span className="days__compound">{amount}</span> {selection && (selection)}
        </div>

        <div className="display__div__total">
          Results: <span className="days__compound">{numeral(results).format('0,0.00')}</span> {selection && (selection)}
        </div>

        <div className="display__div">
          {selection && (selection)} Per Day: <span className="days__compound">{perDay}</span>
        </div>

        {cryptoSelectedShow && (
          <div className="display__div">
            USD Per Day: <span className="days__compound">${numeral(perDay * price).format('0,0.00')}</span> @ ${price}/{selection}
          </div>
        )}

        <div className="display__div">
          Days Compounding: <span className="days__compound">{days} Days</span>
        </div>

        <div className="display__div">
          Compound Interval: <span className="days__compound">{interval} hours</span>
        </div>
      </div>

      <div className="stable__div">
        <div className="days__compound">
          Gas Prices Coming Soon!
        </div>
      </div>
    </div>
  );
}

export default App;
