const axios = require('axios');

async function getTopCoins() {
  try {
    const response = await axios.get('https://api.coinpaprika.com/v1/coins');
    const coins = response.data.slice(0, 10);
    const projects = coins.map(coin => ({
      name: coin.name,
      logo: `https://coinpaprika.com/coin/${coin.id}`,
      website: coin.links.website[0],
      contract: '0x' + Math.random().toString(16).substr(2, 40), // placeholder, replace with actual contract address
      category: 'Token', // placeholder, replace with actual category
      score: Math.floor(Math.random() * 100), // placeholder, replace with actual score
      risk: ['High', 'Medium', 'Low'][Math.floor(Math.random() * 3)], // placeholder, replace with actual risk
      chainLogo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png', // placeholder, replace with actual chain logo
    }));
    console.log(projects);
  } catch (error) {
    console.error(error);
  }
}

getTopCoins();
