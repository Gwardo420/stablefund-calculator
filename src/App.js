import React, { useEffect, useState } from 'react';
import axios from 'axios';
import numeral from 'numeral';
import './App.css';

function App() { 

  //// COMPOUND LENGTH
  const [days, setDays] = useState(182.5);
  //// DEPOSIT
  const [amount, setAmount] = useState(0);
  //// COMPOUND TIMES
  const [compoundTimes, setComoundTimes] = useState(2.5);
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

  useEffect(() => {
    async function calculateReturns() {
      // Compounding formula example 
      //At = $1,000 × (1 + 6%)2 = $1,123.60

      const results = Number(amount) * (1 + 0.01455 * Number(compoundTimes)) ** Number(days);
      const per_day = 0.015 * Number(results);

      setResults(Number(results).toFixed(6));
      setPerDay(numeral(per_day).format('0,0.0000'));
      setInterval(24 / compoundTimes);

      selection_update(selection.toString());
    }
    calculateReturns();
  }, [days, compoundTimes, amount])

  const selection_update = async (selection) => {
    await 1000;
    if(selection.toUpperCase() === "BNB") {
      await select_bnb()
    } else if(selection.toUpperCase()  === "MATIC") {
      await select_matic()
    } else if(selection.toUpperCase()  === "BUSD") {
      await select_busd()
    } else return;
  }

  const change_investment = (amount) => {
    const after_taxes = Number(amount) * 0.03;
    const results = amount - after_taxes;
    setAmount(results);
  }

  const change_compound_time = async (amount) => {
    setDays(amount)
    setTimeout(1000)
  }

  async function select_bnb() {
    cryptoSelected(true)
    await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd').then((coin_gecko_results) => {
      console.log(coin_gecko_results.data.binancecoin.usd)
      const futureOutcome = results * coin_gecko_results.data.binancecoin.usd;
      const bnbPrice = coin_gecko_results.data.binancecoin.usd;

      cryptoSelection("BNB");
      setPrice(bnbPrice);
    })
  }

  async function select_matic() {
    cryptoSelected(true)
    await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=usd').then((coin_gecko_results) => {
      const futureOutcome = results * coin_gecko_results.data['matic-network'].usd;
      const maticPrice = coin_gecko_results.data['matic-network'].usd;

      cryptoSelection("MATIC");
      setPrice(maticPrice);
    })
  }

  async function select_busd() {
    cryptoSelected(true)
    await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=binance-usd&vs_currencies=usd').then((coin_gecko_results) => {
      const futureOutcome = results * coin_gecko_results.data["binance-usd"].usd;
      const busdPrice = coin_gecko_results.data["binance-usd"].usd;

      cryptoSelection("BUSD");
      setPrice(busdPrice);
    })
  }

  return (
    <div className="App">
      <header className="App-header">
        StableFund Compound Calculator

        <div className="stable__text__small">
          Currently in <span>BETA</span>
          <div>
            Created by Gwardo420
          </div>
        </div>
      </header>

      <div className="amount__div">
        <header className="stable__text__header">
          Total deposited
        </header>

        <input placeholder="1500" type="number" onChange={(e) => change_investment(Number(e.target.value))} className="amount__input"></input>
      
        <div className="stable__text__small">
          Values can be BUSD/BNB/MATIC
        </div>
      </div>

      <div className="stable__div">
        <header className="stable__text">
          Compound days <span className="days__compound">{days}</span>
        </header>

        <input min="0" max="365" onChange={(e) => change_compound_time(e.target.value)} className="stable__compound" type={'range'}></input>
      
        <div className="stable__text__small">
          The amount of days you would like to compound.
        </div>
      </div>

      <div className="stable__div">
        <header className="stable__text">
          Compounds per day <span className="days__compound">{compoundTimes}</span>
        </header>

        <input min="1" max="5" onChange={(e) => setComoundTimes(e.target.value)} className="stable__compound" type={'range'}></input>
      
        <div className="stable__text__small">
          The amount of times you plan to compound in a day.
        </div>
      </div>

      <div className="stable__buttons stable__div">
        <header className="stable__text__buttons">
          Select an investment
        </header>

        <div style={{ display: 'flex' }}>
          <button onClick={() => select_bnb()} className="stable__button">BNB</button>
          <button onClick={() => select_busd()} className="stable__button">BUSD</button>
          <button onClick={() => select_matic()} className="stable__button">MATIC</button>
        </div>
      </div>

      <div className="display__amount stable__div">
        <span className="days__compound display__div__text__big">{selection && (
          <div>Total: {numeral(results).format('0,0.000')} {selection} 
            <div className="stable__text__small">after {days} days of compounding {compoundTimes} time(s)/day.</div>
            <div>~ ${numeral(Number(results * price).toFixed(2)).format('0,0.00')} USD</div>
          </div>
        )}
        </span>

        <div className="display__div">
          {cryptoSelectedShow === false && (
            <div>
              Please select either BNB/MATIC or BUSD!
            </div>
          )}

          {cryptoSelectedShow === true && (
            <div>
              {selection} Price: <span className="days__compound">${price}</span>
            </div>
          )}
        </div>

        <div className="display__div__total">
          Future Value: <span className="days__compound">{numeral(results).format('0,0.00')}</span> {selection && (selection)}
          
          {cryptoSelectedShow && (
            <div className="">
              ~<span className="days__compound">${Number(results * price).toFixed(2)} USD</span> @ ${price}/{selection}
            </div>
          )}
        </div>

        <div className="display__div__total">
          Initial Deposit: <span className="days__compound">{numeral(Number(amount)).format('0,0.00')}</span> {selection && (selection)} after 3%.
            
          {cryptoSelectedShow && (
            <div>
              ~<span className="days__compound">{Number(amount * Number(price)).toFixed(2)} USD</span> @ ${price}/{selection}
            </div>
          )}
        </div>
          
        {selection && (
          <>
            <div className="display__div">
              {selection && (<div>{selection} Per Day: <span className="days__compound">{perDay}</span></div>)}
            </div>
          </>
        )}

        {cryptoSelectedShow && (
          <div className="display__div">
            USD Per Day: <span className="days__compound">${numeral(perDay * price).format('0,0.0000')}</span> @ ${price}/{selection}
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
