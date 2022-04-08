const contracts = [
  {
    chainId: 3, // Ropsten
    bridge: '0x96f44B19fa03f2dE70F11432f1BB3257fF88d3a0'
  },
  {
    chainId: 4, // Rinkeby
    bridge: '0x76cfFf6732CeeeC87Ce30ab64df9cef22d4B8aD1'
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
