const fs = require('fs');
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Token Distribution to Core Team", function() {
    let W3DAOToken, w3daoToken, owner;

    beforeEach(async () => {
        W3DAOToken = await ethers.getContractFactory("W3DAOToken");
        [owner] = await ethers.getSigners();
        w3daoToken = await W3DAOToken.deploy(ethers.utils.parseEther("1000000")); // 1 milhão de tokens
        await w3daoToken.deployed();
    });

    it("Should distribute 1000 tokens to each address in core_team_addresses.txt", async function() {
        // Ler os endereços do arquivo core_team_addresses.txt
        const coreTeamAddresses = fs.readFileSync('core_team_addresses.txt', 'utf-8').split('\n').filter(address => !!address.trim());

        // Distribuir 1000 tokens para cada endereço
        for (const address of coreTeamAddresses) {
            await w3daoToken.transfer(address, ethers.utils.parseEther("1000"));
        }

        // Verificar se cada endereço recebeu 1000 tokens
        for (const address of coreTeamAddresses) {
            const balance = await w3daoToken.balanceOf(address);
            expect(balance).to.equal(ethers.utils.parseEther("1000"));
        }
    });
});
