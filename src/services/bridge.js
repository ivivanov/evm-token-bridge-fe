import { getChainContracts } from '../constants/contracts.js'
import Ethers from '../helpers/ethers.js'
import Store from '../store.js'
import Bridge from '../constants/abis/Bridge.json'
import ERC20Token from '../constants/abis/ERC20Token.json'
import { ethers } from 'ethers'

class BridgeService {
  static getChainTokens (chainId) {
    return JSON.parse(window.localStorage.getItem('tokens'))
    // if (tokens) {
    //   return tokens.filter((token) => token.nativeChainId === chainId)
    // }

    // return []
  }

  static async wrappedTokens () {
    const bridgeAddress = getChainContracts(Store.state.chainId).bridge
    const contract = Ethers.getContract(bridgeAddress, Bridge.abi, Store.state.library, Store.state.account)

    return contract.wrappedTokens()
  }

  static async getWrappedToken (wrappedToken) {
    const bridgeAddress = getChainContracts(Store.state.chainId).bridge
    const contract = Ethers.getContract(bridgeAddress, Bridge.abi, Store.state.library, Store.state.account)
    const wrappedTokens = await contract.wrappedTokens()

    for (let i = 0; i < wrappedTokens.length; i++) {
      if (wrappedToken === wrappedTokens[i].token) {
        return wrappedTokens[i]
      }
    }
  }

  static async wrapToken (name, symbol, sourceAddress, sourceChainId) {
    const bridgeAddress = getChainContracts(Store.state.chainId).bridge
    const contract = Ethers.getContract(bridgeAddress, Bridge.abi, Store.state.library, Store.state.account)

    const wrap = await contract.wrapToken(sourceChainId, sourceAddress, { name: name, symbol: symbol, decimals: 18 })
    await wrap.wait(1)
  }

  static async lockToken (targetChain, token, amount) {
    const wei = ethers.utils.parseEther(amount)
    const bridgeAddress = getChainContracts(Store.state.chainId).bridge
    const bridgeContract = Ethers.getContract(bridgeAddress, Bridge.abi, Store.state.library, Store.state.account)
    const tokenContract = Ethers.getContract(token, ERC20Token.abi, Store.state.library, Store.state.account)

    const approve = await tokenContract.increaseAllowance(bridgeAddress, wei)
    await approve.wait(1)

    const lock = await bridgeContract.lock(targetChain, token, wei, Store.state.account)
    await lock.wait(1)
  }

  static async mintToken (claim) {
    const bridgeAddress = getChainContracts(claim.targetChain).bridge
    const bridgeContract = Ethers.getContract(bridgeAddress, Bridge.abi, Store.state.library, Store.state.account)

    const mint = await bridgeContract.mint(claim.sourceChain, claim.nativeToken, claim.amount, claim.receiver, claim.txHash, claim.txSigned)
    await mint.wait(1)
  }

  static async burnToken (token, amount) {
    const wei = ethers.utils.parseEther(amount)
    const bridgeAddress = getChainContracts(Store.state.chainId).bridge
    const bridgeContract = Ethers.getContract(bridgeAddress, Bridge.abi, Store.state.library, Store.state.account)
    const tokenContract = Ethers.getContract(token, ERC20Token.abi, Store.state.library, Store.state.account)

    const approve = await tokenContract.increaseAllowance(bridgeAddress, wei)
    await approve.wait(1)

    const burn = await bridgeContract.burn(token, wei, Store.state.account)
    await burn.wait(1)
  }

  static async releaseToken (claim) {
    const bridgeAddress = getChainContracts(claim.targetChain).bridge
    const bridgeContract = Ethers.getContract(bridgeAddress, Bridge.abi, Store.state.library, Store.state.account)

    const release = await bridgeContract.release(claim.sourceChain, claim.nativeToken, claim.amount, claim.receiver, claim.txHash, claim.txSigned)
    await release.wait(1)
  }
}

export default BridgeService
