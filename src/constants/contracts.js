const contracts = [
  {
    chainId: 4, // Rinkeby
    mainEscrow: '0x4633394E4Fd1175273845d7F0d6A5F613309d384',
    tokens: [
      {
        address: '0x2608D52E43B5010e3e6cFA7aB335c01A6c2E114c',
        symbol: 'ACM'
      },
      {
        address: '0x01BE23585060835E02B77ef475b0Cc51aA1e0709',
        symbol: 'LINK'
      }
    ]
  },
  {
    chainId: 31337, // Hardhat localhost
    sideEscrow: '0x039d7496e432c6Aea4c24648a59318b3cbe09942'
  }
]

const getChainContracts = (chainId) => {
  return contracts.filter(
    (chain) => chain.chainId === chainId
  )[0]
}

export default getChainContracts
