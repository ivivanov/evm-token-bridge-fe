import Ethers from '../helpers/ethers.js'
import getChainContracts from '../constants/contracts.js'
import WalletService from './wallet.js'
import Store from '../store.js'

// import MainEscrow from '../constants/abis/MainEscrow.json'
import SideEscrow from '../constants/abis/SideEscrow.json'

class EscrowService {
  static async getChainTokens (chainId) {
    const contracts = getChainContracts(chainId)
    if (contracts) {
      if (contracts.mainEscrow) {
        return contracts.tokens
      } else { // side chain
        const tokens = []
        const supportedTokens = await EscrowService.getSupportedTokens(chainId)
        for (const t of supportedTokens) {
          tokens.push({
            address: t,
            symbol: await WalletService.getTokenSymbol(t)
          })
        }

        return tokens
      }
    }
  }

  static async getSupportedTokens (chainId) {
    const sideEscrowAddress = getChainContracts(chainId).sideEscrow
    const contract = Ethers.getContract(sideEscrowAddress, SideEscrow.abi, Store.state.library, Store.state.account)

    return contract.supportedTokens()
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

export default EscrowService
