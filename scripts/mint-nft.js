require("dotenv").config();
const API_URL = process.env.API_URL;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(API_URL);
const contract = require("../artifacts/contracts/MyNFT.sol/MyNFT.json");

const nftContract = new web3.eth.Contract(contract.abi, process.env.CONTRACT_ADDRESS);

async function mintNFT(tokenURI) {
  const nonce = await web3.eth.getTransactionCount(process.env.PUBLIC_KEY, "latest"); //get latest nonce

  //the transaction
  const tx = {
    from: process.env.PUBLIC_KEY,
    to: process.env.CONTRACT_ADDRESS,
    nonce: nonce,
    gas: 500000,
    data: nftContract.methods.mintNFT(process.env.PUBLIC_KEY, tokenURI).encodeABI(),
  };

  const signPromise = web3.eth.accounts.signTransaction(tx, process.env.PRIVATE_KEY);
  signPromise
    .then((signedTx) => {
      web3.eth.sendSignedTransaction(signedTx.rawTransaction, function (
        err,
        hash
      ) {
        if (!err) {
          console.log(
            "The hash of your transaction is: ",
            hash,
            "\nCheck Alchemy's Mempool to view the status of your transaction!"
          );
        } else {
          console.log(
            "Something went wrong when submitting your transaction:",
            err
          );
        }
      });
    })
    .catch((err) => {
      console.log(" Promise failed:", err);
    });
}
//https://gateway.pinata.cloud/ipfs/QmRRQASpPFE4VPdVeS2UHdv3LFFrAqtLGGWsUpFpAGHsEJ This is the IPFS address of pinata of nft-metadata.json
mintNFT(
  "https://gateway.pinata.cloud/ipfs/QmRRQASpPFE4VPdVeS2UHdv3LFFrAqtLGGWsUpFpAGHsEJ"
);
