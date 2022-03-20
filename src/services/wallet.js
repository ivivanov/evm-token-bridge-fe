// import Web3 from 'web3'
import { ethers } from 'ethers'
import { getContract } from './ethers'
import { ACME_TOKEN_ADDRESS, MAIN_ESCROW_ADDRESS } from '../constants'
import AcmeToken from '../constants/abis/AcmeToken.json'
import MainEscrow from '../constants/abis/MainEscrow.json'
// import SideEscrow from '../constants/abis/SideEscrow.json'

class WalletService {
  static async getAcmeBalance (library, address) {
    const acme = getContract(ACME_TOKEN_ADDRESS, AcmeToken.abi, library, address)
    const balance = await acme.balanceOf(address)
    return ethers.utils.formatUnits(balance, 18)
  }

  static async lockAmount (library, address, amount) {
    const escrow = getContract(MAIN_ESCROW_ADDRESS, MainEscrow.abi, library, address)
    const acme = getContract(ACME_TOKEN_ADDRESS, AcmeToken.abi, library, address)
    const receipt = await acme.increaseAllowance(escrow.address, amount)
    console.log(receipt)
    // lock
    // await escrow.lock()
  }
}

export default WalletService
