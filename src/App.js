import React, { useEffect, useState, useRef } from 'react';
// import Moralis from 'moralis-v1';

import Inputs from './Inputs';
import ChartRender from "./ChartRender";
import MarqueeRender from './Marquee';
import './App.css';

function App() { 

  return (
    <div className="App">

      <MarqueeRender />

      <header className="App-header" style={{ paddingTop: '30px '}}>
        StableFund Compound Calculator

        <div className="stable__text__small" style={{ marginTop: '20px' }}>
          Currently in <span>BETA</span>
          <div>
            Created by <a href="https://www.twitter.com/devgwardo">Gwardo420</a>
          </div>
        </div>
      </header>

      <Inputs />

      <div className="stable__div">
        <div className="stable__text__small" style={{ color: 'yellow', fontSize: '20px', fontWeight: 700 }}>
          Gas Prices Coming Soon!
        </div>
      </div>

      <ChartRender />

      <div className="stable__div">
        <header className="App-header">
          Creator
        </header>

        <div className="stable_div" style={{ paddingBottom: '20px' }}>
          <img alt="creator_image" className="creator_image" style={{ borderRadius: 10, }} src="https://avatars.githubusercontent.com/u/25094504?v=4"></img>
        </div>

        <div className="display__div__text__big" style={{ fontSize: '20px' }}>
          My name is Gwardo420! I am a Front end Developer for CluCoin. I created this tool to help the StableFund community calculate how much they would earn if the compound their investment. 
        </div>

        <hr style={{ width: '100%' }}></hr>

        <div style={{ display: 'grid', color: 'white', fontSize: '20px' }}>
          <div>
            Public Donation
          </div>

          <div>
            0x8e06e923ba5b7F6c3A167306B4a788B5B12219b8
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
