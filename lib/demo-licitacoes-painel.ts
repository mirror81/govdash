export type LicitacaoPainel = {
  id: string;
  processo: string;
  objeto: string;
  modalidade: string;
  valorEstimado: number;
  orgao: string;
  dataAbertura: string;
  dataLimitePropostas: string;
  portal: string;
};

/** Dados fictícios para demonstração — licitações em aberto (painel TV). */
export const LICITACOES_PAINEL: LicitacaoPainel[] = [
  {
    id: "1",
    processo: "PE 014/2026",
    objeto:
      "Aquisição de medicamentos de alta complexidade para rede municipal de saúde",
    modalidade: "Pregão eletrônico",
    valorEstimado: 2_850_000,
    orgao: "Secretaria Municipal de Saúde",
    dataAbertura: "28/04/2026",
    dataLimitePropostas: "16/05/2026 — 10h",
    portal: "Compras.gov.br — sessão pública nº 89241",
  },
  {
    id: "2",
    processo: "CO 2026/033",
    objeto:
      "Contratação de empresa para manutenção preventiva e corretiva de frota pesada",
    modalidade: "Concorrência",
    valorEstimado: 4_200_000,
    orgao: "Secretaria Municipal de Obras e Serviços Urbanos",
    dataAbertura: "05/05/2026",
    dataLimitePropostas: "30/05/2026 — 14h",
    portal: "Portal de Compras do Município + PNCP",
  },
  {
    id: "3",
    processo: "PE 008/2026",
    objeto:
      "Fornecimento de gêneros alimentícios para merenda escolar (lotes regionais)",
    modalidade: "Pregão eletrônico",
    valorEstimado: 1_120_000,
    orgao: "Secretaria Municipal de Educação",
    dataAbertura: "12/04/2026",
    dataLimitePropostas: "12/05/2026 — 9h",
    portal: "Compras.gov.br",
  },
  {
    id: "4",
    processo: "CP 11/2026",
    objeto:
      "Aquisição de mobiliário e equipamentos para CMEI e unidades de educação infantil",
    modalidade: "Concorrência",
    valorEstimado: 680_000,
    orgao: "Secretaria Municipal de Educação",
    dataAbertura: "20/04/2026",
    dataLimitePropostas: "22/05/2026 — 11h",
    portal: "Portal de Compras do Município",
  },
  {
    id: "5",
    processo: "PE 021/2026",
    objeto:
      "Registro de preços para aquisição de material de expedição e limpeza predial",
    modalidade: "Pregão eletrônico",
    valorEstimado: 420_000,
    orgao: "Secretaria Municipal de Administração",
    dataAbertura: "01/05/2026",
    dataLimitePropostas: "19/05/2026 — 10h30",
    portal: "Compras.gov.br",
  },
  {
    id: "6",
    processo: "CO 2026/019",
    objeto:
      "Ampliação da rede de esgotamento sanitário — contratação integrada de projeto e obra",
    modalidade: "Concorrência",
    valorEstimado: 18_500_000,
    orgao: "Secretaria Municipal de Saneamento e Meio Ambiente",
    dataAbertura: "15/04/2026",
    dataLimitePropostas: "05/06/2026 — 15h",
    portal: "Portal de Compras do Município + TCU — fiscalização ampliada",
  },
  {
    id: "7",
    processo: "PE 017/2026",
    objeto:
      "Locação de software de gestão tributária integrada (cadastro e arrecadação)",
    modalidade: "Pregão eletrônico",
    valorEstimado: 950_000,
    orgao: "Secretaria Municipal da Fazenda",
    dataAbertura: "25/04/2026",
    dataLimitePropostas: "20/05/2026 — 8h",
    portal: "Compras.gov.br",
  },
];
