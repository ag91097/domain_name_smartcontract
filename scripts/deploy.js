const main = async () => {
  const contractFactory = await hre.ethers.getContractFactory("Domains");
  const contract = await contractFactory.deploy("kuchbhi");
  await contract.deployed();

  console.log("Contract deployed to address: ", contract.address);

  let txn = await contract.register("heyhehoho", {
    value: hre.ethers.utils.parseEther("0.1"),
  });
  await txn.wait();
  console.log("Minted domain heyhehoho.kuchbhi");

  txn = await contract.setRecord("heyhehoho", "welcome to a funny domain");
  await txn.wait();
  console.log("Set record for heyhehoho.kuchbhi");

  const address = await contract.getAddress("heyhehoho");
  console.log("Owner of domain heyhehoho:", address);

  const balance = await hre.ethers.provider.getBalance(contract.address);
  console.log("Contract balance:", hre.ethers.utils.formatEther(balance));
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
