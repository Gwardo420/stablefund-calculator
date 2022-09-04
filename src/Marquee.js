import React, { useEffect, useState } from 'react';
import Marquee from 'react-fast-marquee';
import axios from 'axios';

function MarqueeRender() {

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

  useEffect(() => {
    get_prices()
  }, [])

  return (
    <>
      <Marquee pauseOnHover={true} gradient={false} speed={120}>
        <div className="display__div__prices">
          <span className="days__compound" style={{ color: 'lightblue', width: 250 }}><img src="https://seeklogo.com/images/B/binance-coin-bnb-logo-97F9D55608-seeklogo.com.png" height={20} width={20} style={{ marginTop: 'auto', marginBottom: 'auto', marginRight: '5px' }}></img> BNB ${bnbPrice}</span> 
          <span className="days__compound" style={{ color: 'lightblue', width: 250 }}><img src="https://seeklogo.com/images/P/polygon-matic-logo-1DFDA3A3A8-seeklogo.com.png" height={20} width={20} style={{ marginTop: 'auto', marginBottom: 'auto', marginRight: '5px' }}></img> MATIC ${maticPrice}</span>
          <span className="days__compound" style={{ color: 'lightblue', width: 250 }}><img src="https://seeklogo.com/images/B/binance-coin-bnb-logo-CD94CC6D31-seeklogo.com.png" height={20} width={20} style={{ marginTop: 'auto', marginBottom: 'auto', marginRight: '5px' }}></img> BUSD ${busdPrice}</span>
          <span className="days__compound" style={{ color: 'lightblue', width: 250 }}><img src="https://srockettoken.io/wp-content/uploads/2022/02/Group-97-150x150.png" height={20} width={20} style={{ marginTop: 'auto', marginBottom: 'auto', marginRight: '5px' }}></img> SROCKET ${stableOne}</span>
        </div>
      </Marquee>
    </>
  )
}

export default MarqueeRender