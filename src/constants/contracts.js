const contracts = [
  {
    chainId: 4, // Rinkeby
    mainEscrow: '0x89fEf3938A07b1246a479dBaD5dfb5B372E46e3b',
    sideEscrow: '',
    tokens: [
      {
        address: '',
        symbol: 'ETH'
      },
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
    mainEscrow: '',
    sideEscrow: '0x68B1D87F95878fE05B998F19b66F4baba5De1aed',
    tokens: [] // on side chains supported tokens are fetched from the contract
  }
]

// rinkeby
// AcmeToken deployed to: 0xDbc47BF5c14E74374037B7e8f09Fb375F0498ACA
// MainEscrow deployed to: 0x89fEf3938A07b1246a479dBaD5dfb5B372E46e3b
// SideEscrow deployed to: 0xe11DACAcEf8b57Ac1d99c3956E07Ab2785b46c36

const getChainContracts = (chainId) => {
  return contracts.filter(
    (chain) => chain.chainId === chainId
  )[0]
}

export default getChainContracts
