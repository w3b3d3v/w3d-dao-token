const fs = require('fs');
const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    // Deploy do token com 1 milhão de supply
    const Token = await ethers.getContractFactory("W3DAOToken");
    const token = await Token.deploy(ethers.utils.parseEther("1000000")); // 1 milhão de tokens
    await token.deployed();

    console.log("Token deployed to:", token.address);

    // Ler os endereços do arquivo core_team_addresses.txt
    const coreTeamAddresses = fs.readFileSync('core_team_addresses.txt', 'utf-8').split('\n').filter(address => !!address.trim());

    // Transferir 1000 tokens para cada endereço
    for (const address of coreTeamAddresses) {
        await token.transfer(address, ethers.utils.parseEther("1000"));
        console.log(`Transferred 1000 tokens to ${address}`);
    }

    console.log("Verifying contract...");
    await hre.run("verify:verify", {
      address: contract.address,
      constructorArguments: [ethers.utils.parseEther("1000000")], // Adicione os argumentos do construtor aqui, se houver
    });
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
``