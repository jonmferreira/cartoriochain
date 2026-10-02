import Irys from "@irys/sdk";
import * as crypto from "crypto";
import * as fs from "fs";

const IRYS_URL = process.env.IRYS_URL ?? "https://node2.irys.xyz";
const SOLANA_RPC = process.env.SOLANA_RPC ?? "https://api.devnet.solana.com";

export async function getIrys(privateKey: string): Promise<Irys> {
  const irys = new Irys({
    url: IRYS_URL,
    token: "solana",
    key: privateKey,
    config: { providerUrl: SOLANA_RPC },
  });
  await irys.ready();
  return irys;
}

export interface UploadResult {
  txId: string;
  docHash: Buffer;
  size: number;
}

export async function uploadDocument(
  filePathOrBuffer: string | Buffer,
  metadata: {
    docType: string;
    cartorioId: string;
    fileName?: string;
  },
  privateKey: string
): Promise<UploadResult> {
  const data =
    typeof filePathOrBuffer === "string"
      ? fs.readFileSync(filePathOrBuffer)
      : filePathOrBuffer;

  const docHash = crypto.createHash("sha256").update(data).digest();

  const irys = await getIrys(privateKey);

  const tags = [
    { name: "Content-Type", value: "application/octet-stream" },
    { name: "App-Name", value: "CartorioChain" },
    { name: "Doc-Type", value: metadata.docType },
    { name: "Cartorio-Id", value: metadata.cartorioId },
    { name: "Doc-Hash", value: docHash.toString("hex") },
    ...(metadata.fileName
      ? [{ name: "File-Name", value: metadata.fileName }]
      : []),
  ];

  const receipt = await irys.upload(data, { tags });

  return {
    txId: receipt.id,
    docHash,
    size: data.length,
  };
}

export function irysGatewayUrl(txId: string): string {
  return `https://gateway.irys.xyz/${txId}`;
}
