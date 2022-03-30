const main = async () => {
  const [owner, randomUser] = await hre.ethers.getSigners();
  const contractFactory = await hre.ethers.getContractFactory("Domains");
  const contract = await contractFactory.deploy("kuchbhi");
  await contract.deployed();

  console.log("Contract Deployed on Address: ", contract.address);
  console.log("Contract Owner address: ", owner.address);

  // registering a domain
  let txn = await contract.register("heyhe", {
    value: hre.ethers.utils.parseEther("0.5"),
  });
  await txn.wait();

  // checking domain owner
  const domainOwner = await contract.getAddress("heyhe");
  console.log("heyhe Domain owned by: ", domainOwner);

  // checking contract balance
  let contractBalance = await hre.ethers.provider.getBalance(contract.address);
  console.log(
    "Contract balance is: ",
    hre.ethers.utils.formatEther(contractBalance)
  );

  // random user trying to withdraw money from contract
  try {
    txn = await contract.connect(randomUser).withdraw();
    await txn.wait();
  } catch (error) {
    console.log(
      "trying to get away with money??You are not as good as you think."
    );
  }

  // checking owner's balance before withdrawing
  let ownerBalance = await hre.ethers.provider.getBalance(owner.address);
  console.log(
    "Owner balance before withdrawl: ",
    hre.ethers.utils.formatEther(ownerBalance)
  );

  // owner withdrawing money from contract
  txn = await contract.connect(owner).withdraw();
  await txn.wait();

  // checking owner balance after withdrawing
  ownerBalance = await hre.ethers.provider.getBalance(owner.address);
  console.log(
    "Owner balance after withdrawing: ",
    hre.ethers.utils.formatEther(ownerBalance)
  );

  // checking contract balance after withdrawing
  contractBalance = await hre.ethers.provider.getBalance(contract.address);
  console.log(
    "Contract balance after withdrawing: ",
    hre.ethers.utils.formatEther(contractBalance)
  );

  //  setting a domain record that does not belong to me.
  txn = await contract
    .connect(randomUser)
    .setRecord("heyhe", "changing the domain record");
  await txn.wait();
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
