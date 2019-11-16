module.exports = [
  {
    constant: true,
    inputs: [],
    name: "rate",
    outputs: [
      {
        name: "",
        type: "uint256"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "weiRaised",
    outputs: [
      {
        name: "",
        type: "uint256"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "wallet",
    outputs: [
      {
        name: "",
        type: "address"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      {
        name: "recipient",
        type: "address"
      },
      {
        name: "amount",
        type: "uint256"
      },
      {
        name: "nonce",
        type: "uint256"
      },
      {
        name: "v",
        type: "uint8"
      },
      {
        name: "r",
        type: "bytes32"
      },
      {
        name: "s",
        type: "bytes32"
      }
    ],
    name: "claimTokensERC20",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      {
        name: "beneficiary",
        type: "address"
      }
    ],
    name: "buyTokens",
    outputs: [],
    payable: true,
    stateMutability: "payable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "token",
    outputs: [
      {
        name: "",
        type: "address"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    payable: true,
    stateMutability: "payable",
    type: "fallback"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "purchaser",
        type: "address"
      },
      {
        indexed: true,
        name: "beneficiary",
        type: "address"
      },
      {
        indexed: false,
        name: "value",
        type: "uint256"
      },
      {
        indexed: false,
        name: "amount",
        type: "uint256"
      }
    ],
    name: "TokensPurchased",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "token",
        type: "address"
      },
      {
        indexed: true,
        name: "sender",
        type: "address"
      },
      {
        indexed: true,
        name: "recipient",
        type: "address"
      },
      {
        indexed: false,
        name: "amount",
        type: "uint256"
      },
      {
        indexed: false,
        name: "nonce",
        type: "uint256"
      },
      {
        indexed: false,
        name: "iface",
        type: "uint256"
      }
    ],
    name: "Sent",
    type: "event"
  }
];
