// Dados baseados nos arquivos de referência (Palotina / Santa Isabel do Ivaí — LOA 2025)

// ── Receitas ──────────────────────────────────────────────────────────────────
export const receitaTotalLOA = 57_148_402.36;
export const receitaCorrenteLOA = 56_932_937.36;
export const receitaCapitalLOA = 215_465.0;

// Origem
export const receitasProprias = 7_041_213.22; // 12.3%
export const transferFederais = 31_472_750.76; // 55.1%
export const transferEstaduais = 13_583_408.0; // 23.8%
export const outrasReceitas = 4_835_565.38; //  8.5%

// Tributárias Próprias
export const iptu = 3_050_000.0; // +33.89% vs 2024
export const issqn = 870_249.0;
export const itbi = 700_746.0; // +5%
export const irrf = 1_060_773.0; // +90.02%
export const taxas = 809_151.22;
export const contribs = 550_294.0;

// Transferências Federais
export const fpm = 16_814_431.0; // +11.20%
export const fundeb = 8_183_049.76; // +19.35%
export const sus = 4_616_408.0; // +45.76%
export const fnde = 958_255.0; // +5%
export const itrCfemRoyalties = 650_385.0;
export const conveniosFederais = 250_222.0;
export const outrasFed = itrCfemRoyalties + conveniosFederais;

// Transferências Estaduais
export const icms = 11_205_130.0; // +22.18%
export const ipva = 1_955_434.0; // +48.97%
export const ipi = 101_563.0;
export const cideRoyalties = 12_931.0;
export const conveniosEstaduais = 308_350.0;
export const outrasEst = ipi + cideRoyalties + conveniosEstaduais;

// ── Despesas ──────────────────────────────────────────────────────────────────
export const despesaTotalLOA = 54_647_152.36;
export const reservaContingencia = 1_069_457.5;
export const despPessoal = 24_839_982.07; // 43.5%
export const despCusteio = 21_849_049.57; // Outras despesas correntes
export const despInvestimentos = 4_849_869.91;
export const despJuros = 714_470.31; //  1.2%
export const despAmortizacao = 1_324_323.0; //  2.3%
export const despCapital = despInvestimentos + despAmortizacao;

// Despesas por órgão
export const despPrefeitura = 49_824_152.36;
export const despCamara = 2_200_000.0;
export const despPrevidencia = 2_623_000.0;

// ── Índices constitucionais ────────────────────────────────────────────────────
export const rclLOA = 45_200_000.0;
export const baseImpostosTransferencias = 57_148_402.36;

// MDE — Educação: mínimo 25% receita de impostos (Art. 212 CF)
export const baseImpostosMDE = 18_560_000.0;
export const minimoMDE = 4_640_000.0; // 25%
export const gastosMDE = 9_183_049.76; // FUNDEB + próprio → 49.5%
export const gastosMDEpct = 49.47;

// ASPS — Saúde: mínimo 15% da receita de impostos e transferências (LC 141/2012)
export const baseImpostosASPS = baseImpostosTransferencias;
export const minimoASPS = 8_572_260.35;
export const gastosASPS = 14_487_653.7;
export const gastosASPSpct = 25.35;

// Pessoal — LRF: limite 60% RCL (54% Exec. + 6% Leg.)
export const despPessoalExecutivo = 23_100_000.0; // 51.1% RCL
export const despPessoalLegislativo = 1_739_982.07; //  3.85% RCL
export const pctPessoalExecutivo = 51.1;
export const pctPessoalLegislativo = 3.85;
export const pctPessoalGlobal = 54.95;

// ── Investimentos ─────────────────────────────────────────────────────────────
export const investimentos = [
  {
    descricao: "Investimentos na rede municipal de saúde",
    valor: 1_420_000,
    secretaria: "Saúde",
  },
  {
    descricao: "Reforma, ampliação e equipamentos escolares",
    valor: 1_060_000,
    secretaria: "Educação",
  },
  {
    descricao: "Pavimentação, urbanismo e serviços urbanos",
    valor: 1_250_000,
    secretaria: "Obras",
  },
  {
    descricao: "Máquinas, veículos e modernização administrativa",
    valor: 720_000,
    secretaria: "Administração",
  },
  {
    descricao: "Meio ambiente, drenagem e agricultura",
    valor: 399_869.91,
    secretaria: "Obras",
  },
];

// ── Histórico ─────────────────────────────────────────────────────────────────
export const historicoOrcamento = [
  { ano: "2023", receita: 47_200_000, despesa: 45_800_000 },
  { ano: "2024", receita: 52_500_000, despesa: 51_100_000 },
  { ano: "2025", receita: 57_148_402, despesa: 54_647_152 },
];

export const premissasLoa = [
  {
    indicador: "IPCA médio anual",
    valor: "4,5%",
    impacto: "Reajustes contratuais, merenda, transporte e custeio geral.",
  },
  {
    indicador: "PIB real",
    valor: "2,2%",
    impacto: "Arrecadação própria com atividade econômica moderada.",
  },
  {
    indicador: "SELIC média",
    valor: "10,0%",
    impacto: "Pressão sobre custo financeiro e menor margem para crédito.",
  },
  {
    indicador: "Crescimento da RCL",
    valor: "8,7%",
    impacto: "Base para limites da LRF e programação de despesa continuada.",
  },
];

export const cenariosReceita = [
  {
    cenario: "Base LOA",
    variacao: 0,
    receita: receitaTotalLOA,
    despesa: despesaTotalLOA,
  },
  {
    cenario: "Conservador",
    variacao: -3,
    receita: receitaTotalLOA * 0.97,
    despesa: despesaTotalLOA,
  },
  {
    cenario: "Estressado",
    variacao: -6,
    receita: receitaTotalLOA * 0.94,
    despesa: despesaTotalLOA,
  },
];

export const riscosFiscais = [
  {
    risco: "Frustração de FPM e ICMS",
    probabilidade: "Média",
    impacto: "Alto",
    resposta:
      "Decreto de contingenciamento e revisão bimestral da programação.",
  },
  {
    risco: "Judicialização em saúde",
    probabilidade: "Alta",
    impacto: "Médio",
    resposta:
      "Reserva técnica setorial e protocolos para compras emergenciais.",
  },
  {
    risco: "Eventos climáticos e infraestrutura",
    probabilidade: "Média",
    impacto: "Alto",
    resposta: "Uso da reserva de contingência e captação por convênios.",
  },
  {
    risco: "Pressão de folha e encargos",
    probabilidade: "Média",
    impacto: "Alto",
    resposta:
      "Gestão de quadro, priorização de reposições essenciais e controle mensal.",
  },
];

export const marcosGovernanca = [
  {
    etapa: "Setembro a dezembro",
    entrega: "Tramitação legislativa, emendas e aprovação da LOA.",
  },
  {
    etapa: "Bimestral",
    entrega: "Avaliação de receita e despesas com possível contingenciamento.",
  },
  {
    etapa: "Quadrimestral",
    entrega: "Audiência de metas fiscais com resultados e correções de rota.",
  },
  {
    etapa: "Mensal",
    entrega: "Painel de execução física e financeira das ações prioritárias.",
  },
];

export const receitaNatureza = [
  { nome: "Receita corrente", valor: receitaCorrenteLOA },
  { nome: "Receita de capital", valor: receitaCapitalLOA },
];

export const receitasOrigem = [
  { nome: "Próprias", valor: receitasProprias },
  { nome: "Transf. União", valor: transferFederais },
  { nome: "Transf. Estado", valor: transferEstaduais },
  { nome: "Outras correntes", valor: outrasReceitas },
  { nome: "Capital", valor: receitaCapitalLOA },
];

export const receitasPropriasDetalhe = [
  { nome: "IPTU", orcado2024: 2_277_964.0, orcado2025: iptu },
  { nome: "ISSQN", orcado2024: 47_855.0, orcado2025: issqn },
  { nome: "ITBI", orcado2024: 667_377.0, orcado2025: itbi },
  { nome: "Taxas", orcado2024: 770_618.64, orcado2025: taxas },
  { nome: "Melhoria", orcado2024: 524_089.0, orcado2025: contribs },
  { nome: "IRRF", orcado2024: 558_240.0, orcado2025: irrf },
];

export const transferenciasFederaisDetalhe = [
  { nome: "FPM", orcado2024: 15_120_865.0, orcado2025: fpm },
  {
    nome: "ITR/CFEM/Royalties",
    orcado2024: 497_426.0,
    orcado2025: itrCfemRoyalties,
  },
  { nome: "SUS", orcado2024: 3_167_081.0, orcado2025: sus },
  { nome: "FNDE", orcado2024: 912_623.0, orcado2025: fnde },
  { nome: "FUNDEB", orcado2024: 6_856_073.0, orcado2025: fundeb },
  {
    nome: "Convênios e outros",
    orcado2024: 531_867.0,
    orcado2025: conveniosFederais,
  },
];

export const transferenciasEstaduaisDetalhe = [
  { nome: "ICMS", orcado2024: 9_171_351.26, orcado2025: icms },
  { nome: "IPVA", orcado2024: 1_312_646.0, orcado2025: ipva },
  { nome: "IPI", orcado2024: 96_725.0, orcado2025: ipi },
  { nome: "CIDE/Royalties", orcado2024: 15_501.0, orcado2025: cideRoyalties },
  {
    nome: "Convênio e outros",
    orcado2024: 315_479.0,
    orcado2025: conveniosEstaduais,
  },
];

export const despesaNatureza = [
  { nome: "Pessoal e encargos", valor: despPessoal },
  { nome: "Outras correntes", valor: despCusteio },
  { nome: "Juros e encargos", valor: despJuros },
  { nome: "Investimentos", valor: despInvestimentos },
  { nome: "Amortização", valor: despAmortizacao },
  { nome: "Reserva", valor: reservaContingencia },
];

export const despesaSecretarias = [
  {
    nome: "Educação, Cultura, Esportes e Lazer",
    orcado2024: 12_203_092.74,
    orcado2025: 15_191_651.51,
  },
  { nome: "Saúde", orcado2024: 12_237_739.07, orcado2025: 14_487_653.7 },
  {
    nome: "Serviços Urbanos, Meio Ambiente e Agricultura",
    orcado2024: 7_502_026.94,
    orcado2025: 9_489_803.54,
  },
  {
    nome: "Administração e Finanças",
    orcado2024: 8_297_569.42,
    orcado2025: 9_008_766.69,
  },
  {
    nome: "Assessoramento",
    orcado2024: 1_678_625.12,
    orcado2025: 2_757_557.32,
  },
  {
    nome: "Promoção Social",
    orcado2024: 1_755_575.5,
    orcado2025: 1_886_910.63,
  },
  {
    nome: "Planejamento, Indústria e Comércio",
    orcado2024: 843_963.11,
    orcado2025: 999_621.31,
  },
  { nome: "Procuradoria", orcado2024: 535_815.0, orcado2025: 562_605.76 },
  { nome: "Controladoria", orcado2024: 250_078.0, orcado2025: 262_581.9 },
];

export const despesaFuncoes = [
  { nome: "Judiciária", orcado2024: 759_622.5, orcado2025: 797_603.64 },
  { nome: "Administração", orcado2024: 7_085_923.5, orcado2025: 6_739_679.19 },
  { nome: "Defesa", orcado2024: 100_327.5, orcado2025: 105_343.86 },
  {
    nome: "Segurança Pública",
    orcado2024: 203_962.5,
    orcado2025: 214_160.62,
  },
  {
    nome: "Assistência Social",
    orcado2024: 1_755_575.5,
    orcado2025: 1_886_910.63,
  },
  {
    nome: "Previdência Social",
    orcado2024: 2_623_000.0,
    orcado2025: 2_754_150.25,
  },
  { nome: "Saúde", orcado2024: 11_300_469.97, orcado2025: 15_487_653.7 },
  { nome: "Educação", orcado2024: 11_421_420.24, orcado2025: 14_181_852.26 },
  { nome: "Cultura", orcado2024: 431_077.5, orcado2025: 590_072.63 },
  { nome: "Urbanismo", orcado2024: 6_031_955.69, orcado2025: 7_834_457.44 },
  {
    nome: "Gestão Ambiental",
    orcado2024: 694_023.75,
    orcado2025: 1_079_784.33,
  },
  { nome: "Agricultura", orcado2024: 160_965.0, orcado2025: 213_225.13 },
  { nome: "Indústria", orcado2024: 141_750.0, orcado2025: 148_837.5 },
  {
    nome: "Comércio e Serviços",
    orcado2024: 81_375.0,
    orcado2025: 85_443.75,
  },
  {
    nome: "Desporto e Lazer",
    orcado2024: 350_595.0,
    orcado2025: 419_726.62,
  },
  {
    nome: "Encargos Especiais",
    orcado2024: 1_826_291.25,
    orcado2025: 2_038_793.31,
  },
  {
    nome: "Reserva Contingência",
    orcado2024: 66_150.0,
    orcado2025: 69_457.5,
  },
];

export const gastosSociais = [
  { nome: "Educação", orcado2024: 11_421_420.24, orcado2025: 14_181_852.26 },
  { nome: "Saúde", orcado2024: 12_237_739.07, orcado2025: 14_487_653.7 },
  {
    nome: "Assistência Social",
    orcado2024: 1_755_575.5,
    orcado2025: 1_886_910.63,
  },
];

/** SAAE — detalhamento alinhado ao quadro da apresentação LOA 2025 */
export const saaeReceitasDetalhe = [
  { nome: "Patrimonial", orcado2024: 42_754.0, orcado2025: 50_000.0 },
  { nome: "Serviços", orcado2024: 4_178_884.0, orcado2025: 4_342_486.0 },
  { nome: "Alienação de bens", orcado2024: 61_578.0, orcado2025: 60_000.0 },
];

export const saaeDespesasDetalhe = [
  {
    nome: "Pessoal e encargos sociais",
    orcado2024: 42_754.0,
    orcado2025: 1_489_000.0,
  },
  {
    nome: "Outras despesas correntes",
    orcado2024: 4_178_884.0,
    orcado2025: 2_113_486.0,
  },
  {
    nome: "Investimentos",
    orcado2024: 61_578.0,
    orcado2025: 850_000.0,
  },
];

export const saneamentoAutarquia = {
  receita2024: 4_283_216.0,
  receita2025: 4_452_486.0,
  despesa2024: 4_283_216.0,
  despesa2025: 4_452_486.0,
  investimentos2025: 850_000.0,
  variacaoTotalPct: 3.95,
};

/** Fundo Municipal de Previdência — receitas vs despesas (demonstrativo para audiência) */
export const previdenciaRPPS = {
  receita2024: 2_498_000.0,
  receita2025: 2_631_000.0,
  despesa2024: 2_623_000.0,
  despesa2025: 2_754_150.25,
  receitasDetalhe2025: [
    { nome: "Contribuição dos segurados", valor: 985_000.0 },
    { nome: "Contribuição patronal — Prefeitura", valor: 892_500.0 },
    { nome: "Complementação municipal / patronal adicional", valor: 418_750.0 },
    { nome: "Outras receitas patrimoniais e compensações", valor: 334_750.0 },
  ],
  despesasDetalhe2025: [
    {
      nome: "Benefícios e complementação de aposentadorias",
      valor: 1_612_000.0,
    },
    { nome: "Manutenção administrativa e custeio do RPPS", valor: 428_900.0 },
    {
      nome: "Encargos sociais, complementares e reservas atuariais",
      valor: 713_250.25,
    },
  ],
};

export const participacaoCidada = [
  { tema: "Saúde", participantes: 263, valorLOA: 14_487_653.7 },
  { tema: "Educação", participantes: 301, valorLOA: 15_191_651.51 },
  { tema: "Assistência", participantes: 209, valorLOA: 1_886_910.63 },
  { tema: "Segurança", participantes: 74, valorLOA: 214_160.62 },
  { tema: "Habitação e urbanismo", participantes: 77, valorLOA: 7_834_457.44 },
];

export function pct(valor: number, total: number) {
  return total === 0 ? 0 : (valor / total) * 100;
}

export function variacaoPct(atual: number, anterior: number) {
  return anterior === 0 ? 0 : ((atual - anterior) / anterior) * 100;
}
