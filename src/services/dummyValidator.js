import { ethers } from 'ethers'
import { getChainContracts } from '../constants/contracts.js'
import { getChainData } from '@/constants/chains'
import { successToast } from '../helpers/toast.js'

import Bridge from '../constants/abis/Bridge.json'
import Store from '../store.js'
import WalletService from './wallet.js'

const txType = Object.freeze({
  MINT: 'mint',
  RELEASE: 'release'
})

class ValidatorService {
  constructor () {
    this.ropId = 3 // ropsten
    this.rinId = 4 // rinkeby
    this.txSigner = new ethers.Wallet(process.env.VUE_APP_TRUSTED_SIGNER_PK)
  }

  getBridgeContract (chainId) {
    const bridgeAddress = getChainContracts(chainId).bridge
    const provider = new ethers.providers.JsonRpcProvider(getChainData(chainId).rpc_url)
    const bridge = new ethers.Contract(bridgeAddress, Bridge.abi, provider)

    return bridge
  }

  async prepareMintTx (targetChain, sourceChain, token, amountWei, receiver) {
    const tokenName = await WalletService.getTokenName(token)
    const tokenSymbol = await WalletService.getTokenSymbol(token)
    const wrappedTokenName = `wrapped ${tokenName}`
    const wrappedTokenSymbol = `w${tokenSymbol}`

    const txHash = ethers.utils.solidityKeccak256(
      ['uint16', 'address', 'uint256', 'address', 'string', 'string'],
      [sourceChain, token, amountWei, receiver, wrappedTokenName, wrappedTokenSymbol]
    )
    const txArr = ethers.utils.arrayify(txHash)
    const txSigned = await this.txSigner.signMessage(txArr)

    return {
      targetChain: targetChain,
      sourceChain: sourceChain,
      token: token,
      amountWei: amountWei,
      amount: ethers.utils.formatEther(amountWei),
      receiver: receiver,
      wrappedTokenName: wrappedTokenName,
      wrappedTokenSymbol: wrappedTokenSymbol,
      txHash: txHash,
      txSigned: txSigned,
      type: txType.MINT
    }
  }

  async prepareReleaseTx (sourceChain, wrappedToken, amountWei, receiver) {
    const wTokens = Store.state.wrappedTokens
    let wToken
    for (let i = 0; i < wTokens.length; i++) {
      if (wrappedToken === wTokens[i].wrappedToken) {
        wToken = wTokens[i]
      }
    }

    const txHash = ethers.utils.solidityKeccak256(
      ['uint16', 'address', 'uint256', 'address'],
      [sourceChain, wToken.token, amountWei, receiver]
    )
    const txArr = ethers.utils.arrayify(txHash)
    const txSigned = await this.txSigner.signMessage(txArr)

    return {
      targetChain: wToken.sourceChain,
      sourceChain: sourceChain,
      token: wToken.token,
      amountWei: amountWei,
      amount: ethers.utils.formatEther(amountWei),
      receiver: receiver,
      txHash: txHash,
      txSigned: txSigned,
      type: txType.RELEASE
    }
  }

  async start () {
    // Rinkeby
    const rinBridge = this.getBridgeContract(this.rinId)

    rinBridge.on('Lock', async (targetChain, token, receiver, amountWei) => {
      const mintTx = await this.prepareMintTx(targetChain, this.rinId, token, amountWei, receiver)
      Store.commit('addClaim', mintTx)
      successToast(`You can claim now ${ethers.utils.formatEther(amountWei)} tokens`)
    })

    rinBridge.on('Mint', (wrappedToken, amountWei, receiver) => {
      successToast(`Claimed ${ethers.utils.formatEther(amountWei)} tokens`)
    })

    rinBridge.on('Burn', async (wrappedToken, amountWei, receiver) => {
      const releaseTx = await this.prepareReleaseTx(this.rinId, wrappedToken, amountWei, receiver)
      Store.commit('addClaim', releaseTx)
      successToast(`You can claim now ${ethers.utils.formatEther(amountWei)} tokens`)
    })

    rinBridge.on('Release', (sourceChain, token, amountWei, receiver) => {
      successToast(`Claimed ${ethers.utils.formatEther(amountWei)} tokens`)
    })

    rinBridge.on('WrappedTokenDeployed', (sourceChain, nativeToken, wrappedToken) => {
      successToast(`New wrapped token: ${wrappedToken}`)
    })

    // Ropsten
    const ropBridge = this.getBridgeContract(this.ropId)

    ropBridge.on('Lock', async (targetChain, token, receiver, amountWei) => {
      const mintTx = await this.prepareMintTx(targetChain, this.ropId, token, amountWei, receiver)
      Store.commit('addClaim', mintTx)
      successToast(`You can claim now ${ethers.utils.formatEther(amountWei)} tokens`)
    })

    ropBridge.on('Mint', (wrappedToken, amountWei, receiver) => {
      successToast(`Claimed ${ethers.utils.formatEther(amountWei)}`)
    })

    ropBridge.on('Burn', async (wrappedToken, amountWei, receiver) => {
      const releaseTx = await this.prepareReleaseTx(this.ropId, wrappedToken, amountWei, receiver)
      Store.commit('addClaim', releaseTx)
      successToast(`You can claim now ${ethers.utils.formatEther(amountWei)} tokens`)
    })

    ropBridge.on('Release', (sourceChain, token, amountWei, receiver) => {
      successToast(`Claimed ${ethers.utils.formatEther(amountWei)}`)
    })

    ropBridge.on('WrappedTokenDeployed', (sourceChain, nativeToken, wrappedToken) => {
      successToast(`New wrapped token: ${wrappedToken}`)
    })
  }
}

export default ValidatorService
