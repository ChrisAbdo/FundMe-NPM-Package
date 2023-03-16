import Web3 from "web3";

function generateDonationButton(walletAddress, buttonText = 'Donate Crypto') {
  if (!walletAddress) {
    throw new Error('A wallet address must be provided.');
  }

  const button = `
    <button
      class="crypto-donation-button"
      data-wallet-address="${walletAddress}"
    >
      ${buttonText}
    </button>
  `;

  return button;
}

async function handleDonationButtonClick(event) {
  const walletAddress = event.target.getAttribute('data-wallet-address');
  if (!walletAddress) return;

  // Check if Web3 is injected by a browser extension like MetaMask
  if (typeof window.ethereum === 'undefined') {
    alert('Please install MetaMask or another Ethereum wallet extension to proceed.');
    return;
  }

  // Request user's account access
  try {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  } catch (error) {
    console.error('User denied account access');
    return;
  }

  // Create a new Web3 instance with the provided Ethereum provider
  const web3 = new Web3(window.ethereum);

  // Get the user's current account
  const accounts = await web3.eth.getAccounts();
  const userAccount = accounts[0];

  // Define the transaction details
  const transaction = {
    to: walletAddress,
    from: userAccount,
    value: web3.utils.toWei('0.01', 'ether'), // Change this to the desired amount
    gas: 21000,
    gasPrice: await web3.eth.getGasPrice(),
  };

  // Send the transaction
  try {
    const txReceipt = await web3.eth.sendTransaction(transaction);
    console.log('Transaction successful:', txReceipt);
  } catch (error) {
    console.error('Transaction failed:', error);
  }
}


function initCryptoDonation(walletAddress, buttonText) {
  const buttonHtml = generateDonationButton(walletAddress, buttonText);
  document.body.innerHTML += buttonHtml;

  const buttonElement = document.querySelector('.crypto-donation-button');
  buttonElement.addEventListener('click', handleDonationButtonClick);
}


export {
  initCryptoDonation,
};


