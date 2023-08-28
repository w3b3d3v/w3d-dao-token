const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("W3DAOToken", function() {
  let W3DAOToken, w3daoToken, owner, addr1, addr2;

  beforeEach(async () => {
    W3DAOToken = await ethers.getContractFactory("W3DAOToken");
    [owner, addr1, addr2, _] = await ethers.getSigners();
    w3daoToken = await W3DAOToken.deploy(1000);
    await w3daoToken.deployed();
  });

  it("Should mint tokens correctly", async function() {
    await w3daoToken.mint(addr1.address, 100);
    expect(await w3daoToken.balanceOf(addr1.address)).to.equal(100);
  });

  it("Should burn tokens correctly", async function() {
    await w3daoToken.mint(addr1.address, 100);
    await w3daoToken.burn(addr1.address, 50);
    expect(await w3daoToken.balanceOf(addr1.address)).to.equal(50);
  });

  it("Should add and remove admin correctly", async function() {
    await w3daoToken.addAdmin(addr1.address);
    expect(await w3daoToken.hasRole(ethers.constants.HashZero, addr1.address)).to.be.true;
    await w3daoToken.removeAdmin(addr1.address);
    expect(await w3daoToken.hasRole(ethers.constants.HashZero, addr1.address)).to.be.false;
  });

  it("Should transfer tokens to 4 different addresses", async function() {
    const initialSupply = 1000;
    const transferAmount = 500;

    // Mint tokens para o owner
    await w3daoToken.mint(owner.address, initialSupply);

    // Transferir tokens para 4 endereços diferentes
    await w3daoToken.transfer(addr1.address, transferAmount);
    await w3daoToken.transfer(addr2.address, transferAmount);
    // Adicione mais dois endereços se necessário, por exemplo:
    let addr3, addr4;
    [_, _, _, _, addr3, addr4] = await ethers.getSigners();
    await w3daoToken.transfer(addr3.address, transferAmount);
    await w3daoToken.transfer(addr4.address, transferAmount);

    // Verificar se os tokens foram transferidos corretamente
    expect(await w3daoToken.balanceOf(addr1.address)).to.equal(transferAmount);
    expect(await w3daoToken.balanceOf(addr2.address)).to.equal(transferAmount);
    expect(await w3daoToken.balanceOf(addr3.address)).to.equal(transferAmount);
    expect(await w3daoToken.balanceOf(addr4.address)).to.equal(transferAmount);
  });

  it("Should not allow minting after revoking admin role", async function() {
    const mintAmount = 100;

    // Adiciona addr1 como administrador
    await w3daoToken.addAdmin(addr1.address);
    expect(await w3daoToken.hasRole(ethers.constants.HashZero, addr1.address)).to.be.true;

    // Revoga o papel de administrador de addr1
    await w3daoToken.removeAdmin(addr1.address);
    expect(await w3daoToken.hasRole(ethers.constants.HashZero, addr1.address)).to.be.false;

    // Tenta cunhar tokens com addr1 (deve falhar)
    await expect(w3daoToken.connect(addr1).mint(addr2.address, mintAmount)).to.be.revertedWith("Caller is not an contract administrator");
  });

  it("Should allow minting by second admin after removing the first admin", async function() {
    const mintAmount = 100;

    // Adiciona addr1 como administrador
    await w3daoToken.addAdmin(addr1.address);
    expect(await w3daoToken.hasRole(ethers.constants.HashZero, addr1.address)).to.be.true;

    // Adiciona addr2 como outro administrador
    await w3daoToken.addAdmin(addr2.address);
    expect(await w3daoToken.hasRole(ethers.constants.HashZero, addr2.address)).to.be.true;

    // Revoga o papel de administrador de addr1
    await w3daoToken.removeAdmin(addr1.address);
    expect(await w3daoToken.hasRole(ethers.constants.HashZero, addr1.address)).to.be.false;

    // Tenta cunhar tokens com addr2 (deve ser bem-sucedido)
    await w3daoToken.connect(addr2).mint(addr2.address, mintAmount);
    expect(await w3daoToken.balanceOf(addr2.address)).to.equal(mintAmount);
  });

});
