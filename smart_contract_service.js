const {
    Client,
    Hbar,
    ContractCreateFlow,
    ContractExecuteTransaction,
    ContractFunctionParameters,
  } = require("@hashgraph/sdk");
  require('dotenv').config();
  
  const account1 = process.env.MY_PRIVATE_KEY
  const account1Id = process.env.MY_ACCOUNT_ID
  
  const client = Client.forTestnet();
  client.setOperator(account1Id, account1);
  client.setDefaultMaxTransactionFee(new Hbar(100));
  
  const contractJson = require("./CertificationC1.json");
  
  // Deploys a new smart contract on the Hedera network using the provided bytecode.
  async function deployContract() {
    const contractTransaction = await new ContractCreateFlow()
        .setBytecode(contractJson.bytecode)
        .setGas(100_000)
        .execute(client);
  
    const contractId = (await contractTransaction.getReceipt(client)).contractId;
    return contractId
  }
   // Executes the "function1" of the deployed smart contract with input parameters and returns the last element of the result bytes.
  async function interactWithContractFunction1(contractId) {
    const transaction = await new ContractExecuteTransaction()
        .setContractId(contractId)
        .setGas(100_000)
        .setFunction("function1", new ContractFunctionParameters().addUint16(4).addUint16(3))
        .execute(client);
    
    let record = await transaction.getRecord(client);
  
    return Buffer.from((record).contractFunctionResult.bytes).toJSON().data.at(-1)
  }
  // Executes the "function2" of the deployed smart contract with an input parameter n and returns the last element of the result bytes.
  async function interactWithContractFunction2(contractId, n) {
    const transaction = await new ContractExecuteTransaction()
        .setContractId(contractId)
        .setGas(100_000)
        .setFunction("function2", new ContractFunctionParameters().addUint16(n))
        .execute(client);
  
    return Buffer.from((await transaction.getRecord(client)).contractFunctionResult.bytes).toJSON().data.at(-1)
  }
  // Main function that deploys the contract, interacts with both functions of the deployed contract, logs the result from the second function, and then exits the process.
  async function main() {
    let contractId = await deployContract();
    let result1 = await interactWithContractFunction1(contractId);
    let result2 = await interactWithContractFunction2(contractId, result1);
    console.log(result2)
  
    process.exit()
  }
  
  main()