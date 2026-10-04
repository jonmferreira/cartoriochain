import { Noir } from "@noir-lang/noir_js";
import { Barretenberg, UltraHonkBackend } from "@aztec/bb.js";
import * as fs from "fs";
import * as path from "path";

const CIRCUIT_PATH = path.resolve(
  __dirname,
  "../../circuits/document_proof/target/document_proof.json"
);

let _circuit: Record<string, unknown> | null = null;

function loadCircuit(): Record<string, unknown> {
  if (!_circuit) {
    _circuit = JSON.parse(fs.readFileSync(CIRCUIT_PATH, "utf-8"));
  }
  return _circuit!;
}

export interface ProofInput {
  pubKeyX: Uint8Array;   // 32 bytes secp256k1 X
  pubKeyY: Uint8Array;   // 32 bytes secp256k1 Y
  signature: Uint8Array; // 64 bytes (r || s)
  docHash: Uint8Array;   // 32 bytes SHA-256 do documento
}

export interface ProofResult {
  proof: string;       // hex — armazenado no registro do documento
  commitment: string;  // hex Field — Pedersen hash da chave pública, armazenado on-chain
  publicInputs: string[]; // todos os public inputs (doc_hash fields + commitment)
}

export async function generateProof(input: ProofInput): Promise<ProofResult> {
  const circuit = loadCircuit();
  const api = await Barretenberg.new();
  const backend = new UltraHonkBackend(circuit.bytecode as string, api);
  const noir = new Noir(circuit as any);

  try {
    const inputs = {
      pub_key_x: Array.from(input.pubKeyX),
      pub_key_y: Array.from(input.pubKeyY),
      signature: Array.from(input.signature),
      doc_hash: Array.from(input.docHash),
    };

    // execute gera a witness e retorna o commitment (return value do circuito)
    const { witness, returnValue } = await noir.execute(inputs);
    const { proof, publicInputs } = await backend.generateProof(witness);

    // returnValue é o Field do commitment (output público do circuito)
    const commitment = returnValue as string;
    const proofHex = Buffer.from(proof).toString("hex");

    return { proof: proofHex, commitment, publicInputs };
  } finally {
    await api.destroy();
  }
}

export async function verifyProof(
  proofHex: string,
  publicInputs: string[]
): Promise<boolean> {
  const circuit = loadCircuit();
  const api = await Barretenberg.new();
  const backend = new UltraHonkBackend(circuit.bytecode as string, api);

  try {
    const proof = Uint8Array.from(Buffer.from(proofHex, "hex"));
    return await backend.verifyProof({ proof, publicInputs });
  } catch {
    return false;
  } finally {
    await api.destroy();
  }
}
