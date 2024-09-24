const pricesDiv = document.getElementById("prices");
const ensSalesDiv = document.getElementById("ens-sales");
const apiKey = 'a5d354d5-d348-5802-be9a-147a5dd5caa8'; // Your API key from Reservoir

// NFT and ENS Collection contracts
const collectionContracts = [
    '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D',  // Example collection 1
    '0x79FCDEF22feeD20eDDacbB2587640e45491b757f',   // Example collection 2
    '0x282BDD42f4eb70e7A9D9F40c8fEA0825B7f68C5D',   // Example collection 3
];
const ensContract = '0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85';  // ENS Registry Contract

// Function to fetch and display NFT prices
async function fetchNFTPrices() {
    for (const collectionContract of collectionContracts) {
        try {
            const collectionResponse = await fetch(`https://api.reservoir.tools/collections/v5?id=${collectionContract}`, {
                headers: {
                    'x-api-key': apiKey
                }
            });
            const collectionData = await collectionResponse.json();
            
            if (collectionData.collections && collectionData.collections.length > 0) {
                const collection = collectionData.collections[0];
                const collectionName = collection.name;
                const collectionIcon = collection.image;

                const collectionDiv = document.createElement('div');
                collectionDiv.classList.add('collection');

                const collectionHeader = `
                    <div class="collection-header">
                        <img src="${collectionIcon}" alt="${collectionName}" width="50" height="50">
                        <h2>${collectionName}</h2>
                    </div>`;
                collectionDiv.innerHTML = collectionHeader;

                const table = document.createElement('table');
                table.innerHTML = `
                    <thead>
                        <tr>
                            <th>Token</th>
                            <th>Price (ETH)</th>
                            <th>Marketplace</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                `;
                collectionDiv.appendChild(table);
                pricesDiv.appendChild(collectionDiv);

                const tokensResponse = await fetch(`https://api.reservoir.tools/tokens/v5?collection=${collectionContract}`, {
                    headers: {
                        'x-api-key': apiKey
                    }
                });
                const tokensData = await tokensResponse.json();
                const tbody = table.querySelector('tbody');

                if (tokensData.tokens) {
                    tokensData.tokens.forEach(token => {
                        const price = token.market.floorAsk.price?.amount?.native || "Not for sale";
                        const title = token.token.name || `Token ID: ${token.token.tokenId}`;
                        const tokenId = token.token.tokenId;

                        const openseaIcon = '<img src="https://opensea.io/static/images/logos/opensea-logo.svg" alt="OpenSea" width="20" height="20">';
                        const blurIcon = '<img src="https://imgs.blur.io/_assets/homepage/logo.png" alt="Blur" width="20" height="20">';

                        const row = `
                            <tr>
                                <td>
                                    <img src="${token.token.image}" alt="${title}" width="50" height="50">
                                    ${title}
                                </td>
                                <td>${price} ETH</td>
                                <td>
                                    <a href="https://opensea.io/assets/${collectionContract}/${tokenId}" target="_blank">${openseaIcon}</a> |
                                    <a href="https://blur.io/eth/asset/${collectionContract}/${tokenId}" target="_blank">${blurIcon}</a>
                                </td>
                            </tr>`;
                        tbody.innerHTML += row;
                    });
                } else {
                    tbody.innerHTML = "<tr><td colspan='3'>No tokens found for this collection.</td></tr>";
                }
            } else {
                pricesDiv.innerHTML += `<p>No data for contract: ${collectionContract}</p>`;
            }
        } catch (error) {
            console.error('Error fetching collection data:', error);
            pricesDiv.innerHTML += `<p>Error fetching collection data for contract: ${collectionContract}</p>`;
        }
    }
}

// Function to fetch ENS sales data
async function fetchENSSales() {
    try {
        const response = await fetch(`https://api.reservoir.tools/tokens/v5?collection=${ensContract}`, {
            headers: {
                'x-api-key': apiKey
            }
        });
        const data = await response.json();
        
        if (data.tokens) {
            ensSalesDiv.innerHTML += `<h2>ENS Sales</h2>`;
            data.tokens.forEach(token => {
                const price = token.market.floorAsk.price?.amount?.native || "Not for sale";
                const name = token.token.name || `Token ID: ${token.token.tokenId}`;
                ensSalesDiv.innerHTML += `<p>${name}: ${price} ETH</p>`;
            });
        } else {
            ensSalesDiv.innerHTML = "<p>No ENS sales found.</p>";
        }
    } catch (error) {
        console.error('Error fetching ENS sales:', error);
        ensSalesDiv.innerHTML = "<p>Failed to load ENS sales.</p>";
    }
}

// Call the functions to fetch data
fetchNFTPrices();
fetchENSSales();
