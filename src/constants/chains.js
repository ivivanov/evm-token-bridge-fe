export const supportedChains = [
  {
    name: 'Localhost',
    short_name: 'loc',
    chain: 'ETH',
    network: 'local',
    chain_id: 31337,
    network_id: -1,
    rpc_url: 'http://localhost:8545',
    native_currency: {
      symbol: 'ETH',
      name: 'Ethereum',
      decimals: '18',
      contractAddress: '',
      balance: ''
    }
  },
  {
    name: 'Ethereum Mainnet',
    short_name: 'eth',
    chain: 'ETH',
    network: 'mainnet',
    chain_id: 1,
    network_id: 1,
    rpc_url: 'https://mainnet.infura.io/v3/%API_KEY%',
    native_currency: {
      symbol: 'ETH',
      name: 'Ethereum',
      decimals: '18',
      contractAddress: '',
      balance: ''
    },
    explorer: 'https://etherscan.io/'
  },
  {
    name: 'Ethereum Ropsten',
    short_name: 'rop',
    chain: 'ETH',
    network: 'ropsten',
    chain_id: 3,
    network_id: 3,
    rpc_url: 'https://eth-ropsten.alchemyapi.io/v2/%API_KEY%',
    native_currency: {
      symbol: 'ETH',
      name: 'Ethereum',
      decimals: '18',
      contractAddress: '',
      balance: ''
    },
    explorer: 'https://ropsten.etherscan.io/'
  },
  {
    name: 'Ethereum Rinkeby',
    short_name: 'rin',
    chain: 'ETH',
    network: 'rinkeby',
    chain_id: 4,
    network_id: 4,
    rpc_url: 'https://eth-rinkeby.alchemyapi.io/v2/%API_KEY%',
    native_currency: {
      symbol: 'ETH',
      name: 'Ethereum',
      decimals: '18',
      contractAddress: '',
      balance: ''
    },
    explorer: 'https://rinkeby.etherscan.io/'
  },
  {
    name: 'Binance Smart Chain',
    short_name: 'bsc',
    chain: 'smartchain',
    network: 'mainnet',
    chain_id: 56,
    network_id: 56,
    rpc_url: 'https://bsc-dataseed1.defibit.io/',
    native_currency: {
      symbol: 'BNB',
      name: 'BNB',
      decimals: '18',
      contractAddress: '',
      balance: ''
    }
  },
  {
    name: 'Smart Chain - Testnet',
    short_name: 'test-bsc',
    chain: 'smartchain',
    network: 'smartchain',
    chain_id: 97,
    network_id: 97,
    rpc_url: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
    native_currency: {
      symbol: 'BNB',
      name: 'BNB',
      decimals: '18',
      contractAddress: '',
      balance: ''
    }
  }
]

export function getChainData (chainId) {
  let chainData = supportedChains.filter(
    (chain) => chain.chain_id === chainId
  )[0]

  if (!chainData) {
    chainData = supportedChains[0]
  }

  const API_KEY = process.env.VUE_APP_ALCHEMY_ID

  if (
    chainData.rpc_url.includes('alchemyapi.io') &&
    chainData.rpc_url.includes('%API_KEY%') &&
    API_KEY
  ) {
    const rpcUrl = chainData.rpc_url.replace('%API_KEY%', API_KEY)

    return {
      ...chainData,
      rpc_url: rpcUrl
    }
  }

  return chainData
}
