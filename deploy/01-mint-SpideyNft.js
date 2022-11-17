const { network, ethers } = require("hardhat")

module.exports = async ({ getNamedAccounts }) => {
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    // Spidey NFT
    const spideyNft = await ethers.getContract("SpideyNft", deployer)
    const spideyMintTx = await spideyNft.mintNft()
    await spideyMintTx.wait(1)
    console.log(`Spidey NFT index 0 tokenURI: ${await spideyNft.tokenURI(0)}`)
}
module.exports.tags = ["all", "mint"]
