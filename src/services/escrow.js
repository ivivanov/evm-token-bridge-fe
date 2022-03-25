import Web3 from 'web3'
import getChainContracts from '../constants/contracts.js'
import { getChainData } from '../constants/chains.js'
import WalletService from './wallet.js'

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
    const chainData = getChainData(chainId)
    const Web3Client = new Web3(new Web3.providers.HttpProvider(chainData.rpc_url))
    const contract = new Web3Client.eth.Contract(SideEscrow.abi, sideEscrowAddress)

    return contract.methods.supportedTokens().call()
  }
  // static async lockOnMain (library, address, amount) {
  //     const escrow = getContract(MAIN_ESCROW, MainEscrow.abi, library, address)
  //     const acme = getContract(ACME_TOKEN, AcmeToken.abi, library, address)
  //     const receipt = await acme.increaseAllowance(escrow.address, amount)
  //     console.log(receipt)
  //     // lock
  //     // await escrow.lock()
  //   }
}

export default EscrowService
