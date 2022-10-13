const { network } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")
const { storeImages, storeTokenUriMetadata } = require("../utils/upload-to-pinata")

const imagesLocation = "./images/spideyNfts/"

const metadataTemplate = {
    name: "",
    description: "",
    image: "",
    attributes: [
        {
            alter_ego: "Peter Parker",
            location: "New york City",
            hair_colour: "Brown",
            trait_type: "Wallcrawling",
            value: 100,
            costume: "Red and blue",
        },
    ],
}
module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    //lets get the ip hashes of our images
    if (process.env.UPLOAD_TO_PINATA == "true") {
        TOKEN_URI = await handleTokenUris()
    }

    log("Deploying now, please wait...")

    const args = []
    const spideyNft = await deploy("SpideyNft", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying..........")
        await verify(spideyNft.address, args)
    }
}
//This is where we return the tokens of our URI
async function handleTokenUris() {
    TOKEN_URI = []

    //we store the image on IPFS and also store the metadata

    //we make a list of those responses from pinata and they will the hashes of our uploaded files
    //we will loop through that list and update each of the metadatas

    const { responses: imageUploadResponses, files } = await storeImages(imagesLocation)
    for (imageUploadResponseIndex in imageUploadResponses) {
        //we create metadata and upload it
        let tokenUriMetadata = { ...metadataTemplate }
        tokenUriMetadata.name = files[imageUploadResponseIndex].replace(".png", "")
        tokenUriMetadata.description = `An amazing ${tokenUriMetadata.name} SpiderMan!`
        tokenUriMetadata.image = `ipfs://${imageUploadResponses[imageUploadResponseIndex].IpfsHash}`
        console.log(`Uploading ${tokenUriMetadata.name}...`)
        //we store the JSON to pinata
        const metadataUploadResponse = await storeTokenUriMetadata(tokenUriMetadata)
        TOKEN_URI.push(`ipfs://${metadataUploadResponse.IpfsHash}`)
    }
    console.log("Token URIs uploaded! Here:")
    console.log(TOKEN_URI)

    return TOKEN_URI
}

module.exports.tags = ["all", "SpideyNft", "main"]
