import { ethers } from "hardhat";

async function main() {
  console.log("Deploying PredictMarket contract...");

  const PredictMarket = await ethers.getContractFactory("PredictMarket");
  const predictMarket = await PredictMarket.deploy();

  await predictMarket.waitForDeployment();

  const address = await predictMarket.getAddress();

  console.log(`PredictMarket deployed to: ${address}`);
  console.log("\nUpdate this address in lib/contract.ts");
  console.log("\nVerify with:");
  console.log(`npx hardhat verify --network base-sepolia ${address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
