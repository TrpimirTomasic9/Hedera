const {
    Client,
    PrivateKey,
    Hbar,
    Transaction,
    TransferTransaction,
    ScheduleCreateTransaction
  } = require("@hashgraph/sdk")
 require('dotenv').config()
  
// Initializes two accounts, creates a transfer transaction, schedules the transaction, serializes it, deserializes it, signs the deserialized transaction, and executes the transaction.
async function main (){
    console.log('\nStart Task 4\n');
  
    const account1 = {
        id: process.env.ACCOUNT_ID_1,
        privateKey: process.env.PRIVATE_KEY_1
    }
    const account2 = {
        id: process.env.ACCOUNT_ID_2,
        privateKey: process.env.PRIVATE_KEY_2
    }
  
    console.log('Debug: account1', account1.id, account1.privateKey);
  
    const client = Client.forName('testnet');
    client.setOperator(account1.id, PrivateKey.fromString(account1.privateKey));
  
    const tx = new TransferTransaction()
      .addHbarTransfer(account1.id, new Hbar(-10)) 
      .addHbarTransfer(account2.id, new Hbar(10))
  
    console.log('Debug: TX created!');
  
    const scheduledTransaction = new ScheduleCreateTransaction()
      .setScheduledTransaction(tx)
      .setScheduleMemo("Scheduled tx")
      .setAdminKey(PrivateKey.fromString(account1.privateKey))
      .freezeWith(client);
  
    console.log('Debug: Schedule created for TX!');
  
    const serializedTx = Buffer.from(scheduledTransaction.toBytes()).toString('hex');
  
    console.log(`Serialized TX: ${serializedTx}`);
  
    const deserializedTx = Transaction.fromBytes(Buffer.from(serializedTx, 'hex'));
  
    deserializedTx.sign(PrivateKey.fromString(account1.privateKey));
  
    const executed = await deserializedTx.execute(client);
  
  }

  main()