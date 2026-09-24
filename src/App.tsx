import React, { useState, useMemo } from 'react';
import { generateExecutivePdf } from './utils/pdfGenerator';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  AlertTriangle,
  ShieldCheck,
  Calendar,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Building2,
  PieChart,
  HelpCircle,
  Clock,
  Briefcase,
  ChevronRight,
  FileCheck2,
  Search,
  Filter,
  Printer,
  Download,
  FileDown,
  X,
  CheckCircle,
  Check,
  Loader2,
  Copy,
  ExternalLink,
  FileText,
  Eye
} from 'lucide-react';

interface MovingAverageComponent {
  monthName: string;
  receitas: number;
  despesas: number;
  diferenca: number;
}

// Monthly timeline data from the reports
export interface MonthSummary {
  id: string;
  name: string;
  periodLabel: string;
  source: 'Innova' | 'Controlar';
  saldoAnterior: number;
  receitas: number;
  despesas: number;
  saldoFinal: number;
  movLiquido: number; // Diferença (Receitas - Despesas)
  mediaMovel3Meses: number; // Média móvel 3M calculada estritamente sobre a coluna Diferença
  mediaMovelDesc: string;
  mediaMovelFormula: string;
  mediaMovelComponents: MovingAverageComponent[];
  inadimplencia?: number;
  notes: string;
  topRevenues: { name: string; category: string; amount: number }[];
  topExpenses: { name: string; category: string; amount: number }[];
}

interface RawMonthData {
  id: string;
  name: string;
  periodLabel: string;
  source: 'Innova' | 'Controlar';
  saldoAnterior: number;
  receitas: number;
  despesas: number;
  saldoFinal: number;
  inadimplencia?: number;
  notes: string;
  topRevenues: { name: string; category: string; amount: number }[];
  topExpenses: { name: string; category: string; amount: number }[];
}

const rawMonthlyTimelineData: RawMonthData[] = [
  {
    id: 'jan-2026',
    name: 'Jan/2026',
    periodLabel: 'Janeiro 2026',
    source: 'Innova',
    saldoAnterior: 0.00,
    receitas: 83890.56,
    despesas: 0.00,
    saldoFinal: 83890.56,
    notes: 'Abertura do condomínio e emissão da 1ª taxa condominial pela Innova.',
    topRevenues: [
      { name: 'Taxa Condominial Ordinária (Janeiro)', category: 'Taxa Ordinária', amount: 62134.62 },
      { name: 'Taxa Condominial Área Comum Geral', category: 'Taxa Ordinária', amount: 17997.63 },
      { name: 'Fundo de Reserva Ordinário', category: 'Fundo Reserva', amount: 2858.43 },
      { name: 'Fundo de Reserva Área Comum', category: 'Fundo Reserva', amount: 899.88 }
    ],
    topExpenses: [
      { name: 'Sem despesas liquidadas em Jan (pagas acumuladas em Fev)', category: 'Implantação', amount: 0.00 }
    ]
  },
  {
    id: 'fev-2026',
    name: 'Fev/2026',
    periodLabel: 'Fevereiro 2026',
    source: 'Innova',
    saldoAnterior: 83890.56,
    receitas: 80042.98,
    despesas: 123576.92,
    saldoFinal: 40356.62,
    inadimplencia: 85230.29,
    notes: 'Mês de implantação. Incluiu estorno de R$ 51.200,00 depositado por engano e R$ 49.247,00 da Fênix (Jan/Fev).',
    topRevenues: [
      { name: 'Depósito por Engano a Regularizar (W. Mostaert)', category: 'Regularização', amount: 51200.00 },
      { name: 'Rateio Projeto de Segurança (PC 01/05)', category: 'Taxa Extra', amount: 24321.40 },
      { name: 'Rateio Recebimento Áreas Comuns (PC 01/04)', category: 'Taxa Extra', amount: 3588.87 },
      { name: 'Antecipação Cota Unidade 0108', category: 'Taxa Ordinária', amount: 451.25 },
      { name: 'Antecipação Cota Unidade 0804', category: 'Taxa Ordinária', amount: 449.69 },
      { name: 'Multas sobre cobrança em atraso', category: 'Financeira', amount: 28.05 },
      { name: 'Juros de mora sobre cobrança', category: 'Financeira', amount: 3.72 }
    ],
    topExpenses: [
      { name: 'Devolução de transferência indevida (W. Mostaert)', category: 'Regularização', amount: 51200.00 },
      { name: 'Fênix Terceirizações - Portaria Fev/26 (NF 51)', category: 'Terceirização', amount: 25919.47 },
      { name: 'Fênix Terceirizações - Portaria Jan/26 (NF 49)', category: 'Terceirização', amount: 23327.53 },
      { name: 'Honorários do Síndico Jan/26 (RPA 12026)', category: 'Administração', amount: 5446.56 },
      { name: 'PMA Innova - Gerenciamento Custo Fev (NF 25938)', category: 'Administração', amount: 4720.13 },
      { name: 'PMA Innova - Gerenciamento Custo Jan (NF 25930)', category: 'Administração', amount: 3933.44 },
      { name: 'WOM Engenharia - Laudo Recebimento 1/4 (NF 2653)', category: 'Engenharia', amount: 3650.00 },
      { name: 'PMA Innova - Taxa Administração Fev (NF 25937)', category: 'Administração', amount: 2581.12 },
      { name: 'PMA Innova - Taxa Administração Jan (NF 25929)', category: 'Administração', amount: 2150.93 },
      { name: 'Prefeitura do Recife - Taxa CIM 2026.1', category: 'Tributos', amount: 535.54 }
    ]
  },
  {
    id: 'mar-2026',
    name: 'Mar/2026',
    periodLabel: 'Março 2026',
    source: 'Innova',
    saldoAnterior: 40356.62,
    receitas: 193868.45,
    despesas: 18266.55,
    saldoFinal: 215958.52,
    inadimplencia: 3692.43,
    notes: 'Recuperação do acordo da construtora (R$ 167.781,12) e abertura de conta corrente própria no Itaú.',
    topRevenues: [
      { name: 'Acordo Construtora - Quitação Taxa Fev (Recibo 1522622)', category: 'Taxa Ordinária', amount: 83890.56 },
      { name: 'Acordo Construtora - Quitação Taxa Mar (Recibo 1522623)', category: 'Taxa Ordinária', amount: 83890.56 },
      { name: 'Rateio Projeto de Segurança (PC 02/05)', category: 'Taxa Extra', amount: 22316.21 },
      { name: 'Rateio Recebimento Áreas Comuns (PC 02/04)', category: 'Taxa Extra', amount: 3239.80 },
      { name: 'Recebimento de Cota Atrasada Unidade 0706', category: 'Recuperação', amount: 440.35 },
      { name: 'Multas sobre boletos pagos em atraso', category: 'Financeira', amount: 73.35 },
      { name: 'Juros de mora sobre boletos', category: 'Financeira', amount: 13.37 },
      { name: 'Boleto Teste 2 (Carla Belchior)', category: 'Diversos', amount: 2.22 },
      { name: 'Boleto Teste 1 (Carla Belchior)', category: 'Diversos', amount: 2.00 },
      { name: 'Rendimento de Aplicação Financeira Itaú', category: 'Financeira', amount: 0.03 }
    ],
    topExpenses: [
      { name: 'Honorários do Síndico Fev/26 (RPA 1022026)', category: 'Administração', amount: 5446.56 },
      { name: 'WOM Engenharia - Laudo Recebimento 2/4 (NF 2686)', category: 'Engenharia', amount: 3650.00 },
      { name: 'Receita Federal - INSS sobre NF 51 Fênix', category: 'Tributos', amount: 3203.53 },
      { name: 'Receita Federal - INSS sobre NF 49 Fênix', category: 'Tributos', amount: 2883.17 },
      { name: 'Receita Federal - INSS sobre NF 25938 Innova', category: 'Tributos', amount: 654.33 },
      { name: 'Receita Federal - INSS sobre NF 25930 Innova', category: 'Tributos', amount: 545.27 },
      { name: 'Prefeitura do Recife - ISS sobre RPA Síndico', category: 'Tributos', amount: 324.20 },
      { name: 'Prefeitura do Recife - ISS sobre NF 25938 Innova', category: 'Tributos', amount: 297.42 },
      { name: 'Receita Federal - PIS/COFINS/CSLL NF 25938 Innova', category: 'Tributos', amount: 276.60 },
      { name: 'Prefeitura do Recife - ISS sobre NF 25930 Innova', category: 'Tributos', amount: 247.85 }
    ]
  },
  {
    id: 'abr-2026',
    name: 'Abr/2026',
    periodLabel: 'Abril 2026',
    source: 'Controlar',
    saldoAnterior: 215958.52,
    receitas: 0.00,
    despesas: 82824.44,
    saldoFinal: 133134.08,
    notes: 'Período de transição de gestão da Innova para a Controlar, fixando o saldo inicial em R$ 133.134,08.',
    topRevenues: [
      { name: 'Receitas de Transição / Saldos Vinculados', category: 'Transição', amount: 0.00 }
    ],
    topExpenses: [
      { name: 'Despesas Correntes do Período de Transição', category: 'Operacional', amount: 82824.44 }
    ]
  },
  {
    id: 'mai-2026',
    name: 'Mai/2026',
    periodLabel: 'Maio 2026',
    source: 'Controlar',
    saldoAnterior: 133134.08,
    receitas: 51879.14,
    despesas: 97049.94,
    saldoFinal: 87963.28,
    notes: '1ª parcela das máquinas (R$ 25.600,00) e terceirização acumulada (R$ 59.645,46).',
    topRevenues: [
      { name: 'Taxa Extra: Sistema de Segurança', category: 'Taxa Extra', amount: 25123.27 },
      { name: 'Taxa Ordinária Condominial', category: 'Taxa Ordinária', amount: 21533.50 },
      { name: 'Taxa Extra: Fiscalização/Laudos/Projetos', category: 'Taxa Extra', amount: 3301.73 },
      { name: 'Fundo de Reserva', category: 'Fundo Reserva', amount: 1133.32 },
      { name: 'Acordo Administrativo Inadimplentes', category: 'Recuperação', amount: 1045.64 },
      { name: 'Receita com Multas de Atraso', category: 'Financeira', amount: 102.64 },
      { name: 'Rendimento de Aplicação Financeira', category: 'Financeira', amount: 28.20 },
      { name: 'Receita com Juros de Mora', category: 'Financeira', amount: 27.11 },
      { name: 'Boleto/Transferência Teste', category: 'Diversos', amount: 0.03 }
    ],
    topExpenses: [
      { name: 'Serv. Terceirização de Mão de Obra', category: 'Terceirização', amount: 59645.46 },
      { name: 'Aquisição Máquinas e Equipamentos (Parcela 1/3)', category: 'Imobilizado', amount: 25600.00 },
      { name: 'Pró-Labore do Síndico', category: 'Administração', amount: 5891.92 },
      { name: 'Fiscalização e Laudo de Obra (WOM Engenharia)', category: 'Engenharia', amount: 3650.00 },
      { name: 'Manutenção de Elevadores', category: 'Manutenção', amount: 1862.19 },
      { name: 'Neoenergia - Energia Elétrica Áreas Comuns', category: 'Concessionárias', amount: 313.37 },
      { name: 'Pacote de Serviços Bancários PJ', category: 'Financeira', amount: 87.00 }
    ]
  },
  {
    id: 'jun-2026',
    name: 'Jun/2026',
    periodLabel: 'Junho 2026',
    source: 'Controlar',
    saldoAnterior: 87963.28,
    receitas: 184384.42,
    despesas: 76230.04,
    saldoFinal: 196117.66,
    notes: 'Arrecadação robusta de taxas ordinárias (R$ 148k) e 2ª parcela de máquinas (R$ 25.600,00).',
    topRevenues: [
      { name: 'Taxa Ordinária Condominial', category: 'Taxa Ordinária', amount: 148068.86 },
      { name: 'Taxa Extra: Sistema de Segurança', category: 'Taxa Extra', amount: 17445.22 },
      { name: 'Acordo Administrativo Inadimplentes', category: 'Recuperação', amount: 10317.66 },
      { name: 'Fundo de Reserva', category: 'Fundo Reserva', amount: 7792.80 },
      { name: 'Receita com Multas de Atraso', category: 'Financeira', amount: 1291.61 },
      { name: 'Receita com Juros de Mora', category: 'Financeira', amount: 221.03 },
      { name: 'Taxa Extra: Fiscalização/Laudos/Projetos', category: 'Taxa Extra', amount: 65.24 }
    ],
    topExpenses: [
      { name: 'Serv. Terceirização de Mão de Obra', category: 'Terceirização', amount: 38465.62 },
      { name: 'Aquisição Máquinas e Equipamentos (Parcela 2/3)', category: 'Imobilizado', amount: 25600.00 },
      { name: 'Pró-Labore do Síndico', category: 'Administração', amount: 5891.92 },
      { name: 'Taxa de Administração (Controlar)', category: 'Administração', amount: 1620.00 },
      { name: 'Seguro Predial', category: 'Obrigatórias', amount: 1174.53 },
      { name: 'Internet e Telecomunicações', category: 'Concessionárias', amount: 1155.00 },
      { name: 'Serviços de Arquitetura e Engenharia', category: 'Projetos', amount: 1000.00 },
      { name: 'Serviços Prestados Diversos', category: 'Operacional', amount: 391.60 },
      { name: 'Serviços Cartorários', category: 'Administração', amount: 354.86 },
      { name: 'Material para Pintura', category: 'Materiais', amount: 253.70 }
    ]
  },
  {
    id: 'jul-2026',
    name: 'Jul/2026',
    periodLabel: 'Julho 2026',
    source: 'Controlar',
    saldoAnterior: 196117.66,
    receitas: 112936.63,
    despesas: 91585.74,
    saldoFinal: 217468.55,
    notes: '3ª e última parcela de máquinas (R$ 25.600,00) e fatura Neoenergia de R$ 8.825,52.',
    topRevenues: [
      { name: 'Taxa Ordinária Condominial', category: 'Taxa Ordinária', amount: 101634.62 },
      { name: 'Fundo de Reserva', category: 'Fundo Reserva', amount: 5349.02 },
      { name: 'Taxa Extra: Sistema de Segurança', category: 'Taxa Extra', amount: 5100.09 },
      { name: 'Receita com Multas de Atraso', category: 'Financeira', amount: 571.89 },
      { name: 'Acordo Administrativo Inadimplentes', category: 'Recuperação', amount: 440.35 },
      { name: 'Receita com Juros de Mora', category: 'Financeira', amount: 220.93 },
      { name: 'Taxa Extra: Fiscalização/Laudos/Projetos', category: 'Taxa Extra', amount: 55.73 }
    ],
    topExpenses: [
      { name: 'Serv. Terceirização de Mão de Obra', category: 'Terceirização', amount: 35846.47 },
      { name: 'Aquisição Máquinas e Equipamentos (Parcela 3/3)', category: 'Imobilizado', amount: 25600.00 },
      { name: 'Neoenergia - Energia Elétrica Áreas Comuns', category: 'Concessionárias', amount: 8825.52 },
      { name: 'Pró-Labore do Síndico', category: 'Administração', amount: 5891.92 },
      { name: 'Material de Limpeza e Conservação', category: 'Materiais', amount: 1953.73 },
      { name: 'Manutenção de Elevadores', category: 'Manutenção', amount: 1862.19 },
      { name: 'Combustível para Gerador', category: 'Operacional', amount: 1740.00 },
      { name: 'Internet e Telecomunicações', category: 'Concessionárias', amount: 1649.99 },
      { name: 'Taxa de Administração (Controlar)', category: 'Administração', amount: 1620.00 },
      { name: 'Gás Predial', category: 'Concessionárias', amount: 1478.94 }
    ]
  },
  {
    id: 'ago-2026',
    name: 'Ago/2026',
    periodLabel: 'Agosto 2026',
    source: 'Controlar',
    saldoAnterior: 217468.55,
    receitas: 105992.28,
    despesas: 42414.89,
    saldoFinal: 281045.94,
    notes: 'Despesas estabilizadas sem parcelas de máquinas. Saldo atinge o ápice de R$ 281.045,94.',
    topRevenues: [
      { name: 'Taxa Ordinária Condominial', category: 'Taxa Ordinária', amount: 100504.10 },
      { name: 'Fundo de Reserva', category: 'Fundo Reserva', amount: 5289.48 },
      { name: 'Acordo Administrativo Inadimplentes', category: 'Recuperação', amount: 385.40 },
      { name: 'Receita com Multas de Atraso', category: 'Financeira', amount: 134.50 },
      { name: 'Receita com Juros de Mora', category: 'Financeira', amount: 41.30 }
    ],
    topExpenses: [
      { name: 'Serv. Terceirização de Mão de Obra', category: 'Terceirização', amount: 9927.00 },
      { name: 'Pró-Labore do Síndico', category: 'Administração', amount: 5891.92 },
      { name: 'Tributos Retidos (INSS PJ, IR, PIS, CIM)', category: 'Tributos', amount: 5428.44 },
      { name: 'Material de Limpeza e Conservação', category: 'Materiais', amount: 4270.70 },
      { name: 'Manutenção de Elevadores', category: 'Manutenção', amount: 1862.19 },
      { name: 'Internet e Telecomunicações', category: 'Concessionárias', amount: 1649.99 },
      { name: 'Taxa de Administração (Controlar)', category: 'Administração', amount: 1620.00 },
      { name: 'Encargos Sociais INSS Pró-Labore', category: 'Tributos', amount: 1296.80 },
      { name: 'Seguro Predial', category: 'Obrigatórias', amount: 1174.53 },
      { name: 'Utensílios e Ferramentas', category: 'Materiais', amount: 1175.26 }
    ]
  }
];

// Cálculo estritamente dinâmico da coluna Diferença (Receitas - Despesas)
// e da Média Móvel de 3 meses baseada EXCLUSIVAMENTE nas diferenças calculadas
export const monthlyTimeline: MonthSummary[] = rawMonthlyTimelineData.map((month, idx, allMonths) => {
  // 1. Diferença líquida mensal apurada como Receitas Líquidas menos Despesas Pagas
  const movLiquido = Number((month.receitas - month.despesas).toFixed(2));

  // 2. Janela dos últimos 3 meses (ou decorridos até 3) baseada na coluna "Diferença"
  const windowSlice = allMonths.slice(Math.max(0, idx - 2), idx + 1);
  const mediaMovelComponents: MovingAverageComponent[] = windowSlice.map((w) => ({
    monthName: w.name,
    receitas: w.receitas,
    despesas: w.despesas,
    diferenca: Number((w.receitas - w.despesas).toFixed(2))
  }));

  const sumDifferences = mediaMovelComponents.reduce((acc, curr) => acc + curr.diferenca, 0);
  const mediaMovel3Meses = Number((sumDifferences / windowSlice.length).toFixed(2));

  // 3. Descrição explicativa detalhada da fórmula demonstrando a média das diferenças
  const windowNames = windowSlice.map((w) => w.name.split('/')[0]).join(', ');
  const formulaDiffs = mediaMovelComponents
    .map((c) => `${c.diferenca >= 0 ? '+' : '-'}R$ ${(Math.abs(c.diferenca) / 1000).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}K`)
    .join(' ');

  const mediaMovelDesc = windowSlice.length === 1
    ? `Mês base inicial (+R$ ${(movLiquido / 1000).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}K)`
    : `Média ${windowNames}: (${formulaDiffs}) / ${windowSlice.length} = ${mediaMovel3Meses >= 0 ? '+' : '-'}R$ ${(Math.abs(mediaMovel3Meses) / 1000).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}K`;

  const mediaMovelFormula = windowSlice.length === 1
    ? `Diferença ${windowSlice[0].name}: R$ ${movLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
    : `(${mediaMovelComponents.map((c) => `${c.monthName}: ${c.diferenca >= 0 ? '+' : ''}R$ ${c.diferenca.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`).join(' + ')}) ÷ ${windowSlice.length} = ${mediaMovel3Meses >= 0 ? '+' : ''}R$ ${mediaMovel3Meses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

  return {
    ...month,
    movLiquido,
    mediaMovel3Meses,
    mediaMovelDesc,
    mediaMovelFormula,
    mediaMovelComponents
  };
});

interface FinancialItem {
  id: string;
  name: string;
  category: string;
  amount: number;
  monthId: string; // 'fev-2026', 'mar-2026', 'mai-2026', etc.
  monthLabel: string;
  details?: string;
}

// Top Costs dataset compiled directly from all 4 reports
const allExpensesData: FinancialItem[] = [
  // Controlar Multi-month items
  { id: 'c-terc-total', name: 'Mão de Obra Terceirizada (Portaria/Serviços)', category: 'Terceirização', amount: 143884.55, monthId: 'consolidado-controlar', monthLabel: 'Mai-Ago (Controlar)', details: 'Mai R$ 59.645, Jun R$ 38.465, Jul R$ 35.846, Ago R$ 9.927' },
  { id: 'c-imob-total', name: 'Aquisição de Máquinas e Equipamentos (3 parcelas)', category: 'Investimento / Imobilizado', amount: 76800.00, monthId: 'consolidado-controlar', monthLabel: 'Mai-Jul (Controlar)', details: 'Total de R$ 76.800 pago em 3 parcelas de R$ 25.600' },
  { id: 'c-prolabore', name: 'Pró-Labore da Gestão / Síndico', category: 'Administração', amount: 23567.68, monthId: 'consolidado-controlar', monthLabel: 'Mai-Ago (Controlar)', details: '4 competências de R$ 5.891,92' },
  { id: 'c-energia', name: 'Neoenergia - Energia Elétrica Áreas Comuns', category: 'Concessionárias', amount: 9138.89, monthId: 'consolidado-controlar', monthLabel: 'Mai-Ago (Controlar)', details: 'Mai R$ 313,37 e Jul R$ 8.825,52' },
  { id: 'c-limpeza', name: 'Materiais de Limpeza e Conservação', category: 'Materiais', amount: 6224.43, monthId: 'consolidado-controlar', monthLabel: 'Mai-Ago (Controlar)', details: 'Jul R$ 1.953,73 e Ago R$ 4.270,70' },
  { id: 'c-elevadores', name: 'Manutenção de Elevadores', category: 'Manutenção', amount: 5586.57, monthId: 'consolidado-controlar', monthLabel: 'Mai-Ago (Controlar)', details: '3 meses a R$ 1.862,19/mês' },
  { id: 'c-tributos', name: 'Tributos e Impostos Retidos (INSS/IR/PIS/CIM)', category: 'Tributos', amount: 5428.44, monthId: 'consolidado-controlar', monthLabel: 'Ago (Controlar)', details: 'INSS PJ R$ 3.748,91, IR R$ 592, PIS R$ 551, CIM R$ 535' },
  { id: 'c-taxa-adm', name: 'Taxa de Administração (Controlar)', category: 'Administração', amount: 4860.00, monthId: 'consolidado-controlar', monthLabel: 'Jun-Ago (Controlar)', details: 'Jun, Jul e Ago a R$ 1.620,00/mês' },
  { id: 'c-internet', name: 'Internet e Telecomunicações', category: 'Concessionárias', amount: 4454.98, monthId: 'consolidado-controlar', monthLabel: 'Jun-Ago (Controlar)', details: 'Jun R$ 1.155,00, Jul R$ 1.649,99, Ago R$ 1.649,99' },
  { id: 'c-laudo-wom', name: 'Fiscalização e Laudo de Obra (WOM Eng.)', category: 'Engenharia', amount: 3650.00, monthId: 'consolidado-controlar', monthLabel: 'Mai (Controlar)', details: 'Parcela de vistoria predial' },
  { id: 'c-seguro', name: 'Seguro Predial', category: 'Obrigatórias', amount: 3523.59, monthId: 'consolidado-controlar', monthLabel: 'Jun-Ago (Controlar)', details: '3 parcelas de R$ 1.174,53' },
  { id: 'c-combustivel', name: 'Combustível para Gerador / Manutenção', category: 'Operacional', amount: 2539.00, monthId: 'consolidado-controlar', monthLabel: 'Jul-Ago (Controlar)', details: 'Jul R$ 1.740,00 e Ago R$ 799,00' },
  { id: 'c-advocacia', name: 'Honorários Advocatícios', category: 'Jurídico', amount: 2334.24, monthId: 'consolidado-controlar', monthLabel: 'Jul-Ago (Controlar)', details: 'Jul R$ 1.167,12 e Ago R$ 1.167,12' },
  { id: 'c-acesso', name: 'Manutenção do Controle de Acesso', category: 'Segurança', amount: 2100.00, monthId: 'consolidado-controlar', monthLabel: 'Jul-Ago (Controlar)', details: 'Jul R$ 1.050,00 e Ago R$ 1.050,00' },
  { id: 'c-gas', name: 'Gás Predial', category: 'Concessionárias', amount: 1968.30, monthId: 'consolidado-controlar', monthLabel: 'Jun-Ago (Controlar)', details: 'Jun R$ 139,23, Jul R$ 1.478,94, Ago R$ 350,13' },
  { id: 'c-inss-encargo', name: 'Encargos INSS Pró-Labore', category: 'Tributos', amount: 1296.80, monthId: 'consolidado-controlar', monthLabel: 'Ago (Controlar)', details: 'INSS patronal sobre remuneração' },
  { id: 'c-rateio', name: 'Rateio de Despesas Áreas Comuns', category: 'Operacional', amount: 1211.58, monthId: 'consolidado-controlar', monthLabel: 'Jul-Ago (Controlar)', details: 'Jul R$ 691,69 e Ago R$ 519,89' },
  { id: 'c-utensilios', name: 'Utensílios e Ferramentas de Pequeno Valor', category: 'Materiais', amount: 1175.26, monthId: 'consolidado-controlar', monthLabel: 'Ago (Controlar)', details: 'Aquisições pontuais de manutenção' },
  { id: 'c-arquitetura', name: 'Serviços de Arquitetura e Engenharia', category: 'Projetos', amount: 1000.00, monthId: 'consolidado-controlar', monthLabel: 'Jun (Controlar)', details: 'Consultoria técnica complementar' },

  // Innova Fev/2026 Items
  { id: 'fev-estorno', name: 'Estorno de Transferência Indevida (W. Mostaert)', category: 'Regularização', amount: 51200.00, monthId: 'fev-2026', monthLabel: 'Fev/2026 (Innova)', details: 'Devolução de TED recebida por equívoco em 13/02' },
  { id: 'fev-fenix-1', name: 'Fênix Terceirizações - Portaria Jan/2026 (NF 49)', category: 'Terceirização', amount: 23327.53, monthId: 'fev-2026', monthLabel: 'Fev/2026 (Innova)', details: 'Líquido pago com 11% INSS retido' },
  { id: 'fev-fenix-2', name: 'Fênix Terceirizações - Portaria Fev/2026 (NF 51)', category: 'Terceirização', amount: 25919.47, monthId: 'fev-2026', monthLabel: 'Fev/2026 (Innova)', details: 'Líquido pago com 11% INSS retido' },
  { id: 'fev-sindico', name: 'Honorários do Síndico - Jan/2026 (RPA 12026)', category: 'Administração', amount: 5446.56, monthId: 'fev-2026', monthLabel: 'Fev/2026 (Innova)', details: 'Maurício Lacerda Sobrinho (líquido)' },
  { id: 'fev-laudo-1', name: 'WOM Engenharia - Laudo Recebimento 1/4 (NF 2653)', category: 'Engenharia', amount: 3650.00, monthId: 'fev-2026', monthLabel: 'Fev/2026 (Innova)', details: '1ª parcela de 4 do contrato de vistoria' },
  { id: 'fev-innova-ger1', name: 'PMA Innova - Gerenciamento Custo Jan (NF 25930)', category: 'Administração', amount: 3933.44, monthId: 'fev-2026', monthLabel: 'Fev/2026 (Innova)', details: 'Líquido de taxas de gerenciamento' },
  { id: 'fev-innova-ger2', name: 'PMA Innova - Gerenciamento Custo Fev (NF 25938)', category: 'Administração', amount: 4720.13, monthId: 'fev-2026', monthLabel: 'Fev/2026 (Innova)', details: 'Líquido de taxas de gerenciamento' },
  { id: 'fev-innova-adm1', name: 'PMA Innova - Taxa de Administração Jan (NF 25929)', category: 'Administração', amount: 2150.93, monthId: 'fev-2026', monthLabel: 'Fev/2026 (Innova)', details: 'Taxa condominial proporcional' },
  { id: 'fev-innova-adm2', name: 'PMA Innova - Taxa de Administração Fev (NF 25937)', category: 'Administração', amount: 2581.12, monthId: 'fev-2026', monthLabel: 'Fev/2026 (Innova)', details: 'Taxa condominial proporcional' },
  { id: 'fev-cim', name: 'Prefeitura do Recife - Taxa CIM 2026.1', category: 'Tributos', amount: 535.54, monthId: 'fev-2026', monthLabel: 'Fev/2026 (Innova)', details: 'Taxa imobiliária municipal' },
  { id: 'fev-banco', name: 'Tarifas e Custas de Cobrança Bancária', category: 'Financeiras', amount: 112.20, monthId: 'fev-2026', monthLabel: 'Fev/2026 (Innova)', details: '9 liquidações e custas de emissão' },

  // Innova Mar/2026 Items
  { id: 'mar-darf-inss', name: 'Receita Federal - DARF Previdenciário INSS', category: 'Tributos', amount: 7286.30, monthId: 'mar-2026', monthLabel: 'Mar/2026 (Innova)', details: 'INSS retido de Fênix (NFs 49/51) e Innova (NFs 25930/25938)' },
  { id: 'mar-sindico', name: 'Honorários do Síndico - Fev/2026 (RPA 1022026)', category: 'Administração', amount: 5446.56, monthId: 'mar-2026', monthLabel: 'Mar/2026 (Innova)', details: 'Maurício Lacerda Sobrinho (líquido)' },
  { id: 'mar-laudo-2', name: 'WOM Engenharia - Laudo Recebimento 2/4 (NF 2686)', category: 'Engenharia', amount: 3650.00, monthId: 'mar-2026', monthLabel: 'Mar/2026 (Innova)', details: '2ª parcela de 4 do contrato de vistoria' },
  { id: 'mar-iss', name: 'Prefeitura do Recife - DAM ISSQN Retido', category: 'Tributos', amount: 869.47, monthId: 'mar-2026', monthLabel: 'Mar/2026 (Innova)', details: 'ISS síndico R$ 324,20 + ISS Innova R$ 545,27' },
  { id: 'mar-pis-cofins', name: 'Receita Federal - DARF 5952 PIS/COFINS/CSLL', category: 'Tributos', amount: 737.86, monthId: 'mar-2026', monthLabel: 'Mar/2026 (Innova)', details: 'Retenções das NFs da Innova' },
  { id: 'mar-locacao-not', name: 'HTM Locações - Locação de Notebook', category: 'Equipamentos', amount: 150.00, monthId: 'mar-2026', monthLabel: 'Mar/2026 (Innova)', details: 'Recibo 32419 comp. 01/2026' },
  { id: 'mar-tar-banco', name: 'Tarifas e Custas de Boletos Itaú', category: 'Financeiras', amount: 126.36, monthId: 'mar-2026', monthLabel: 'Mar/2026 (Innova)', details: 'Tarifas operacionais de títulos' }
];

// Top Revenues dataset compiled directly from all 4 reports
const allRevenuesData: FinancialItem[] = [
  // Controlar Multi-month items
  { id: 'r-c-ord-jun', name: 'Taxa Ordinária Condominial (Junho)', category: 'Taxa Ordinária', amount: 148068.86, monthId: 'consolidado-controlar', monthLabel: 'Jun (Controlar)' },
  { id: 'r-c-ord-jul', name: 'Taxa Ordinária Condominial (Julho)', category: 'Taxa Ordinária', amount: 101634.62, monthId: 'consolidado-controlar', monthLabel: 'Jul (Controlar)' },
  { id: 'r-c-ord-ago', name: 'Taxa Ordinária Condominial (Agosto)', category: 'Taxa Ordinária', amount: 100504.10, monthId: 'consolidado-controlar', monthLabel: 'Ago (Controlar)' },
  { id: 'r-c-extra-seg-mai', name: 'Taxa Extra: Sistema de Segurança (Maio)', category: 'Taxa Extra', amount: 25123.27, monthId: 'consolidado-controlar', monthLabel: 'Mai (Controlar)' },
  { id: 'r-c-ord-mai', name: 'Taxa Ordinária Condominial (Maio)', category: 'Taxa Ordinária', amount: 21533.50, monthId: 'consolidado-controlar', monthLabel: 'Mai (Controlar)' },
  { id: 'r-c-extra-seg-jun', name: 'Taxa Extra: Sistema de Segurança (Junho)', category: 'Taxa Extra', amount: 17445.22, monthId: 'consolidado-controlar', monthLabel: 'Jun (Controlar)' },
  { id: 'r-c-acordo-jun', name: 'Acordo Administrativo Inadimplentes (Junho)', category: 'Recuperação', amount: 10317.66, monthId: 'consolidado-controlar', monthLabel: 'Jun (Controlar)' },
  { id: 'r-c-fundo-jun', name: 'Fundo de Reserva (Junho)', category: 'Fundo Reserva', amount: 7792.80, monthId: 'consolidado-controlar', monthLabel: 'Jun (Controlar)' },
  { id: 'r-c-fundo-jul', name: 'Fundo de Reserva (Julho)', category: 'Fundo Reserva', amount: 5349.02, monthId: 'consolidado-controlar', monthLabel: 'Jul (Controlar)' },
  { id: 'r-c-fundo-ago', name: 'Fundo de Reserva (Agosto)', category: 'Fundo Reserva', amount: 5289.48, monthId: 'consolidado-controlar', monthLabel: 'Ago (Controlar)' },
  { id: 'r-c-extra-seg-jul', name: 'Taxa Extra: Sistema de Segurança (Julho)', category: 'Taxa Extra', amount: 5100.09, monthId: 'consolidado-controlar', monthLabel: 'Jul (Controlar)' },
  { id: 'r-c-extra-laudos-mai', name: 'Taxa Extra: Fiscalização/Laudos/Projetos', category: 'Taxa Extra', amount: 3301.73, monthId: 'consolidado-controlar', monthLabel: 'Mai (Controlar)' },
  { id: 'r-c-multas-tot', name: 'Receita com Multas de Atraso (Consolidado)', category: 'Financeira', amount: 2100.64, monthId: 'consolidado-controlar', monthLabel: 'Mai-Ago (Controlar)' },
  { id: 'r-c-fundo-mai', name: 'Fundo de Reserva (Maio)', category: 'Fundo Reserva', amount: 1133.32, monthId: 'consolidado-controlar', monthLabel: 'Mai (Controlar)' },
  { id: 'r-c-acordo-mai', name: 'Acordo Administrativo (Maio)', category: 'Recuperação', amount: 1045.64, monthId: 'consolidado-controlar', monthLabel: 'Mai (Controlar)' },

  // Innova Fev/2026 Items
  { id: 'r-fev-transferencia', name: 'Depósito por Engano a Regularizar (W. Mostaert)', category: 'Regularização', amount: 51200.00, monthId: 'fev-2026', monthLabel: 'Fev/2026 (Innova)', details: 'Estornado em 26/02/2026' },
  { id: 'r-fev-rec-extraord', name: 'Recebimentos Cotas Extraordinárias Condôminos', category: 'Taxa Extra', amount: 27910.27, monthId: 'fev-2026', monthLabel: 'Fev/2026 (Innova)', details: 'Rateio segurança e recebimento' },
  { id: 'r-fev-antecipacoes', name: 'Antecipações de Cotas Futuras', category: 'Taxa Ordinária', amount: 900.94, monthId: 'fev-2026', monthLabel: 'Fev/2026 (Innova)' },
  { id: 'r-fev-multas', name: 'Multas e Juros de Boletos', category: 'Financeira', amount: 31.77, monthId: 'fev-2026', monthLabel: 'Fev/2026 (Innova)' },

  // Innova Mar/2026 Items
  { id: 'r-mar-const-fev', name: 'Acordo Construtora - Quitação Taxa Fev/2026', category: 'Taxa Ordinária', amount: 83890.56, monthId: 'mar-2026', monthLabel: 'Mar/2026 (Innova)', details: 'Pago em 10/03/2026' },
  { id: 'r-mar-const-mar', name: 'Acordo Construtora - Quitação Taxa Mar/2026', category: 'Taxa Ordinária', amount: 83890.56, monthId: 'mar-2026', monthLabel: 'Mar/2026 (Innova)', details: 'Pago em 10/03/2026' },
  { id: 'r-mar-rec-extraord', name: 'Recebimentos Cotas Extraordinárias', category: 'Taxa Extra', amount: 25556.01, monthId: 'mar-2026', monthLabel: 'Mar/2026 (Innova)' },
  { id: 'r-mar-rec-atrasadas', name: 'Recebimentos de Cotas em Atraso Unidades', category: 'Recuperação', amount: 440.35, monthId: 'mar-2026', monthLabel: 'Mar/2026 (Innova)' },
  { id: 'r-mar-multas-juros', name: 'Multas e Juros Recebidos', category: 'Financeira', amount: 86.72, monthId: 'mar-2026', monthLabel: 'Mar/2026 (Innova)' }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'inadimplencia' | 'analise281k' | 'timeline' | 'documentos'>('dashboard');
  const [selectedMonthFilter, setSelectedMonthFilter] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [unitFilter, setUnitFilter] = useState<string>('all');
  const [expandedMonthId, setExpandedMonthId] = useState<string | null>(null);
  const [showPdfModal, setShowPdfModal] = useState<boolean>(false);
  const [pdfScope, setPdfScope] = useState<'current' | 'all'>('current');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
  const [pdfSuccessMessage, setPdfSuccessMessage] = useState<string | null>(null);
  const [generatedPdfBlobUrl, setGeneratedPdfBlobUrl] = useState<string | null>(null);
  const [generatedPdfFileName, setGeneratedPdfFileName] = useState<string | null>(null);
  const [copiedSummary, setCopiedSummary] = useState<boolean>(false);
  const [pdfActiveView, setPdfActiveView] = useState<'preview' | 'doc' | 'texto'>('preview');

  // Filter expenses according to selection
  const filteredExpenses = useMemo(() => {
    let list = allExpensesData;
    if (selectedMonthFilter !== 'todos') {
      list = list.filter((item) => item.monthId === selectedMonthFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((i) => i.name.toLowerCase().includes(q) || i.category.toLowerCase().includes(q));
    }
    return list;
  }, [selectedMonthFilter, searchQuery]);

  // Filter revenues according to selection
  const filteredRevenues = useMemo(() => {
    let list = allRevenuesData;
    if (selectedMonthFilter !== 'todos') {
      list = list.filter((item) => item.monthId === selectedMonthFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((i) => i.name.toLowerCase().includes(q) || i.category.toLowerCase().includes(q));
    }
    return list;
  }, [selectedMonthFilter, searchQuery]);

  // Top 10 + Others for Expenses
  const { topExpenses, otherExpensesTotal, totalExpensesSum } = useMemo(() => {
    const sorted = [...filteredExpenses].sort((a, b) => b.amount - a.amount);
    const top10 = sorted.slice(0, 10);
    const others = sorted.slice(10);
    const otherSum = others.reduce((acc, curr) => acc + curr.amount, 0);
    const total = sorted.reduce((acc, curr) => acc + curr.amount, 0);
    return {
      topExpenses: top10,
      otherExpensesTotal: otherSum,
      totalExpensesSum: total
    };
  }, [filteredExpenses]);

  // Top 10 + Others for Revenues
  const { topRevenues, otherRevenuesTotal, totalRevenuesSum } = useMemo(() => {
    const sorted = [...filteredRevenues].sort((a, b) => b.amount - a.amount);
    const top10 = sorted.slice(0, 10);
    const others = sorted.slice(10);
    const otherSum = others.reduce((acc, curr) => acc + curr.amount, 0);
    const total = sorted.reduce((acc, curr) => acc + curr.amount, 0);
    return {
      topRevenues: top10,
      otherRevenuesTotal: otherSum,
      totalRevenuesSum: total
    };
  }, [filteredRevenues]);

  const maxExpenseValue = topExpenses[0]?.amount || 1;
  const maxRevenueValue = topRevenues[0]?.amount || 1;

  const handleGeneratePdf = (scope: 'current' | 'all') => {
    setIsGeneratingPdf(true);
    setPdfSuccessMessage(null);

    try {
      const filterLabel =
        selectedMonthFilter === 'todos'
          ? 'Consolidado Geral (Todos os Períodos)'
          : selectedMonthFilter === 'consolidado-controlar'
          ? 'Controlar Condomínio Digital (Jan a Ago/2026)'
          : selectedMonthFilter === 'fev-2026'
          ? 'Fevereiro/2026 (Innova Housing)'
          : 'Março/2026 (Innova Housing)';

      const { fileName, blobUrl } = generateExecutivePdf(
        scope,
        activeTab,
        monthlyTimeline,
        {
          topExpenses,
          otherExpensesTotal,
          totalExpensesSum,
          topRevenues,
          otherRevenuesTotal,
          totalRevenuesSum
        },
        filterLabel
      );

      setGeneratedPdfBlobUrl(blobUrl);
      setGeneratedPdfFileName(fileName);
      setPdfSuccessMessage(`Documento PDF "${fileName}" gerado com sucesso!`);

      // Trigger direct download
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
      }, 500);

    } catch (err) {
      console.error('Erro gerando PDF:', err);
      setPdfSuccessMessage('Erro ao gerar PDF diretamente. Tente a opção de visualização para impressão.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleCopySummary = () => {
    let summaryText = `CONDOMÍNIO DO EDIFÍCIO MOINHO SILO 240 - PARECER EXECUTIVO\n`;
    summaryText += `Emissão: 24/09/2026 • Recife-PE\n\n`;
    summaryText += `1. DISPONIBILIDADE E SALDO ACUMULADO:\n`;
    summaryText += `• Saldo Final em Conta (31/08/2026): R$ 281.045,94\n`;
    summaryText += `• Capital de Giro Livre Operacional: R$ 210.390,04 (74,8%)\n`;
    summaryText += `• Fundos Carimbados/Vinculados: R$ 70.655,90 (Fundo Reserva R$ 19,5K + Segurança R$ 47,6K + Laudos R$ 3,4K)\n`;
    summaryText += `• Máquinas e Equipamentos (R$ 76.800,00): 100% QUITADAS em 3 parcelas de R$ 25.600,00 (sem compromissos futuros)\n`;
    summaryText += `• Dívidas e Empréstimos Bancários: R$ 0,00\n\n`;
    summaryText += `2. INADIMPLÊNCIA & COBRANÇA:\n`;
    summaryText += `• Inadimplência Mais Atualizada: R$ 3.692,43 (apenas 3,2% - 96,8% adimplente)\n`;
    summaryText += `• Pico em Fevereiro/2026: R$ 85.230,29 (98,4% da Construtora)\n`;
    summaryText += `• Recuperado em Março/2026: R$ 84.330,91 (98,9% da dívida liquidada em 30 dias)\n`;
    summaryText += `• Redução da Inadimplência: -95,7%\n\n`;
    summaryText += `3. SALDOS MENSAIS E MÉDIAS MÓVEIS (8 MESES):\n`;
    summaryText += `• Média Móvel Líquida dos Últimos 3 Meses (Jun, Jul, Ago): + R$ 64.360,89 / mês\n`;
    summaryText += `• Média Geral de Diferença Mensal de 2026: + R$ 35.130,74 / mês\n`;
    summaryText += `• Média Líquida da Gestão Controlar (Mai a Ago): + R$ 36.977,97 / mês\n`;
    summaryText += `• Saldo de Fev/26: R$ 40.356,62 | Saldo de Ago/26: R$ 281.045,94\n\n`;
    summaryText += `Signatários: Maurício Lacerda Sobrinho (Síndico), Carla Cristina Belchior (Gerente Financeira) e Fabio Luiz Siqueira de Paula (Controller).`;

    navigator.clipboard.writeText(summaryText);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Top Header Bar */}
      <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-sm">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-base font-bold tracking-tight text-white block leading-tight">
                  Moinho Silo 240
                </span>
                <span className="text-xs text-slate-400 block leading-tight">
                  Painel de Auditoria & Prestação de Contas
                </span>
              </div>
            </div>

            {/* Navigation Tabs */}
            <nav className="flex items-center gap-1.5 p-1 bg-slate-800/80 rounded-xl border border-slate-700/60 overflow-x-auto">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'dashboard'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <PieChart className="w-3.5 h-3.5" />
                Top 10 Custos & Receitas
              </button>

              <button
                onClick={() => setActiveTab('inadimplencia')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'inadimplencia'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-300" />
                Inadimplência & Cobrança
              </button>

              <button
                onClick={() => setActiveTab('analise281k')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'analise281k'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Auditoria R$ 281K
              </button>

              <button
                onClick={() => setActiveTab('timeline')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'timeline'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                Saldos Mensais
              </button>

              <button
                onClick={() => setActiveTab('documentos')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'documentos'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <FileCheck2 className="w-3.5 h-3.5" />
                Fontes (PDFs)
              </button>
            </nav>

            {/* Global PDF Export Button */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setPdfScope('current');
                  setShowPdfModal(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-white text-slate-900 hover:bg-slate-100 shadow-sm transition-all cursor-pointer whitespace-nowrap"
                title="Salvar esta visualização ou relatório completo em PDF"
              >
                <Printer className="w-3.5 h-3.5 text-blue-600" />
                <span>Salvar em PDF</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Official Header exclusively for PDF / Print Output */}
        <div className="print-only mb-6 border-b-2 border-slate-900 pb-4">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-xl font-bold uppercase tracking-tight text-slate-900">
                Condomínio do Prédio 240 do Complexo Multiuso Moinho Recife
              </h1>
              <p className="text-xs text-slate-600 mt-0.5">
                CNPJ: 47.289.584/0002-01 • Inscrição Municipal: 7765541 • Silo 240
              </p>
              <p className="text-xs text-slate-500">
                Rua de São Jorge, 240, Bloco A, Bairro do Recife, Recife - PE, CEP 50030-240
              </p>
            </div>
            <div className="text-right text-xs">
              <span className="font-bold text-slate-900 block">RELATÓRIO DE PRESTAÇÃO DE CONTAS</span>
              <span className="text-slate-500 block">Exercício 2026 • Emissão Oficial</span>
              <span className="text-blue-700 font-bold block uppercase mt-1">
                {activeTab === 'dashboard' && 'Demonstrativo: 10 Maiores Custos & Receitas'}
                {activeTab === 'inadimplencia' && 'Relatório de Inadimplência & Cobrança'}
                {activeTab === 'analise281k' && 'Auditoria & Disponibilidade dos R$ 281K'}
                {activeTab === 'timeline' && 'Saldos Mensais, Diferenças & Média Móvel'}
                {activeTab === 'documentos' && 'Fontes Documentais e Processos'}
              </span>
            </div>
          </div>
        </div>
        
        {/* Banner Alert with Core Answer about the R$ 281K Question */}
        <section className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-lg border border-slate-800">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                PARECER DE AUDITORIA FINANCEIRA • AGOSTO/2026
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Saldo Acumulado em Caixa: <span className="text-emerald-400 font-mono">R$ 281.045,94</span>
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                <strong>Os R$ 281K estão comprometidos?</strong> A análise técnica dos 4 relatórios revela que 
                <strong> ~R$ 70.883,00</strong> possuem destinação carimbada e vinculada por convenção/assembleia 
                (Fundo de Reserva de <strong>R$ 19.564,62</strong> e saldo da Taxa Extra de Segurança de <strong>R$ 47.668,58</strong>). 
                Os <strong>~R$ 210.162,00</strong> restantes representam <strong>capital de giro operacional livre</strong>. 
                As parcelas de máquinas e equipamentos (R$ 76.800,00) <strong>já foram 100% quitadas</strong> até Julho/2026, 
                e não constam dívidas financeiras nem empréstimos em aberto.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10 shrink-0 space-y-2 text-center lg:text-left min-w-[240px]">
              <p className="text-xs text-slate-300">Composição do Saldo Final</p>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-emerald-300 font-medium">Livre Operacional:</span>
                  <span className="font-mono font-bold text-white">~R$ 210,1 mil</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-amber-300 font-medium">Fundos Vinculados:</span>
                  <span className="font-mono font-bold text-white">~R$ 70,8 mil</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">Dívidas Bancárias:</span>
                  <span className="font-mono font-bold text-emerald-400">R$ 0,00</span>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('analise281k')}
                className="w-full mt-2 py-1.5 px-3 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-slate-950 transition-colors flex items-center justify-center gap-1"
              >
                Ver Detalhes do Parecer <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </section>

        {/* Tab 1: Dashboard with Top 10 Expenses & Revenues */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Filter Bar */}
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-500" />
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Filtrar Período:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => setSelectedMonthFilter('todos')}
                    className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                      selectedMonthFilter === 'todos'
                        ? 'bg-blue-600 text-white font-semibold shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Todos (Consolidado)
                  </button>
                  <button
                    onClick={() => setSelectedMonthFilter('consolidado-controlar')}
                    className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                      selectedMonthFilter === 'consolidado-controlar'
                        ? 'bg-blue-600 text-white font-semibold shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Controlar (Jan-Ago)
                  </button>
                  <button
                    onClick={() => setSelectedMonthFilter('fev-2026')}
                    className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                      selectedMonthFilter === 'fev-2026'
                        ? 'bg-blue-600 text-white font-semibold shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Fev/2026 (Innova)
                  </button>
                  <button
                    onClick={() => setSelectedMonthFilter('mar-2026')}
                    className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                      selectedMonthFilter === 'mar-2026'
                        ? 'bg-blue-600 text-white font-semibold shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Mar/2026 (Innova)
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Pesquisar despesa ou receita..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-56"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setPdfScope('current');
                    setShowPdfModal(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition-colors cursor-pointer shrink-0"
                  title="Salvar dados de Custos e Receitas em PDF"
                >
                  <Printer className="w-3.5 h-3.5 text-blue-600" />
                  <span>Salvar PDF</span>
                </button>
              </div>
            </div>

            {/* Monthly Balances Overview Grid */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    Saldos Mensais do Condomínio (Linha do Tempo)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Posição bancária e variação financeira mês a mês
                  </p>
                </div>
                <span className="text-xs font-semibold text-slate-500">
                  Valores em Reais (BRL)
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {monthlyTimeline.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3.5 rounded-xl border transition-all ${
                      selectedMonthFilter === item.id
                        ? 'bg-blue-50/80 border-blue-500 shadow-sm ring-1 ring-blue-500'
                        : 'bg-slate-50/60 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 mb-1">
                      <span>{item.name}</span>
                      <span className="text-[10px] text-slate-400">{item.source}</span>
                    </div>
                    <p className="text-sm font-bold font-mono text-slate-900">
                      R$ {item.saldoFinal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                    <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px]">
                      <span className="text-slate-500">Variação:</span>
                      <span className={`font-mono font-semibold ${item.movLiquido >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                        {item.movLiquido >= 0 ? '+' : ''}{item.movLiquido.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Graphs Grid: 10 Maiores Custos vs 10 Maiores Receitas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* TOP 10 CUSTOS */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                      <h3 className="text-base font-bold text-slate-900">
                        10 Maiores Custos / Despesas
                      </h3>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Visualização gráfica proporcional com resto agrupado em "Outros"
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">Total Despesas:</span>
                    <span className="text-sm font-bold font-mono text-rose-700">
                      R$ {totalExpensesSum.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                {/* Bars List */}
                <div className="space-y-3">
                  {topExpenses.map((expense, idx) => {
                    const percentageOfTotal = ((expense.amount / totalExpensesSum) * 100).toFixed(1);
                    const barWidth = Math.max(8, (expense.amount / maxExpenseValue) * 100);

                    return (
                      <div key={expense.id} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium text-slate-800 flex items-center gap-1.5 truncate max-w-[70%]">
                            <span className="text-slate-400 font-mono text-[11px] w-4">{idx + 1}.</span>
                            <span className="truncate" title={expense.name}>{expense.name}</span>
                          </span>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[11px] text-slate-400 font-mono">{percentageOfTotal}%</span>
                            <span className="font-bold font-mono text-slate-900">
                              R$ {expense.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </span>
                          </div>
                        </div>

                        {/* Bar */}
                        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                          <div
                            className="bg-rose-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${barWidth}%` }}
                          />
                        </div>
                        {expense.details && (
                          <p className="text-[10px] text-slate-400 pl-5">{expense.details}</p>
                        )}
                      </div>
                    );
                  })}

                  {/* Outros Custos */}
                  {otherExpensesTotal > 0 && (
                    <div className="space-y-1 pt-3 border-t border-slate-100">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-slate-600 flex items-center gap-1.5">
                          <span className="text-slate-400 font-mono text-[11px] w-4">11.</span>
                          <span>Outros Custos Agrupados ({filteredExpenses.length - 10} itens)</span>
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-slate-400 font-mono">
                            {((otherExpensesTotal / totalExpensesSum) * 100).toFixed(1)}%
                          </span>
                          <span className="font-bold font-mono text-slate-700">
                            R$ {otherExpensesTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div
                          className="bg-slate-400 h-full rounded-full transition-all duration-500"
                          style={{ width: `${Math.max(6, (otherExpensesTotal / maxExpenseValue) * 100)}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* TOP 10 RECEITAS */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                      <h3 className="text-base font-bold text-slate-900">
                        10 Maiores Receitas / Entradas
                      </h3>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Visualização gráfica proporcional com resto agrupado em "Outras"
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">Total Receitas:</span>
                    <span className="text-sm font-bold font-mono text-emerald-700">
                      R$ {totalRevenuesSum.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                {/* Bars List */}
                <div className="space-y-3">
                  {topRevenues.map((revenue, idx) => {
                    const percentageOfTotal = ((revenue.amount / totalRevenuesSum) * 100).toFixed(1);
                    const barWidth = Math.max(8, (revenue.amount / maxRevenueValue) * 100);

                    return (
                      <div key={revenue.id} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium text-slate-800 flex items-center gap-1.5 truncate max-w-[70%]">
                            <span className="text-slate-400 font-mono text-[11px] w-4">{idx + 1}.</span>
                            <span className="truncate" title={revenue.name}>{revenue.name}</span>
                          </span>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[11px] text-slate-400 font-mono">{percentageOfTotal}%</span>
                            <span className="font-bold font-mono text-slate-900">
                              R$ {revenue.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </span>
                          </div>
                        </div>

                        {/* Bar */}
                        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                          <div
                            className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${barWidth}%` }}
                          />
                        </div>
                        {revenue.details && (
                          <p className="text-[10px] text-slate-400 pl-5">{revenue.details}</p>
                        )}
                      </div>
                    );
                  })}

                  {/* Outras Receitas */}
                  {otherRevenuesTotal > 0 && (
                    <div className="space-y-1 pt-3 border-t border-slate-100">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-slate-600 flex items-center gap-1.5">
                          <span className="text-slate-400 font-mono text-[11px] w-4">11.</span>
                          <span>Outras Receitas Agrupadas ({filteredRevenues.length - 10} itens)</span>
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-slate-400 font-mono">
                            {((otherRevenuesTotal / totalRevenuesSum) * 100).toFixed(1)}%
                          </span>
                          <span className="font-bold font-mono text-slate-700">
                            R$ {otherRevenuesTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div
                          className="bg-slate-400 h-full rounded-full transition-all duration-500"
                          style={{ width: `${Math.max(6, (otherRevenuesTotal / maxRevenueValue) * 100)}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Tab: Inadimplência & Cobrança */}
        {activeTab === 'inadimplencia' && (
          <div className="space-y-8">
            {/* Banner de Destaque: Valor Mais Atualizado */}
            <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 rounded-2xl p-6 text-white border-2 border-emerald-500/40 shadow-md">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5 max-w-3xl">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      Posição Atualizada da Inadimplência
                    </span>
                    <span className="text-xs text-slate-400">Balancete Auditado & Relatório Controlar 2026</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-baseline gap-3">
                    <span className="text-emerald-400 font-mono">R$ 3.692,43</span>
                    <span className="text-xs sm:text-sm font-normal text-emerald-200/80 bg-emerald-900/60 px-2.5 py-1 rounded-md border border-emerald-700/50">
                      Taxa Residual: apenas 3,2% (96,8% Adimplente)
                    </span>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    <strong>Valor mais recente discriminado em balancete analítico:</strong> R$ 3.692,43 (remanescente em Março/2026, com apenas 6 unidades devedoras de cotas de segurança). 
                    No relatório subsequente da <strong>Controlar (até Agosto/2026)</strong>, o condomínio arrecadou mais <strong>R$ 12.189,05 em Acordos Administrativos</strong> de cotas atrasadas, mantendo a inadimplência líquida praticamente <strong>estabilizada em patamar residual / zerado</strong> no fechamento do 1º semestre.
                  </p>
                </div>

                <div className="shrink-0 bg-white/5 rounded-xl p-4 border border-white/10 text-right min-w-[200px]">
                  <span className="text-xs text-slate-400 block">Queda em relação ao Pico</span>
                  <span className="text-2xl font-bold font-mono text-emerald-400 block mt-0.5">- 95,7%</span>
                  <span className="text-[11px] text-slate-400 block mt-1">De R$ 85,2K para R$ 3,6K</span>
                </div>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Valor Mais Atualizado */}
              <div className="bg-white rounded-2xl border-2 border-emerald-500/80 p-5 shadow-sm relative overflow-hidden bg-emerald-50/10">
                <div className="absolute top-0 right-0 w-2 h-full bg-emerald-500" />
                <div className="flex items-center justify-between text-xs text-emerald-800 font-bold mb-1">
                  <span>INADIMPLÊNCIA ATUAL</span>
                  <span className="text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                    Posição Mais Recente
                  </span>
                </div>
                <p className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-900 mt-1">
                  R$ 3.692,43
                </p>
                <p className="text-xs text-emerald-700 mt-1 font-medium">
                  Apenas 6 unidades com cotas de segurança
                </p>
              </div>

              {/* Card 2: Pico de Inadimplência */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span>Pico de Inadimplência (Fev)</span>
                  <span className="text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">Fev/2026</span>
                </div>
                <p className="text-2xl font-bold font-mono text-amber-900 mt-1">
                  R$ 85.230,29
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  98,4% concentrado na Construtora (R$ 83,8K)
                </p>
              </div>

              {/* Card 3: Recuperado em Março */}
              <div className="bg-white rounded-2xl border border-emerald-200 p-5 shadow-sm bg-emerald-50/20">
                <div className="flex items-center justify-between text-xs text-emerald-700 mb-1">
                  <span>Recuperado em Março</span>
                  <span className="text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200">98,9%</span>
                </div>
                <p className="text-2xl font-bold font-mono text-emerald-800 mt-1">
                  R$ 84.330,91
                </p>
                <p className="text-xs text-emerald-600 mt-1">
                  Acordo da Construtora liquidado em 10/03
                </p>
              </div>

              {/* Card 4: Acordos Quitados Controlar */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span>Acordos Quitados (Controlar)</span>
                  <span className="text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">Mai-Ago</span>
                </div>
                <p className="text-2xl font-bold font-mono text-indigo-900 mt-1">
                  R$ 12.189,05
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  + R$ 2.611 de multas e juros de mora
                </p>
              </div>
            </div>

            {/* Special Feature: The Case of the Construtora */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="space-y-3 max-w-3xl">
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-700 uppercase tracking-wider">
                    <Building2 className="w-4 h-4 text-blue-600" />
                    Estudo de Caso de Auditoria: A Regularização da Construtora
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">
                    O Falso Alarme dos R$ 85 Mil de Inadimplência em Fevereiro
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    No balancete de Fevereiro/2026, a taxa de inadimplência aparentava estar em nível crítico de 
                    <strong> R$ 85.230,29</strong>. No entanto, a auditoria das páginas 15 e 16 comprova que 
                    <strong> R$ 83.890,56 (98,4%)</strong> correspondiam a um único recibo em nome da <strong>Construtora</strong> 
                    (Recibo 1522622 / Acordo 76806 com vencimento em 27/02/2026).
                  </p>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    A dívida foi renegociada para a data de <strong>10/03/2026</strong>, quando a construtora liquidou não apenas os 
                    <strong> R$ 83.890,56 de Fevereiro</strong>, como também pagou no mesmo dia a cota de <strong>Março (outros R$ 83.890,56)</strong>, 
                    totalizando <strong>R$ 167.781,12</strong> em um só dia. Esse pagamento derrubou a inadimplência total do condomínio para irrisórios 
                    <strong> R$ 3.692,43</strong>.
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 shrink-0 min-w-[260px] space-y-3">
                  <span className="text-xs font-bold text-slate-700 block">Composição do Boleto da Construtora</span>
                  <div className="space-y-1.5 text-xs font-mono">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Taxa Condominial:</span>
                      <span className="font-bold text-slate-800">R$ 57.168,62</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Área Comum Geral:</span>
                      <span className="font-bold text-slate-800">R$ 17.997,63</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Dif. Honorários Síndico:</span>
                      <span className="font-bold text-slate-800">R$ 4.966,00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Fundo de Reserva:</span>
                      <span className="font-bold text-slate-800">R$ 2.858,43</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Fundo Reserva Comum:</span>
                      <span className="font-bold text-slate-800">R$ 899,88</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-slate-200 text-sm font-bold text-emerald-700">
                      <span>Total Liquidado:</span>
                      <span>R$ 83.890,56</span>
                    </div>
                  </div>
                  <span className="inline-block w-full text-center text-[10px] text-emerald-700 bg-emerald-100/70 py-1 rounded font-sans font-semibold">
                    Quitado via Acordo 76806 em 10/03/2026
                  </span>
                </div>
              </div>
            </div>

            {/* Inadimplência Chart: Fev vs Mar vs Ago */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-emerald-600" />
                Curva de Redução da Inadimplência no Condomínio
              </h3>
              <p className="text-xs text-slate-500 mb-6">
                Comparativo da inadimplência total acumulada entre os meses auditados
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Fevereiro */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-700 font-bold">Fevereiro / 2026</span>
                    <span className="font-mono text-amber-700 font-bold">R$ 85.230,29</span>
                  </div>
                  <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full w-full" />
                  </div>
                  <span className="text-[11px] text-slate-500 block">Pico inicial (espera da construtora)</span>
                </div>

                {/* Março */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-700 font-bold">Março / 2026</span>
                    <span className="font-mono text-emerald-700 font-bold">R$ 3.692,43</span>
                  </div>
                  <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: '4.3%' }} />
                  </div>
                  <span className="text-[11px] text-emerald-700 font-medium block">Queda de 95,7% após quitação</span>
                </div>

                {/* Agosto */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-700 font-bold">Agosto / 2026</span>
                    <span className="font-mono text-emerald-700 font-bold">Controlada</span>
                  </div>
                  <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden">
                    <div className="bg-emerald-600 h-full rounded-full" style={{ width: '1.5%' }} />
                  </div>
                  <span className="text-[11px] text-slate-500 block">Acordos contínuos e inadimplência residual mínima</span>
                </div>
              </div>
            </div>

            {/* Debtor Breakdown Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Relação Analítica de Devedores Identificados nos Relatórios
                  </h3>
                  <p className="text-xs text-slate-500">
                    Unidades autônomas, valores, recibos e status de cobrança
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={unitFilter}
                    onChange={(e) => setUnitFilter(e.target.value)}
                    className="py-1.5 px-3 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Todas as Unidades</option>
                    <option value="quitados">Apenas Quitados</option>
                    <option value="pendentes">Apenas Pendentes / Em Acordo</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => {
                      setPdfScope('current');
                      setShowPdfModal(true);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition-colors cursor-pointer"
                    title="Exportar dados de Inadimplência em PDF"
                  >
                    <Printer className="w-3.5 h-3.5 text-amber-600" />
                    <span>Salvar Guia em PDF</span>
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Unidade</th>
                      <th className="py-2.5 px-3">Recibo / Venc.</th>
                      <th className="py-2.5 px-3">Composição da Cobrança</th>
                      <th className="py-2.5 px-3 text-right">Valor Nominal</th>
                      <th className="py-2.5 px-3 text-center">Status Contábil</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {/* Construtora */}
                    {(unitFilter === 'all' || unitFilter === 'quitados') && (
                      <tr className="hover:bg-slate-50/70">
                        <td className="py-3 px-3 align-top font-bold text-slate-900">
                          CONSTRUTORA
                        </td>
                        <td className="py-3 px-3 align-top font-mono text-slate-600">
                          Recibo 1522622<br /><span className="text-[10px] text-slate-400">Venc: 27/02/2026</span>
                        </td>
                        <td className="py-3 px-3 align-top text-slate-700">
                          Taxa Condominial Ordinária + Área Comum Geral + Fundo de Reserva + Honorários Síndico
                        </td>
                        <td className="py-3 px-3 align-top text-right font-mono font-bold text-slate-900">
                          R$ 83.890,56
                        </td>
                        <td className="py-3 px-3 align-top text-center">
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            Quitado em 10/03/2026
                          </span>
                        </td>
                      </tr>
                    )}

                    {/* Unidade 0706 */}
                    {(unitFilter === 'all' || unitFilter === 'quitados') && (
                      <tr className="hover:bg-slate-50/70">
                        <td className="py-3 px-3 align-top font-bold text-slate-900">
                          Unidade 0706
                        </td>
                        <td className="py-3 px-3 align-top font-mono text-slate-600">
                          Recibo 1521377<br /><span className="text-[10px] text-slate-400">Venc: 13/02/2026</span>
                        </td>
                        <td className="py-3 px-3 align-top text-slate-700">
                          Projeto de Segurança (R$ 385,40) + Recebimento Áreas Comuns (R$ 54,95)
                        </td>
                        <td className="py-3 px-3 align-top text-right font-mono font-bold text-slate-900">
                          R$ 440,35
                        </td>
                        <td className="py-3 px-3 align-top text-center">
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            Quitado em 10/03 (+ R$ 12,55 juros/multa)
                          </span>
                        </td>
                      </tr>
                    )}

                    {/* Unidade 0106 */}
                    {(unitFilter === 'all' || unitFilter === 'pendentes') && (
                      <tr className="hover:bg-slate-50/70">
                        <td className="py-3 px-3 align-top font-bold text-slate-900">
                          Unidade 0106
                        </td>
                        <td className="py-3 px-3 align-top font-mono text-slate-600">
                          Recibo 1537109<br /><span className="text-[10px] text-slate-400">Venc: 10/03/2026</span>
                        </td>
                        <td className="py-3 px-3 align-top text-slate-700">
                          Projeto de Segurança (R$ 457,58) + Recebimento Áreas Comuns (R$ 65,24)
                        </td>
                        <td className="py-3 px-3 align-top text-right font-mono font-bold text-slate-900">
                          R$ 522,82
                        </td>
                        <td className="py-3 px-3 align-top text-center">
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                            Pendente em Março
                          </span>
                        </td>
                      </tr>
                    )}

                    {/* Unidade 0203 */}
                    {(unitFilter === 'all' || unitFilter === 'pendentes') && (
                      <tr className="hover:bg-slate-50/70">
                        <td className="py-3 px-3 align-top font-bold text-slate-900">
                          Unidade 0203
                        </td>
                        <td className="py-3 px-3 align-top font-mono text-slate-600">
                          Recibos 1521334 e 1537114<br /><span className="text-[10px] text-slate-400">2 parcelas em aberto</span>
                        </td>
                        <td className="py-3 px-3 align-top text-slate-700">
                          Cotas extraordinárias de segurança e vistoria predial (Fev e Mar)
                        </td>
                        <td className="py-3 px-3 align-top text-right font-mono font-bold text-slate-900">
                          R$ 902,50
                        </td>
                        <td className="py-3 px-3 align-top text-center">
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                            2 Parcelas Pendentes
                          </span>
                        </td>
                      </tr>
                    )}

                    {/* Unidade 0304 */}
                    {(unitFilter === 'all' || unitFilter === 'pendentes') && (
                      <tr className="hover:bg-slate-50/70">
                        <td className="py-3 px-3 align-top font-bold text-slate-900">
                          Unidade 0304
                        </td>
                        <td className="py-3 px-3 align-top font-mono text-slate-600">
                          Recibo 1537123<br /><span className="text-[10px] text-slate-400">Acordo nº 78264</span>
                        </td>
                        <td className="py-3 px-3 align-top text-slate-700">
                          Projeto de Segurança (R$ 407,19) + Áreas Comuns (R$ 58,06)
                        </td>
                        <td className="py-3 px-3 align-top text-right font-mono font-bold text-slate-900">
                          R$ 465,25
                        </td>
                        <td className="py-3 px-3 align-top text-center">
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                            Acordo Administrativo
                          </span>
                        </td>
                      </tr>
                    )}

                    {/* Unidade 0306 */}
                    {(unitFilter === 'all' || unitFilter === 'pendentes') && (
                      <tr className="hover:bg-slate-50/70">
                        <td className="py-3 px-3 align-top font-bold text-slate-900">
                          Unidade 0306
                        </td>
                        <td className="py-3 px-3 align-top font-mono text-slate-600">
                          Recibo 1537125<br /><span className="text-[10px] text-slate-400">Acordo nº 78265</span>
                        </td>
                        <td className="py-3 px-3 align-top text-slate-700">
                          Projeto de Segurança (R$ 407,19) + Áreas Comuns (R$ 58,06)
                        </td>
                        <td className="py-3 px-3 align-top text-right font-mono font-bold text-slate-900">
                          R$ 465,25
                        </td>
                        <td className="py-3 px-3 align-top text-center">
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                            Acordo Administrativo
                          </span>
                        </td>
                      </tr>
                    )}

                    {/* Unidade 0504 */}
                    {(unitFilter === 'all' || unitFilter === 'pendentes') && (
                      <tr className="hover:bg-slate-50/70">
                        <td className="py-3 px-3 align-top font-bold text-slate-900">
                          Unidade 0504
                        </td>
                        <td className="py-3 px-3 align-top font-mono text-slate-600">
                          Recibo 1537139<br /><span className="text-[10px] text-slate-400">Venc: 10/03/2026</span>
                        </td>
                        <td className="py-3 px-3 align-top text-slate-700">
                          Projeto de Segurança (R$ 385,40) + Áreas Comuns (R$ 54,95)
                        </td>
                        <td className="py-3 px-3 align-top text-right font-mono font-bold text-slate-900">
                          R$ 440,35
                        </td>
                        <td className="py-3 px-3 align-top text-center">
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                            Pendente em Março
                          </span>
                        </td>
                      </tr>
                    )}

                    {/* Unidade 0808 */}
                    {(unitFilter === 'all' || unitFilter === 'pendentes') && (
                      <tr className="hover:bg-slate-50/70">
                        <td className="py-3 px-3 align-top font-bold text-slate-900">
                          Unidade 0808
                        </td>
                        <td className="py-3 px-3 align-top font-mono text-slate-600">
                          Recibos 1521387 e 1537167<br /><span className="text-[10px] text-slate-400">2 parcelas em aberto</span>
                        </td>
                        <td className="py-3 px-3 align-top text-slate-700">
                          Cotas extraordinárias de segurança e vistoria predial (Fev e Mar)
                        </td>
                        <td className="py-3 px-3 align-top text-right font-mono font-bold text-slate-900">
                          R$ 896,26
                        </td>
                        <td className="py-3 px-3 align-top text-center">
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                            2 Parcelas Pendentes
                          </span>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recovery Summary from Controlar Report */}
            <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md border border-slate-800">
              <h4 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                Histórico de Cobrança Administrativa & Acordos (Maio a Agosto / 2026)
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                No relatório comparativo da Controlar (Arquivo 4), a linha <code className="bg-white/10 px-1 py-0.5 rounded font-mono text-xs">Acordo Administrativo</code> 
                comprova a recuperação ativa e amigável das cotas pendentes ao longo de todo o ano de 2026:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
                <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                  <span className="text-slate-400 block text-[11px]">Recuperado em Maio</span>
                  <span className="font-bold text-white text-sm">R$ 1.045,64</span>
                </div>
                <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                  <span className="text-slate-400 block text-[11px]">Recuperado em Junho</span>
                  <span className="font-bold text-emerald-400 text-sm">R$ 10.317,66</span>
                </div>
                <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                  <span className="text-slate-400 block text-[11px]">Recuperado em Julho</span>
                  <span className="font-bold text-white text-sm">R$ 440,35</span>
                </div>
                <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                  <span className="text-slate-400 block text-[11px]">Recuperado em Agosto</span>
                  <span className="font-bold text-white text-sm">R$ 385,40</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Detailed Audit regarding the R$ 281K Question */}
        {activeTab === 'analise281k' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <div className="border-b border-slate-200 pb-4 mb-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider">
                    <ShieldCheck className="w-4 h-4" />
                    Investigação Contábil e Auditoria de Compromissos
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mt-1">
                    O valor de R$ 281.045,94 está comprometido com dívidas ou compromissos assumidos?
                  </h3>
                  <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                    Analisamos detalhadamente todos os contratos, extratos e relatórios de despesas (Innova e Controlar).
                    Abaixo está a resposta técnica fundamentada em cada página dos documentos.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setPdfScope('current');
                    setShowPdfModal(true);
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors cursor-pointer shrink-0"
                  title="Salvar Parecer Técnico dos R$ 281K em PDF"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Salvar Parecer em PDF</span>
                </button>
              </div>

              {/* 3 Pillar Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* 1. Parcelas de Máquinas e Equipamentos */}
                <div className="p-5 rounded-xl border border-emerald-200 bg-emerald-50/40">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                      <FileCheck2 className="w-4 h-4 text-emerald-600" />
                      Máquinas e Equipamentos (R$ 76.800)
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">3 x R$ 25.600</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed mb-2">
                    <strong>SITUAÇÃO: 100% QUITADO.</strong><br />
                    O relatório da Controlar (pág. 2 e 3) mostra que o investimento de R$ 76.800,00 foi integralmente liquidado em 3 parcelas de R$ 25.600,00 nos meses de Maio, Junho e Julho de 2026. Em Agosto/2026 a linha zerou.
                  </p>
                  <p className="text-[11px] text-slate-500 pt-2 border-t border-emerald-200/60">
                    Refere-se ao maquinário de implantação do condomínio (equipamentos de limpeza industrial, automação predial, maquinário de áreas comuns e sistema de segurança).
                  </p>
                </div>

                {/* 2. Fundos Vinculados por Lei/Assembleia */}
                <div className="p-5 rounded-xl border border-amber-200 bg-amber-50/40">
                  <div className="flex items-center gap-2 text-amber-800 font-bold text-sm mb-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    Valores Vinculados (~R$ 70,8K)
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    <strong>SITUAÇÃO: CARIMBADO POR ASSEMBLEIA.</strong><br />
                    • <strong>Fundo de Reserva:</strong> R$ 19.564,62 acumulados por exigência legal.<br />
                    • <strong>Taxa Extra de Segurança:</strong> R$ 47.668,58 arrecadados exclusivamente para implantar o sistema de segurança predial.<br />
                    Esses valores não devem ser usados em despesas ordinárias.
                  </p>
                </div>

                {/* 3. Dívidas Bancárias ou Passivos Judiciais */}
                <div className="p-5 rounded-xl border border-blue-200 bg-blue-50/40">
                  <div className="flex items-center gap-2 text-blue-800 font-bold text-sm mb-2">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    Dívidas & Empréstimos Bancários
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    <strong>SITUAÇÃO: NENHUMA DÍVIDA REGISTRADA.</strong><br />
                    Os extratos mensais do Itaú (Conta Innova e Conta Própria) e os balancetes não apontam nenhum tipo de empréstimo bancário, cheque especial contratado, antecipação de recebíveis com juros ou penhora judicial.
                  </p>
                </div>
              </div>

              {/* Machinery & Equipment Deep Dive Card */}
              <div className="mb-8 p-6 rounded-2xl border border-slate-200 bg-slate-50/80 space-y-4">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-indigo-600" />
                  <h4 className="text-base font-bold text-slate-900">
                    O que são as "Máquinas e Equipamentos" adquiridas (R$ 76.800,00)?
                  </h4>
                </div>
                <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-3">
                  <p>
                    No <strong>Demonstrativo Comparativo da Controlar (Arquivo 4, pág. 2 e 3)</strong>, a linha 
                    <code className="bg-slate-200 px-1.5 py-0.5 rounded text-slate-900 font-mono text-xs">Imobilizado &gt; Aquisição Máquinas e Equipamentos</code> 
                    registra um valor total acumulado de <strong>R$ 76.800,00</strong>, executado rigorosamente em 3 parcelas iguais de <strong>R$ 25.600,00</strong> nos meses de:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
                    <div className="bg-white p-3 rounded-lg border border-slate-200">
                      <span className="text-slate-400 block text-[11px]">Parcela 1/3 (Maio/2026)</span>
                      <span className="font-bold text-slate-900 text-sm">R$ 25.600,00</span>
                      <span className="text-emerald-600 block text-[10px]">Liquidada</span>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-slate-200">
                      <span className="text-slate-400 block text-[11px]">Parcela 2/3 (Junho/2026)</span>
                      <span className="font-bold text-slate-900 text-sm">R$ 25.600,00</span>
                      <span className="text-emerald-600 block text-[10px]">Liquidada</span>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-slate-200">
                      <span className="text-slate-400 block text-[11px]">Parcela 3/3 (Julho/2026)</span>
                      <span className="font-bold text-slate-900 text-sm">R$ 25.600,00</span>
                      <span className="text-emerald-600 block text-[10px]">Liquidada</span>
                    </div>
                  </div>
                  <div className="space-y-2 pt-2 text-xs text-slate-600">
                    <p>
                      <strong>1. Natureza Contábil:</strong> Trata-se de <em>Ativo Imobilizado</em> (bens duráveis que passam a pertencer ao patrimônio do condomínio, ao contrário de serviços ou materiais de consumo descartáveis). Há ainda a aquisição de um eletrodoméstico/eletroeletrônico em Julho de R$ 888,00, totalizando R$ 77.688,00 em bens imobilizados.
                    </p>
                    <p>
                      <strong>2. Finalidade no Contexto de Implantação do Silo 240:</strong> Como o empreendimento é novo e recém-entregue pela construtora, essa rubrica custeia os equipamentos operacionais permanentes necessários para o funcionamento autônomo das áreas comuns do prédio:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li><strong>Equipamentos e hardware do Sistema de Segurança & Controle de Acesso:</strong> Servidores, centrais de automação, leitores de biometria/reconhecimento facial, catracas e infraestrutura de CFTV (cujo rateio foi aprovado e arrecadado em paralelo sob a rubrica <em>"Taxa Extra - Sistema-Projeto de Segurança"</em>, que arrecadou R$ 47.668,58 no mesmo período).</li>
                      <li><strong>Maquinário Industrial de Limpeza e Conservação:</strong> Lavadoras e polidoras industriais de piso para as áreas de grande circulação e garagens, hidrojateadoras de alta pressão e equipamentos pesados de manutenção para a equipe terceirizada utilizar.</li>
                      <li><strong>Equipamentos de Apoio às Áreas Comuns e Guarita:</strong> Climatizadores/ar condicionado, mobiliário técnico de portaria e apoio aos sistemas mecânicos (gerador, bombas e reservatórios).</li>
                    </ul>
                    <p>
                      <strong>3. Onde encontrar o detalhe nota fiscal por nota fiscal:</strong> O relatório da Controlar (Arquivo 4) é um <em>balancete comparativo sintético</em> de 3 páginas (consolida por grupos de contas). As notas fiscais individuais com descrição de cada modelo e fabricante estão arquivadas nas respectivas pastas digitais mensais dos meses de <strong>Maio, Junho e Julho de 2026</strong>, acessíveis aos condôminos pelo aplicativo <strong>Gruvi</strong> (conforme instruído no Arquivo 3).
                    </p>
                  </div>
                </div>
              </div>

              {/* Exact Breakdown Table of the R$ 281K */}
              <div className="border border-slate-200 rounded-xl overflow-hidden mb-6">
                <div className="bg-slate-100 px-4 py-3 border-b border-slate-200">
                  <h4 className="text-sm font-bold text-slate-900">
                    Demonstrativo de Disponibilidade do Saldo Final (Agosto/2026: R$ 281.045,94)
                  </h4>
                </div>
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-600 uppercase border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-4">Destinação / Natureza do Saldo</th>
                      <th className="py-2.5 px-4">Status Jurídico / Contábil</th>
                      <th className="py-2.5 px-4 text-right">Valor em Caixa</th>
                      <th className="py-2.5 px-4 text-right">% do Saldo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        1. Fundo de Reserva Acumulado (Ordinário + Geral)
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        Vinculado por Lei nº 4.591/64 e Convenção (apenas emergências/obras aprovadas)
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-amber-700">
                        R$ 19.564,62
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-500">
                        7,0%
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        2. Arrecadação Taxa Extra: Projeto de Segurança
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        Carimbado por Assembleia Geral para execução e aquisição do sistema
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-amber-700">
                        R$ 47.668,58
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-500">
                        17,0%
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        3. Arrecadação Taxa Extra: Laudos e Fiscalização
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        Carimbado para o contrato de vistoria e recebimento (WOM Engenharia)
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-amber-700">
                        R$ 3.422,70
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-500">
                        1,2%
                      </td>
                    </tr>
                    <tr className="bg-slate-50/50">
                      <td className="py-3 px-4 font-bold text-slate-900">
                        Subtotal de Saldos Carimbados / Vinculados
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-700">
                        Comprometidos com finalidades específicas já aprovadas
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-amber-800">
                        R$ 70.655,90
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-700">
                        25,2%
                      </td>
                    </tr>
                    <tr className="bg-emerald-50/40">
                      <td className="py-3 px-4 font-bold text-emerald-950">
                        4. Saldo Operacional Líquido Livre (Capital de Giro)
                      </td>
                      <td className="py-3 px-4 text-emerald-900 font-medium">
                        Disponível em conta corrente para custeio ordinário regular do condomínio
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-emerald-700 text-sm">
                        R$ 210.390,04
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-emerald-800">
                        74,8%
                      </td>
                    </tr>
                    <tr className="bg-slate-900 text-white font-bold">
                      <td className="py-3 px-4">
                        TOTAL CONSOLIDADO EM AGOSTO/2026
                      </td>
                      <td className="py-3 px-4 text-slate-300">
                        Disponibilidade Total em Contas Bancárias e Aplicação
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-emerald-400 text-sm">
                        R$ 281.045,94
                      </td>
                      <td className="py-3 px-4 text-right font-mono">
                        100,0%
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Explanatory notes */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-2">
                <p>
                  <strong>💡 Capacidade de Cobertura Operacional:</strong> Com uma despesa mensal corrente entre 
                  <strong> R$ 42.000,00 e R$ 50.000,00</strong>, o saldo livre de <strong>R$ 210.390,04</strong> confere 
                  ao condomínio uma autonomia de <strong>4 a 5 meses de sobrevivência operacional</strong> sem necessidade de aportes extras, 
                  configurando uma saúde financeira robusta e sem inadimplência crítica.
                </p>
                <p>
                  <strong>🔍 Compromissos Contratuais em Andamento:</strong> O contrato de vistoria e recebimento da WOM Engenharia previa 
                  4 parcelas de R$ 3.650,00 (R$ 14.600,00 total). Nos relatórios foram liquidadas as parcelas 1/4 (Fev), 2/4 (Mar) e outra em Maio, 
                  restando no máximo a entrega do laudo final com a última parcela de R$ 3.650,00, valor irrisório frente aos R$ 281K.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Detailed Monthly Balances Timeline */}
        {activeTab === 'timeline' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <div className="border-b border-slate-200 pb-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Evolução dos Saldos Mês a Mês (De Jan/2026 a Ago/2026)
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Como o condomínio saiu de R$ 83.890,56 em Janeiro e atingiu R$ 281.045,94 em Agosto
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <div className="text-xs font-semibold text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200">
                    Média Geral de Saldo: R$ 156.991,90 / mês
                  </div>
                  <div className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                    Saldo Final (Ago): R$ 281.045,94
                  </div>
                </div>
              </div>

              {/* Averages Summary Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/70 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-emerald-900 block">Média Móvel 3M (Diferença)</span>
                    <span className="text-[9px] font-bold uppercase bg-emerald-200/80 text-emerald-900 px-1.5 py-0.5 rounded">Rec - Desp</span>
                  </div>
                  <span className="text-xl font-bold font-mono text-emerald-950 mt-1 block">
                    + R$ 64.360,89
                  </span>
                  <span className="text-[11px] text-emerald-700 font-medium">Superávit líquido médio (Jun, Jul e Ago)</span>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-slate-500 block">Média da Diferença (8 Meses)</span>
                    <span className="text-[9px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">Mensal</span>
                  </div>
                  <span className="text-lg font-bold font-mono text-slate-900 mt-1 block">
                    + R$ 35.130,74
                  </span>
                  <span className="text-[11px] text-slate-400">Sobra média mensal apurada</span>
                </div>

                <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/50">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-blue-800 block">Média Diferença Controlar</span>
                    <span className="text-[9px] font-medium text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded">Mai-Ago</span>
                  </div>
                  <span className="text-lg font-bold font-mono text-blue-950 mt-1 block">
                    + R$ 36.977,97
                  </span>
                  <span className="text-[11px] text-blue-600">Superávit mensal operacional</span>
                </div>

                <div className="p-4 rounded-xl border border-indigo-100 bg-indigo-50/50">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-indigo-800 block">Média Diferença Innova</span>
                    <span className="text-[9px] font-medium text-indigo-700 bg-indigo-100 px-1.5 py-0.5 rounded">Jan-Mar</span>
                  </div>
                  <span className="text-lg font-bold font-mono text-indigo-950 mt-1 block">
                    + R$ 71.986,17
                  </span>
                  <span className="text-[11px] text-indigo-600">Impulsionado por acerto construtora</span>
                </div>
              </div>

              {/* Esclarecimento Metodológico: Média Móvel sobre Diferença (Rec - Desp) */}
              <div className="bg-gradient-to-r from-blue-50/90 to-indigo-50/90 border border-blue-200 rounded-xl p-4 mb-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-600 text-white rounded-lg shrink-0 mt-0.5 shadow-xs">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <span>Metodologia: Média Móvel Calculada Estritamente sobre a "Diferença (Rec - Desp)"</span>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded font-bold">Auditado</span>
                    </h5>
                    <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                      A média móvel trimestral reflete <strong>exclusivamente a sobra/déficit operacional líquido de cada mês (Receitas Líquidas − Despesas Pagas)</strong>, e <em>nunca o Saldo Final acumulado em conta corrente</em>.
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      💡 <strong>Esclarecimento do 1º Trimestre:</strong> Em Jan, Fev e Mar/2026, como a implantação do condomínio partiu de saldo inicial zero, a soma acumulada das diferenças coincidiu temporariamente com o Saldo Final daquele início. A partir de Abril/2026, com o saldo inicial acumulado de R$ 133K, as grandezas diferem totalmente (ex.: em <strong>Ago/2026</strong> a média móvel da diferença é de <strong>+R$ 64.360,89</strong>, enquanto a média do saldo final seria de <strong>R$ 231.544,05</strong>).
                    </p>
                  </div>
                </div>
                <div className="bg-white px-4 py-2.5 rounded-xl border border-blue-200 shrink-0 text-center shadow-2xs self-stretch md:self-auto flex flex-col justify-center">
                  <span className="text-[10px] uppercase font-bold text-slate-500">Média Móvel Recente (3M)</span>
                  <span className="text-lg font-black font-mono text-emerald-700">+ R$ 64.360,89</span>
                  <span className="text-[10px] text-slate-400 font-medium">Jun (+108K), Jul (+21K), Ago (+64K)</span>
                </div>
              </div>

              {/* Analytical Monthly Table with Difference, Moving Average, and Click-to-Expand */}
              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs mb-6">
                <div className="bg-slate-100/90 px-4 py-3 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-blue-600" />
                      Tabela Analítica Mensal: Saldos, Diferença & Média Móvel (3M)
                    </h4>
                    <p className="text-xs text-slate-500">
                      Clique sobre qualquer mês para ver ou ocultar as 10 maiores receitas e despesas
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
                      💡 1º clique: expande • 2º clique: recolhe
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setPdfScope('current');
                        setShowPdfModal(true);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors cursor-pointer shrink-0"
                      title="Salvar Saldos Mensais em PDF"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Salvar em PDF</span>
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-3">Mês / Período</th>
                        <th className="py-3 px-3">Gestão</th>
                        <th className="py-3 px-3 text-right">Saldo Inicial</th>
                        <th className="py-3 px-3 text-right text-emerald-700">Receitas (+)</th>
                        <th className="py-3 px-3 text-right text-rose-700">Despesas (-)</th>
                        <th className="py-3 px-3 text-right bg-slate-100/80 font-bold text-slate-900 border-x border-slate-200">
                          <div>Diferença (Rec - Desp)</div>
                          <span className="text-[9px] text-slate-500 font-normal lowercase block">superávit/déficit</span>
                        </th>
                        <th className="py-3 px-3 text-right text-blue-900 font-bold">Saldo Final (=)</th>
                        <th className="py-3 px-3 text-right bg-indigo-50/70 font-bold text-indigo-950 border-l border-indigo-100">
                          <div>Média Móvel 3M (Diferença)</div>
                          <span className="text-[9px] text-indigo-700 font-normal lowercase block">calculada sobre rec − desp</span>
                        </th>
                        <th className="py-3 px-3 text-center">Detalhamento</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {monthlyTimeline.map((month) => {
                        const isExpanded = expandedMonthId === month.id;
                        const isPositiveDiff = month.movLiquido >= 0;
                        const isPositiveMM = month.mediaMovel3Meses >= 0;

                        return (
                          <tr
                            key={month.id}
                            onClick={() => setExpandedMonthId(isExpanded ? null : month.id)}
                            className={`cursor-pointer transition-colors ${
                              isExpanded
                                ? 'bg-blue-50/70 ring-1 ring-inset ring-blue-500 font-medium'
                                : 'hover:bg-slate-50'
                            }`}
                          >
                            <td className="py-3 px-3 font-bold text-slate-900 whitespace-nowrap">
                              <div className="flex items-center gap-1.5">
                                <span className={`w-2 h-2 rounded-full ${isExpanded ? 'bg-blue-600' : 'bg-slate-300'}`} />
                                <span>{month.name}</span>
                              </div>
                              <span className="text-[10px] text-slate-400 block font-normal">{month.periodLabel}</span>
                            </td>
                            <td className="py-3 px-3 whitespace-nowrap text-slate-600 font-medium">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                                month.source === 'Innova'
                                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                                  : 'bg-amber-50 text-amber-700 border-amber-200'
                              }`}>
                                {month.source}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-right font-mono text-slate-600 whitespace-nowrap">
                              R$ {month.saldoAnterior.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </td>
                            <td className="py-3 px-3 text-right font-mono font-semibold text-emerald-700 whitespace-nowrap">
                              + R$ {month.receitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </td>
                            <td className="py-3 px-3 text-right font-mono font-semibold text-rose-700 whitespace-nowrap">
                              - R$ {month.despesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </td>
                            <td className={`py-3 px-3 text-right font-mono font-bold whitespace-nowrap border-x border-slate-200 ${
                              isPositiveDiff ? 'bg-emerald-50/80 text-emerald-800' : 'bg-rose-50/80 text-rose-800'
                            }`}>
                              {isPositiveDiff ? '+' : ''}R$ {month.movLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </td>
                            <td className="py-3 px-3 text-right font-mono font-bold text-blue-900 whitespace-nowrap">
                              R$ {month.saldoFinal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </td>
                            <td className="py-3 px-3 text-right font-mono font-bold whitespace-nowrap border-l border-indigo-100 bg-indigo-50/40">
                              <span className={isPositiveMM ? 'text-emerald-700' : 'text-rose-700'}>
                                {isPositiveMM ? '+' : ''}R$ {month.mediaMovel3Meses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                              </span>
                              <span className="text-[10px] text-slate-500 block font-normal font-sans" title={month.mediaMovelDesc}>
                                {month.mediaMovelDesc}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-center whitespace-nowrap">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                                isExpanded
                                  ? 'bg-blue-600 text-white shadow-xs'
                                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                              }`}>
                                {isExpanded ? 'Recolher ▲' : 'Ver 10 Maiores ▼'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Inline Expanded Drawer / Modal Section */}
              {expandedMonthId && (
                (() => {
                  const activeMonthData = monthlyTimeline.find((m) => m.id === expandedMonthId);
                  if (!activeMonthData) return null;

                  const maxRec = activeMonthData.topRevenues[0]?.amount || 1;
                  const maxDesp = activeMonthData.topExpenses[0]?.amount || 1;

                  return (
                    <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-700 space-y-6 animate-in fade-in duration-300">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 uppercase">
                              Detalhamento do Mês
                            </span>
                            <span className="text-xs text-slate-400">
                              Administradora {activeMonthData.source} • {activeMonthData.periodLabel}
                            </span>
                          </div>
                          <h4 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
                            10 Maiores Receitas e Despesas de {activeMonthData.name}
                          </h4>
                          <p className="text-xs text-slate-300 mt-1">
                            {activeMonthData.notes}
                          </p>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <span className="text-[11px] text-slate-400 block">Diferença Líquida:</span>
                            <span className={`text-base font-bold font-mono ${activeMonthData.movLiquido >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {activeMonthData.movLiquido >= 0 ? '+' : ''}R$ {activeMonthData.movLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </span>
                            <span className="text-[10px] text-indigo-300 block">
                              Média Móvel 3M: R$ {activeMonthData.mediaMovel3Meses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </span>
                          </div>
                          <button
                            onClick={() => setExpandedMonthId(null)}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                          >
                            Fechar (X)
                          </button>
                        </div>
                      </div>

                      {/* Memória de Cálculo da Média Móvel sobre Diferença (Rec - Desp) */}
                      <div className="bg-slate-800/90 rounded-xl p-4 border border-indigo-500/30">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700/80 pb-3 mb-3">
                          <div className="flex items-center gap-2">
                            <span className="p-1.5 rounded-md bg-indigo-500/20 text-indigo-400">
                              <TrendingUp className="w-4 h-4" />
                            </span>
                            <div>
                              <h5 className="text-xs font-bold text-white uppercase tracking-wider">
                                Memória de Cálculo da Média Móvel dos Últimos 3 Meses
                              </h5>
                              <p className="text-[11px] text-slate-400">
                                Calculada estritamente sobre a coluna <strong>Diferença (Receitas − Despesas)</strong>
                              </p>
                            </div>
                          </div>
                          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-indigo-950 text-indigo-300 border border-indigo-700/50">
                            Resultado: {activeMonthData.mediaMovel3Meses >= 0 ? '+' : ''}R$ {activeMonthData.mediaMovel3Meses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                          {activeMonthData.mediaMovelComponents.map((comp, cIdx) => (
                            <div key={cIdx} className="bg-slate-900/80 rounded-lg p-3 border border-slate-700">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">{comp.monthName}</span>
                                <span className="text-[9px] text-slate-500 font-mono">mês {cIdx + 1}/{activeMonthData.mediaMovelComponents.length}</span>
                              </div>
                              <div className="text-[11px] text-slate-300 space-y-0.5 mt-1.5">
                                <div className="flex justify-between">
                                  <span>Receitas:</span>
                                  <span className="text-emerald-400 font-mono">+R$ {comp.receitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Despesas:</span>
                                  <span className="text-rose-400 font-mono">-R$ {comp.despesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                </div>
                                <div className="flex justify-between border-t border-slate-800 pt-1 font-bold">
                                  <span className="text-white">Diferença:</span>
                                  <span className={`font-mono ${comp.diferenca >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                    {comp.diferenca >= 0 ? '+' : ''}R$ {comp.diferenca.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="truncate max-w-full">
                            <span className="text-indigo-400 font-bold font-sans mr-2">Fórmula:</span>
                            <span>{activeMonthData.mediaMovelFormula}</span>
                          </div>
                          <span className="text-[10px] text-emerald-400 font-sans font-semibold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40 shrink-0">
                            ✓ Confirmado sobre Diferença (Rec - Desp)
                          </span>
                        </div>
                      </div>

                      {/* 2 Columns: Top 10 Revenues vs Top 10 Expenses */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Receitas */}
                        <div className="bg-slate-800/80 p-5 rounded-xl border border-slate-700/80 space-y-4">
                          <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                              <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                              Maiores Receitas ({activeMonthData.name})
                            </span>
                            <span className="text-xs font-mono font-bold text-emerald-400">
                              Total: R$ {activeMonthData.receitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </span>
                          </div>

                          <div className="space-y-3">
                            {activeMonthData.topRevenues.length === 0 ? (
                              <p className="text-xs text-slate-400 py-4 text-center">Nenhum lançamento de receita registrado.</p>
                            ) : (
                              activeMonthData.topRevenues.map((rec, idx) => {
                                const percent = ((rec.amount / (activeMonthData.receitas || 1)) * 100).toFixed(1);
                                const barWidth = Math.max(8, (rec.amount / maxRec) * 100);

                                return (
                                  <div key={idx} className="space-y-1">
                                    <div className="flex justify-between text-xs">
                                      <span className="font-medium text-slate-200 truncate max-w-[65%]">
                                        <span className="text-slate-500 font-mono mr-1.5">{idx + 1}.</span>
                                        {rec.name}
                                      </span>
                                      <div className="flex items-center gap-2">
                                        <span className="text-[10px] text-slate-400 font-mono">{percent}%</span>
                                        <span className="font-mono font-bold text-emerald-300">
                                          R$ {rec.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="w-full bg-slate-700/60 h-2 rounded-full overflow-hidden">
                                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${barWidth}%` }} />
                                    </div>
                                  </div>
                                );
                              })
                            )}
                          </div>
                        </div>

                        {/* Despesas */}
                        <div className="bg-slate-800/80 p-5 rounded-xl border border-slate-700/80 space-y-4">
                          <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                            <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                              <ArrowDownRight className="w-4 h-4 text-rose-400" />
                              Maiores Despesas ({activeMonthData.name})
                            </span>
                            <span className="text-xs font-mono font-bold text-rose-400">
                              Total: R$ {activeMonthData.despesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </span>
                          </div>

                          <div className="space-y-3">
                            {activeMonthData.topExpenses.length === 0 ? (
                              <p className="text-xs text-slate-400 py-4 text-center">Nenhum lançamento de despesa registrado.</p>
                            ) : (
                              activeMonthData.topExpenses.map((desp, idx) => {
                                const percent = ((desp.amount / (activeMonthData.despesas || 1)) * 100).toFixed(1);
                                const barWidth = Math.max(8, (desp.amount / maxDesp) * 100);

                                return (
                                  <div key={idx} className="space-y-1">
                                    <div className="flex justify-between text-xs">
                                      <span className="font-medium text-slate-200 truncate max-w-[65%]">
                                        <span className="text-slate-500 font-mono mr-1.5">{idx + 1}.</span>
                                        {desp.name}
                                      </span>
                                      <div className="flex items-center gap-2">
                                        <span className="text-[10px] text-slate-400 font-mono">{percent}%</span>
                                        <span className="font-mono font-bold text-rose-300">
                                          R$ {desp.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="w-full bg-slate-700/60 h-2 rounded-full overflow-hidden">
                                      <div className="bg-rose-500 h-full rounded-full" style={{ width: `${barWidth}%` }} />
                                    </div>
                                  </div>
                                );
                              })
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()
              )}
            </div>
          </div>
        )}

        {/* Tab 4: Raw PDF Documents & Origin */}
        {activeTab === 'documentos' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1">
                    Fontes e Documentos Auditados
                  </h3>
                  <p className="text-xs text-slate-500">
                    Todos os dados foram apurados diretamente a partir dos 4 relatórios oficiais anexados ao processo.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setPdfScope('current');
                    setShowPdfModal(true);
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors cursor-pointer shrink-0"
                  title="Salvar Resumo de Fontes em PDF"
                >
                  <Printer className="w-3.5 h-3.5 text-blue-600" />
                  <span>Salvar Fontes em PDF</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                  <span className="text-xs font-bold text-blue-700 block mb-1">ARQUIVO 1 • 159 PÁGINAS</span>
                  <h4 className="font-bold text-sm text-slate-900">Prestação de Contas - Fev/2026 (Innova)</h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Contém o balancete de implantação, demonstrativo de contas, extrato do Itaú, comprovação do estorno de R$ 51.200,00, honorários do síndico, contrato da Fênix e proposta da WOM Engenharia.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                  <span className="text-xs font-bold text-emerald-700 block mb-1">ARQUIVO 2 • 170 PÁGINAS</span>
                  <h4 className="font-bold text-sm text-slate-900">Prestação de Contas - Mar/2026 (Innova)</h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Contém a quitação dos acordos da construtora de R$ 167.781,12, guias DARF e REINF de tributos federais e municipais, criação da conta própria do condomínio e parecer tributário oficial sobre o síndico.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                  <span className="text-xs font-bold text-purple-700 block mb-1">ARQUIVO 3 • 6 PÁGINAS</span>
                  <h4 className="font-bold text-sm text-slate-900">Manual Prestação de Contas Digital (Controlar / Gruvi)</h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Instruções para consulta e assinatura digital das contas mensais pelo smartphone através da plataforma Gruvi, com foco em sustentabilidade e eliminação de pastas físicas de papel.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                  <span className="text-xs font-bold text-amber-700 block mb-1">ARQUIVO 4 • 3 PÁGINAS</span>
                  <h4 className="font-bold text-sm text-slate-900">Demonstrativo Comparativo Jan-Ago/2026 (Controlar)</h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Planilha orçamentária oficial detalhando mês a mês a receita total de R$ 455.192,47, as despesas de R$ 307.280,61, a compra de máquinas (R$ 76.800,00) e o saldo acumulado final de R$ 281.045,94.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Official Signature Lines exclusively for PDF / Print Output */}
        <div className="print-only mt-12 pt-8 border-t border-slate-300">
          <div className="grid grid-cols-3 gap-8 text-center text-xs text-slate-700">
            <div>
              <div className="border-t border-slate-800 pt-2 font-bold text-slate-900 uppercase">
                Maurício Lacerda Sobrinho
              </div>
              <span className="text-[11px] text-slate-500 block">Síndico Profissional</span>
              <span className="text-[10px] text-slate-400 block">Moinho Silo 240</span>
            </div>

            <div>
              <div className="border-t border-slate-800 pt-2 font-bold text-slate-900 uppercase">
                Carla Cristina Belchior
              </div>
              <span className="text-[11px] text-slate-500 block">Gerente Financeira</span>
              <span className="text-[10px] text-slate-400 block">Administração de Condomínios</span>
            </div>

            <div>
              <div className="border-t border-slate-800 pt-2 font-bold text-slate-900 uppercase">
                Fabio Luiz Siqueira de Paula
              </div>
              <span className="text-[11px] text-slate-500 block">Controller Financeiro</span>
              <span className="text-[10px] text-slate-400 block">Conselho Fiscal / Auditoria</span>
            </div>
          </div>
          <div className="text-center text-[10px] text-slate-400 mt-6">
            Documento emitido eletronicamente para fins de prestação de contas do Condomínio do Prédio 240 do Complexo Multiuso Moinho Recife.
          </div>
        </div>

      </main>

      {/* Interactive PDF Export Modal */}
      {showPdfModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-xs no-print animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                  <Printer className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-tight">
                    Salvar e Apresentar Relatório em PDF
                  </h3>
                  <p className="text-xs text-slate-500">
                    Documento oficial com gráficos, balancetes, parecer de auditoria e assinaturas
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowPdfModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
                title="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="p-6 overflow-y-auto space-y-5 flex-1">
              {/* Scope Selection */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  1. Selecione o Escopo do Documento:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setPdfScope('current');
                      setGeneratedPdfBlobUrl(null);
                    }}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      pdfScope === 'current'
                        ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-600/20'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 block">Esta Guia Atual</span>
                      <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                        {activeTab}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 block mt-1">
                      {activeTab === 'dashboard' && 'Top 10 Custos & Top 10 Receitas do condomínio'}
                      {activeTab === 'inadimplencia' && 'Quitação da Construtora e Relação de Unidades Devedoras'}
                      {activeTab === 'analise281k' && 'Auditoria dos R$ 281K, Destinação e Parecer de Dívidas'}
                      {activeTab === 'timeline' && 'Saldos Mensais, Diferenças e Média Móvel (8 Meses)'}
                      {activeTab === 'documentos' && 'Fontes de Dados e Balancetes das Administradoras'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPdfScope('all');
                      setGeneratedPdfBlobUrl(null);
                    }}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      pdfScope === 'all'
                        ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-600/20'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 block">Dossiê Completo (5 Guias)</span>
                      <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        Recomendado
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 block mt-1">
                      Todas as seções consolidadas em relatório executivo multi-páginas
                    </span>
                  </button>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="bg-slate-900 rounded-xl p-4 text-white space-y-3 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                      2. Ações de Apresentação e Download:
                    </span>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Geração vetorial imediata, nítida e pronta para envio a conselheiros ou assembleia.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      disabled={isGeneratingPdf}
                      onClick={() => handleGeneratePdf(pdfScope)}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 transition-all cursor-pointer disabled:opacity-50 shadow-sm"
                    >
                      {isGeneratingPdf ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                          <span>Gerando PDF...</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4 text-slate-950" />
                          <span>{generatedPdfBlobUrl ? 'Gerar Novamente & Baixar' : 'Gerar e Baixar PDF'}</span>
                        </>
                      )}
                    </button>

                    {generatedPdfBlobUrl && (
                      <button
                        type="button"
                        onClick={() => window.open(generatedPdfBlobUrl, '_blank')}
                        className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition-colors cursor-pointer"
                        title="Abrir PDF em nova aba do navegador"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
                        <span>Abrir em Nova Aba</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={handleCopySummary}
                      className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition-colors cursor-pointer"
                      title="Copiar texto executivo formatado para e-mail ou WhatsApp"
                    >
                      {copiedSummary ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-400" />
                          <span>Copiar Texto</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Success Notification */}
                {pdfSuccessMessage && (
                  <div className="p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-lg text-xs text-emerald-200 flex items-center justify-between animate-in fade-in">
                    <span className="flex items-center gap-2 font-medium">
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                      {pdfSuccessMessage}
                    </span>
                    <span className="text-[11px] text-emerald-400 font-mono">Download disparado com sucesso</span>
                  </div>
                )}
              </div>

              {/* View Switcher Tabs */}
              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setPdfActiveView('preview')}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                        pdfActiveView === 'preview'
                          ? 'bg-white text-blue-700 shadow-xs'
                          : 'text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Apresentação Executiva (Visual)
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setPdfActiveView('doc');
                        if (!generatedPdfBlobUrl) {
                          handleGeneratePdf(pdfScope);
                        }
                      }}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                        pdfActiveView === 'doc'
                          ? 'bg-white text-blue-700 shadow-xs'
                          : 'text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <FileText className="w-3.5 h-3.5" />
                      Leitor de Documento PDF
                    </button>

                    <button
                      type="button"
                      onClick={() => setPdfActiveView('texto')}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                        pdfActiveView === 'texto'
                          ? 'bg-white text-blue-700 shadow-xs'
                          : 'text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <Copy className="w-3.5 h-3.5" />
                      Resumo para Ata / E-mail
                    </button>
                  </div>

                  <span className="text-[11px] text-slate-500 font-medium">
                    Formato A4 Oficial • Condomínio Moinho Silo 240
                  </span>
                </div>

                {/* View 1: Apresentação Executiva Formatada */}
                {pdfActiveView === 'preview' && (
                  <div className="p-6 bg-white space-y-6 max-h-96 overflow-y-auto">
                    {/* Header */}
                    <div className="border-b-2 border-slate-900 pb-3 flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 uppercase">
                          Condomínio do Edifício Moinho Silo 240
                        </h4>
                        <p className="text-[11px] text-slate-600 mt-0.5">
                          CNPJ: 47.289.584/0002-01 • Inscrição Municipal: 7765541 • Bairro do Recife, Recife-PE
                        </p>
                        <p className="text-[10px] text-slate-400">
                          Prestações de Contas Consolidadas: Administradoras Innova Housing e Controlar Condomínio Digital
                        </p>
                      </div>
                      <div className="text-right text-[11px]">
                        <span className="font-bold text-blue-800 block uppercase">
                          {pdfScope === 'all'
                            ? 'DOSSIÊ FINANCEIRO CONSOLIDADO 2026'
                            : `RELATÓRIO: ${activeTab.toUpperCase()}`}
                        </span>
                        <span className="text-slate-500 block">Emissão Oficial: 24/09/2026</span>
                      </div>
                    </div>

                    {/* KPI Highlights Bar */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Saldo em Conta (Ago/26)</span>
                        <span className="text-sm font-bold text-slate-900 font-mono block mt-0.5">R$ 281.045,94</span>
                        <span className="text-[10px] text-emerald-600 font-medium">Pico de Liquidez</span>
                      </div>

                      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                        <span className="text-[10px] uppercase font-bold text-emerald-700 block">Inadimplência Atual</span>
                        <span className="text-sm font-bold text-emerald-800 font-mono block mt-0.5">R$ 3.692,43</span>
                        <span className="text-[10px] text-emerald-700 font-medium">96,8% Adimplente</span>
                      </div>

                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <span className="text-[10px] uppercase font-bold text-blue-700 block">Média Móvel Líquida (3M)</span>
                        <span className="text-sm font-bold text-blue-900 font-mono block mt-0.5">+ R$ 64.360,89</span>
                        <span className="text-[10px] text-blue-600 font-medium">Média Jun, Jul e Ago/26</span>
                      </div>

                      <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
                        <span className="text-[10px] uppercase font-bold text-indigo-700 block">Máquinas & Dívidas</span>
                        <span className="text-sm font-bold text-indigo-900 font-mono block mt-0.5">100% Quitado</span>
                        <span className="text-[10px] text-indigo-600 font-medium">R$ 0,00 Dívidas</span>
                      </div>
                    </div>

                    {/* Section 1: Saldos Mensais e Diferenças */}
                    {(pdfScope === 'all' || activeTab === 'timeline') && (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <h5 className="font-bold text-xs text-slate-900 uppercase tracking-wide">
                            Demonstrativo Cronológico de Saldos Mensais (Janeiro a Agosto/2026):
                          </h5>
                          <span className="text-[10px] text-slate-500">8 Meses Auditados</span>
                        </div>
                        <div className="overflow-x-auto border border-slate-200 rounded-lg">
                          <table className="w-full text-left text-xs">
                            <thead className="bg-slate-100 font-bold text-slate-700 border-b border-slate-200">
                              <tr>
                                <th className="p-2">Mês / Gestão</th>
                                <th className="p-2 text-right">Saldo Anterior</th>
                                <th className="p-2 text-right">Receitas (+)</th>
                                <th className="p-2 text-right">Despesas (-)</th>
                                <th className="p-2 text-right">Diferença Mensal</th>
                                <th className="p-2 text-right">Saldo Final</th>
                                <th className="p-2 text-right">Média Móvel 3M (Diferença)</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                              {monthlyTimeline.map((m) => (
                                <tr key={m.id} className="hover:bg-slate-50/70">
                                  <td className="p-2 font-sans font-medium text-slate-900">
                                    {m.name} <span className="text-[10px] text-slate-400">({m.source})</span>
                                  </td>
                                  <td className="p-2 text-right text-slate-600">
                                    R$ {m.saldoAnterior.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                  </td>
                                  <td className="p-2 text-right text-emerald-700 font-semibold">
                                    R$ {m.receitas.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                  </td>
                                  <td className="p-2 text-right text-rose-700 font-semibold">
                                    R$ {m.despesas.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                  </td>
                                  <td className="p-2 text-right font-bold">
                                    <span className={m.movLiquido >= 0 ? 'text-emerald-700' : 'text-rose-700'}>
                                      {m.movLiquido >= 0 ? '+' : ''}R$ {m.movLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </span>
                                  </td>
                                  <td className="p-2 text-right font-bold text-blue-900 bg-blue-50/40">
                                    R$ {m.saldoFinal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                  </td>
                                  <td className="p-2 text-right font-bold text-indigo-900 bg-indigo-50/40">
                                    <span className={m.mediaMovel3Meses >= 0 ? 'text-emerald-700' : 'text-rose-700'}>
                                      {m.mediaMovel3Meses >= 0 ? '+' : ''}R$ {m.mediaMovel3Meses.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Section 2: Top 10 Custos e Receitas */}
                    {(pdfScope === 'all' || activeTab === 'dashboard') && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <h5 className="font-bold text-xs text-rose-900 uppercase">
                            10 Maiores Custos / Despesas:
                          </h5>
                          <div className="border border-slate-200 rounded-lg overflow-hidden">
                            <table className="w-full text-left text-xs">
                              <thead className="bg-slate-100 text-slate-700 text-[10px] font-bold border-b">
                                <tr>
                                  <th className="p-1.5">Despesa</th>
                                  <th className="p-1.5 text-right">Valor</th>
                                  <th className="p-1.5 text-right">%</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 text-[10px]">
                                {topExpenses.slice(0, 5).map((e, idx) => (
                                  <tr key={e.id}>
                                    <td className="p-1.5 font-medium text-slate-800 truncate max-w-[140px]">{idx + 1}. {e.name}</td>
                                    <td className="p-1.5 text-right font-mono font-bold text-rose-700">
                                      R$ {e.amount.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                                    </td>
                                    <td className="p-1.5 text-right font-mono text-slate-500">
                                      {totalExpensesSum > 0 ? ((e.amount / totalExpensesSum) * 100).toFixed(1) : 0}%
                                    </td>
                                  </tr>
                                ))}
                                <tr className="bg-slate-50 font-bold">
                                  <td className="p-1.5">Total Geral de Despesas</td>
                                  <td className="p-1.5 text-right font-mono text-rose-800" colSpan={2}>
                                    R$ {totalExpensesSum.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h5 className="font-bold text-xs text-emerald-900 uppercase">
                            10 Maiores Receitas Arrecadadas:
                          </h5>
                          <div className="border border-slate-200 rounded-lg overflow-hidden">
                            <table className="w-full text-left text-xs">
                              <thead className="bg-slate-100 text-slate-700 text-[10px] font-bold border-b">
                                <tr>
                                  <th className="p-1.5">Receita</th>
                                  <th className="p-1.5 text-right">Valor</th>
                                  <th className="p-1.5 text-right">%</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 text-[10px]">
                                {topRevenues.slice(0, 5).map((r, idx) => (
                                  <tr key={r.id}>
                                    <td className="p-1.5 font-medium text-slate-800 truncate max-w-[140px]">{idx + 1}. {r.name}</td>
                                    <td className="p-1.5 text-right font-mono font-bold text-emerald-700">
                                      R$ {r.amount.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                                    </td>
                                    <td className="p-1.5 text-right font-mono text-slate-500">
                                      {totalRevenuesSum > 0 ? ((r.amount / totalRevenuesSum) * 100).toFixed(1) : 0}%
                                    </td>
                                  </tr>
                                ))}
                                <tr className="bg-slate-50 font-bold">
                                  <td className="p-1.5">Total Geral de Receitas</td>
                                  <td className="p-1.5 text-right font-mono text-emerald-800" colSpan={2}>
                                    R$ {totalRevenuesSum.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Section 3: Parecer R$ 281K */}
                    {(pdfScope === 'all' || activeTab === 'analise281k') && (
                      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                        <div className="flex items-center gap-1.5 font-bold text-slate-900">
                          <ShieldCheck className="w-4 h-4 text-emerald-600" />
                          Parecer de Auditoria dos R$ 281K (Comprometimento & Liquidez):
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-[11px]">
                          <div>
                            <span className="font-bold text-slate-800 block">• Capital Livre para Operação:</span>
                            <span className="text-slate-600 block">
                              <strong>R$ 210.390,04 (74,8%)</strong> em caixa livre, suficiente para cobrir 6,6 meses de despesas sem arrecadação adicional.
                            </span>
                          </div>
                          <div>
                            <span className="font-bold text-slate-800 block">• Fundos Vinculados (Carimbados):</span>
                            <span className="text-slate-600 block">
                              <strong>R$ 70.655,90 (25,2%)</strong> vinculados por convenção (Reserva R$ 19,5K, Segurança R$ 47,6K e Laudos R$ 3,4K).
                            </span>
                          </div>
                          <div>
                            <span className="font-bold text-slate-800 block">• Máquinas & Equipamentos (R$ 76.800):</span>
                            <span className="text-emerald-700 font-semibold block">
                              100% quitadas em 3 parcelas de R$ 25.600,00 (Mai, Jun e Jul). Nada mais a pagar.
                            </span>
                          </div>
                          <div>
                            <span className="font-bold text-slate-800 block">• Empréstimos e Passivos:</span>
                            <span className="text-emerald-700 font-semibold block">
                              R$ 0,00 (Nenhuma dívida bancária registrada).
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Signatures */}
                    <div className="pt-4 border-t border-slate-300">
                      <div className="grid grid-cols-3 gap-4 text-center text-[10px]">
                        <div>
                          <div className="border-t border-slate-800 pt-1 font-bold text-slate-900 uppercase">
                            Maurício Lacerda Sobrinho
                          </div>
                          <span className="text-slate-500 block">Síndico Profissional</span>
                        </div>
                        <div>
                          <div className="border-t border-slate-800 pt-1 font-bold text-slate-900 uppercase">
                            Carla Cristina Belchior
                          </div>
                          <span className="text-slate-500 block">Gerente Financeira</span>
                        </div>
                        <div>
                          <div className="border-t border-slate-800 pt-1 font-bold text-slate-900 uppercase">
                            Fabio Luiz Siqueira de Paula
                          </div>
                          <span className="text-slate-500 block">Controller Financeiro</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* View 2: Leitor de Documento PDF */}
                {pdfActiveView === 'doc' && (
                  <div className="p-4 bg-slate-900 text-center min-h-[360px] flex flex-col items-center justify-center">
                    {generatedPdfBlobUrl ? (
                      <div className="w-full space-y-3">
                        <div className="flex items-center justify-between text-xs text-slate-300 px-1">
                          <span className="flex items-center gap-1.5 font-mono text-emerald-400">
                            <CheckCircle className="w-4 h-4" />
                            {generatedPdfFileName}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleGeneratePdf(pdfScope)}
                            className="text-blue-400 hover:text-blue-300 underline cursor-pointer"
                          >
                            Regenerar Documento
                          </button>
                        </div>
                        <iframe
                          src={generatedPdfBlobUrl}
                          className="w-full h-[420px] rounded-xl border border-slate-700 bg-white"
                          title="Visualizador PDF Silo 240"
                        />
                      </div>
                    ) : (
                      <div className="space-y-4 py-12 max-w-sm mx-auto">
                        <div className="h-12 w-12 rounded-2xl bg-blue-500/20 text-blue-400 mx-auto flex items-center justify-center">
                          <FileDown className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-white">Carregando Visualização do PDF</h4>
                          <p className="text-xs text-slate-400 mt-1">
                            Clique no botão abaixo para compilar a prévia vetorial em alta resolução.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleGeneratePdf(pdfScope)}
                          className="px-4 py-2 text-xs font-bold rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 transition-colors"
                        >
                          Gerar Visualização Agora
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* View 3: Resumo em Texto Copiável */}
                {pdfActiveView === 'texto' && (
                  <div className="p-4 bg-slate-50 space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-700">Texto Executivo Pronto para E-mail ou WhatsApp:</span>
                      <button
                        type="button"
                        onClick={handleCopySummary}
                        className="flex items-center gap-1 px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold cursor-pointer"
                      >
                        {copiedSummary ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        {copiedSummary ? 'Copiado!' : 'Copiar Texto'}
                      </button>
                    </div>
                    <pre className="p-3 bg-white border border-slate-200 rounded-lg text-slate-800 text-[11px] leading-relaxed whitespace-pre-wrap font-mono select-all max-h-80 overflow-y-auto">
{`CONDOMÍNIO DO EDIFÍCIO MOINHO SILO 240 - PARECER EXECUTIVO
Emissão Oficial: 24/09/2026 • Auditoria Contábil

1. DISPONIBILIDADE E SALDO ACUMULADO (R$ 281K):
• Saldo Final em Conta (31/08/2026): R$ 281.045,94
• Capital de Giro Livre Operacional: R$ 210.390,04 (74,8% sem amarras)
• Fundos Carimbados/Vinculados: R$ 70.655,90 (Fundo Reserva R$ 19,5K + Segurança R$ 47,6K + Laudos R$ 3,4K)
• Máquinas e Equipamentos (R$ 76.800,00): 100% QUITADAS em 3 parcelas de R$ 25.600,00 (Mai, Jun e Jul)
• Empréstimos e Dívidas Bancárias: R$ 0,00 (Nenhum passivo ativo)
• Capacidade de Cobertura: 6,6 meses de operação contínua sem arrecadação adicional

2. INADIMPLÊNCIA & COBRANÇA:
• Inadimplência Mais Atualizada: R$ 3.692,43 (apenas 3,2% - 96,8% Adimplente)
• Pico em Fevereiro/2026: R$ 85.230,29 (98,4% era dívida da Construtora)
• Recuperação em Março/2026: R$ 84.330,91 (98,9% da dívida paga em 30 dias via Acordo 76806)
• Redução Histórica da Inadimplência: - 95,7%

3. SALDOS MENSAIS E MÉDIAS MÓVEIS (8 MESES):
• Média Móvel Líquida dos Últimos 3 Meses (Jun, Jul, Ago): + R$ 64.360,89 / mês
• Média Geral de Diferença Mensal de 2026: + R$ 35.130,74 / mês
• Média Líquida da Gestão Controlar (Mai a Ago): + R$ 36.977,97 / mês
• Média Líquida da Gestão Innova (Jan a Mar): + R$ 71.986,17 / mês
• Superávit Médio Operacional Mensal: + R$ 36.977,97 / mês

Signatários Oficiais:
- Maurício Lacerda Sobrinho (Síndico Profissional)
- Carla Cristina Belchior (Gerente Financeira)
- Fabio Luiz Siqueira de Paula (Controller Financeiro)`}
                    </pre>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between px-6 py-3.5 border-t border-slate-200 bg-slate-50 shrink-0">
              <span className="text-xs text-slate-500">
                Condomínio Moinho Silo 240 • Prestações de Contas 2026
              </span>
              <button
                type="button"
                onClick={() => setShowPdfModal(false)}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
