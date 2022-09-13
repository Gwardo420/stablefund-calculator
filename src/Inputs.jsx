import '../src/grid.css';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Moralis from 'moralis-v1';
import numeral from 'numeral';
import AnimatedNumber from "animated-number-react";

const serverUrl = "https://tisn7y00c9um.moralisweb3.com:2053/server";
const appId = "3kTUY5dxjjHAN3TxLXcWmnDHzExfTpmJDSZcvCKj";

function Inputs() {
  
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
  //// CHAIN SELECTED
  const [chainSelected, setChainSelected] = useState(false);
  //// DIFFERENCE
  const [difference, setDifference] = useState(0);
  //// SETTING CHAIN ID FOR WALLET
  const [chainId, setChainId] = useState("");
  //// USERS WALLET ADDRESS
  const [usersWallet, setUsersWallet] = useState("");
  //// USD VALUE
  const [usdValue, setUSDValue] = useState(0);

  //// COIN PRICES
  const [bnbPrice, setBNBPrice] = useState(0);
  const [maticPrice, setMaticPrice] = useState(0);
  const [busdPrice, setBUSDPrice] = useState(0);
  const [stableOne, setStableOnePrice] = useState(0);

  async function get_prices() {
    await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd').then((coin_gecko_results) => {
      console.log(coin_gecko_results.data.binancecoin.usd)
      setBNBPrice(coin_gecko_results.data.binancecoin.usd)
    })

    await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=usd').then((coin_gecko_results) => {
      console.log(coin_gecko_results.data['matic-network'].usd)
      setMaticPrice(coin_gecko_results.data['matic-network'].usd)
    })

    await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=binance-usd&vs_currencies=usd').then((coin_gecko_results) => {
      console.log(coin_gecko_results.data['binance-usd'].usd)
      setBUSDPrice(coin_gecko_results.data['binance-usd'].usd)
    })

    await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=stable-one-rocket&vs_currencies=usd').then((coin_gecko_results) => {
      console.log(coin_gecko_results.data)
      setStableOnePrice(coin_gecko_results.data['stable-one-rocket'].usd)
    })
  }
  
  async function select_bnb() {
    setAmount(0)
    await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd').then(async (coin_gecko_results) => {
      await setPrice(coin_gecko_results.data.binancecoin.usd)
      await cryptoSelected(true);
      await cryptoSelection("BNB");
      await setChainSelected(true);
      await setChainId("bsc");

      if(usersWallet) {
        await check_bnb(usersWallet);
      }
    })
  }

  async function select_matic() {
    cryptoSelected(true);
    cryptoSelection("MATIC");
    setPrice(maticPrice);
    setChainSelected(true);
    setChainId("0x89");
  }

  async function select_busd() {
    setAmount(0)
    await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=binance-usd&vs_currencies=usd').then(async (coin_gecko_results) => {
      await setPrice(coin_gecko_results.data['binance-usd'].usd)
      await cryptoSelected(true);
      await cryptoSelection("BUSD");
      await setChainSelected(true);
      await setChainId("bsc");

      if(usersWallet) {
        await check_busd(usersWallet);
      }
    })
  }


  const selection_update = async (selection) => {
    if(selection.toUpperCase() === "BNB") {
      await select_bnb()
    } else if(selection.toUpperCase()  === "MATIC") {
      await select_matic()
    } else if(selection.toUpperCase()  === "BUSD") {
      await select_busd()
    } else return;
  };

  const change_compound_time = async (amount) => {
    console.log(amount)
    setDays(amount)
  };

  async function check_busd(wallet) {
    if(!wallet)return console.log("There was no wallet address!");
    if(wallet.length !== 42)return console.log("The wallet address was not big enough!");
    await setUsersWallet(wallet)
    try {
      const ABI =  [{
        "inputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "name": "investors",
        "outputs": [
          {
            "internalType": "address",
            "name": "investor",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "totalLocked",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "startTime",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "lastCalculationDate",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "claimableAmount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "claimedAmount",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      }];
  
      const options = {
        chain: chainId.toString(),
        address: "0xfBbc24CA5518898fAe0d8455Cb265FaAA66157C9",
        function_name: "investors",
        abi: ABI,
        params: { "": wallet.toString() },
      };
      const allowance = await Moralis.Web3API.native.runContractFunction(options);
      const investorAmount = await allowance['totalLocked'];
      await setAmount(investorAmount / Math.pow(10, 18));
    } catch(err) {
      console.log(err);
    }
  }

  async function check_bnb(wallet) {
    if(!wallet)return console.log("There was no wallet address!");
    if(wallet.length !== 42)return console.log("The wallet address was not big enough!");
    await setUsersWallet(wallet)
    try {
      const ABI =  [  {
        "inputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "name": "investors",
        "outputs": [
          {
            "internalType": "address",
            "name": "investor",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "totalLocked",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "startTime",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "lastCalculationDate",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "claimableAmount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "claimedAmount",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      }];
  
      const options = {
        chain: chainId.toString(),
        address: "0x4F2bC1d99C953e0053F5bb9A6855CF7A5CBe66Fa",
        function_name: "investors",
        abi: ABI,
        params: { "": wallet.toString() },
      };
      const allowance = await Moralis.Web3API.native.runContractFunction(options);
      const investorAmount = await allowance['totalLocked'];
      await setAmount(investorAmount / Math.pow(10, 18))
    } catch(err) {
      console.log(err)
    }
  }

  async function check_contract(wallet_address) {
    if(await chainId.toLowerCase() === "bsc" && await selection.toUpperCase() === "BUSD") { 
      check_busd(wallet_address)
    } else if(await chainId.toLowerCase() === "bsc" && await selection.toUpperCase() === "BNB") {  
      check_bnb(wallet_address)
    }
  }

  useEffect(() => {
    async function calculateReturns() {
      // Compounding formula example
      //At = $1,000 × (1 + 6%)2 = $1,123.60
      const results = Number(amount) * (1 + 0.01455 * Number(compoundTimes)) ** Number(days);
      const per_day = 0.015 * Number(results);
      const difference = Number(results) - Number(amount);
      const usdValues = Number(results) * Number(price);

      console.log("USD Values")
      console.log(usdValues)

      setResults(results);
      setDifference(difference.toFixed(6));
      setUSDValue(usdValues.toFixed(4));
      setPerDay(numeral(per_day).format('0,0.0000'));
      setInterval(24 / compoundTimes);
      // selection_update(selection.toString());
    }
    calculateReturns();
  }, [days, compoundTimes, amount, selection]);

  useEffect(() => {
    get_prices();
    Moralis.start({
      serverUrl, appId
    });
  }, []);

  return (
    <>
          
      <div style={{ color: 'white', fontSize: '20px', padding: '10px' }}>
        {Number(amount).toFixed(4) + ' initial deposit ' + ' x ' + (1 + ' + ' + 0.01455 + ' x ' + Number(compoundTimes)) + ' compounds ' + ' ^ ' + Number(days) + ' days'}
      </div>

      {cryptoSelectedShow === true && (
        <>
          <div style={{ textAlign: 'left', color: 'white', maxWidth: 300, marginLeft: 'auto', marginRight: 'auto' }}>Compound total</div>
          <div style={{ display: 'flex', justifyContent: 'center', color: 'rgb(0, 255, 213)', fontSize: '25px', fontWeight: 'bold', borderTop: '1px solid white', maxWidth: 300, marginLeft: 'auto', marginRight: 'auto' }}>
            <div>
              ~<AnimatedNumber value={results} formatValue={(value) => `${numeral(Number(value.toFixed(2))).format('0,0.00')}`}></AnimatedNumber> <span style={{ marginLeft: '5px' }}>{selection}</span>
            </div>
          </div>

          <div style={{ textAlign: 'left', color: 'white', maxWidth: 300, marginLeft: 'auto', marginRight: 'auto' }}>Compound earnings</div>
          <div style={{ display: 'flex', justifyContent: 'center', color: 'rgb(0, 255, 213)', fontSize: '25px', fontWeight: 'bold', borderTop: '1px solid white', maxWidth: 300, marginLeft: 'auto', marginRight: 'auto' }}>
            <div>
            +<AnimatedNumber value={difference} formatValue={(value) => `${numeral(Number(value.toFixed(2))).format('0,0.00')}`}></AnimatedNumber> <span style={{ marginLeft: '5px' }}>{selection}</span>
            </div>
          </div>

          <div style={{ textAlign: 'left', color: 'white', maxWidth: 300, marginLeft: 'auto', marginRight: 'auto' }}>Market/USD value</div>
          <div style={{ display: 'flex', justifyContent: 'center', color: 'rgb(0, 255, 213)', fontSize: '25px', fontWeight: 'bold', borderTop: '1px solid white', maxWidth: 300, marginLeft: 'auto', marginRight: 'auto' }}>
            <div>
              $<AnimatedNumber value={usdValue} formatValue={(value) => `${numeral(Number(value.toFixed(2))).format('0,0.00')}`}></AnimatedNumber> <span style={{ marginLeft: '5px' }}>USD</span>
            </div>
          </div>
        </>
      )}

      <section className="grid-basic">
        <div className="amount__div">
          <header className="stable__text__buttons">
            Select a chain
          </header>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button onClick={() => select_bnb()} className="stable__button"><img src="https://seeklogo.com/images/B/binance-coin-bnb-logo-97F9D55608-seeklogo.com.png" height={20} width={20} style={{ marginTop: 'auto', marginBottom: 'auto', marginRight: '5px' }}></img> BNB</button>
            <button onClick={() => select_busd()} className="stable__button"><img src="https://seeklogo.com/images/B/binance-coin-bnb-logo-CD94CC6D31-seeklogo.com.png" height={20} width={20} style={{ marginTop: 'auto', marginBottom: 'auto', marginRight: '5px' }}></img> BUSD</button>
            {/* <button disabled={true} onClick={() => select_matic()} className="stable__button"><img src="https://seeklogo.com/images/P/polygon-matic-logo-1DFDA3A3A8-seeklogo.com.png" height={20} width={20} style={{ marginTop: 'auto', marginBottom: 'auto', marginRight: '5px' }}></img> MATIC</button> */}
          </div>

          {!chainId && (
            <>
              <div style={{ display: 'grid', color: 'yellow', marginBottom: '25px', fontSize: '20px', fontWeight: 700 }}>
                Please select a chain above before entering your address.
              </div>
            </>
          )}

          <header className="stable__text__header">
            Wallet Address
          </header>

          <input disabled={!chainSelected} placeholder="0x24bc3..." onChange={(e) => check_contract(e.target.value)} className="amount__input"></input>
        
          <div className="stable__text__small">
            Enter your StableFund wallet address
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

          <header className="stable__text">
            Compounds per day <span className="days__compound">{compoundTimes}</span>
          </header>

          <input min="1" max="3" onChange={(e) => setComoundTimes(e.target.value)} className="stable__compound" type={'range'}></input>
        
          <div className="stable__text__small">
            The amount of times you plan to compound in a day.
          </div>
        </div>
        
        </section>

        <div className="display__amount">
          {cryptoSelectedShow === true && (
            <div className="display__div">
              Earnings: <span className="days__compound">{numeral(difference).format('0,0.000000')} {selection}</span>
            </div>
          )}

          {cryptoSelectedShow === true && (
            <>
              <div className="display__div"> 
                Staked: <span className="days__compound">{numeral(Number(amount)).format('0,0.0000')} {selection && (selection)}</span>
              </div>

              <div className="display__div">
                Staked Value: <span className="days__compound">${Number(amount * Number(price)).toFixed(4)} USD</span>
              </div>

              <div className="display__div">
                Compound Total: <span className="days__compound">{numeral(results).format('0,0.0000')} {selection}</span>
              </div>

              <div className="display__div">
                Compound Value: <span className="days__compound">${numeral(Number(results * price).toFixed(2)).format('0,0.00')} USD</span>
              </div>
            </>
          )}

          {selection && (
            <>
              <div className="display__div">
              <span>{selection} Per Day:</span> <span className="days__compound">{perDay}</span>
              </div>
            </>
          )}

          {cryptoSelectedShow && (
            <div className="display__div">
              USD Per Day: <span className="days__compound">${numeral(perDay * price).format('0,0.0000')}</span>
            </div>
          )}

          <div className="display__div">
            Days Compounding: <span className="days__compound">{days} Days</span>
          </div>

          <div className="display__div">
            Compound Interval: <div className="days__compound">{interval} hours</div>
          </div>
        </div>
    </>
  )
}

export default Inputs