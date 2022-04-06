const contracts = [
  {
    chainId: 3, // Ropsten
    bridge: '0x1aCB2C028c39747FCb4b047d2DC1E23bB2Fa6EbE'
  },
  {
    chainId: 4, // Rinkeby
    bridge: '0x9156bc4c585b0FF37DF0fD59e2C02958b807f5F4'
  },
  {
    chainId: 42, // Kovan
    bridge: '0x46813d84CAb0AB86dBb9CEB8622bC962aEc77914'
  },
  {
    chainId: 31337, // Hardhat localhost
    bridge: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'
  }
]

export function getChainContracts (chainId) {
  return contracts.filter(
    (chain) => chain.chainId === chainId
  )[0]
}
