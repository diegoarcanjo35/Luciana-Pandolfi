import { describe, expect, it } from "vitest";
import { pivotarFunil } from "@/lib/analytics-funil";

describe("pivotarFunil", () => {
  it("agrupa linhas da mesma página em um objeto", () => {
    const resultado = pivotarFunil([
      { pagina: "/plano-familiar", tipo_evento: "page_view", n: 100 },
      { pagina: "/plano-familiar", tipo_evento: "form_submit", n: 12 },
    ]);
    expect(resultado["/plano-familiar"]).toEqual({ page_view: 100, form_submit: 12 });
  });

  it("mantém páginas diferentes separadas", () => {
    const resultado = pivotarFunil([
      { pagina: "/plano-familiar", tipo_evento: "page_view", n: 100 },
      { pagina: "/plano-empresarial", tipo_evento: "page_view", n: 40 },
    ]);
    expect(Object.keys(resultado)).toEqual(["/plano-familiar", "/plano-empresarial"]);
  });

  it("retorna objeto vazio para lista vazia", () => {
    expect(pivotarFunil([])).toEqual({});
  });
});
