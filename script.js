// Your Reservoir API key
const apiKey = 'a5d354d5-d348-5802-be9a-147a5dd5caa8';  // Replace with your actual API key

// ENS contract address for .eth domains
const ensContractAddress = '0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85';

// NFT collection contract addresses
const nftContracts = [
  '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D',  // Example NFT collection 1
  '0x...OtherContractHere',  // Example NFT collection 2
  // Add more contract addresses here
];

// Function to fetch NFT prices for a collection
function fetchNftPrices(contractAddress, tableId) {
  fetch(`https://api.reservoir.tools/tokens/v5?collection=${contractAddress}`, {
    headers: {
      'x-api-key': apiKey  // Pass the API key in the headers
    }
  })
    .then(response => response.json())
    .then(data => {
      console.log('NFT Prices Data:', data);

      const tableBody = document.getElementById(tableId);
      
      data.tokens.forEach(token => {
        const price = token.market.floorAsk.price.amount.native || "Not for sale";
        const title = token.token.name || `Token ID: ${token.token.tokenId}`;
        const imageUrl = token.token.image;  // Get the token image

        const row = `
          <tr>
            <td><img src="${imageUrl}" alt="${title}" style="width: 50px; height: 50px;"></td>
            <td>${title}</td>
            <td>${price} ETH</td>
          </tr>
        `;
        tableBody.innerHTML += row;
      });
    })
    .catch(error => {
      console.error('Error fetching NFT prices:', error);
      document.getElementById(tableId).innerHTML = '<tr><td colspan="3">Failed to load prices.</td></tr>';
    });
}

// Fetch NFT prices for each contract and display in the corresponding table
nftContracts.forEach((contract, index) => {
  const tableId = `nft-sales-${index}`;  // Dynamic table ID for each NFT collection
  fetchNftPrices(contract, tableId);
});

// Fetch ENS sales data
function fetchEnsSales() {
  fetch(`https://api.reservoir.tools/sales/v3?contract=${ensContractAddress}`, {
    headers: {
      'x-api-key': apiKey
    }
  })
    .then(response => response.json())
    .then(data => {
      console.log('ENS Sales Data:', data);

      const salesTable = document.getElementById('ens-sales');
      data.sales.forEach(sale => {
        const domain = sale.token.tokenId;  // ENS domain (token ID)
        const price = sale.price.amount.native;  // Sale price in ETH
        const date = new Date(sale.timestamp * 1000).toLocaleDateString();  // Sale date

        const row = `
          <tr>
            <td>${domain}.eth</td>
            <td>${price} ETH</td>
            <td>${date}</td>
          </tr>
        `;
        salesTable.innerHTML += row;
      });
    })
    .catch(error => {
      console.error('Error fetching ENS sales:', error);
      document.getElementById('ens-sales').innerHTML = '<tr><td colspan="3">Failed to load ENS sales data.</td></tr>';
    });
}

// Fetch ENS sales on page load
fetchEnsSales();
