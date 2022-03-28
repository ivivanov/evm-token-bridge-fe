const contracts = [
  {
    chainId: 4, // Rinkeby
    bridge: '0x9cdAa0349427D2702414F4776A600cA0cF6e877e'
  },
  {
    chainId: 31337, // Hardhat localhost
    bridge: '0x5FbDB2315678afecb367f032d93F642f64180aa3'
  }
]

export function getChainContracts (chainId) {
  return contracts.filter(
    (chain) => chain.chainId === chainId
  )[0]
}
