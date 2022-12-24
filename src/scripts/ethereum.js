import * as ethers from 'ethers';

const funCoinAmount = ethers.BigNumber.from("1000000000000000000");
const bridgeAddress = import.meta.env.VITE_ETH_BRIDGE_ADDRESS;
const bridgeAbi = ["function lock(uint256) external returns (bytes32)"];
const contract = (signer) => new ethers.Contract(bridgeAddress, bridgeAbi, signer);

export async function connectWallet() {
  if (typeof window.ethereum !== 'undefined') {
    console.log('MetaMask is installed!');
  }

  const message = [];
  return await ethereum.request({ method: 'eth_requestAccounts', params: [] });
}

export async function lockTokens() {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const bridge = contract(signer);
  const tx = await bridge.lock(funCoinAmount);
  const receipt = await tx.wait();
  console.log("event log: ", receipt.events[2].topics[1]);
  return receipt.events[2].topics[1];
}
