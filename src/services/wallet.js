import Web3 from 'web3'
import ERC20Token from '../constants/abis/ERC20Token.json'
import Store from '../store.js'
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

  static async getTokenSymbol (address) {
    const chainData = getChainData(Store.state.chainId)
    const Web3Client = new Web3(new Web3.providers.HttpProvider(chainData.rpc_url))
    const contract = new Web3Client.eth.Contract(ERC20Token.abi, address)
    return await contract.methods.symbol().call()
  }
}

export default WalletService
