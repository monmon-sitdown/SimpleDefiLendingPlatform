require("dotenv").config();
const { ethers } = require("ethers");

// Loading .env for key and Ganache URL
const privateKey = process.env.PRIVATE_KEY;
const provider = new ethers.providers.JsonRpcProvider(process.env.GANACHE_URL);
const wallet = new ethers.Wallet(privateKey, provider);

// ABI of ERC20 token
const tokenABI = [
  "function mint(address to, uint256 amount) public",
  "function approve(address spender, uint256 amount) public returns (bool)",
];

const TokenAddress = "0x36bFCebFfcAac1E6d6C2Dc39f2C7a2190359754B";

async function main() {
  // Get Token A instance
  const TokenA = new ethers.Contract(TokenAddress, tokenABI, wallet);

  // Target Address and amount
  const recipientAddress = "0x0162d27D2B11da01D59df10994D104e6B94FF5B0"; // ganache user address
  const amountToMint = ethers.utils.parseUnits("10000", 18); // mint 10000

  // mint
  const mintTxA = await TokenA.mint(recipientAddress, amountToMint);
  await mintTxA.wait();
  console.log(`Minted ${amountToMint} Token to ${recipientAddress}`);

  // Approve lending platform to use the tokens
  const dexAddress = "0x94f394Db5e958E296670BF494c723B6fab52d3fD"; // The address of contract of lending platform
  const approveTxA = await TokenA.approve(dexAddress, amountToMint);
  await approveTxA.wait();
  console.log(`Approved ${amountToMint} Token to DEX at ${dexAddress}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
