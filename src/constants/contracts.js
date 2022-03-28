const contracts = [
  {
    chainId: 4, // Rinkeby
    bridge: '0x1aCB2C028c39747FCb4b047d2DC1E23bB2Fa6EbE'
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
