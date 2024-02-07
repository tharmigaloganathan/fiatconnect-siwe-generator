import { generateNonce, SiweMessage } from 'siwe';
import { BrowserProvider, ethers } from 'ethers';

async function outputJSON() {
    // Gather user inputted selections
    var randomGenerateWalletOption = document.getElementById("randomGenerateWallet").checked;
    var sessionDuration = document.getElementById("sessionDuration").value;
    var chainId = document.getElementById("chainId").value;
    var apiBaseUrl = document.getElementById("apiBaseUrl").value;

    // Create SIWE Message Using a Randomly Generated Ethereum Wallet
    if( randomGenerateWalletOption ) {
        console.log("Creating SIWE /auth/login message body...");

        // Defining variables
        const wallet = ethers.Wallet.createRandom()
        const expirationDate = new Date(Date.now() + Number(sessionDuration))
        const headers = {}

        // Creating the SIWE message
        const siweMessage = new SiweMessage({
            domain: new URL(apiBaseUrl).hostname,
            address: wallet.address,
            statement: 'Sign in with Ethereum',
            uri: `${apiBaseUrl}/auth/login`,
            version: '1',
            chainId: chainId,
            nonce: generateNonce(),
            expirationTime: expirationDate.toISOString(),
        })

        // Constructing the body of /auth/login in required format
        const message = siweMessage.prepareMessage()
        const signature = await wallet.signMessage(message)

        // Convert the object to JSON format
        const postRequest = {
            message,
            signature,
        }
        var jsonOutput = JSON.stringify(postRequest, null, 2);

        // Display the JSON result on the page
        document.getElementById("outputResult").innerText = jsonOutput;
    }
    // Create SIWE Message Using the User's Ethereum Wallet
    else {
        const provider = new BrowserProvider(window.ethereum);
        // Connecting the user's wallet
        console.log("Connecting your wallet...");
        provider.send('eth_requestAccounts', [])
          .catch(() => console.log('user rejected request'));

        const signer = await provider.getSigner();


    }

}

// Attach the function to the button click event
document.getElementById('outputJSONButton').addEventListener('click', outputJSON);