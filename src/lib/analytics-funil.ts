// Pivota o resultado bruto da consulta de funil (uma linha por página x tipo_evento)
// num objeto por página, pronto pra tabela do painel. Lógica pura, sem I/O — testável
// sem D1, seguindo o mesmo padrão de session-logic.ts.

export interface FunilRowLike {
  pagina: string;
  tipo_evento: string;
  n: number;
}

export type FunilPivotado = Record<string, Record<string, number>>;

export function pivotarFunil(rows: FunilRowLike[]): FunilPivotado {
  const resultado: FunilPivotado = {};
  for (const row of rows) {
    if (!resultado[row.pagina]) resultado[row.pagina] = {};
    resultado[row.pagina][row.tipo_evento] = row.n;
  }
  return resultado;
}
