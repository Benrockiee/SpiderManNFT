// We are going to skimp a bit on these tests...

const { assert } = require("chai")
const { network, deployments, ethers } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("SpiderMan NFT Unit Tests", function () {
          let spideyNft, deployer

          beforeEach(async () => {
              accounts = await ethers.getSigners()
              deployer = accounts[0]
              await deployments.fixture(["spideynft"])
              spideyNft = await ethers.getContractFactory("SpideyNft")
          })

          describe("Constructor", () => {
              it("Initializes the NFT Correctly.", async () => {
                  const name = await spideyNft.name()
                  assert.equal(name, "Spidey")
                  const symbol = await spideyNft.symbol()
                  assert.equal(symbol, "SPD")
                  const tokenCounter = await spideyNft.getTokenCounter()
                  assert.equal(tokenCounter.toString(), "0")
              })
          })

          describe("Mint NFT", () => {
              it("Allows users to mint an NFT, and updates appropriately", async function () {
                  const txResponse = await spideyNft.mintNft()
                  await txResponse.wait(1)
                  const tokenURI = await spideyNft.tokenURI(0)
                  const tokenCounter = await spideyNft.getTokenCounter()

                  assert.equal(tokenCounter.toString(), "1")
                  assert.equal(tokenURI, await spideyNft.TOKEN_URI())
              })
          })
      })
