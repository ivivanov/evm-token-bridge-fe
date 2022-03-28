import ERC20Token from '../constants/abis/ERC20Token.json'
import Store from '../store.js'
import Ethers from '../helpers/ethers.js'
import { ethers } from 'ethers'

class WalletService {
  static async getTokenBalance (address) {
    const contract = Ethers.getContract(address, ERC20Token.abi, Store.state.library, Store.state.account)
    const balance = await contract.balanceOf(Store.state.account)

    return ethers.utils.formatUnits(balance)
  }

  static async getTokenSymbol (address) {
    const contract = Ethers.getContract(address, ERC20Token.abi, Store.state.library, Store.state.account)
    return contract.symbol()
  }

  static async getTokenName (address) {
    const contract = Ethers.getContract(address, ERC20Token.abi, Store.state.library, Store.state.account)
    return contract.name()
  }
}

export default WalletService
