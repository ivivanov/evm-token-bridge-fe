import { getChainContracts } from '../constants/contracts.js'
import Ethers from '../helpers/ethers.js'
import Store from '../store.js'
import Bridge from '../constants/abis/Bridge.json'
import ERC20Token from '../constants/abis/ERC20Token.json'
import { ethers } from 'ethers'

const serviceFeeWei = '1000000000000000' // 0.001eth

class BridgeService {
  static getImportedTokens (chainId) {
    const tokens = JSON.parse(window.localStorage.getItem('tokens'))

    if (tokens) {
      return tokens.filter((token) => token.chainId === chainId)
    }

    return []
  }

  static async getWrappedTokens () {
    const bridgeAddress = getChainContracts(Store.state.chainId).bridge
    const contract = Ethers.getContract(bridgeAddress, Bridge.abi, Store.state.library, Store.state.account)

    return contract.wrappedTokens()
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

    const approve = await tokenContract.approve(bridgeAddress, wei)
    await approve.wait()

    const lock = await bridgeContract.lock(targetChain, token, wei, { value: serviceFeeWei })
    await lock.wait(2)
  }

  static async mintToken (claim) {
    const bridgeAddress = getChainContracts(claim.targetChain).bridge
    const bridgeContract = Ethers.getContract(bridgeAddress, Bridge.abi, Store.state.library, Store.state.account)

    const mint = await bridgeContract.mint({
      sourceChain: claim.sourceChain,
      token: claim.token,
      amount: claim.amountWei,
      receiver: claim.receiver,
      wrappedTokenName: claim.wrappedTokenName,
      wrappedTokenSymbol: claim.wrappedTokenSymbol,
      txHash: claim.txHash,
      txSigned: claim.txSigned
    })

    await mint.wait(1)
  }

  static async burnToken (sourceChain, token, amount) {
    const wei = ethers.utils.parseEther(amount)
    const bridgeAddress = getChainContracts(Store.state.chainId).bridge
    const bridgeContract = Ethers.getContract(bridgeAddress, Bridge.abi, Store.state.library, Store.state.account)
    const tokenContract = Ethers.getContract(token, ERC20Token.abi, Store.state.library, Store.state.account)

    const approve = await tokenContract.increaseAllowance(bridgeAddress, wei)
    await approve.wait()

    const burn = await bridgeContract.burn(sourceChain, token, wei, Store.state.account)
    await burn.wait(1)
  }

  static async releaseToken (claim) {
    const bridgeAddress = getChainContracts(claim.targetChain).bridge
    const bridgeContract = Ethers.getContract(bridgeAddress, Bridge.abi, Store.state.library, Store.state.account)

    const release = await bridgeContract.release({
      sourceChain: claim.sourceChain,
      token: claim.token,
      amount: claim.amountWei,
      receiver: claim.receiver,
      txHash: claim.txHash,
      txSigned: claim.txSigned
    })

    await release.wait(1)
  }
}

export default BridgeService
