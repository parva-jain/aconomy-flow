const Web3 = require("web3");
const SampleERC20 = require("./contractABI/SampleERC20.json");
const SampleNFT = require("./contractABI/SampleNFT.json");
const Composable = require("./contractABI/ComposableTopDown.json");

let contractERC20;
let contractNFT;
let contractComp;
let accounts;
let deployedNetworkComp;
let deployedNetworkERC20;
let deployedNetworkNFT;

init = async () => {
  if (window.ethereum) {
    window.web3 = new Web3(window.ethereum);
    await window.ethereum.enable();
    console.log("Connected");
  } else {
    alert("Metamask not found");
  }
  const id = await web3.eth.net.getId();
  deployedNetworkComp = Composable.networks[id];
  contractComp = new web3.eth.Contract(
    Composable.abi,
    deployedNetworkComp.address
  );
  deployedNetworkERC20 = SampleERC20.networks[id];
  contractERC20 = new web3.eth.Contract(
    SampleERC20.abi,
    deployedNetworkERC20.address
  );
  deployedNetworkNFT = SampleNFT.networks[id];
  contractNFT = new web3.eth.Contract(
    SampleNFT.abi,
    deployedNetworkNFT.address
  );
  accounts = await web3.eth.getAccounts();
  console.log("All Set up!!");
};

mintComposableNFT = async () => {
  const receipt = await contractComp.methods
    .mint(compOwnerAddress.value)
    .send({ from: accounts[0] });
  console.log(receipt);
  console.log("Composable Minted!!");
};

mintNFT = async () => {
  const receipt = await contractNFT.methods
    .mint721(ownerAddress.value)
    .send({ from: accounts[0] });
  console.log(receipt);
  console.log("Minted!!");
};

TransferToComposable = async () => {
  const bytesCompId = await web3.utils.padLeft(
    web3.utils.toHex(composableTokenId.value),
    32
  );
  const tx = await contractNFT.methods
    .safeTransferFrom(
      accounts[0],
      deployedNetworkComp.address,
      NFTTokenId.value,
      bytesCompId
    )
    .send({ from: accounts[0] });
  console.log(tx);
  console.log("Transferred!!");
};

TransferComposable = async () => {
  const tx = await contractComp.methods
    .transferFrom(accounts[0], receiverAddress.value, composableId.value)
    .send({ from: accounts[0] });
  console.log(tx);
  console.log("Transferred!!");
};

// TransferChild = async () => {
//   const tx = await contractComp.methods
//     .safeTransferChild(
//       composableNFTTokenId.value,
//       childReceiverAddress.value,
//       deployedNetworkNFT.address,
//       childNFTTokenId.value
//     )
//     .send({ from: accounts[0] });
//   console.log(tx);
//   console.log("Transferred!!");
// };

// TransferChildToComposable = async () => {
//   const bytesToCompId = await web3.utils.padLeft(
//     web3.utils.toHex(toCNFTTokenId.value),
//     32
//   );
//   const tx = await contractComp.methods
//     .safeTransferChild(
//       fromCNFTTokenId.value,
//       deployedNetworkComp.address,
//       deployedNetworkNFT.address,
//       sampleNFTTokenId.value,
//       bytesToCompId
//     )
//     .send({ from: accounts[0] });
//   console.log(tx);
//   console.log("Transferred!!");
// };

showOwnerOfComposable = async () => {
  const result = await contractComp.methods
    .ownerOf(composableNFTId.value)
    .call({ from: accounts[0] });
  console.log(result);
};

showOwnerOfChild = async () => {
  const result = await contractComp.methods
    .ownerOfChild(deployedNetworkNFT.address, childTokenId.value)
    .call({ from: accounts[0] });
  console.log(result);
};

showOwnerOfNFT = async () => {
  const result = await contractNFT.methods
    .ownerOf(ERC721TokenId.value)
    .call({ from: accounts[0] });
  console.log(result);
};

mintERC20 = async () => {
  const receipt = await contractERC20.methods
    .mint(ownerAddressERC20.value, tokenAmount.value)
    .send({ from: accounts[0] });
  console.log(receipt);
  console.log("Minted!!");
};

getERC20 = async () => {
  await contractERC20.methods
    .approve(deployedNetworkComp.address, getTokenAmount.value)
    .send({ from: accounts[0] });
  console.log("approved");
  const receipt = await contractComp.methods
    .getERC20(
      accounts[0],
      getTokenId.value,
      deployedNetworkERC20.address,
      getTokenAmount.value
    )
    .send({ from: accounts[0] });
  console.log(receipt);
  console.log("Recieved!!");
};

burnComposable = async () => {
  const tx = await contractComp.methods
    .safeTransferChild(
      composableNFTTokenId.value,
      childReceiverAddress.value,
      deployedNetworkNFT.address,
      childNFTTokenId.value
    )
    .send({ from: accounts[0] });
  console.log(tx);
  console.log("Transferred NFT!!");

  const receipt = await contractComp.methods
    .transferERC20(
      composableNFTTokenId.value,
      senderAddress.value,
      deployedNetworkERC20.address,
      sendTokenAmount.value
    )
    .send({ from: accounts[0] });
  console.log(receipt);
  console.log("Transferred!!");
};

// sendERC20 = async () => {
//   const receipt = await contractComp.methods
//     .transferERC20(
//       sendTokenId.value,
//       senderAddress.value,
//       deployedNetworkERC20.address,
//       sendTokenAmount.value
//     )
//     .send({ from: accounts[0] });
//   console.log(receipt);
//   console.log("Transferred!!");
// };

showBalanceNFT = async () => {
  const receipt = await contractComp.methods
    .balanceOfERC20(balanceTokenId.value, deployedNetworkERC20.address)
    .call();
  console.log(receipt);
};

showBalanceAccount = async () => {
  const receipt = await contractERC20.methods
    .balanceOf(balanceAccountAddress.value)
    .call();
  console.log(receipt);
};

const compOwnerAddress = document.getElementById("ownerAddressComp");

const btnMintCompNFT = document.getElementById("btnCreateCompItem");
btnMintCompNFT.onclick = mintComposableNFT;

const ownerAddress = document.getElementById("ownerAddressNFT");

const btnMintNFT = document.getElementById("btnCreateItem");
btnMintNFT.onclick = mintNFT;

const composableTokenId = document.getElementById("toComposableTokenId");
const NFTTokenId = document.getElementById("NFTTokenId");

const btnTransferToComposable = document.getElementById(
  "btnTransferToComposable"
);
btnTransferToComposable.onclick = TransferToComposable;

const composableId = document.getElementById("composableTokenId");
const receiverAddress = document.getElementById("receiverAddress");

const btnTransferComposable = document.getElementById("btnTransferComposable");
btnTransferComposable.onclick = TransferComposable;

const composableNFTTokenId = document.getElementById("composableNFTTokenId");
const childReceiverAddress = document.getElementById("childReceiverAddress");
const childNFTTokenId = document.getElementById("childNFTTokenId");
const senderAddress = document.getElementById("senderAddressERC20");
const sendTokenAmount = document.getElementById("sendTokenAmount");

const btnBurnComposable = document.getElementById("btnBurnComposable");
btnBurnComposable.onclick = burnComposable;

// const fromCNFTTokenId = document.getElementById("fromCNFTTokenId");
// const toCNFTTokenId = document.getElementById("toCNFTTokenId");
// const sampleNFTTokenId = document.getElementById("sampleNFTTokenId");

// const btnTransferChildToComp = document.getElementById(
//   "btnTransferChildToComp"
// );
// btnTransferChildToComp.onclick = TransferChildToComposable;

const composableNFTId = document.getElementById("composableNFTId");

const btnOwnerOfComposable = document.getElementById("btnOwnerOfComposable");
btnOwnerOfComposable.onclick = showOwnerOfComposable;

const childTokenId = document.getElementById("childTokenId");

const btnOwnerOfChild = document.getElementById("btnOwnerOfChild");
btnOwnerOfChild.onclick = showOwnerOfChild;

const ERC721TokenId = document.getElementById("ERC721TokenId");

const btnOwnerOfNFT = document.getElementById("btnOwnerOfNFT");
btnOwnerOfNFT.onclick = showOwnerOfNFT;

const ownerAddressERC20 = document.getElementById("ownerAddressERC20");
const tokenAmount = document.getElementById("tokenAmount");

const btnMintERC20 = document.getElementById("btnCreateERC20");
btnMintERC20.onclick = mintERC20;

const getTokenAmount = document.getElementById("getTokenAmount");
const getTokenId = document.getElementById("getTokenId");

const btnGetToken = document.getElementById("btnGetToken");
btnGetToken.onclick = getERC20;

// const senderAddress = document.getElementById("senderAddressERC20");
// const sendTokenAmount = document.getElementById("sendTokenAmount");
// const sendTokenId = document.getElementById("sendTokenId");

// const btnSendToken = document.getElementById("btnSendToken");
// btnSendToken.onclick = sendERC20;

const balanceTokenId = document.getElementById("balanceTokenId");

const btnTokenBalance = document.getElementById("btnTokenBalance");
btnTokenBalance.onclick = showBalanceNFT;

const balanceAccountAddress = document.getElementById("balanceAccountAddress");

const btnAccountBalance = document.getElementById("btnAccountBalance");
btnAccountBalance.onclick = showBalanceAccount;

init();
