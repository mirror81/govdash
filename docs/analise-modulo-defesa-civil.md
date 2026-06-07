# Análise — Módulo Defesa Civil

**Data:** 2026-05-09  
**Projeto:** Analytics (Code42 / Linear)  
**Repositório:** mirantegov/painel

---

## 1. Contexto e justificativa

O Brasil é o **6º país do mundo que mais sofre com catástrofes climáticas** (ONU). Em 2024, o CEMADEN registrou **3.620 alertas de desastres** — o maior número desde o início do monitoramento, em 2011 — e **1.690 ocorrências confirmadas**. As enchentes no Rio Grande do Sul de 2024 afetaram **478 dos 497 municípios**, resultaram em **182 mortes**, deslocaram mais de **580 mil pessoas** e causaram perdas superiores a **R$ 3 bilhões**.

Dos alertas emitidos:
- **53%** foram de risco geológico (deslizamentos)
- **47%** de risco hidrológico (enxurradas, transbordamento de rios)
- **68%** das ocorrências foram de origem hidrológica

Em 73% dos municípios brasileiros, a população vive em áreas com alto risco de desastres por chuvas. **Ventanias e enchentes** são os dois tipos de evento mais frequentes e com maior impacto humano e logístico.

A criação de um módulo dedicado à **Defesa Civil** no painel municipal responde a uma necessidade operacional real: concentrar monitoramento, planejamento de resposta e gestão de recursos em uma única tela acessível à equipe de coordenação.

---

## 2. Tipos de desastre contemplados

### 2.1 Enchentes e enxurradas
- Causadas por chuvas intensas que superam a capacidade de escoamento do solo e drenagem urbana
- Afetam áreas ribeirinhas, baixadas, encostas e regiões sem saneamento adequado
- Provocam: isolamento de comunidades, contaminação da água, destruição de moradias, perda de alimentos e pertences, interrupção de energia

### 2.2 Ventanias e tempestades
- Ventos acima de 60 km/h já causam danos estruturais
- Ventos acima de 90 km/h (ventania forte) derrubam árvores, postes e telhados
- Provocam: falta de energia, queda de árvores sobre casas, danificação de culturas, deslizamentos (quando combinadas com chuva)

---

## 3. Estrutura do módulo

O módulo é dividido em **quatro painéis**, acessíveis por sub-abas internas:

| Sub-aba | Função |
|---|---|
| **Monitoramento** | KPIs climáticos e de risco em tempo real (pré-catástrofe) |
| **Ocorrências** | Registro e status de eventos ativos e histórico |
| **Recursos** | Estoque e distribuição de suprimentos nos abrigos |
| **Logística** | Planos de evacuação, rotas e equipes mobilizadas |

---

## 4. Painel 1 — Monitoramento (pré-catástrofe)

Inspirado nas fontes do CEMADEN, INMET e experiências dos sistemas de Santa Catarina e Rio de Janeiro, este painel exibe indicadores de **alerta precoce**.

### 4.1 KPIs de topo (cartões de monitoramento)

| KPI | Descrição | Fonte de dado |
|---|---|---|
| **Temperatura atual** | Temperatura em °C na sede do município | INMET / estação local |
| **Chuva acumulada 24h** | Milímetros nas últimas 24 horas | Pluviômetro / CEMADEN |
| **Chuva prevista 48h** | Previsão de precipitação em mm | INMET / CPTEC |
| **Velocidade do vento** | Km/h e direção predominante | Estação meteorológica |
| **Nível dos rios** | % em relação à cota de alerta dos rios monitorados | ANA / sensores locais |
| **Comunidades em alerta** | Número de comunidades com risco ativo | CEMADEN / Defesa Civil |
| **Casas a vistoriar** | Imóveis identificados como vulneráveis na temporada | Cadastro municipal |
| **Famílias em áreas de risco** | Total de famílias residentes em zonas de risco alto | IBGE / PLHIS |

### 4.2 Indicadores de alerta por nível

Seguindo o padrão CEMADEN / Defesa Civil:

| Nível | Cor | Critério |
|---|---|---|
| **Normal** | Verde | Sem anomalias, sem previsão de eventos |
| **Observação** | Amarelo | Chuva acumulada > 20 mm/h ou vento > 50 km/h |
| **Atenção** | Laranja | Chuva > 40 mm/h, nível do rio acima de 50% da cota de alerta |
| **Alerta** | Vermelho | Chuva > 60 mm/h, nível do rio acima da cota de alerta, ventania > 80 km/h |
| **Emergência** | Roxo | Evento em curso com vítimas ou desabrigados confirmados |

### 4.3 Gráficos de monitoramento

- **Histórico de chuva acumulada (7 dias)** — gráfico de barras por dia
- **Evolução do nível do rio (24h)** — linha com marcação da cota de atenção e alerta
- **Mapa de comunidades por nível de risco** — mapa municipal com pontos coloridos por nível
- **Previsão climática 5 dias** — cards com temperatura mín/máx e precipitação esperada

---

## 5. Painel 2 — Ocorrências

### 5.1 KPIs de ocorrências

| KPI | Descrição |
|---|---|
| Ocorrências ativas | Eventos em andamento sem encerramento |
| Pessoas afetadas | Total de pessoas impactadas no período |
| Desabrigados | Pessoas sem moradia temporária |
| Desalojados | Pessoas que deixaram o imóvel mas têm para onde ir |
| Mortes | Óbitos confirmados relacionados ao desastre |
| Feridos | Atendimentos de saúde registrados |
| Imóveis danificados | Residências com dano parcial ou total |

### 5.2 Tabela de ocorrências

Cada ocorrência exibe:
- Tipo (Enchente / Ventania / Deslizamento)
- Bairro / Comunidade
- Data e hora de abertura
- Status (Em atendimento / Aguardando recurso / Encerrado)
- Equipe responsável
- Número de afetados

### 5.3 Gráfico histórico

- **Ocorrências por mês (12 meses)** — comparativo por tipo de evento
- **Série histórica de afetados por ano** — linha temporal

---

## 6. Painel 3 — Recursos (suprimentos e abrigos)

### 6.1 Abrigos

Cada abrigo (escola, ginásio, centro comunitário) é cadastrado com:

| Campo | Descrição |
|---|---|
| Nome e endereço | Identificação do local |
| Capacidade total | Número máximo de pessoas |
| Ocupação atual | Pessoas abrigadas no momento |
| % de ocupação | Barra de progresso visual |
| Responsável | Nome e contato do coordenador local |
| Status | Ativo / Standby / Encerrado |

### 6.2 KPIs de suprimentos

Organizado por categoria crítica para desastres no Brasil:

| Categoria | KPI exibido |
|---|---|
| **Água potável** | Litros disponíveis / consumo diário estimado / dias de autonomia |
| **Alimentos** | Cestas básicas disponíveis / refeições/dia servidas |
| **Energia** | Geradores ativos / abrigos com fornecimento |
| **Roupas e cobertores** | Kits disponíveis / kits distribuídos |
| **Abrigo / Lonas** | Kits de emergência disponíveis |
| **Medicamentos** | Kits de primeiros socorros / medicamentos essenciais |
| **Higiene** | Kits de higiene disponíveis |

### 6.3 Alertas de estoque crítico

- Quando um recurso cai abaixo de 20% da necessidade estimada, exibe alerta vermelho
- Botão de **Solicitar Reposição** diretamente no painel para cada categoria

---

## 7. Painel 4 — Logística (evacuação e mobilização)

### 7.1 Plano de evacuação

Estruturado por **zonas de risco** do município:

| Zona | Tipo de risco | Rota de evacuação | Abrigo destino | Prioridade |
|---|---|---|---|---|
| Zona A | Área ribeirinha (enchente) | Rua X → Av. Y → Ginásio Z | Ginásio Municipal | Alta |
| Zona B | Encosta (deslizamento) | Estrada rural → Escola N | Escola Estadual | Alta |
| Zona C | Centro (ventania) | Qualquer rua larga | Teatro / Ginásio | Média |

O painel exibe:
- **Mapa de rotas de evacuação** por zona
- **Status de cada rota** (Livre / Bloqueada / Em uso)
- **Tempo estimado de evacuação** por zona (calculado por tamanho da população e distância)

### 7.2 Equipes mobilizadas

| Equipe | Função | Status | Localização atual |
|---|---|---|---|
| Busca e Resgate | Resgatar pessoas em área de risco | Ativa | Bairro X |
| Saúde de Campo | Triagem e atendimento médico | Standby | Base central |
| Distribuição | Entrega de suprimentos nos abrigos | Ativa | Ginásio Municipal |
| Monitoramento | Observação e reporte de nível d'água | Ativa | Margem do rio Y |

### 7.3 Veículos e equipamentos

| Item | Quantidade total | Em uso | Disponível |
|---|---|---|---|
| Viaturas leves | 8 | 5 | 3 |
| Caminhões de suprimento | 3 | 2 | 1 |
| Barcos de resgate | 4 | 4 | 0 |
| Geradores portáteis | 10 | 7 | 3 |

---

## 8. Dados demo para implementação

Para o módulo funcionar com dados estáticos de demonstração, sugerimos os seguintes valores iniciais, baseados em cenário fictício de município de médio porte (150 mil habitantes) em período de alerta:

### 8.1 Contexto do cenário demo

- **Município:** Cidade fictícia no interior do Sul/Sudeste
- **Período:** Janeiro (verão — pico de enchentes e tempestades)
- **Status atual:** Nível "Atenção" (laranja) — chuva acumulada 45 mm nas últimas 12h, rio a 65% da cota de alerta

### 8.2 KPIs demo — Monitoramento

| Indicador | Valor demo |
|---|---|
| Temperatura atual | 26,4°C |
| Chuva acumulada 24h | 52 mm |
| Chuva prevista 48h | 38 mm |
| Velocidade do vento | 42 km/h (NE) |
| Nível do Rio Municipal | 68% da cota de alerta |
| Comunidades em alerta | 4 |
| Casas a vistoriar | 312 |
| Famílias em área de risco | 1.847 |

### 8.3 KPIs demo — Ocorrências

| Indicador | Valor demo |
|---|---|
| Ocorrências ativas | 7 |
| Pessoas afetadas | 423 |
| Desabrigados | 118 |
| Desalojados | 305 |
| Imóveis danificados | 89 |

### 8.4 Abrigos demo

| Abrigo | Capacidade | Ocupação | Status |
|---|---|---|---|
| Ginásio Municipal | 300 | 118 (39%) | Ativo |
| Escola Estadual João XXIII | 200 | 0 | Standby |
| Centro Comunitário Norte | 150 | 0 | Standby |

### 8.5 Suprimentos demo

| Categoria | Disponível | Consumo/dia | Autonomia |
|---|---|---|---|
| Água potável | 12.000 L | 2.360 L | 5 dias |
| Cestas básicas | 340 | 25/dia | 13 dias |
| Refeições servidas hoje | 472 | — | — |
| Kits de roupa | 280 | — | — |
| Kits de higiene | 190 | — | — |
| Geradores ativos | 3 de 10 | — | — |

---

## 9. Componentes de interface sugeridos

### KPIs de topo
- Cards com ícone, valor principal, variação e indicador de nível de alerta colorido
- Ícones sugeridos: `Thermometer01Icon`, `Rain01Icon`, `Wind01Icon`, `WaterIcon`, `Home01Icon`, `Alert01Icon`

### Gráficos
- **Chuva acumulada (barras):** `BarChart` via Recharts
- **Nível do rio (linha com threshold):** `LineChart` com `ReferenceLine` em 80% e 100%
- **Estoque de suprimentos (barras horizontais):** `BarChart` horizontal com cor condicional (verde/amarelo/vermelho)
- **Ocupação dos abrigos (donut):** `PieChart` por abrigo

### Tabelas
- Ocorrências ativas: `Table` com badge de status colorido
- Equipes mobilizadas: cards com status inline
- Veículos: grade de cartões com indicador de disponibilidade

### Mapa
- Para a versão demo: substituir mapa real por representação estilizada com cartões de zona
- Futuramente: integrar Leaflet ou Mapbox com shape do município

---

## 10. Referências e fontes

- [CEMADEN — Centro Nacional de Monitoramento e Alertas de Desastres Naturais](https://www.gov.br/cemaden/pt-br)
- [Cemaden registra recorde de alertas — 1.690 ocorrências em 2024](https://agenciagov.ebc.com.br/noticias/202501/cemaden-registra-recorde-de-alertas-e-mais-de-1-6-mil-ocorrencias-de-desastre-no-brasil-em-2024)
- [IBGE — PEERS: Pesquisa especial sobre enchentes RS 2024](https://www.ibge.gov.br/peers/)
- [CNM — Panorama dos Desastres no Brasil 2013–2023](https://cnm.org.br/storage/biblioteca/2024/Estudos_tecnicos/202405_ET_Panorama_Desastres_Brasil_2013_a_2023.pdf)
- [Brasil: 73% da população em municípios com alto risco de desastres por chuvas](https://apublica.org/2024/05/no-brasil-3-a-cada-4-vivem-em-municipios-com-mais-risco-de-desastres-causados-por-chuvas/)
- [Câmara dos Deputados — Brasil é 6º país que mais sofre com catástrofes climáticas](https://www.camara.leg.br/radio/programas/396885-enchentes-o-brasil-e-6o-pais-do-mundo-que-mais-sofre-com-catastrofes-climaticas/)
- [Painel de monitoramento CEMADEN-RJ](https://painelcemadenrj.defesacivil.rj.gov.br/monitoramento/v2/mapa/)
- [Secretaria de Defesa Civil SC — Monitoramento](https://monitoramento.defesacivil.sc.gov.br/)
- [Plano de Ação de Enchente — Ribeirão Preto/SP](https://www.ribeiraopreto.sp.gov.br/portal/defesa-civil/plano-de-acao-enchente)
- [Nova plataforma de gestão de riscos — SP](https://www.infraestruturameioambiente.sp.gov.br/ipa/2024/11/nova-plataforma-de-monitoramento-reforca-a-gestao-de-riscos-de-desastres-naturais/)
