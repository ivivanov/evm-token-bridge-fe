import { getAddress } from '@ethersproject/address'
import { AddressZero } from '@ethersproject/constants'
import { Contract } from '@ethersproject/contracts'

class Ethers {
  static isAddress (value) {
    try {
      return getAddress(value)
    } catch {
      return false
    }
  }

  static getSigner (library, account) {
    return library.getSigner(account).connectUnchecked()
  }

  static getProviderOrSigner (library, account) {
    return account ? Ethers.getSigner(library, account) : library
  }

  static getContract (address, ABI, library, account) {
    if (!Ethers.isAddress(address) || address === AddressZero) {
      throw Error(`Invalid 'address' parameter '${address}'.`)
    }

    return new Contract(address, ABI, Ethers.getProviderOrSigner(library, account))
  }
}

export default Ethers
