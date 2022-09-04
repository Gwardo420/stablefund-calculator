import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import moment from 'moment';
import axios from 'axios';
import './App.css';

function ChartRender() {

  const [prices, setPrices] = useState([]);
  const [chartDays, setChartDays] = useState(72);
  const [crypto_selection, set_crypto_selection] = useState("");

  async function fetch_stable_one_price() {
    setPrices([])
    let pricesL = []
    let prices = await axios.get(`https://api.coingecko.com/api/v3/coins/stable-one-rocket/market_chart?vs_currency=usd&days=${chartDays.toString()}`)
    set_crypto_selection("SROCKET");
    for(let pricesList of prices.data.prices) {
      pricesL.push([pricesList[0], (pricesList[1]).toFixed(18)])
    }
    let data = await Promise.all(pricesL);
    setPrices(data)
  };

  async function fetch_bnb_price() {
    setPrices([])
    let pricesL = []
    let prices = await axios.get(`https://api.coingecko.com/api/v3/coins/binancecoin/market_chart?vs_currency=usd&days=${chartDays.toString()}`)
    set_crypto_selection("BNB");
    for(let pricesList of prices.data.prices) {
      pricesL.push([pricesList[0], (pricesList[1]).toFixed(18)])
    }
    let data = await Promise.all(pricesL);
    setPrices(data)
  };

  async function fetch_matic_price() {
    setPrices([])
    let pricesL = []
    let prices = await axios.get(`https://api.coingecko.com/api/v3/coins/matic-network/market_chart?vs_currency=usd&days=${chartDays.toString()}`)
    set_crypto_selection("MATIC");
    for(let pricesList of prices.data.prices) {
      pricesL.push([pricesList[0], (pricesList[1]).toFixed(18)])
    }
    let data = await Promise.all(pricesL);
    setPrices(data)
  };

  useEffect(() => {
    fetch_stable_one_price()
  }, [])

  return (
    <> 
      <div className="display__div__chart">
        <div style={{ marginRight: 'auto', marginLeft: 'auto', color: 'white', fontSize: '2em', paddingTop: '10px', paddingBottom: '10px' }}>
          {crypto_selection}
        </div>
        
        <Chart options={{ 
          theme: { mode: 'dark', monochrome: { enabled: true, color: '#FFFFFF' } },
          noData: { text: 'Generating Chart...' },
          xaxis: { labels: {
            formatter: function(value) { return moment(value).format('ddd, hA')},
            show: false,
            hideOverlappingLabels: true
          }},
          yaxis: { labels: {
              formatter: function(value) {return Number(value).toFixed(4) }
            }, show: true },
          }}
          series={[{ name: 'Price', data: prices }]}
          type="line"
          height={320}
        />

      <div style={{ marginRight: 'auto', marginLeft: 'auto', color: 'white', marginTop: '10px', display: 'flex', justifyContent: 'center' }}>
        <button className="stable__button" onClick={() => fetch_bnb_price()}>BNB</button>
        <button className="stable__button" onClick={() => fetch_matic_price()}>MATIC</button>
        <button className="stable__button" onClick={() => fetch_stable_one_price()}>SROCKET</button>
      </div>
      </div>
    </>
  )
}

export default ChartRender