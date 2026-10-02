import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Cartoriochain } from "../target/types/cartoriochain";
import { expect } from "chai";
import * as crypto from "crypto";

describe("cartoriochain", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.Cartoriochain as Program<Cartoriochain>;

  const makeDocId = (seed: string): number[] =>
    Array.from(crypto.createHash("sha256").update(seed).digest());

  const makeHash = (content: string): number[] =>
    Array.from(crypto.createHash("sha256").update(content).digest());

  it("registra um documento", async () => {
    const docId = makeDocId("DOC-AM-2026-001");
    const docHash = makeHash("contrato-compra-venda-lote-42.pdf");

    const [pda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("document"), Buffer.from(docId)],
      program.programId
    );

    await program.methods
      .registerDocument(
        docId,
        docHash,
        "irys://placeholder_tx_id_40chars_base58xxx",
        "Escritura",
        "CARTORIO-AM-001"
      )
      .accounts({ document: pda, authority: provider.wallet.publicKey })
      .rpc();

    const record = await program.account.documentRecord.fetch(pda);
    expect(record.revoked).to.equal(false);
    expect(record.docType).to.equal("Escritura");
    expect(record.cartorioId).to.equal("CARTORIO-AM-001");
  });

  it("verifica documento com hash correto", async () => {
    const docId = makeDocId("DOC-AM-2026-001");
    const docHash = makeHash("contrato-compra-venda-lote-42.pdf");

    const [pda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("document"), Buffer.from(docId)],
      program.programId
    );

    const result = await program.methods
      .verifyDocument(docId, docHash)
      .accounts({ document: pda })
      .view();

    expect(result).to.equal(true);
  });

  it("falha ao verificar com hash incorreto", async () => {
    const docId = makeDocId("DOC-AM-2026-001");
    const wrongHash = makeHash("documento-falso.pdf");

    const [pda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("document"), Buffer.from(docId)],
      program.programId
    );

    try {
      await program.methods
        .verifyDocument(docId, wrongHash)
        .accounts({ document: pda })
        .view();
      expect.fail("deveria ter falhado");
    } catch (e: any) {
      expect(e.message).to.include("HashMismatch");
    }
  });

  it("revoga documento", async () => {
    const docId = makeDocId("DOC-AM-2026-001");

    const [pda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("document"), Buffer.from(docId)],
      program.programId
    );

    await program.methods
      .revokeDocument(docId, "Erro de identificação — reemitir com matrícula correta")
      .accounts({ document: pda, authority: provider.wallet.publicKey })
      .rpc();

    const record = await program.account.documentRecord.fetch(pda);
    expect(record.revoked).to.equal(true);
  });

  it("falha ao verificar documento revogado", async () => {
    const docId = makeDocId("DOC-AM-2026-001");
    const docHash = makeHash("contrato-compra-venda-lote-42.pdf");

    const [pda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("document"), Buffer.from(docId)],
      program.programId
    );

    try {
      await program.methods
        .verifyDocument(docId, docHash)
        .accounts({ document: pda })
        .view();
      expect.fail("deveria ter falhado");
    } catch (e: any) {
      expect(e.message).to.include("AlreadyRevoked");
    }
  });
});
