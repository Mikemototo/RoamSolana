
import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID,
     createAssociatedTokenAccountInstruction, createMintToCheckedInstruction, createTransferInstruction, getAssociatedTokenAddressSync,
} from '@solana/spl-token';
import { Connection, PublicKey, 
     Keypair, LAMPORTS_PER_SOL,
     TransactionMessage,
     VersionedTransaction,
    } from '@solana/web3.js';


const connection= new Connection("https://api.devnet.solana.com","confirmed");

const privkey1 = 
[95,168,25,23,8,29,184,48,24,224,178,228,249,73,243,66,254,205,99,69,118,
127,28,4,237,252,228,240,83,0,28,210,158,98,151,229,149,244,142,17,58,
193,85,159,194,75,48,136,151,11,112,32,40,95,178,76,250,15,242,142,3,71,163,244]

const payer = Keypair.fromSecretKey(Uint8Array.from(privkey1));

const mint = new PublicKey("J1aKpFUuHHcsuKUr4unpRkT1QMruCWGbLxYVNUk3CmTN");

const  create_ata = async (authority:Keypair,user:PublicKey,amount:number) => {

    const user_ata = getAssociatedTokenAddressSync(mint,user,false,TOKEN_2022_PROGRAM_ID,ASSOCIATED_TOKEN_PROGRAM_ID);

    const account_info = await connection.getAccountInfo(user_ata);

    if (account_info?.owner.toString() != TOKEN_2022_PROGRAM_ID.toString()){

        let create_ata =  createAssociatedTokenAccountInstruction(authority.publicKey,user_ata,user,mint,TOKEN_2022_PROGRAM_ID,ASSOCIATED_TOKEN_PROGRAM_ID);

        const message = new TransactionMessage({
            instructions: [create_ata],
              payerKey: authority.publicKey,
              recentBlockhash : (await connection.getLatestBlockhash()).blockhash
        }).compileToV0Message();
    
        const tx = new VersionedTransaction(message);


        tx.sign([authority]);
        const sig = await connection.sendTransaction(tx);

        const latestBlockHash = await connection.getLatestBlockhash();

        const confirmation = await connection.confirmTransaction({
            blockhash: latestBlockHash.blockhash,
            lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
            signature: sig,
        });

        return confirmation.value;
            
    }    
    
}

const  transfer_tokens = async (authority:Keypair,user:PublicKey,amount:number) => {

    const user_ata = getAssociatedTokenAddressSync(mint,user,false,TOKEN_2022_PROGRAM_ID,ASSOCIATED_TOKEN_PROGRAM_ID);
    const authority_ata = getAssociatedTokenAddressSync(mint,authority.publicKey,false,TOKEN_2022_PROGRAM_ID,ASSOCIATED_TOKEN_PROGRAM_ID);

    
    let transfer_ix =  createTransferInstruction(authority_ata,user_ata,authority.publicKey,amount,[],TOKEN_2022_PROGRAM_ID);

    const message = new TransactionMessage({
        instructions: [transfer_ix],
          payerKey: authority.publicKey,
          recentBlockhash : (await connection.getLatestBlockhash()).blockhash
        }).compileToV0Message();
    
        const tx = new VersionedTransaction(message);


        tx.sign([authority]);
        const sig = await connection.sendTransaction(tx);

        const latestBlockHash = await connection.getLatestBlockhash();

        const confirmation = await connection.confirmTransaction({
            blockhash: latestBlockHash.blockhash,
            lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
            signature: sig,
          });
    
    return confirmation.value;
}

const  mint_tokens = async (authority:Keypair,amount:number) => {

    const authority_ata = getAssociatedTokenAddressSync(mint,authority.publicKey,false,TOKEN_2022_PROGRAM_ID,ASSOCIATED_TOKEN_PROGRAM_ID);

    
    let mint_ix =  createMintToCheckedInstruction(mint,authority_ata,authority.publicKey,amount,9,[],TOKEN_2022_PROGRAM_ID);

    const message = new TransactionMessage({
        instructions: [mint_ix],
          payerKey: authority.publicKey,
          recentBlockhash : (await connection.getLatestBlockhash()).blockhash
        }).compileToV0Message();
    
        const tx = new VersionedTransaction(message);


        tx.sign([authority]);
        const sig = await connection.sendTransaction(tx);

        const latestBlockHash = await connection.getLatestBlockhash();

        const confirmation = await connection.confirmTransaction({
            blockhash: latestBlockHash.blockhash,
            lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
            signature: sig,
          });
    
    return confirmation.value;
}

