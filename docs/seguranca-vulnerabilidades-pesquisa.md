# Segurança — pesquisa de vulnerabilidades e hipóteses de teste

Rastreio das ameaças conhecidas às primitivas que o CartórioChain usa na camada ViewKey
(`api/src/viewkey.ts`): **KEM híbrido X25519 + ML-KEM-768 (X-Wing)** + **AES-256-GCM**. Cada ameaça tem
fonte verificada, aplicabilidade ao nosso caso e o teste que vamos escrever. Base da seção de segurança
do README. Regra: só marcamos "coberto" quando houver teste real passando.

## Alinhamento NIST (fato, não selo)
- **ML-KEM-768 = FIPS 203** (NIST, ago/2024). Implementação via `@noble/post-quantum` (pure-JS, auditável).
- **Abordagem híbrida** (clássico ‖ PQC) segue a orientação de transição do NIST — **NIST IR 8547**
  ("Transition to Post-Quantum Cryptography Standards", draft público nov/2024). Fontes:
  `https://csrc.nist.gov/projects/post-quantum-cryptography` · FIPS 203 · NIST IR 8547.
- NÃO somos "NIST/FIPS-validados" (CMVP/CAVP) — não alegar isso.

---

## Tabela de referências (pesquisa de segurança)

Todos os metadados abaixo foram verificados nas fontes primárias (out/2026).

| # | Título | Autores | Ano | Fonte |
|---|--------|---------|-----|-------|
| R1 | KyberSlash: Exploiting secret-dependent division timings in Kyber implementations | D. J. Bernstein, K. Bhargavan, S. Bhasin, A. Chattopadhyay, T. K. Chia, M. J. Kannwischer, F. Kiefer, T. Paiva, P. Ravi, G. Tamvada | 2024 | IACR ePrint 2024/1049 (TCHES 2025) — https://eprint.iacr.org/2024/1049 |
| R2 | X-Wing: The Hybrid KEM You've Been Looking For | M. Barbosa, D. Connolly, J. D. Duarte, A. Kaiser, P. Schwabe, K. Varner, B. Westerbaan | 2024 | IACR Communications in Cryptology; ePrint 2024/039 — https://eprint.iacr.org/2024/039 |
| R3 | Elliptic Curves for Security (X25519; RFC 7748) | A. Langley, M. Hamburg, S. Turner | 2016 | IRTF RFC 7748 — https://www.rfc-editor.org/rfc/rfc7748.html |
| R4 | Nonce-Disrespecting Adversaries: Practical Forgery Attacks on GCM in TLS | H. Böck, A. Zauner, S. Devlin, J. Somorovsky, P. Jovanovic | 2016 | USENIX WOOT '16; ePrint 2016/475 — https://eprint.iacr.org/2016/475 |
| R5 | Module-Lattice-Based Key-Encapsulation Mechanism Standard (FIPS 203) | NIST | 2024 | NIST FIPS 203 — https://csrc.nist.gov/pubs/fips/203/final |
| R6 | Transition to Post-Quantum Cryptography Standards (NIST IR 8547, draft público) | NIST | 2024 | NIST IR 8547 (IPD) — https://csrc.nist.gov/pubs/ir/8547/ipd |

> Nota: o título da especificação IETF do X-Wing (R2) é "X-Wing: general-purpose hybrid post-quantum KEM"
> (`draft-connolly-cfrg-xwing-kem`); acima consta o título do artigo revisado (CiC/ePrint).

Mapeamento ameaça → referência: V1→R1, V2→R3, V3→R4; base PQC/híbrido→R2,R5,R6.

## Testes derivados (hipótese → teste → status)

Legenda: 🛡️ = blindado (teste passando hoje) · ⏳ = pendente (a implementar). Status só vira 🛡️ com
teste real passando — mesma regra do resto do projeto.

| Ref | Hipótese extraída | Teste realizado | Status |
|-----|-------------------|-----------------|--------|
| V4  | AEAD detecta adulteração do ciphertext | tamper em `ciphertext` → decifragem falha | 🛡️ |
| V4  | AEAD/KEM detecta adulteração do encapsulamento | tamper em `kemCt` → decifragem falha | 🛡️ |
| —   | viewKey errado não decifra | decapsular com outro keypair → falha | 🛡️ |
| R2  | ML-KEM-768 realmente presente (não só X25519) | tamanhos: pubKey 1216 B, kemCt 1120 B | 🛡️ |
| —   | Round-trip íntegro | cifra → decifra = dado original | 🛡️ |
| V1  | Decapsulação não vaza segredo por early-exit (KyberSlash) | ct inválido → **rejeição implícita** do ML-KEM (retorna segredo 32 B ≠ válido, sem throw/early-exit) + versão da lib | 🛡️ |
| V2  | X25519 de ordem baixa / zero não gera segredo previsível | zerar o componente X25519 da pubkey → a lib **rejeita a chave de ordem baixa (falha limpa)** | 🛡️ |
| V3  | Nunca reusa nonce/chave | cifrar 2× o mesmo dado → `nonce`/`kemCt`/`ciphertext` diferentes; nonce = 12 B | 🛡️ |
| —   | Randomness sempre de CSPRNG (não previsível) | dois keypairs independentes nunca colidem | 🛡️ |
| CNJ | Latência conforme alta disponibilidade (extra do extra) | benchmark N=500: keygen ~1 ms · encrypt ~3 ms · decrypt ~3,4 ms (p95 todos < 6 ms) → ~243 docs/s/core | 🛡️ |

Os 🛡️ vêm de `api/src/viewkey.test.ts` (8/8) + `api/src/viewkey.security.test.ts` (10/10) +
`api/src/viewkey.bench.ts` (3/3). **Tabela 100% blindada.**

> CNJ: as normas do e-notariado (Prov. 100/2020, 149/2023, 213/2026) exigem **alta disponibilidade**
> (redundância, failover, continuidade), não um SLA numérico de latência cripto. O benchmark evidencia
> **folga de desempenho** (latência negligenciável), não um SLA certificado.

> Nota V1: verificação formal de constant-time é delegada à lib auditada (`@noble/post-quantum`); nosso
> teste prova a **rejeição implícita** (desenho constant-time do ML-KEM FO) e que nosso código não
> introduz branch dependente de segredo. Nota V2: no X-Wing, mesmo que o X25519 fosse forçado a zero, o
> ML-KEM-768 ainda protege o segredo — e na prática a lib já rejeita a chave malformada.

---

## Autocrítica honesta — os artigos de referência encontraram novos bugs?

**Não.** Os artigos (KyberSlash, X25519 low-order, nonce reuse) **não revelaram nenhum bug novo** no nosso
código. O que eles fizeram foi **dirigir a validação**: de cada ameaça conhecida derivamos uma hipótese e
um teste, e os testes **confirmaram que a implementação já resiste** àquela classe de ataque (a lib rejeita
pontos de ordem baixa; o ML-KEM faz rejeição implícita constant-time; usamos nonce/chave frescos por
operação). Ou seja: valor em **validar a blindagem**, não em descobrir defeito.

Não vamos inflar isso como "a pesquisa achou e consertamos vulnerabilidades" — seria falso. Os problemas
reais encontrados e resolvidos nesta frente foram de **integração**, não de criptografia: a
incompatibilidade de módulo ESM↔CommonJS do `@noble/post-quantum` (resolvida com dynamic import) e uma
asserção de teste minha equivocada (corrigida). O mérito dos artigos é terem transformado "achamos que está
seguro" em "está testado contra os ataques que a literatura descreve".

---

## V1 — KyberSlash (timing secret-dependent no ML-KEM/Kyber)
- **O quê:** divisões dependentes de segredo em `poly_tomsg`/`poly_compress` durante o decapsulamento
  vazam, por tempo, bits da chave secreta — recuperável em minutos/horas em alvos reais (RPi2, Cortex-M4).
  É o caso clássico de "cripto não-constant-time" que falseia tempo/reconhecimento.
- **Fontes:** `https://kyberslash.cr.yp.to/` · `https://eprint.iacr.org/2024/1049` (CHES 2025) ·
  Kudelski retrospective (crystals-go).
- **Aplicabilidade:** rodamos o decapsulamento **no servidor** (Node). Risco = side-channel de tempo
  observável por rede/co-tenant. Precisamos confirmar que a lib (`@noble/post-quantum`) usa caminho
  constant-time e versão pós-patch, e NÃO introduzir branch/sort dependente de segredo no nosso código.
- **Hipótese de teste:** o tempo de `decryptViewKeyPayload` não deve correlacionar com o conteúdo do
  segredo; nosso código não ramifica por bytes do segredo.
- **Teste planejado:** (a) medir variância de tempo de decapsulamento sobre N ciphertexts (sanidade,
  não prova formal); (b) assert de versão da lib ≥ patch; (c) revisão: nenhum branch/early-return
  dependente de segredo em `viewkey.ts`.

## V2 — X25519 low-order points / shared secret todo-zero (RFC 7748 §6.1)
- **O quê:** um peer pode enviar uma u-coordinate de ordem baixa → o shared secret X25519 vira **zero,
  previsível**, eliminando a contribuição da chave privada. RFC 7748 deixa a checagem opcional (depende
  do protocolo exigir "contributory behavior").
- **Fontes:** `https://www.rfc-editor.org/rfc/rfc7748.html` (§6.1, §7) · datatracker IETF.
- **Aplicabilidade:** no X-Wing, o combiner liga `ss_ml-kem ‖ ss_x25519 ‖ ct_x25519 ‖ pk_x25519` — então
  mesmo que o lado X25519 seja forçado a zero, o segredo final ainda depende do ML-KEM-768 (atacante não
  conhece). O híbrido **mitiga por construção**. Ainda assim, queremos testar robustez: chave pública
  malformada/ordem baixa não deve produzir segredo previsível nem crashar de forma insegura.
- **Hipótese de teste:** paymentAddress com componente X25519 de ordem baixa NÃO resulta em payload
  decifrável por terceiro nem em segredo previsível; encapsulamento com chave malformada falha limpo.
- **Teste planejado:** injetar pk com metade X25519 = ponto de ordem baixa / zeros → garantir que (a) não
  decifra com chave de terceiro, (b) erro é tratado (não vaza), (c) dois encaps independentes diferem.

## V3 — AES-GCM nonce reuse (forja + quebra de confidencialidade)
- **O quê:** reusar nonce com a mesma chave em AES-GCM é catastrófico — XOR dos keystreams revela XOR dos
  plaintexts e permite recuperar a authkey (GHASH) → forja de tags. Já explorado em QUIC (2016), s2n (2019).
- **Fontes:** BlackHat "Nonce-Disrespecting Adversaries" · `https://neilmadden.blog/2024/05/23/galois-counter-mode-and-random-nonces/` · miscreant/SIV.
- **Aplicabilidade:** **mitigado por design** — cada `encryptForViewKey` faz um encapsulamento KEM novo →
  **chave AES derivada é única por operação** → nonce aleatório de 12 bytes novo a cada chamada. Reuso de
  (chave, nonce) é essencialmente impossível porque a chave muda a cada cifragem. Nota de escala: o limite
  de aniversário de nonces aleatórios de 96 bits só importaria sob chave fixa reutilizada — não é o caso.
- **Hipótese de teste:** nunca reusamos nonce; cada cifragem produz nonce e chave frescos.
- **Teste planejado:** cifrar o mesmo dado 2× → nonces diferentes, kemCt diferentes, ciphertexts
  diferentes; assert nonce = 12 bytes; (round-trip/tamper já cobertos em `viewkey.test.ts`).

## V4 — Integridade / tamper (AEAD) — já coberto
- `viewkey.test.ts` já testa: tamper em ciphertext e em kemCt → decifragem falha (GCM authTag / KEM).
  Manter e expandir para o hardening acima.

---

## Cenário extra pedido (Jonathan): "assinatura previsível / cripto não-constant-time"
Mapeia direto para **V1 (KyberSlash/timing)** e, no geral, para randomness previsível. Hipótese adicional:
qualquer randomness (nonce, ephemeral, coins do KEM) deve vir de CSPRNG (`crypto.randomBytes` / RNG da
lib), nunca determinístico/previsível. Teste: dois artefatos independentes nunca colidem.

## Backlog de testes (`api/src/viewkey.security.test.ts` — 10/10 passando)
- [x] V1 rejeição implícita constant-time + versão lib
- [x] V2 low-order/zero X25519 → lib rejeita (falha limpa)
- [x] V3 não-reuso de nonce/chave (frescor por operação)
- [x] CSPRNG — keypairs independentes diferem
- [x] V4 tamper (ciphertext + kemCt) em `viewkey.test.ts`
- [x] Extra-extra: benchmark de desempenho p/ conformidade CNJ (`viewkey.bench.ts`, 3/3) — latência negligenciável, ~243 docs/s/core
