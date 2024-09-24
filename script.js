// Grab the pricesDiv and ensSalesDiv elements where we will display the NFT prices and ENS sales
const pricesDiv = document.getElementById("prices");
const ensSalesDiv = document.getElementById("ensSales");

// Your API keys from Reservoir and ENS
const apiKeyReservoir = 'a5d354d5-d348-5802-be9a-147a5dd5caa8'; // Replace with your Reservoir API key
const apiKeyENS = 'a5d354d5-d348-5802-be9a-147a5dd5caa8'; // Replace with ENS API key

// Define the collection contract addresses you want to fetch data from
const collectionContracts = [
    '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D',  // BAYC
    '0x79FCDEF22feeD20eDDacbB2587640e45491b757f',   // Another collection contract
    '0x282BDD42f4eb70e7A9D9F40c8fEA0825B7f68C5D',
    '0xB852c6b5892256C264Cc2C888eA462189154D8d7',
    
];

// Fetch NFT prices for each collection from Reservoir API
function fetchNFTPrices() {
    collectionContracts.forEach(contract => {
        fetch(`https://api.reservoir.tools/tokens/v5?collection=${contract}`, {
            headers: {
                'x-api-key': apiKeyReservoir  // Pass the API key in the headers
            }
        })
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json(); // Parse JSON if response is OK
        })
        .then(data => {
            if (data.tokens) {
                const table = document.createElement('table');
                table.innerHTML = `
                    <thead>
                        <tr>
                            <th>Token</th>
                            <th>Price (ETH)</th>
                            <th>Marketplace</th>
                        </tr>
                    </thead>
                    <tbody>
                    </tbody>
                `;
                data.tokens.forEach(token => {
                    const price = token.market.floorAsk?.price?.amount?.native || "Not for sale";
                    const title = token.token.name || `Token ID: ${token.token.tokenId}`;
                    const marketplaceLink = `https://opensea.io/assets/${contract}/${token.token.tokenId}`;
                    
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${title}</td>
                        <td>${price}</td>
                        <td><a href="${marketplaceLink}" target="_blank">
                            <img src="https://opensea.io/static/images/logos/opensea-logo.svg" width="20" alt="OpenSea">
                        </a></td>
                    `;
                    table.querySelector('tbody').appendChild(row);
                });
                pricesDiv.appendChild(table);
            } else {
                pricesDiv.innerHTML = "<p>No tokens found for this collection.</p>";
            }
        })
        .catch(error => {
            console.error('Error fetching NFT prices:', error);
            pricesDiv.innerHTML = "<p>Failed to load prices from Reservoir.</p>";
        });
    });
}

// Fetch ENS sales data
function fetchENSSales() {
    fetch(`https://api.ens-vision.tools/ens-sales/v1/recent`, {
        headers: {
            'Authorization': `Bearer ${apiKeyENS}`
        }
    })
    .then(response => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json(); // Parse JSON if response is OK
    })
    .then(data => {
        if (data.sales) {
            const table = document.createElement('table');
            table.innerHTML = `
                <thead>
                    <tr>
                        <th>Domain</th>
                        <th>Price (ETH)</th>
                        <th>Buyer</th>
                    </tr>
                </thead>
                <tbody>
                </tbody>
            `;
            data.sales.forEach(sale => {
                const domain = sale.name;
                const price = sale.price / 1e18; // Price in ETH (assuming price is in wei)
                const buyer = sale.buyer || "Unknown";
                
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${domain}</td>
                    <td>${price}</td>
                    <td>${buyer}</td>
                `;
                table.querySelector('tbody').appendChild(row);
            });
            ensSalesDiv.appendChild(table);
        } else {
            ensSalesDiv.innerHTML = "<p>No recent ENS sales found.</p>";
        }
    })
    .catch(error => {
        console.error('Error fetching ENS sales:', error);
        ensSalesDiv.innerHTML = "<p>Failed to load ENS sales data.</p>";
    });
}

// Call both functions to display data
fetchNFTPrices();
fetchENSSales();
