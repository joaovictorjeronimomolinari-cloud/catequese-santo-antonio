// Validações compartilhadas para os formulários de cadastro/login.

/** Provedores de e-mail aceitos (finais padrão). */
export const EMAIL_DOMAINS_PERMITIDOS = [
  "gmail.com",
  "googlemail.com",
  "hotmail.com",
  "outlook.com",
  "outlook.com.br",
  "live.com",
  "msn.com",
  "yahoo.com",
  "yahoo.com.br",
  "ymail.com",
  "icloud.com",
  "me.com",
  "uol.com.br",
  "bol.com.br",
  "terra.com.br",
  "ig.com.br",
  "globo.com",
  "proton.me",
  "protonmail.com",
] as const;

const EMAIL_LOCAL_RE = /^[a-zA-Z0-9._%+-]+$/;

export function isValidEmail(email: string): boolean {
  const v = email.trim().toLowerCase();
  const at = v.indexOf("@");
  if (at < 1 || at !== v.lastIndexOf("@")) return false;
  const local = v.slice(0, at);
  const domain = v.slice(at + 1);
  if (!EMAIL_LOCAL_RE.test(local)) return false;
  return (EMAIL_DOMAINS_PERMITIDOS as readonly string[]).includes(domain);
}

/** DDDs válidos no Brasil. */
const DDD_VALIDOS = new Set([
  11, 12, 13, 14, 15, 16, 17, 18, 19,
  21, 22, 24, 27, 28,
  31, 32, 33, 34, 35, 37, 38,
  41, 42, 43, 44, 45, 46, 47, 48, 49,
  51, 53, 54, 55,
  61, 62, 63, 64, 65, 66, 67, 68, 69,
  71, 73, 74, 75, 77, 79,
  81, 82, 83, 84, 85, 86, 87, 88, 89,
  91, 92, 93, 94, 95, 96, 97, 98, 99,
]);

export function apenasDigitos(v: string): string {
  return v.replace(/\D+/g, "");
}

/**
 * Aceita telefone brasileiro com DDD: 10 dígitos (fixo) ou 11 dígitos (móvel
 * começando por 9 depois do DDD).
 */
export function isValidBrPhone(tel: string): boolean {
  const d = apenasDigitos(tel);
  if (d.length !== 10 && d.length !== 11) return false;
  const ddd = Number(d.slice(0, 2));
  if (!DDD_VALIDOS.has(ddd)) return false;
  if (d.length === 11 && d[2] !== "9") return false;
  // Fixo não começa com 0/1
  if (d.length === 10 && (d[2] === "0" || d[2] === "1")) return false;
  return true;
}

/** Máscara amigável: (XX) 9 XXXX-XXXX ou (XX) XXXX-XXXX. */
export function formatBrPhone(tel: string): string {
  const d = apenasDigitos(tel).slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10)
    return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 3)} ${d.slice(3, 7)}-${d.slice(7)}`;
}

/** YYYY-MM-DD de hoje. */
export function hojeISO(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

/** Data ISO (YYYY-MM-DD) exatamente N anos atrás a partir de hoje. */
export function anosAtrasISO(anos: number): string {
  const d = new Date();
  d.setFullYear(d.getFullYear() - anos);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

/** Idade em anos completos a partir de YYYY-MM-DD. */
export function idadeEmAnos(nascimentoISO: string): number {
  if (!nascimentoISO) return NaN;
  const [y, m, d] = nascimentoISO.split("-").map(Number);
  if (!y || !m || !d) return NaN;
  const hoje = new Date();
  let idade = hoje.getFullYear() - y;
  const antesAniv =
    hoje.getMonth() + 1 < m ||
    (hoje.getMonth() + 1 === m && hoje.getDate() < d);
  if (antesAniv) idade--;
  return idade;
}

/** Aluno: nascimento válido = até no máximo 18 anos atrás, e não no futuro. */
export function isNascimentoAluno(nascimentoISO: string): boolean {
  if (!nascimentoISO) return false;
  const idade = idadeEmAnos(nascimentoISO);
  if (Number.isNaN(idade)) return false;
  return idade >= 0 && idade < 18;
}

/** Catequista: precisa ser maior de idade (>= 18 anos). */
export function isNascimentoAdulto(nascimentoISO: string): boolean {
  if (!nascimentoISO) return false;
  const idade = idadeEmAnos(nascimentoISO);
  if (Number.isNaN(idade)) return false;
  return idade >= 18 && idade <= 120;
}
