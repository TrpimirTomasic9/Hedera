const { PrivateKey, Client, AccountCreateTransaction } = require("@hashgraph/sdk");

const treasuryAccount = PrivateKey.fromString("302e020100300506032b6570042204203e238bb604b26b2a0458803996d27b8d5742f206bed5b3157cf44e7c43479cda");
const treasuryId = "0.0.3833849"

const treasuryClient = Client.forTestnet();
treasuryClient.setOperator(treasuryId, treasuryAccount);

// This function creates a new Hedera Hashgraph account.
async function createAccount(n) {
    const newAccountPrivateKey = PrivateKey.generateED25519();
    const tx = await new AccountCreateTransaction()
        .setKey(newAccountPrivateKey)
        .setInitialBalance(1500)
        .execute(treasuryClient);

    const accountId = (await tx.getReceipt(treasuryClient)).accountId;
    console.log(`- Acount ${n}`);
    console.log(`Private key: ${newAccountPrivateKey}`);
    console.log(`Account ID: ${accountId}\n`);
}
// This is the main function that creates 5 new accounts.
async function main() {
    for (let i = 1; i <= 5; i++) {
        await createAccount(i);
    }

    process.exit()
}

main();