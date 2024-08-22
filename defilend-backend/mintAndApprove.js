require("dotenv").config();
const { ethers } = require("ethers");

// 从 .env 文件中加载私钥和Ganache URL
const privateKey = process.env.PRIVATE_KEY;
const provider = new ethers.providers.JsonRpcProvider(process.env.GANACHE_URL);
const wallet = new ethers.Wallet(privateKey, provider);

// ERC20 代币合约的 ABI 和地址
const tokenABI = [
  "function mint(address to, uint256 amount) public",
  "function approve(address spender, uint256 amount) public returns (bool)",
];

const TokenAddress = "0x36bFCebFfcAac1E6d6C2Dc39f2C7a2190359754B";

async function main() {
  // 获取 Token1的合约实例
  const TokenA = new ethers.Contract(TokenAddress, tokenABI, wallet);

  // 目标地址和数量
  const recipientAddress = "0x0162d27D2B11da01D59df10994D104e6B94FF5B0"; // 替换为用户地址
  const amountToMint = ethers.utils.parseUnits("10000", 18); // 铸造1000个代币

  // 铸造代币
  const mintTxA = await TokenA.mint(recipientAddress, amountToMint);
  await mintTxA.wait();
  console.log(`Minted ${amountToMint} Token to ${recipientAddress}`);

  // 授权 DEX 平台合约使用代币
  const dexAddress = "0x94f394Db5e958E296670BF494c723B6fab52d3fD"; // DEX 平台合约地址
  const approveTxA = await TokenA.approve(dexAddress, amountToMint);
  await approveTxA.wait();
  console.log(`Approved ${amountToMint} Token to DEX at ${dexAddress}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
