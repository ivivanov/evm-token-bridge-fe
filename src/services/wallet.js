import Web3 from 'web3'
// import { ethers } from 'ethers'

import ERC20Token from '../constants/abis/ERC20Token.json'
// import Ethers from '../helpers/ethers.js'
import Store from '../store.js'
// import utilities from '../'

// import MainEscrow from '../constants/abis/MainEscrow.json'
// import SideEscrow from '../constants/abis/SideEscrow.json'
import { getChainData } from '../constants/chains.js'

class WalletService {
  // omit address to get the ETH balance
  static async getTokenBalance (address) {
    const chainData = getChainData(Store.state.chainId)
    const Web3Client = new Web3(new Web3.providers.HttpProvider(chainData.rpc_url))

    let balance
    if (address) {
      const contract = new Web3Client.eth.Contract(ERC20Token.abi, address)
      balance = await contract.methods.balanceOf(Store.state.account).call()
    } else {
      balance = await Web3Client.eth.getBalance(Store.state.account)
    }

    return Web3Client.utils.fromWei(balance)
  }

  // static async getTokenBalance (address) {
  //   const chainData = this.getChainData(this.chainId)
  //   const library = new Web3Provider(provider)
  //   const account = Store.state.account
  //   const provider = new Web

  //   let balance
  //   if (!address) {
  //     // const provider = ethers.getDefaultProvider()
  //     console.log(provider)
  //     balance = await provider.getBalance(account)
  //   } else {
  //     const token = Ethers.getContract(address, ERC20Token.abi, library, account)
  //     balance = await token.balanceOf(account)
  //   }

  //   return ethers.utils.formatEther(balance)
  // }

  // static async lockAmount (library, address, amount) {
  //   const escrow = getContract(MAIN_ESCROW, MainEscrow.abi, library, address)
  //   const acme = getContract(ACME_TOKEN, AcmeToken.abi, library, address)
  //   const receipt = await acme.increaseAllowance(escrow.address, amount)
  //   console.log(receipt)
  //   // lock
  //   // await escrow.lock()
  // }
}

export default WalletService
