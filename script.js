// Grab the pricesDiv element where we will display the NFT prices
const pricesDiv = document.getElementById("prices");
const ensSalesDiv = document.getElementById("ens-sales");

// Your API key from Reservoir
const apiKey = 'a5d354d5-d348-5802-be9a-147a5dd5caa8';  // Replace with your actual API key

// Define the NFT collection contract addresses you want to fetch data from
const nftContracts = [
    '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D',  // Example NFT collection
    // Add more NFT contract addresses as needed
];

// Define the ENS contract address
const ensContract = '0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85';  // ENS Registry Contract

// Function to fetch NFT prices
async function fetchNFTPrices() {
    for (const contract of nftContracts) {
        try {
            const response = await fetch(`https://api.reservoir.tools/tokens/v5?collection=${contract}`, {
                headers: {
                    'x-api-key': apiKey  // Pass the API key in the headers
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if (data.tokens) {
                pricesDiv.innerHTML += `<h2>NFT Prices for Collection: ${contract}</h2>`;
                data.tokens.forEach(token => {
                    const price = token.market.floorAsk.price.amount.native || "Not for sale";
                    const title = token.token.name || `Token ID: ${token.token.tokenId}`;
                    const imageUrl = token.token.image || '';  // Get the token image URL
                    pricesDiv.innerHTML += `
                        <div class="token">
                            <img src="${imageUrl}" alt="${title}" />
                            <p>${title}: ${price} ETH</p>
                        </div>`;
                });
            } else {
                pricesDiv.innerHTML += `<h2>NFT Prices for Collection: ${contract}</h2><p>No tokens found.</p>`;
            }
        } catch (error) {
            console.error('Error fetching NFT prices:', error);
            pricesDiv.innerHTML += `<p>Failed to load prices for collection: ${contract}.</p>`;
        }
    }
}

// Function to fetch ENS sales
async function fetchENSSales() {
    try {
        const response = await fetch(`https://api.reservoir.tools/tokens/v5?collection=${ensContract}`, {
            headers: {
                'x-api-key': apiKey  // Use your Reservoir API key
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.tokens) {
            ensSalesDiv.innerHTML += `<h2>ENS Sales</h2>`;
            data.tokens.forEach(token => {
                const price = token.market.floorAsk.price.amount.native || "Not for sale";
                const name = token.token.name || `Token ID: ${token.token.tokenId}`;
                ensSalesDiv.innerHTML += `<p>${name}: ${price} ETH</p>`;
            });
        } else {
            ensSalesDiv.innerHTML += "<p>No ENS sales found.</p>";
        }
    } catch (error) {
        console.error('Error fetching ENS sales:', error);
        ensSalesDiv.innerHTML += "<p>Failed to load ENS sales.</p>";
    }
}

// Call the functions to fetch data
fetchNFTPrices();
fetchENSSales();
