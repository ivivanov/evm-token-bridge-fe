import { ethers } from 'ethers'
import { getChainContracts } from '../constants/contracts.js'
import { getChainData } from '@/constants/chains'
import { successToast } from '../helpers/toast.js'

import Bridge from '../constants/abis/Bridge.json'
import Store from '../store.js'
import BridgeService from './bridge.js'

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

  async start () {
    // const claimTx = {
    //   targetChain: 4,
    //   sourceChain: 3,
    //   nativeToken: ,
    //   amount: amount,
    //   receiver: receiver,
    //   txHash: txHash,
    //   txSigned: txSigned,
    //   type: 'release'
    // }

    // Store.commit('addClaim', claimTx)

    // Rinkeby
    const rinBridge = this.getBridgeContract(this.rinId)
    rinBridge.on('Lock', (targetChain, token, receiver, amount) => {
      console.log('Lock: ', targetChain, token, receiver, amount)
      const txHash = ethers.utils.solidityKeccak256(['uint16', 'address', 'uint256', 'address'], [this.rinId, token, amount, receiver])
      const txArr = ethers.utils.arrayify(txHash)
      const txSigned = this.txSigner.signMessage(txArr)

      const claimTx = {
        sourceChain: this.rinId,
        targetChain: targetChain,
        nativeToken: token,
        amount: amount,
        receiver: receiver,
        txHash: txHash,
        txSigned: txSigned,
        type: 'mint'
      }

      Store.commit('addClaim', claimTx)
    })

    rinBridge.on('Release', (sourceChain, token, amount, receiver) => {
      successToast(`Claimed ${ethers.utils.parseEther(amount)}`)
      console.log('Release on rinkeby')
    })

    // Ropsten
    const ropBridge = this.getBridgeContract(this.ropId)

    ropBridge.on('Burn', async (wrappedToken, amount, receiver) => {
      console.log('Burn: ', wrappedToken, amount, receiver)

      const token = await BridgeService.getWrappedToken(wrappedToken)
      const txHash = ethers.utils.solidityKeccak256(['uint16', 'address', 'uint256', 'address'], [this.ropId, token.nativeToken, amount, receiver])
      const txArr = ethers.utils.arrayify(txHash)
      const txSigned = this.txSigner.signMessage(txArr)

      const claimTx = {
        targetChain: token.nativeChain,
        sourceChain: this.ropId,
        nativeToken: token.nativeToken,
        amount: amount,
        receiver: receiver,
        txHash: txHash,
        txSigned: txSigned,
        type: 'release'
      }

      Store.commit('addClaim', claimTx)
    })

    ropBridge.on('Mint', (wrappedToken, amount, receiver) => {
      successToast(`Claimed ${ethers.utils.parseEther(amount)}`)
      console.log('Mint on ropsten')
    })

    ropBridge.on('WrappedTokenDeployed', (sourceChain, nativeToken, wrappedToken) => {
      successToast(`New wrapped token: ${wrappedToken}`)
      console.log('WrappedTokenDeployed on ropsten')
    })
  }
}

export default ValidatorService
