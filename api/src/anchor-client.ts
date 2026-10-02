import * as anchor from "@coral-xyz/anchor";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import * as crypto from "crypto";
import * as fs from "fs";
import * as path from "path";

const IDL_PATH = path.resolve(__dirname, "../../target/idl/cartoriochain.json");
const PROGRAM_ID = new PublicKey(
  process.env.PROGRAM_ID ?? "CCHNxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
);

export function loadKeypair(privateKeyBase58OrPath: string): Keypair {
  if (fs.existsSync(privateKeyBase58OrPath)) {
    const raw = JSON.parse(fs.readFileSync(privateKeyBase58OrPath, "utf-8"));
    return Keypair.fromSecretKey(new Uint8Array(raw));
  }
  const { bs58 } = require("bs58");
  return Keypair.fromSecretKey(bs58.decode(privateKeyBase58OrPath));
}

export function getProvider(keypair: Keypair, rpcUrl?: string): anchor.AnchorProvider {
  const connection = new Connection(
    rpcUrl ?? process.env.SOLANA_RPC ?? "https://api.devnet.solana.com",
    "confirmed"
  );
  const wallet = new anchor.Wallet(keypair);
  return new anchor.AnchorProvider(connection, wallet, { commitment: "confirmed" });
}

export function getProgram(provider: anchor.AnchorProvider) {
  const idl = JSON.parse(fs.readFileSync(IDL_PATH, "utf-8"));
  return new anchor.Program(idl, PROGRAM_ID, provider);
}

export function docIdFromString(id: string): number[] {
  return Array.from(crypto.createHash("sha256").update(id).digest());
}

export function docIdPDA(docId: number[], programId: PublicKey): PublicKey {
  const [pda] = PublicKey.findProgramAddressSync(
    [Buffer.from("document"), Buffer.from(docId)],
    programId
  );
  return pda;
}

export interface RegisterParams {
  docIdSeed: string;
  docHash: Buffer;
  irystxId: string;
  docType: string;
  cartorioId: string;
}

export async function registerDocument(
  params: RegisterParams,
  provider: anchor.AnchorProvider
) {
  const program = getProgram(provider);
  const docId = docIdFromString(params.docIdSeed);
  const pda = docIdPDA(docId, PROGRAM_ID);

  const tx = await program.methods
    .registerDocument(
      docId,
      Array.from(params.docHash),
      params.irystxId,
      params.docType,
      params.cartorioId
    )
    .accounts({ document: pda, authority: provider.wallet.publicKey })
    .rpc();

  return { tx, pda: pda.toBase58(), docId };
}

export async function fetchDocument(docIdSeed: string, provider: anchor.AnchorProvider) {
  const program = getProgram(provider);
  const docId = docIdFromString(docIdSeed);
  const pda = docIdPDA(docId, PROGRAM_ID);
  return program.account.documentRecord.fetch(pda);
}

export async function revokeDocument(
  docIdSeed: string,
  reason: string,
  provider: anchor.AnchorProvider
) {
  const program = getProgram(provider);
  const docId = docIdFromString(docIdSeed);
  const pda = docIdPDA(docId, PROGRAM_ID);

  return program.methods
    .revokeDocument(docId, reason)
    .accounts({ document: pda, authority: provider.wallet.publicKey })
    .rpc();
}
