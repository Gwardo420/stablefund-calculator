import React, { useEffect, useState, useRef } from 'react';
import Moralis from 'moralis-v1';

import Inputs from './Inputs';
import ChartRender from "./ChartRender";
import MarqueeRender from './Marquee';
import './App.css';

const serverUrl = "https://tisn7y00c9um.moralisweb3.com:2053/server";
const appId = "3kTUY5dxjjHAN3TxLXcWmnDHzExfTpmJDSZcvCKj";

function App() { 

  useEffect(() => {
    Moralis.start({ 
      serverUrl, appId
    });
    // get_prices();
  }, []);

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
        <div className="stable__text__small" style={{ color: 'red' }}>
          Gas Prices Coming Soon!
        </div>
      </div>

      <ChartRender />

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
          <button className="social_tag" style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', background: 'transparent', border: 'transparent' }}>
            <img style={{ marginRight: 5 }} height={20} src="https://iconmonstr.com/wp-content/g/gd/makefg.php?i=../releases/preview/2012/png/iconmonstr-twitter-1.png&r=0&g=0&b=0"></img>

            Twitter
          </button>

          <button onClick={() => window.open("https://github.com/Gwardo420/stablefund-calculator")} className="social_tag" style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', background: 'transparent', border: 'transparent' }}>
            <img style={{ marginRight: 5 }} height={20} src="https://iconmonstr.com/wp-content/g/gd/makefg.php?i=../releases/preview/2012/png/iconmonstr-github-1.png&r=0&g=0&b=0"></img>

            GitHub
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
