import { execSync, spawn } from "child_process";
import * as path from "path";
import * as fs from "fs";
import * as crypto from "crypto";

const CIRCUIT_DIR = path.resolve(__dirname, "../../circuits/document_proof");
const PROOFS_DIR = path.resolve(__dirname, "../../circuits/proofs");

export interface ProofInput {
  docContent: Buffer;          // conteúdo bruto do documento (máx 4KB)
  pubKeyX: Buffer;             // 32 bytes
  pubKeyY: Buffer;             // 32 bytes
  signatureR: Buffer;          // 32 bytes ECDSA r
  signatureS: Buffer;          // 32 bytes ECDSA s
  docHash: Buffer;             // SHA-256 — deve bater com on-chain
  commitment: string;          // campo Pedersen (hex Field)
}

export interface ProofResult {
  proof: string;               // caminho do arquivo de prova
  publicInputs: string;        // public inputs JSON
}

function bufToNoirArray(buf: Buffer): string {
  return `[${Array.from(buf).join(", ")}]`;
}

export async function generateProof(input: ProofInput): Promise<ProofResult> {
  fs.mkdirSync(PROOFS_DIR, { recursive: true });

  // Preenche doc_content com zeros até 4096 bytes
  const padded = Buffer.alloc(4096);
  input.docContent.copy(padded, 0, 0, Math.min(input.docContent.length, 4096));

  const proverToml = `
doc_content = ${bufToNoirArray(padded)}
pub_key_x = ${bufToNoirArray(input.pubKeyX)}
pub_key_y = ${bufToNoirArray(input.pubKeyY)}
signature_r = ${bufToNoirArray(input.signatureR)}
signature_s = ${bufToNoirArray(input.signatureS)}
doc_hash = ${bufToNoirArray(input.docHash)}
commitment = "${input.commitment}"
`.trim();

  const proverPath = path.join(CIRCUIT_DIR, "Prover.toml");
  fs.writeFileSync(proverPath, proverToml);

  // nargo prove
  execSync("nargo prove", { cwd: CIRCUIT_DIR, stdio: "pipe" });

  const proofFile = path.join(CIRCUIT_DIR, "proofs", "document_proof.proof");
  const publicInputsFile = path.join(CIRCUIT_DIR, "proofs", "document_proof.json");

  return {
    proof: proofFile,
    publicInputs: fs.existsSync(publicInputsFile)
      ? fs.readFileSync(publicInputsFile, "utf-8")
      : "{}",
  };
}

export async function verifyProof(): Promise<boolean> {
  try {
    execSync("nargo verify", { cwd: CIRCUIT_DIR, stdio: "pipe" });
    return true;
  } catch {
    return false;
  }
}

// Gera um Pedersen commitment das coordenadas públicas (usado pelo frontend)
export function computeCommitment(pubKeyX: Buffer, pubKeyY: Buffer): string {
  // Aproximação JS do Pedersen — o commitment real é gerado pelo circuito
  // Para o frontend calcular antes de submeter ao backend
  const raw = Buffer.concat([pubKeyX, pubKeyY]);
  return crypto.createHash("sha256").update(raw).digest("hex");
}
