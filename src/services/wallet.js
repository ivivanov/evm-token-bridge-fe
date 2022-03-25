import ERC20Token from '../constants/abis/ERC20Token.json'
import Store from '../store.js'
import Ethers from '../helpers/ethers.js'
import { ethers } from 'ethers'

class WalletService {
  // omit address to get the ETH balance
  static async getTokenBalance (address) {
    let balance
    if (address) {
      const contract = Ethers.getContract(address, ERC20Token.abi, Store.state.library, Store.state.account)
      balance = await contract.balanceOf(Store.state.account)
    } else {
      balance = await Store.state.library.getBalance(Store.state.account)
    }

    return ethers.utils.formatUnits(balance)
  }

  static async getTokenSymbol (address) {
    const contract = Ethers.getContract(address, ERC20Token.abi, Store.state.library, Store.state.account)
    return await contract.symbol()
  }
}

export default WalletService
