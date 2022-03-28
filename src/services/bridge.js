import { getChainContracts } from '../constants/contracts.js'
import Ethers from '../helpers/ethers.js'
import Store from '../store.js'
import Bridge from '../constants/abis/Bridge.json'

class BridgeService {
  static async getChainTokens (chainId) {
    const contracts = getChainContracts(chainId)
    if (contracts) {
      if (contracts.tokens) {
        return contracts.tokens
      } else { // side chain
        return await BridgeService.wrappedTokens(chainId)
      }
    }
  }

  static wrappedTokens () {
    const bridgeAddress = getChainContracts(Store.state.chainId).bridge
    const contract = Ethers.getContract(bridgeAddress, Bridge.abi, Store.state.library, Store.state.account)

    return contract.wrappedTokens()
  }

  static wrapToken (name, symbol, sourceAddress, sourceChainId) {
    const bridgeAddress = getChainContracts(Store.state.chainId).bridge
    const contract = Ethers.getContract(bridgeAddress, Bridge.abi, Store.state.library, Store.state.account)
    console.log(name, symbol, sourceAddress, sourceChainId)
    return contract.wrapToken(name, symbol, sourceAddress, sourceChainId)
  }

  static async lockToken () {
    // lock on main
    // ##lock eth
    // ##lock any

    // lock on side
    // ##lock eth
    // ##lock any
  }
}

export default BridgeService
