import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import numeral from 'numeral';
import Moralis from 'moralis-v1';
import Marquee from "react-fast-marquee";
import './App.css';

const serverUrl = "https://tisn7y00c9um.moralisweb3.com:2053/server";
const appId = "3kTUY5dxjjHAN3TxLXcWmnDHzExfTpmJDSZcvCKj";

function App() { 
  const wallet_address_input = useRef()

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

  //// COIN PRICES
  const [bnbPrice, setBNBPrice] = useState(0);
  const [maticPrice, setMaticPrice] = useState(0);
  const [busdPrice, setBUSDPrice] = useState(0);
  const [stableOne, setStableOnePrice] = useState(0);

  const selection_update = async (selection) => {
    if(selection.toUpperCase() === "BNB") {
      await select_bnb()
    } else if(selection.toUpperCase()  === "MATIC") {
      await select_matic()
    } else if(selection.toUpperCase()  === "BUSD") {
      await select_busd()
    } else return;
  }

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

  const change_compound_time = async (amount) => {
    setDays(amount)
    setTimeout(1000)
  }

  async function select_bnb() {
    cryptoSelected(true)
    cryptoSelection("BNB");
    setPrice(bnbPrice);
    setChainSelected(true);
    setChainId("bsc");
  }

  async function select_matic() {
    cryptoSelected(true)
    cryptoSelection("MATIC");
    setPrice(maticPrice);
    setChainSelected(true);
    setChainId("0x89");
  }

  async function select_busd() {
    cryptoSelected(true)
    cryptoSelection("BUSD");
    setPrice(busdPrice);
    setChainSelected(true);
    setChainId("bsc");
  }

  async function check_contract(wallet_address) {
    if(!wallet_address)return;
    if(wallet_address.length !== 42)return;
    setUsersWallet(wallet_address)
    if(chainId === "bsc" && selection === "BUSD") { 
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
          params: { "": wallet_address.toString() },
        };
        const allowance = await Moralis.Web3API.native.runContractFunction(options);
        const investorAmount = await allowance['totalLocked'];
        setAmount(investorAmount / Math.pow(10, 18));
      } catch(err) {
        console.log(err);
      }
    } else if(chainId === "bsc" && selection === "BNB") {  
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
          params: { "": wallet_address.toString() },
        };
        const allowance = await Moralis.Web3API.native.runContractFunction(options);
        const investorAmount = await allowance['totalLocked'];
        setAmount(investorAmount / Math.pow(10, 18))
      } catch(err) {
        console.log(err)
      }
    }
  }

  useEffect(() => {
    Moralis.start({ serverUrl, appId });
    get_prices();
  }, []);

  useEffect(() => {
    async function calculateReturns() {
      // Compounding formula example
      //At = $1,000 × (1 + 6%)2 = $1,123.60
      const results = Number(amount) * (1 + 0.01455 * Number(compoundTimes)) ** Number(days);
      const per_day = 0.015 * Number(results);
      const difference = Number(results) - Number(amount);

      setResults(Number(results).toFixed(6));
      setDifference(difference.toFixed(6));
      setPerDay(numeral(per_day).format('0,0.0000'));
      setInterval(24 / compoundTimes);
      selection_update(selection.toString());
    }
    calculateReturns();
  }, [days, compoundTimes, amount, selection])

  return (
    <div className="App">
      <header className="App-header" style={{ paddingTop: '30px '}}>
        StableFund Compound Calculator

        <div className="stable__text__small" style={{ marginTop: '20px' }}>
          Currently in <span>BETA</span>
          <div>
            Created by <a href="https://www.twitter.com/devgwardo">Gwardo420</a>
          </div>
        </div>
      </header>

      <Marquee pauseOnHover={true} gradient={false} speed={50}>
        <div className="display__div__prices">
          <span className="days__compound" style={{ color: 'lightblue', width: 250 }}><img src="https://seeklogo.com/images/B/binance-coin-bnb-logo-97F9D55608-seeklogo.com.png" height={20} width={20} style={{ marginTop: 'auto', marginBottom: 'auto', marginRight: '5px' }}></img> BNB ${bnbPrice}</span> 
          <span className="days__compound" style={{ color: 'lightblue', width: 250 }}><img src="https://seeklogo.com/images/P/polygon-matic-logo-1DFDA3A3A8-seeklogo.com.png" height={20} width={20} style={{ marginTop: 'auto', marginBottom: 'auto', marginRight: '5px' }}></img> MATIC ${maticPrice}</span>
          <span className="days__compound" style={{ color: 'lightblue', width: 250 }}><img src="https://seeklogo.com/images/B/binance-coin-bnb-logo-CD94CC6D31-seeklogo.com.png" height={20} width={20} style={{ marginTop: 'auto', marginBottom: 'auto', marginRight: '5px' }}></img> BUSD ${busdPrice}</span>
          <span className="days__compound" style={{ color: 'lightblue', width: 250 }}><img src="https://srockettoken.io/wp-content/uploads/2022/02/Group-97-150x150.png" height={20} width={20} style={{ marginTop: 'auto', marginBottom: 'auto', marginRight: '5px' }}></img> SROCKET ${stableOne}</span>
        </div>
      </Marquee>

      <div className="stable__buttons stable__div">
        <header className="stable__text__buttons">
          Select a chain
        </header>

        <div style={{ display: 'flex' }}>
          <button onClick={() => select_bnb()} className="stable__button"><img src="https://seeklogo.com/images/B/binance-coin-bnb-logo-97F9D55608-seeklogo.com.png" height={20} width={20} style={{ marginTop: 'auto', marginBottom: 'auto', marginRight: '5px' }}></img> BNB</button>
          <button onClick={() => select_busd()} className="stable__button"><img src="https://seeklogo.com/images/B/binance-coin-bnb-logo-CD94CC6D31-seeklogo.com.png" height={20} width={20} style={{ marginTop: 'auto', marginBottom: 'auto', marginRight: '5px' }}></img> BUSD</button>
          <button disabled={true} onClick={() => select_matic()} className="stable__button"><img src="https://seeklogo.com/images/P/polygon-matic-logo-1DFDA3A3A8-seeklogo.com.png" height={20} width={20} style={{ marginTop: 'auto', marginBottom: 'auto', marginRight: '5px' }}></img> MATIC</button>
        </div>

        <div className="stable__text__small" style={{ color: 'red' }}>Matic is currently disabled!</div>
      </div>

      <div className="amount__div">
        <header className="stable__text__header">
          Wallet Address
        </header>

        <input disabled={!chainSelected} ref={wallet_address_input} placeholder="0x24bc3..." onChange={(e) => check_contract(e.target.value)} className="amount__input"></input>
      
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
      </div>

      <div className="stable__div">
        <header className="stable__text">
          Compounds per day <span className="days__compound">{compoundTimes}</span>
        </header>

        <input min="1" max="3" onChange={(e) => setComoundTimes(e.target.value)} className="stable__compound" type={'range'}></input>
      
        <div className="stable__text__small">
          The amount of times you plan to compound in a day.
        </div>
      </div>

      <div className="display__amount stable__div">
        {cryptoSelectedShow === true && (
          <div className="display__div">
            Earnings: <span className="days__compound">{numeral(difference).format('0,0.000000')} {selection}</span>
          </div>
        )}

        {cryptoSelectedShow === true && (
          <div className="display__div">
            {selection} Price: <span className="days__compound">${price}</span>
          </div>
        )}

        {cryptoSelectedShow === true && (
          <>
            <div className="display__div"> 
              Staked: <span className="days__compound">{numeral(Number(amount)).format('0,0.0000')} {selection && (selection)}</span>
            </div>

            <div className="display__div">
              Staked Value: <span className="days__compound">${Number(amount * Number(price)).toFixed(2)} USD</span>
            </div>

            <div className="display__div">
              Compound Total: <span className="days__compound">{numeral(results).format('0,0.0000')} {selection}</span>
            </div>

            <div className="display__div">
              Compound Value: <span className="days__compound">${numeral(Number(results * price).toFixed(2)).format('0,0.00')} USD</span>
            </div>
          </>
        )}

        {cryptoSelectedShow === false && (
          <div className="display__div__text__big display__div">
            Please select either BNB/MATIC or BUSD!
          </div>
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

      <div className="stable__div">
        <div className="stable__text__small" style={{ color: 'red' }}>
          Gas Prices Coming Soon!
        </div>
      </div>

      <div className="stable__div">
        <header className="App-header">
          Creator
        </header>

        <div className="stable_div" style={{ paddingBottom: '20px' }}>
          <img className="creator_image" style={{ borderRadius: 10, }} src="https://avatars.githubusercontent.com/u/25094504?v=4"></img>
        </div>

        <div className="display__div__text__big">
          My name is Gwardo420! I am a Front End Developer for a few projects. I created this tool to help the StableFund community calculate how much they would earn if the compound their investment. 
        </div>

        <div onClick={() => window.open("https://www.twitter.com/devgwardo")} style={{ display: 'flex', justifyContent: 'space-evenly', paddingTop: 20 }}>
          <div className="social_tag" style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <img style={{ marginRight: 5 }} height={20} src="https://iconmonstr.com/wp-content/g/gd/makefg.php?i=../releases/preview/2012/png/iconmonstr-twitter-1.png&r=0&g=0&b=0"></img>

            Twitter
          </div>

          <div onClick={() => window.open("https://github.com/Gwardo420/stablefund-calculator")} className="social_tag" style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <img style={{ marginRight: 5 }} height={20} src="https://iconmonstr.com/wp-content/g/gd/makefg.php?i=../releases/preview/2012/png/iconmonstr-github-1.png&r=0&g=0&b=0"></img>

            GitHub
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
