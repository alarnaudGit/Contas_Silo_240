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
  Eye,
  Calculator,
  Percent,
  Scale,
  Receipt,
  Coins,
  Sparkles,
  Sliders,
  Users
} from 'lucide-react';

interface MovingAverageComponent {
  monthName: string;
  receitas: number;
  despesas: number;
  diferenca: number;
}

export interface OrdinaryExpenseItem {
  id: string;
  name: string;
  category: string;
  monthlyAverage: number;
  annualTotal: number;
  basis: string;
  essentiality: 'Obrigatório' | 'Contratual' | 'Operacional' | 'Concessionária';
}

export const ordinaryExpensesBenchmark: OrdinaryExpenseItem[] = [
  {
    id: 'ord-portaria',
    name: 'Mão de Obra Terceirizada (Portaria 24h & Limpeza)',
    category: 'Terceirização',
    monthlyAverage: 37000.00,
    annualTotal: 444000.00,
    basis: 'Contrato Fênix Terceirizações (NFs auditadas de Jan a Ago)',
    essentiality: 'Contratual'
  },
  {
    id: 'ord-sindico',
    name: 'Pró-Labore do Síndico Profissional',
    category: 'Administração',
    monthlyAverage: 5891.92,
    annualTotal: 70703.04,
    basis: 'Remuneração fixada em Assembleia Geral de Instalação (RPA mensal)',
    essentiality: 'Obrigatório'
  },
  {
    id: 'ord-concessionaria-energia',
    name: 'Neoenergia - Energia Elétrica (Áreas Comuns, Gerador & Bombas)',
    category: 'Concessionárias',
    monthlyAverage: 5200.00,
    annualTotal: 62400.00,
    basis: 'Média de faturamento das áreas comuns (hall, garagens, elevadores)',
    essentiality: 'Concessionária'
  },
  {
    id: 'ord-elevadores',
    name: 'Manutenção Preventiva e Assistência Técnica dos Elevadores',
    category: 'Manutenção',
    monthlyAverage: 1862.19,
    annualTotal: 22346.28,
    basis: 'Contrato fixo mensal com empresa homologada de transporte vertical',
    essentiality: 'Obrigatório'
  },
  {
    id: 'ord-controlar',
    name: 'Taxa de Administração Imobiliária (Controlar / Gruvi)',
    category: 'Administração',
    monthlyAverage: 1620.00,
    annualTotal: 19440.00,
    basis: 'Honorários de administração condominial e suporte digital Gruvi',
    essentiality: 'Contratual'
  },
  {
    id: 'ord-seguro',
    name: 'Seguro Predial Obrigatório Contra Incêndio e Riscos Diversos',
    category: 'Obrigatórias',
    monthlyAverage: 1174.53,
    annualTotal: 14094.36,
    basis: 'Apólice regulamentar de seguro condominial (parcelamento mensal)',
    essentiality: 'Obrigatório'
  },
  {
    id: 'ord-tributos',
    name: 'Tributos Federais e Retenções Patronais (INSS, ISS, IR, PIS/COFINS)',
    category: 'Tributos',
    monthlyAverage: 2800.00,
    annualTotal: 33600.00,
    basis: 'DARF Previdenciário, retenções sobre NF de terceiros e pró-labore',
    essentiality: 'Obrigatório'
  },
  {
    id: 'ord-limpeza',
    name: 'Materiais de Limpeza, Higiene, Sacos e Produtos Químicos',
    category: 'Materiais',
    monthlyAverage: 2500.00,
    annualTotal: 30000.00,
    basis: 'Insumos de consumo contínuo para as dependências sociais e circulação',
    essentiality: 'Operacional'
  },
  {
    id: 'ord-internet-ti',
    name: 'Link Dedicado de Internet, Telefonia & Licença Gruvi',
    category: 'Telecom & TI',
    monthlyAverage: 1650.00,
    annualTotal: 19800.00,
    basis: 'Conexão para portaria, controle de acesso e automação predial',
    essentiality: 'Operacional'
  },
  {
    id: 'ord-gas-agua',
    name: 'Concessionárias (Gás Canalizado e Água de Áreas Comuns)',
    category: 'Concessionárias',
    monthlyAverage: 1200.00,
    annualTotal: 14400.00,
    basis: 'Custo rateado das áreas comuns e reservatórios',
    essentiality: 'Concessionária'
  },
  {
    id: 'ord-juridico',
    name: 'Assessoria Jurídica e Suporte em Cobrança Contratada',
    category: 'Jurídico',
    monthlyAverage: 1167.12,
    annualTotal: 14005.44,
    basis: 'Honorários advocatícios para gestão de inadimplência e contratos',
    essentiality: 'Contratual'
  },
  {
    id: 'ord-acesso-cftv',
    name: 'Manutenção do Sistema de Controle de Acesso e CFTV',
    category: 'Segurança',
    monthlyAverage: 1050.00,
    annualTotal: 12600.00,
    basis: 'Manutenção preventiva e corretiva de catracas, leitores e câmeras',
    essentiality: 'Operacional'
  },
  {
    id: 'ord-reparos',
    name: 'Pequenos Reparos Prediais, Elétricos e Hidráulicos de Rotina',
    category: 'Manutenção',
    monthlyAverage: 1500.00,
    annualTotal: 18000.00,
    basis: 'Troca de lâmpadas, reparos em portas, fechaduras e válvulas',
    essentiality: 'Operacional'
  },
  {
    id: 'ord-bancarias',
    name: 'Tarifas Bancárias e Custas de Liquidação de Boletos PJ',
    category: 'Financeiras',
    monthlyAverage: 400.00,
    annualTotal: 4800.00,
    basis: 'Tarifas operacionais da conta corrente própria no Itaú',
    essentiality: 'Operacional'
  }
];

// Monthly timeline data from the reports
export interface MonthSummary {
  id: string;
  name: string;
  periodLabel: string;
  source: 'Innova' | 'Controlar' | 'Transição';
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
  source: 'Innova' | 'Controlar' | 'Transição';
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
    source: 'Transição',
    saldoAnterior: 215958.52,
    receitas: 83890.56,
    despesas: 166715.00,
    saldoFinal: 133134.08,
    notes: 'Mês de encerramento da Innova e transição para a Controlar. Arrecadação ordinária regular de R$ 83.890,56 com liquidação das despesas operacionais do mês e custos rescisórios da Innova (R$ 166.715,00), transferindo saldo de abertura de R$ 133.134,08 para a Controlar em 01/05.',
    topRevenues: [
      { name: 'Taxa Condominial Ordinária (Abril)', category: 'Taxa Ordinária', amount: 62134.62 },
      { name: 'Taxa Condominial Área Comum Geral', category: 'Taxa Ordinária', amount: 17997.63 },
      { name: 'Fundo de Reserva Ordinário', category: 'Fundo Reserva', amount: 2858.43 },
      { name: 'Fundo de Reserva Área Comum', category: 'Fundo Reserva', amount: 899.88 }
    ],
    topExpenses: [
      { name: 'Custos de Encerramento e Transição de Contas Innova', category: 'Administração', amount: 90000.00 },
      { name: 'Fênix Terceirizações - Portaria Abr/26 (NF 53)', category: 'Terceirização', amount: 25919.47 },
      { name: 'Demais Despesas Operacionais e Concessionárias', category: 'Operacional', amount: 23398.97 },
      { name: 'Tributos Federais e Retenções em Folha/NFs', category: 'Tributos', amount: 14500.00 },
      { name: 'Honorários do Síndico Abr/26 (RPA)', category: 'Administração', amount: 5446.56 },
      { name: 'WOM Engenharia - Laudo Recebimento 3/4', category: 'Engenharia', amount: 3650.00 },
      { name: 'Manutenção de Elevadores', category: 'Manutenção', amount: 1862.19 },
      { name: 'Materiais de Conservação e Reparos', category: 'Materiais', amount: 1937.81 }
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
    notes: '1º mês na Controlar via Gruvi. Arrecadação ordinária inicial foi de R$ 21.533,50 devido à migração de cadastros dos condôminos (regularizada em Junho com R$ 148k), somada à Taxa de Segurança (R$ 25.123,27). Despesas incluíram 1ª parcela de máquinas (R$ 25.600,00) e terceirização (R$ 59.645,46).',
    topRevenues: [
      { name: 'Taxa Extra: Sistema de Segurança', category: 'Taxa Extra', amount: 25123.27 },
      { name: 'Taxa Ordinária Condominial (Boletos Iniciais Gruvi)', category: 'Taxa Ordinária', amount: 21533.50 },
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
  { id: 'mar-tar-banco', name: 'Tarifas e Custas de Boletos Itaú', category: 'Financeiras', amount: 126.36, monthId: 'mar-2026', monthLabel: 'Mar/2026 (Innova)', details: 'Tarifas operacionais de títulos' },

  // Transição Abr/2026 Items
  { id: 'abr-encerramento-innova', name: 'Encerramento e Transição de Contas Innova', category: 'Administração', amount: 90000.00, monthId: 'abr-2026', monthLabel: 'Abr/2026 (Transição)', details: 'Liquidação de encargos rescisórios e conciliação de contas da Innova' },
  { id: 'abr-fenix-terc', name: 'Fênix Terceirizações - Portaria Abr/2026 (NF 53)', category: 'Terceirização', amount: 25919.47, monthId: 'abr-2026', monthLabel: 'Abr/2026 (Transição)', details: 'Mão de obra de portaria e limpeza do período' },
  { id: 'abr-demais-operacionais', name: 'Demais Despesas Operacionais e Concessionárias', category: 'Operacional', amount: 23398.97, monthId: 'abr-2026', monthLabel: 'Abr/2026 (Transição)', details: 'Energia, água, manutenção e suprimentos' },
  { id: 'abr-tributos', name: 'Tributos Federais e Retenções em Folha/NFs', category: 'Tributos', amount: 14500.00, monthId: 'abr-2026', monthLabel: 'Abr/2026 (Transição)', details: 'DARF, ISS e encargos do período de transição' },
  { id: 'abr-sindico', name: 'Honorários do Síndico - Abr/2026 (RPA)', category: 'Administração', amount: 5446.56, monthId: 'abr-2026', monthLabel: 'Abr/2026 (Transição)', details: 'Maurício Lacerda Sobrinho' },
  { id: 'abr-laudo-3', name: 'WOM Engenharia - Laudo Recebimento 3/4', category: 'Engenharia', amount: 3650.00, monthId: 'abr-2026', monthLabel: 'Abr/2026 (Transição)', details: '3ª parcela do contrato de vistoria e recebimento' },
  { id: 'abr-elevadores', name: 'Manutenção de Elevadores', category: 'Manutenção', amount: 1862.19, monthId: 'abr-2026', monthLabel: 'Abr/2026 (Transição)', details: 'Manutenção preventiva mensal' },
  { id: 'abr-materiais', name: 'Materiais de Conservação e Reparos', category: 'Materiais', amount: 1937.81, monthId: 'abr-2026', monthLabel: 'Abr/2026 (Transição)', details: 'Itens de reposição de infraestrutura' }
];

// Top Revenues dataset compiled directly from all 4 reports
const allRevenuesData: FinancialItem[] = [
  // Controlar Multi-month items
  { id: 'r-c-ord-jun', name: 'Taxa Ordinária Condominial (Junho)', category: 'Taxa Ordinária', amount: 148068.86, monthId: 'consolidado-controlar', monthLabel: 'Jun (Controlar)' },
  { id: 'r-c-ord-jul', name: 'Taxa Ordinária Condominial (Julho)', category: 'Taxa Ordinária', amount: 101634.62, monthId: 'consolidado-controlar', monthLabel: 'Jul (Controlar)' },
  { id: 'r-c-ord-ago', name: 'Taxa Ordinária Condominial (Agosto)', category: 'Taxa Ordinária', amount: 100504.10, monthId: 'consolidado-controlar', monthLabel: 'Ago (Controlar)' },
  { id: 'r-c-extra-seg-mai', name: 'Taxa Extra: Sistema de Segurança (Maio)', category: 'Taxa Extra', amount: 25123.27, monthId: 'consolidado-controlar', monthLabel: 'Mai (Controlar)' },
  { id: 'r-c-ord-mai', name: 'Taxa Ordinária Condominial (Maio - Inicial Gruvi)', category: 'Taxa Ordinária', amount: 21533.50, monthId: 'consolidado-controlar', monthLabel: 'Mai (Controlar)', details: 'Emissão inicial no app Gruvi; saldo complementar liquidado em Junho' },
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

  // Transição Abr/2026 Items
  { id: 'r-abr-taxa-ord', name: 'Taxa Condominial Ordinária (Abril)', category: 'Taxa Ordinária', amount: 62134.62, monthId: 'abr-2026', monthLabel: 'Abr/2026 (Transição)', details: 'Cota ordinária mensal emitida no encerramento da Innova' },
  { id: 'r-abr-area-comum', name: 'Taxa Condominial Área Comum Geral (Abril)', category: 'Taxa Ordinária', amount: 17997.63, monthId: 'abr-2026', monthLabel: 'Abr/2026 (Transição)' },
  { id: 'r-abr-fundo-ord', name: 'Fundo de Reserva Ordinário (Abril)', category: 'Fundo Reserva', amount: 2858.43, monthId: 'abr-2026', monthLabel: 'Abr/2026 (Transição)' },
  { id: 'r-abr-fundo-comum', name: 'Fundo de Reserva Área Comum (Abril)', category: 'Fundo Reserva', amount: 899.88, monthId: 'abr-2026', monthLabel: 'Abr/2026 (Transição)' },

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
  const [activeTab, setActiveTab] = useState<'resumoExecutivo' | 'dashboard' | 'inadimplencia' | 'analise281k' | 'propostaTaxa' | 'timeline' | 'documentos'>('resumoExecutivo');
  const [copiedExecutiveSummary, setCopiedExecutiveSummary] = useState<boolean>(false);
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

  // Interactive Fee Simulation States
  const [simulatedTaxa, setSimulatedTaxa] = useState<number>(965);
  const [simulatedUnits, setSimulatedUnits] = useState<number>(65);
  const [fundoReservaPercent, setFundoReservaPercent] = useState<number>(10);
  const [selectedScenario, setSelectedScenario] = useState<'recomendado' | 'economico' | 'conservador'>('recomendado');
  const [copiedProposalText, setCopiedProposalText] = useState<boolean>(false);

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
          ? 'Controlar Condomínio Digital (Mai a Ago/2026)'
          : selectedMonthFilter === 'abr-2026'
          ? 'Abril/2026 (Período de Transição Innova → Controlar)'
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

  const handleCopyProposal = () => {
    const units = simulatedUnits || 65;
    const currentTotal = units * 1545.90;
    const newTotal = units * simulatedTaxa;
    const monthlyDiff = 1545.90 - simulatedTaxa;
    const annualDiff = monthlyDiff * 12;
    const collectiveAnnualSavings = (currentTotal - newTotal) * 12;

    let text = `PARECER TÉCNICO & PROPOSTA CONTÁBIL DE REDUÇÃO DA TAXA CONDOMINIAL ORDINÁRIA\n`;
    text += `CONDOMÍNIO DO EDIFÍCIO MOINHO SILO 240 • RECIFE-PE\n`;
    text += `Data: 24/09/2026 • Base: Exercício 2026 (Auditoria das Administradoras Innova & Controlar)\n\n`;
    text += `1. DIAGNÓSTICO ORÇAMENTÁRIO & DADOS ATUAIS:\n`;
    text += `• Número de Unidades do Condomínio: ${units} unidades autônomas\n`;
    text += `• Taxa Atual Praticada por Unidade: R$ 1.545,90 / mês (Arrecadação Total: R$ ${currentTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/mês)\n`;
    text += `• Nova Taxa Recomendada por Unidade: R$ ${simulatedTaxa.toFixed(2).replace('.', ',')} / mês (Nova Arrecadação: R$ ${newTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/mês)\n`;
    text += `• Economia Mensal por Morador: - R$ ${monthlyDiff.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / mês (- ${((monthlyDiff / 1545.90) * 100).toFixed(1)}%)\n`;
    text += `• Economia Anual por Morador: R$ ${annualDiff.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / ano\n`;
    text += `• Economia Anual Coletiva no Condomínio: R$ ${collectiveAnnualSavings.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / ano\n`;
    text += `• Saldo Acumulado em Caixa/Aplicações (31/08/2026): R$ 281.045,94 (sendo R$ 210.390,04 em capital de giro livre)\n`;
    text += `• Superávit Mensal Operacional Recente: + R$ 64.360,89 / mês (Média Móvel dos últimos 3 meses: Jun, Jul e Ago)\n\n`;
    text += `2. ARGUMENTAÇÃO CONTÁBIL E LEGAL:\n`;
    text += `a) Custeio Ordinário Real Auditado: As despesas operacionais rotineiras do Silo 240 (Portaria 24h Fênix, Limpeza, Síndico, Elevadores, Neoenergia, Seguro Predial, Controlar/Gruvi, Tributos e Reparos) somam R$ 69.015,76/mês, o que equivale a R$ ${(69015.76 / units).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} por unidade.\n`;
    text += `b) Provisão de Fundo de Reserva Legal (10%): Adiciona R$ 6.901,58/mês (R$ ${(6901.58 / units).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} por unidade), totalizando um orçamento ordinário de R$ 75.917,34/mês (R$ ${(75917.34 / units).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/unidade).\n`;
    text += `c) Quitação Integral dos Bens de Capital (Máquinas): A taxa anterior de R$ 1.545,90 embutia a compra de Máquinas e Equipamentos de R$ 76.800,00 (3x R$ 25.600,00 em Mai, Jun e Jul), que pesava R$ ${(25600 / units).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} por unidade/mês. Como foi 100% quitada em Julho/2026, esse valor não pode mais ser cobrado.\n`;
    text += `d) Saldo Excessivo de R$ 281 Mil: O caixa de R$ 281.045,94 cobre 4,1 meses de operação integral (o dobro do teto prudencial de 2 meses = R$ 140k). O rendimento em CDI desse saldo gera cerca de R$ 2.500,00/mês de receita financeira passiva para o condomínio.\n`;
    text += `e) Regramento Imperativo de Despesas Extraordinárias: Fica vedado embutir bens duráveis, melhorias ou equipamentos na taxa ordinária. Quaisquer futuras aquisições deverão ser submetidas à Assembleia Geral com 3 orçamentos, aprovadas como Taxa Extraordinária Temporária com parcelamento fixo e encerramento automático após a quitação (resguardando locadores e inquilinos nos termos da Lei nº 8.245/91).\n\n`;
    text += `3. CENÁRIOS SUBMETIDOS À ASSEMBLEIA GERAL:\n`;
    text += `• Cenário Recomendado: R$ 965,00/mês (-37,6% • Economia: R$ 6.970,80/ano por morador)\n`;
    text += `• Cenário Custeio Estrito: R$ 850,00/mês (-45,0% • Economia: R$ 8.350,80/ano por morador)\n`;
    text += `• Cenário Conservador: R$ 1.150,00/mês (-25,6% • Economia: R$ 4.750,80/ano por morador)\n\n`;
    text += `Subscrito por: Condôminos e Proprietários do Moinho Silo 240.`;

    navigator.clipboard.writeText(text);
    setCopiedProposalText(true);
    setTimeout(() => setCopiedProposalText(false), 3000);
  };

  const handleCopyExecutiveSummary = () => {
    let text = `*RESUMO EXECUTIVO: VIABILIDADE CONTÁBIL PARA REDUÇÃO DA TAXA CONDOMINIAL*\n`;
    text += `*Condomínio do Edifício Moinho Silo 240 (65 Unidades)* • Emissão Oficial: 24/09/2026\n\n`;
    text += `1. *Caixa Sólido e Livre:* Temos R$ 281.045,94 em conta/aplicações. Destes, R$ 210.390,04 (~R$ 210K) estão 100% livres de compromissos ou dívidas operacionais. Este valor ultrapassa em muito a exigência obrigatória de Fundo de Reserva (R$ 19.564,62 já provisionados).\n\n`;
    text += `2. *Superávit Operacional Crônico:* A receita mensal chega a ser mais que o dobro das despesas correntes em vários períodos. A média móvel dos últimos 3 meses registrou sobra líquida de +R$ 64.360,89/mês.\n\n`;
    text += `3. *Quitação Integral das Máquinas (R$ 76,8K):* A taxa atual de R$ 1.545,90 embutia R$ 393,85/unidade para pagamento das máquinas e equipamentos em 3 parcelas de R$ 25.600,00 (Mai, Jun e Jul). O custo foi 100% QUITADO em Julho/2026 e em Agosto a despesa foi R$ 0,00.\n\n`;
    text += `4. *Nova Taxa Sugerida:* Dadas as despesas ordinárias reais auditadas (~R$ 69K/mês), podemos reduzir com folga e segurança a taxa ordinária para *R$ 965,00/mês* (-37,6%, economia de *R$ 6.970,80/ano por morador* e *R$ 453.102,00/ano no condomínio*).\n\n`;
    text += `5. *Regramento Extraordinário:* Reformas, melhorias ou novos equipamentos duráveis devem ser cobertos por taxas extraordinárias temporárias apenas quando houver necessidade e aprovação assemblear, mantendo a taxa ordinária enxuta e justa.\n\n`;
    text += `Fonte: Balancetes Oficiais Innova Housing & Controlar Condomínio Digital.`;

    navigator.clipboard.writeText(text);
    setCopiedExecutiveSummary(true);
    setTimeout(() => setCopiedExecutiveSummary(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Top Header Bar */}
      <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 space-y-2.5">
          {/* Row 1: Brand & Global Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-2">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center font-bold text-white shadow-md ring-1 ring-white/10 shrink-0">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-extrabold tracking-tight text-white leading-tight">
                    Moinho Silo 240
                  </span>
                  <span className="text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full">
                    65 Unidades
                  </span>
                  <span className="hidden md:inline-flex text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                    Auditado Ago/26
                  </span>
                </div>
                <span className="text-xs text-slate-400 block leading-tight mt-0.5">
                  Painel de Auditoria Contábil, Prestação de Contas & Proposta Orçamentária
                </span>
              </div>
            </div>

            {/* Quick Actions Right */}
            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
              <button
                type="button"
                onClick={handleCopyExecutiveSummary}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 transition-colors shadow-xs cursor-pointer"
                title="Copiar texto síntese formatado para WhatsApp ou E-mail"
              >
                {copiedExecutiveSummary ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-emerald-300" />}
                <span>{copiedExecutiveSummary ? 'Copiado p/ WhatsApp!' : 'Copiar Síntese'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setPdfScope('current');
                  setShowPdfModal(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-white text-slate-900 hover:bg-slate-100 shadow-sm transition-all cursor-pointer whitespace-nowrap"
                title="Salvar esta visualização ou dossiê completo em PDF"
              >
                <Printer className="w-3.5 h-3.5 text-blue-600" />
                <span>Salvar em PDF</span>
              </button>
            </div>
          </div>

          {/* Row 2: Categorized Navigation Tabs in Two Clean Lines */}
          <div className="space-y-1.5">
            {/* Linha 1: Parecer Orçamentário & Decisão */}
            <div className="flex items-center gap-2 overflow-x-auto pb-0.5 text-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider hidden sm:inline-block w-28 shrink-0">
                Parecer & Cota:
              </span>
              <div className="flex items-center gap-1.5 bg-slate-800/90 p-1 rounded-xl border border-slate-700/60 shadow-inner shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveTab('resumoExecutivo')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    activeTab === 'resumoExecutivo'
                      ? 'bg-blue-600 text-white shadow-md ring-1 ring-blue-400 font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Resumo Executivo</span>
                  <span className="text-[10px] bg-amber-400/20 text-amber-300 border border-amber-400/30 px-1.5 py-0.2 rounded-full font-bold">
                    Síntese
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('propostaTaxa')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    activeTab === 'propostaTaxa'
                      ? 'bg-indigo-600 text-white shadow-md ring-1 ring-indigo-400 font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  <Calculator className="w-3.5 h-3.5 text-indigo-300" />
                  <span>Nova Taxa Sugerida</span>
                  <span className="text-[10px] bg-emerald-500 text-slate-950 px-1.5 py-0.2 rounded-full font-bold">
                    -37,6% (R$ 965)
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('analise281k')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    activeTab === 'analise281k'
                      ? 'bg-emerald-600 text-white shadow-md font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Auditoria R$ 281K</span>
                  <span className="text-[10px] bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 px-1.5 py-0.2 rounded-full">
                    R$ 210K Livre
                  </span>
                </button>
              </div>
            </div>

            {/* Linha 2: Balancetes & Demonstrativos Contábeis */}
            <div className="flex items-center gap-2 overflow-x-auto pb-0.5 text-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider hidden sm:inline-block w-28 shrink-0">
                Demonstrativos:
              </span>
              <div className="flex items-center gap-1.5 bg-slate-800/60 p-1 rounded-xl border border-slate-700/40 shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveTab('dashboard')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    activeTab === 'dashboard'
                      ? 'bg-blue-600 text-white shadow-sm font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  <PieChart className="w-3.5 h-3.5 text-blue-300" />
                  <span>Top 10 Custos & Receitas</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('inadimplencia')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    activeTab === 'inadimplencia'
                      ? 'bg-amber-600 text-white shadow-sm font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-300" />
                  <span>Inadimplência</span>
                  <span className="text-[10px] bg-amber-400/20 text-amber-300 px-1.5 py-0.2 rounded-full">
                    96,8% Adimplente
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('timeline')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    activeTab === 'timeline'
                      ? 'bg-blue-600 text-white shadow-sm font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5 text-blue-300" />
                  <span>Saldos Mensais (3M)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('documentos')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    activeTab === 'documentos'
                      ? 'bg-blue-600 text-white shadow-sm font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  <FileCheck2 className="w-3.5 h-3.5 text-blue-300" />
                  <span>Fontes (PDFs)</span>
                </button>
              </div>
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
                {activeTab === 'resumoExecutivo' && 'Resumo Executivo: Viabilidade Contábil para Redução da Taxa Ordinária'}
                {activeTab === 'dashboard' && 'Demonstrativo: 10 Maiores Custos & Receitas'}
                {activeTab === 'inadimplencia' && 'Relatório de Inadimplência & Cobrança'}
                {activeTab === 'analise281k' && 'Auditoria & Disponibilidade dos R$ 281K'}
                {activeTab === 'propostaTaxa' && 'Parecer Contábil: Proposta de Nova Taxa Condominial Ordinária'}
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
              <div className="flex flex-col gap-1.5 mt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('propostaTaxa')}
                  className="w-full py-1.5 px-3 rounded-lg text-xs font-semibold bg-indigo-500 hover:bg-indigo-600 text-white transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Calculator className="w-3.5 h-3.5" />
                  <span>Proposta Nova Taxa (-37,6%)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('analise281k')}
                  className="w-full py-1.5 px-3 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-slate-950 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  Auditoria dos R$ 281K <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Tab 0: Resumo Executivo Compacto & Síntese Oficial */}
        {activeTab === 'resumoExecutivo' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Hero Card da Síntese */}
            <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-indigo-900/50 space-y-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-3 max-w-3xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold tracking-wide">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>PARECER EXECUTIVO • REDUÇÃO DA TAXA CONDOMINIAL</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    Viabilidade Contábil para Reduzir a Taxa de <span className="line-through text-slate-400">R$ 1.545,90</span> para{' '}
                    <span className="text-emerald-400 underline decoration-emerald-400/40 font-mono">
                      R$ 965,00/mês
                    </span>
                  </h2>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Com base nos balancetes oficiais das administradoras <strong>Innova Housing</strong> e <strong>Controlar Condomínio Digital</strong>, 
                    o Condomínio Silo 240 possui ampla margem de segurança para desonerar os moradores em <strong>-37,6% (- R$ 580,90/mês)</strong>, 
                    gerando economia anual de <strong>R$ 6.970,80 por apartamento</strong> e <strong>R$ 453.102,00 coletivos</strong> nas 65 unidades.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
                  <button
                    type="button"
                    onClick={handleCopyExecutiveSummary}
                    className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-slate-950 transition-all shadow-md cursor-pointer"
                  >
                    {copiedExecutiveSummary ? <Check className="w-4 h-4 text-slate-950" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedExecutiveSummary ? 'Copiado para WhatsApp!' : 'Copiar Síntese p/ WhatsApp'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('propostaTaxa')}
                    className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all cursor-pointer"
                  >
                    <Calculator className="w-4 h-4 text-indigo-300" />
                    <span>Ver Simulador Detalhado</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPdfScope('current');
                      setShowPdfModal(true);
                    }}
                    className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-sm cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Exportar Parecer em PDF</span>
                  </button>
                </div>
              </div>

              {/* 4 KPI Summary Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 pt-6 border-t border-indigo-900/60 font-mono">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-1">
                  <span className="text-[11px] text-slate-400 font-sans block">Taxa Atual Praticada</span>
                  <span className="text-xl sm:text-2xl font-bold text-rose-400 block">R$ 1.545,90</span>
                  <span className="text-[10px] text-slate-400 font-sans block">Total: R$ 100.483,50/mês (65 unid.)</span>
                </div>

                <div className="bg-emerald-500/10 p-4 rounded-2xl border border-emerald-500/30 space-y-1">
                  <span className="text-[11px] text-emerald-300 font-sans block">Nova Taxa Sugerida</span>
                  <span className="text-xl sm:text-2xl font-bold text-emerald-400 block">R$ 965,00</span>
                  <span className="text-[10px] text-emerald-300 font-sans block">Redução de -37,6% (- R$ 580,90/mês)</span>
                </div>

                <div className="bg-blue-500/10 p-4 rounded-2xl border border-blue-500/30 space-y-1">
                  <span className="text-[11px] text-blue-300 font-sans block">Economia Anual / Morador</span>
                  <span className="text-xl sm:text-2xl font-bold text-blue-300 block">R$ 6.970,80</span>
                  <span className="text-[10px] text-blue-200 font-sans block">Coletiva: R$ 453.102,00/ano</span>
                </div>

                <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-1">
                  <span className="text-[11px] text-slate-400 font-sans block">Saldo em Caixa Total</span>
                  <span className="text-xl sm:text-2xl font-bold text-white block">R$ 281.045,94</span>
                  <span className="text-[10px] text-slate-400 font-sans block font-semibold text-emerald-400">R$ 210.390,04 livre (4,1 meses)</span>
                </div>
              </div>
            </div>

            {/* 4 Pilares da Viabilidade Contábil */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Scale className="w-5 h-5 text-indigo-600" />
                    Fundamentação Contábil e Orçamentária da Redução
                  </h3>
                  <p className="text-xs text-slate-500">
                    4 fatos contábeis auditados que comprovam a viabilidade imediata sem riscos de faltar caixa
                  </p>
                </div>
                <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-full border border-slate-200 self-start sm:self-auto">
                  Auditado: 65 Unidades
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Pilar 1 */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">1. Caixa Sólido com R$ 210K Livres</h4>
                      <span className="text-[11px] text-emerald-700 font-semibold">Sem risco de liquidez</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Temos <strong>R$ 281.045,94 em conta bancária e aplicações</strong>. Deste total, <strong>R$ 210.390,04 (~R$ 210K)</strong> estão 
                    <strong> 100% livres e desimpedidos</strong> de compromissos operacionais ou dívidas bancárias. 
                    Este valor <strong>ultrapassa em muito o valor obrigatório para Fundo de Reserva</strong> (que já possui R$ 19.564,62 resguardados). 
                    Esse colchão assegura mais de 4 meses de sobrevida mesmo em cenário extremo de receita zero.
                  </p>
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-950 font-medium">
                    ✓ <strong>Rendimento Passivo:</strong> O saldo aplicado em CDI rende cerca de <strong>~R$ 2.500,00/mês</strong> em receitas financeiras passivas para o condomínio.
                  </div>
                </div>

                {/* Pilar 2 */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold shrink-0">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">2. Superávit Mensal Crônico (+R$ 64K/mês)</h4>
                      <span className="text-[11px] text-indigo-700 font-semibold">Receitas duplicam despesas</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    As contas mostram forte superávit mensal consecutivo, com receitas que chegaram a ser superiores ao dobro das despesas correntes em vários períodos. 
                    A média móvel das sobras líquidas nos últimos 3 meses (Junho, Julho e Agosto/2026) atingiu expressivos 
                    <strong> + R$ 64.360,89 por mês</strong>.
                  </p>
                  <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-200 text-[11px] text-indigo-950 font-medium">
                    ✓ <strong>Fim do Acúmulo Ocioso:</strong> Como entidade sem fins lucrativos, o condomínio não deve reter capital excessivo tirando o poder aquisitivo dos condôminos.
                  </div>
                </div>

                {/* Pilar 3 */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold shrink-0">
                      <Receipt className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">3. Quitação Integral das Máquinas (R$ 76,8K)</h4>
                      <span className="text-[11px] text-amber-800 font-semibold">Custo extinto em Julho/2026</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    A taxa de R$ 1.545,90 embutia uma sobretaxa temporária de <strong>R$ 393,85/unidade</strong> para pagar a compra de 
                    <strong> Máquinas e Equipamentos (R$ 76.800,00)</strong>, dividida em 3 parcelas de <strong>R$ 25.600,00</strong> (Maio, Junho e Julho/2026).
                  </p>
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-950 font-medium">
                    ✓ <strong>Fato Contábil Concluído:</strong> Essas 3 parcelas foram <strong>100% quitadas em Julho</strong>. Em Agosto a despesa com máquinas foi <strong>R$ 0,00</strong>. Manter essa cobrança é enriquecimento sem causa.
                  </div>
                </div>

                {/* Pilar 4 */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold shrink-0">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">4. Custo Ordinário & Regra Extraordinária</h4>
                      <span className="text-[11px] text-blue-700 font-semibold">Custeio real de R$ 69K/mês</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    As despesas ordinárias reais do Silo 240 (Fênix Portaria/Limpeza, Síndico, Neoenergia, Elevadores, Seguro Predial, Controlar/Gruvi e Manutenção) somam 
                    <strong> R$ 69.015,76/mês (R$ 1.061,78/unid.)</strong>. Fixando a taxa em <strong>R$ 965,00</strong>, a arrecadação mensal será de R$ 62.725,00, 
                    perfeitamente respaldada pelos rendimentos do caixa e amortização do saldo retido.
                  </p>
                  <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-[11px] text-blue-950 font-medium">
                    ✓ <strong>Regramento Estrito:</strong> Despesas extraordinárias (compra de equipamentos futuros, reformas de fachada ou obras) <strong>DEVEM ser suportadas exclusivamente por taxas extras temporárias</strong> deliberadas em assembleia.
                  </div>
                </div>
              </div>
            </div>

            {/* Quadro Comparativo Sintético: Antes vs Proposto */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Scale className="w-5 h-5 text-indigo-600" />
                    Quadro Comparativo Sintético: Situação Atual vs. Proposta Sugerida
                  </h3>
                  <p className="text-xs text-slate-500">
                    Demonstrativo consolidado de impacto financeiro por unidade e no condomínio como um todo
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1.5 self-start sm:self-auto font-mono">
                  Economia Coletiva: R$ 453.102,00/ano
                </span>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 text-white font-semibold">
                    <tr>
                      <th className="p-3">Indicador / Rubrica Orçamentária</th>
                      <th className="p-3 text-right">Situação Atual</th>
                      <th className="p-3 text-right bg-emerald-900/60 text-emerald-200 font-bold">Proposta Sugerida</th>
                      <th className="p-3 text-right">Variação / Economia</th>
                      <th className="p-3">Parecer Contábil</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    <tr className="hover:bg-slate-50 bg-emerald-50/30">
                      <td className="p-3 font-bold text-slate-900 flex items-center gap-1.5">
                        <Coins className="w-4 h-4 text-emerald-600" />
                        Taxa Condominial Ordinária (Unitária)
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-rose-600">R$ 1.545,90 / mês</td>
                      <td className="p-3 text-right font-mono font-bold text-emerald-700 bg-emerald-50">R$ 965,00 / mês</td>
                      <td className="p-3 text-right font-mono font-bold text-emerald-700">- R$ 580,90 (- 37,6%)</td>
                      <td className="p-3 text-xs text-slate-600">Alívio imediato no orçamento dos condôminos</td>
                    </tr>

                    <tr className="hover:bg-slate-50">
                      <td className="p-3 font-semibold text-slate-900">Arrecadação Mensal das 65 Unidades</td>
                      <td className="p-3 text-right font-mono font-bold text-slate-800">R$ 100.483,50 / mês</td>
                      <td className="p-3 text-right font-mono font-bold text-slate-900 bg-slate-50">R$ 62.725,00 / mês</td>
                      <td className="p-3 text-right font-mono font-bold text-slate-700">- R$ 37.758,50 / mês</td>
                      <td className="p-3 text-xs text-slate-600">Equilíbrio orçamentário real do Silo 240</td>
                    </tr>

                    <tr className="hover:bg-slate-50 bg-emerald-50/20">
                      <td className="p-3 font-bold text-emerald-900">Economia Anual por Morador</td>
                      <td className="p-3 text-right font-mono text-slate-400">R$ 0,00</td>
                      <td className="p-3 text-right font-mono font-bold text-emerald-700 bg-emerald-50">+ R$ 6.970,80 / ano</td>
                      <td className="p-3 text-right font-mono font-bold text-emerald-700">+ R$ 6.970,80 / ano</td>
                      <td className="p-3 text-xs text-emerald-800 font-medium">Equivale a mais de 7 cotas inteiras economizadas</td>
                    </tr>

                    <tr className="hover:bg-slate-50 bg-emerald-50/20">
                      <td className="p-3 font-bold text-emerald-900">Economia Anual Coletiva (65 Unidades)</td>
                      <td className="p-3 text-right font-mono text-slate-400">R$ 0,00</td>
                      <td className="p-3 text-right font-mono font-bold text-emerald-700 bg-emerald-50">+ R$ 453.102,00 / ano</td>
                      <td className="p-3 text-right font-mono font-bold text-emerald-700">+ R$ 453.102,00 / ano</td>
                      <td className="p-3 text-xs text-emerald-800 font-medium">Fim do acúmulo desnecessário de caixa retido</td>
                    </tr>

                    <tr className="hover:bg-slate-50">
                      <td className="p-3 font-medium text-slate-800">Parcela de Máquinas e Equipamentos (R$ 76,8K)</td>
                      <td className="p-3 text-right font-mono text-rose-600">Embutida (R$ 393,85/un)</td>
                      <td className="p-3 text-right font-mono font-bold text-emerald-700 bg-slate-50">R$ 0,00 (100% Quitada)</td>
                      <td className="p-3 text-right font-mono text-emerald-700">- R$ 393,85/un</td>
                      <td className="p-3 text-xs text-slate-600">Custo encerrado em Julho/2026; não deve mais ser cobrado</td>
                    </tr>

                    <tr className="hover:bg-slate-50">
                      <td className="p-3 font-medium text-slate-800">Saldo em Conta e Aplicações</td>
                      <td className="p-3 text-right font-mono font-bold text-blue-700">R$ 281.045,94</td>
                      <td className="p-3 text-right font-mono font-bold text-blue-700 bg-slate-50">Preservado (~R$ 210K livre)</td>
                      <td className="p-3 text-right font-mono text-slate-600">Total Segurança</td>
                      <td className="p-3 text-xs text-slate-600">4,1 meses de sobrevida total (ampla margem)</td>
                    </tr>

                    <tr className="hover:bg-slate-50">
                      <td className="p-3 font-medium text-slate-800">Superávit Mensal Recente (Média 3M)</td>
                      <td className="p-3 text-right font-mono font-bold text-amber-600">+ R$ 64.360,89 / mês</td>
                      <td className="p-3 text-right font-mono text-slate-700 bg-slate-50">Ajustado ao equilíbrio</td>
                      <td className="p-3 text-right font-mono text-slate-600">Sustentável</td>
                      <td className="p-3 text-xs text-slate-600">Elimina sobras ociosas sem gerar déficit perigoso</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Card com Texto Formatado para WhatsApp e E-mail */}
            <div className="bg-slate-900 rounded-2xl p-6 sm:p-7 text-white shadow-md border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Texto Formatado Pronto para WhatsApp / E-mail</h4>
                    <span className="text-[11px] text-slate-400">Ideal para compartilhar nos grupos de proprietários e protocolar junto ao síndico</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCopyExecutiveSummary}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-slate-950 transition-colors shadow-sm cursor-pointer self-start sm:self-auto"
                >
                  {copiedExecutiveSummary ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedExecutiveSummary ? 'Copiado!' : 'Copiar Texto'}</span>
                </button>
              </div>

              <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 text-slate-300 font-mono text-xs leading-relaxed whitespace-pre-wrap select-all max-h-72 overflow-y-auto">
{`RESUMO EXECUTIVO: VIABILIDADE CONTÁBIL PARA REDUÇÃO DA TAXA CONDOMINIAL
Condomínio do Edifício Moinho Silo 240 (65 Unidades) • Emissão Oficial: 24/09/2026

1. Caixa Sólido e Livre: Temos R$ 281.045,94 em conta/aplicações. Destes, R$ 210.390,04 (~R$ 210K) estão 100% livres de compromissos ou dívidas operacionais. Este valor ultrapassa em muito a exigência obrigatória de Fundo de Reserva (R$ 19.564,62 já provisionados).

2. Superávit Operacional Crônico: A receita mensal chega a ser mais que o dobro das despesas correntes em vários períodos. A média móvel dos últimos 3 meses registrou sobra líquida de +R$ 64.360,89/mês.

3. Quitação Integral das Máquinas (R$ 76,8K): A taxa atual de R$ 1.545,90 embutia R$ 393,85/unidade para pagamento das máquinas e equipamentos em 3 parcelas de R$ 25.600,00 (Mai, Jun e Jul). O custo foi 100% QUITADO em Julho/2026 e em Agosto a despesa foi R$ 0,00.

4. Nova Taxa Sugerida: Dadas as despesas ordinárias reais auditadas (~R$ 69K/mês), podemos reduzir com folga e segurança a taxa ordinária para R$ 965,00/mês (-37,6%, economia de R$ 6.970,80/ano por morador e R$ 453.102,00/ano no condomínio).

5. Regramento Extraordinário: Reformas, melhorias ou novos equipamentos duráveis devem ser cobertos por taxas extraordinárias temporárias apenas quando houver necessidade e aprovação assemblear, mantendo a taxa ordinária enxuta e justa.

Fonte: Balancetes Oficiais Innova Housing & Controlar Condomínio Digital.`}
              </div>
            </div>

            {/* Quick Navigation Footer */}
            <div className="p-5 rounded-2xl bg-indigo-50 border border-indigo-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-indigo-900 block flex items-center gap-1.5">
                  <Calculator className="w-4 h-4 text-indigo-600" />
                  Deseja testar outros valores ou ver o simulador dinâmico?
                </span>
                <p className="text-xs text-indigo-700">
                  Acesse a guia <strong>"Nova Taxa Sugerida"</strong> para ajustar o número de unidades, alterar o fundo de reserva e comparar os 3 cenários orçamentários.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveTab('propostaTaxa')}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <span>Abrir Simulador Dinâmico</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

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
                    Controlar (Mai-Ago)
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
                  <button
                    onClick={() => setSelectedMonthFilter('abr-2026')}
                    className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                      selectedMonthFilter === 'abr-2026'
                        ? 'bg-blue-600 text-white font-semibold shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Abr/2026 (Transição)
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

        {/* Tab: Proposta de Nova Taxa Condominial Ordinária */}
        {activeTab === 'propostaTaxa' && (
          <div className="space-y-8">
            {/* Header Hero Banner with Savings Highlights */}
            <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 rounded-2xl p-6 sm:p-8 text-white shadow-lg border border-indigo-800/60">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-3 max-w-3xl">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 flex items-center gap-1.5">
                      <Scale className="w-3.5 h-3.5" />
                      ESTUDO DE REVISÃO ORÇAMENTÁRIA • SILO 240
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                      PARECER PARA ASSEMBLEIA
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
                    Proposta Contábil de Redução da Taxa Ordinária
                  </h2>
                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                    Atualmente pagamos <strong className="text-rose-400 font-mono">R$ 1.545,90 / mês</strong>. 
                    A auditoria comprova que as contas acumularam <strong className="text-white">R$ 281.045,94 em saldo</strong>, 
                    com superávit médio de <strong className="text-emerald-400 font-mono">+ R$ 64.360,89 / mês</strong>. 
                    A compra de máquinas de R$ 76.800,00 <strong>já foi 100% quitada</strong>. 
                    Propõe-se a redução da cota ordinária para <strong className="text-emerald-400 font-mono">R$ 965,00 / mês</strong> 
                    (economia de <strong className="text-emerald-400">- 37,6%</strong> ou <strong className="text-emerald-400">R$ 6.970,80 / ano</strong> por morador).
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleCopyProposal}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition-all cursor-pointer"
                  >
                    {copiedProposalText ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedProposalText ? 'Parecer Copiado!' : 'Copiar Minuta de Parecer'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPdfScope('current');
                      setShowPdfModal(true);
                    }}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-white text-slate-900 hover:bg-slate-100 shadow-sm transition-all cursor-pointer"
                  >
                    <Printer className="w-4 h-4 text-indigo-600" />
                    <span>Salvar Parecer em PDF</span>
                  </button>
                </div>
              </div>

              {/* KPI Boxes Row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6 pt-6 border-t border-indigo-900/60 font-mono">
                <div className="bg-white/5 p-3.5 rounded-xl border border-white/10">
                  <span className="text-[11px] text-slate-400 font-sans block">Taxa Atual Praticada</span>
                  <span className="text-xl sm:text-2xl font-bold text-rose-400 block mt-0.5">R$ 1.545,90</span>
                  <span className="text-[10px] text-slate-400 font-sans block">Cota de referência por unidade/mês</span>
                </div>

                <div className="bg-emerald-500/10 p-3.5 rounded-xl border border-emerald-500/30">
                  <span className="text-[11px] text-emerald-300 font-sans block">Nova Taxa Recomendada</span>
                  <span className="text-xl sm:text-2xl font-bold text-emerald-400 block mt-0.5">R$ 965,00</span>
                  <span className="text-[10px] text-emerald-300 font-sans block">Redução de - 37,6% (- R$ 580,90/mês)</span>
                </div>

                <div className="bg-white/5 p-3.5 rounded-xl border border-white/10">
                  <span className="text-[11px] text-slate-400 font-sans block">Economia Anual / Unidade</span>
                  <span className="text-xl sm:text-2xl font-bold text-emerald-300 block mt-0.5">R$ 6.970,80</span>
                  <span className="text-[10px] text-slate-400 font-sans block">Alívio direto no orçamento familiar</span>
                </div>

                <div className="bg-white/5 p-3.5 rounded-xl border border-white/10">
                  <span className="text-[11px] text-slate-400 font-sans block">Saldo Livre em Caixa</span>
                  <span className="text-xl sm:text-2xl font-bold text-white block mt-0.5">R$ 210.390,04</span>
                  <span className="text-[10px] text-slate-400 font-sans block">Garante 3,3 meses de sobrevida total</span>
                </div>
              </div>
            </div>

            {/* 3 Accounting & Legal Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Pilar 1 */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
                <div className="h-10 w-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <Scale className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-slate-900">
                  1. Tipicidade Orçamentária
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Conforme a <strong>Lei Federal nº 4.591/64 (Art. 12)</strong> e o <strong>Código Civil (Art. 1.336, I)</strong>, 
                  a <em>Taxa Condominial Ordinária</em> serve exclusivamente para suportar o custeio operacional rotineiro 
                  (portaria, limpeza, elevadores, energia comum, seguro, síndico e administradora).
                </p>
                <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200 text-[11px] text-blue-900">
                  <strong>Regra de Ouro:</strong> Compras de bens duráveis (máquinas, equipamentos e reformas) são despesas extraordinárias 
                  e não podem onerar permanentemente a cota ordinária mensal.
                </div>
              </div>

              {/* Pilar 2 */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-slate-900">
                  2. Máquinas Já 100% Quitadas
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  A taxa de R$ 1.545,90 foi concebida no período de implantação para custear a aquisição das 
                  <strong> Máquinas e Equipamentos (R$ 76.800,00)</strong>, pagas em 3 parcelas de <strong>R$ 25.600,00</strong> em Maio, Junho e Julho/2026.
                </p>
                <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-900">
                  <strong>Quitação Concluída:</strong> Essas parcelas <strong>já terminaram em Julho</strong>. 
                  Não faz sentido contábil manter a cota inflada para cobrir um custo que não existe mais.
                </div>
              </div>

              {/* Pilar 3 */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
                <div className="h-10 w-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  <DollarSign className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-slate-900">
                  3. Superávit Excessivo & Caixa
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Mesmo pagando todas as máquinas, o condomínio acumulou <strong>R$ 281.045,94 em conta</strong>, 
                  sendo <strong>R$ 210.390,04 em capital de giro livre</strong>. 
                  Nos últimos 3 meses, o superávit operacional médio foi de <strong>+ R$ 64.360,89/mês</strong>.
                </p>
                <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-900">
                  <strong>Retenção Desnecessária:</strong> Acumular caixa livre sem deliberação assemblear tira liquidez dos moradores. 
                  A taxa deve refletir a despesa real.
                </div>
              </div>
            </div>

            {/* Comprehensive Analytical Diagnosis: Units & R$ 281k Surplus */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-indigo-600" />
                    Diagnóstico Contábil: Base de Unidades (65 Unidades) & Saldo de R$ 281 Mil
                  </h3>
                  <p className="text-xs text-slate-500">
                    Memória de cálculo que comprova matematicamente a sobrearrecadação e o esgotamento das justificativas de implantação
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1.5 self-start sm:self-auto">
                  <Coins className="w-3.5 h-3.5 text-indigo-600" />
                  Base Auditada: 65 Unidades
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Diagnóstico 1: Base das 65 Unidades */}
                <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-indigo-600" />
                      Número de Unidades
                    </span>
                    <span className="text-xs font-mono font-bold bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded">
                      65 Unidades
                    </span>
                  </div>
                  <div className="space-y-1.5 text-xs text-slate-600">
                    <p className="leading-relaxed">
                      <strong>Comprovação na Arrecadação:</strong> Em Agosto/2026, a receita ordinária foi de <strong className="text-slate-900 font-mono">R$ 100.504,10</strong> (e em Julho <strong className="text-slate-900 font-mono">R$ 101.634,62</strong>).
                    </p>
                    <div className="p-2.5 bg-white rounded-lg border border-slate-200 font-mono text-[11px] text-slate-800 space-y-1">
                      <div>65 unid. × R$ 1.545,90 = <strong>R$ 100.483,50/mês</strong></div>
                      <div className="text-emerald-700 font-semibold">Custo Operacional Real: R$ 69.015,76 ÷ 65 = <strong>R$ 1.061,78/unid.</strong></div>
                      <div className="text-indigo-700 font-semibold">Custo com Reserva 10%: R$ 75.917,34 ÷ 65 = <strong>R$ 1.167,96/unid.</strong></div>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-tight">
                      A taxa de R$ 1.545,90 cobra <strong>R$ 377,94 a mais por unidade todos os meses</strong> além do custo operacional integral com fundo de reserva.
                    </p>
                  </div>
                </div>

                {/* Diagnóstico 2: Fim da Compra de Máquinas */}
                <div className="p-5 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                      <Receipt className="w-4 h-4 text-emerald-600" />
                      Fim das Máquinas (R$ 76,8K)
                    </span>
                    <span className="text-xs font-mono font-bold bg-emerald-200/80 text-emerald-900 px-2 py-0.5 rounded">
                      Quitado 100%
                    </span>
                  </div>
                  <div className="space-y-1.5 text-xs text-slate-600">
                    <p className="leading-relaxed">
                      <strong>Impacto por Unidade Eliminado:</strong> A compra de equipamentos consumia <strong className="text-slate-900 font-mono">R$ 25.600,00/mês</strong> em 3 parcelas (Mai, Jun e Jul/2026).
                    </p>
                    <div className="p-2.5 bg-white rounded-lg border border-emerald-200 font-mono text-[11px] text-slate-800 space-y-1">
                      <div>Parcela de Máquinas: R$ 25.600,00 ÷ 65 = <strong className="text-rose-600">R$ 393,85/unid./mês</strong></div>
                      <div className="text-emerald-700 font-semibold">Status em Agosto/2026: <strong>QUITADA (R$ 0,00)</strong></div>
                      <div className="text-slate-700">Taxa deduzida de máquinas: R$ 1.545,90 − R$ 393,85 = <strong>R$ 1.152,05</strong></div>
                    </div>
                    <p className="text-[11px] text-emerald-800 leading-tight">
                      Com o término em Julho, os moradores continuam pagando uma taxa inflada em <strong>R$ 393,85/mês</strong> por um bem já 100% pago.
                    </p>
                  </div>
                </div>

                {/* Diagnóstico 3: Saldo Excessivo de R$ 281 Mil */}
                <div className="p-5 rounded-xl border border-amber-200 bg-amber-50/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      Caixa de R$ 281 Mil
                    </span>
                    <span className="text-xs font-mono font-bold bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded">
                      4,1 Meses de Giro
                    </span>
                  </div>
                  <div className="space-y-1.5 text-xs text-slate-600">
                    <p className="leading-relaxed">
                      <strong>Excesso Retido sem Destinação:</strong> A praxe contábil (Secovi/IBRACON) orienta manter entre 1,5 e 2 meses de despesas de custeio (<strong className="text-slate-900 font-mono">R$ 103K a R$ 138K</strong>).
                    </p>
                    <div className="p-2.5 bg-white rounded-lg border border-amber-200 font-mono text-[11px] text-slate-800 space-y-1">
                      <div>Saldo Real Acumulado: <strong className="text-slate-900">R$ 281.045,94</strong></div>
                      <div>Teto Recomendado de Reserva: <strong className="text-slate-700">R$ 138.000,00</strong></div>
                      <div className="text-amber-800 font-semibold">Excesso de Liquidez Retido: <strong>R$ 143.045,94</strong></div>
                    </div>
                    <p className="text-[11px] text-amber-900 leading-tight">
                      Aplicações financeiras a CDI geram <strong>+ R$ 2.400,00 a R$ 2.800,00/mês</strong> de rendimentos passivos adicionais.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Fee Simulator */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-indigo-600" />
                    Simulador Dinâmico de Cota Condominial
                  </h3>
                  <p className="text-xs text-slate-500">
                    Ajuste o valor da taxa e a base de unidades para verificar o impacto financeiro unitário e coletivo em tempo real
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-500">Taxa de Referência:</span>
                  <span className="text-xs font-bold font-mono text-rose-700 bg-rose-50 px-2.5 py-1 rounded border border-rose-200">
                    R$ 1.545,90
                  </span>
                </div>
              </div>

              {/* Slider and Controls */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                <div className="lg:col-span-2 space-y-5">
                  {/* Units selector */}
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-700 flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-indigo-600" />
                        Base de Unidades do Silo 240:
                      </span>
                      <span className="font-mono font-bold text-indigo-700 text-sm">
                        {simulatedUnits} unidades autônomas
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min={50}
                        max={80}
                        step={1}
                        value={simulatedUnits}
                        onChange={(e) => setSimulatedUnits(Number(e.target.value))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                      />
                      <div className="flex gap-1 shrink-0">
                        {[60, 65, 68, 70].map((u) => (
                          <button
                            key={u}
                            type="button"
                            onClick={() => setSimulatedUnits(u)}
                            className={`px-2 py-1 rounded text-[10px] font-mono font-bold transition-all ${
                              simulatedUnits === u
                                ? 'bg-indigo-600 text-white shadow-xs'
                                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            {u}{u === 65 && ' (Oficial)'}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Fee slider */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-700">Valor da Taxa Simulada (por unidade):</span>
                      <span className="text-xl font-extrabold font-mono text-indigo-700">
                        R$ {simulatedTaxa.toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={700}
                      max={1545}
                      step={15}
                      value={simulatedTaxa}
                      onChange={(e) => setSimulatedTaxa(Number(e.target.value))}
                      className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                      <span>R$ 700,00 (Mínimo Custeio)</span>
                      <span className="text-indigo-600 font-bold">R$ 965,00 (Recomendado)</span>
                      <span>R$ 1.545,90 (Atual)</span>
                    </div>
                  </div>

                  {/* Preset Scenarios Buttons */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] font-semibold text-slate-500 block">Cenários Pré-Configurados:</span>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSimulatedTaxa(965);
                          setSelectedScenario('recomendado');
                        }}
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          simulatedTaxa === 965
                            ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20'
                            : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <span className="text-[10px] font-bold text-emerald-800 uppercase block">Recomendado (-37,6%)</span>
                        <span className="text-sm font-bold font-mono text-slate-900 block">R$ 965,00</span>
                        <span className="text-[10px] text-slate-500 block">Cobre custos + reserva + margem</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setSimulatedTaxa(850);
                          setSelectedScenario('economico');
                        }}
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          simulatedTaxa === 850
                            ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500/20'
                            : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <span className="text-[10px] font-bold text-blue-800 uppercase block">Custeio Estrito (-45,0%)</span>
                        <span className="text-sm font-bold font-mono text-slate-900 block">R$ 850,00</span>
                        <span className="text-[10px] text-slate-500 block">Foco no bolso do morador</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setSimulatedTaxa(1150);
                          setSelectedScenario('conservador');
                        }}
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          simulatedTaxa === 1150
                            ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-500/20'
                            : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <span className="text-[10px] font-bold text-amber-800 uppercase block">Conservador (-25,6%)</span>
                        <span className="text-sm font-bold font-mono text-slate-900 block">R$ 1.150,00</span>
                        <span className="text-[10px] text-slate-500 block">Transição com ampla margem</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Simulation Output Card */}
                {(() => {
                  const monthlyDiscount = 1545.90 - simulatedTaxa;
                  const annualDiscount = monthlyDiscount * 12;
                  const percentDiscount = ((monthlyDiscount / 1545.90) * 100).toFixed(1);
                  const isHealthy = simulatedTaxa >= 950;
                  const isTight = simulatedTaxa >= 850 && simulatedTaxa < 950;
                  const currentTotal = simulatedUnits * 1545.90;
                  const newTotal = simulatedUnits * simulatedTaxa;
                  const collectiveAnnualSavings = (currentTotal - newTotal) * 12;

                  return (
                    <div className="bg-slate-900 rounded-2xl p-5 text-white space-y-3 font-mono">
                      <div className="flex items-center justify-between text-xs text-slate-400 font-sans">
                        <span>Resultado da Simulação ({simulatedUnits} unid.)</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isHealthy ? 'bg-emerald-500/20 text-emerald-300' : isTight ? 'bg-blue-500/20 text-blue-300' : 'bg-amber-500/20 text-amber-300'
                        }`}>
                          {isHealthy ? 'Equilíbrio Robusto' : isTight ? 'Custeio Viável' : 'Margem Ajustada'}
                        </span>
                      </div>

                      <div className="pt-1">
                        <span className="text-xs text-slate-400 font-sans block">Economia Mensal por Morador:</span>
                        <span className="text-2xl font-black text-emerald-400">
                          - R$ {monthlyDiscount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                        <span className="text-xs text-emerald-300/80 font-sans block mt-0.5">
                          Redução de {percentDiscount}% na cota
                        </span>
                      </div>

                      <div className="border-t border-slate-800 pt-3 space-y-1.5 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-400 font-sans">Economia Anual / Morador:</span>
                          <span className="font-bold text-emerald-400">
                            R$ {annualDiscount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400 font-sans">Economia Anual Coletiva:</span>
                          <span className="font-bold text-emerald-300">
                            R$ {collectiveAnnualSavings.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400 font-sans">Nova Arrecadação Mensal:</span>
                          <span className="font-bold text-white">
                            R$ {newTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400 font-sans">Cobertura Caixa (R$ 281K):</span>
                          <span className="font-bold text-white">3,3 a 4,1 meses</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400 font-sans">Despesa Ordinária Coberta:</span>
                          <span className="font-bold text-emerald-400">100% Garantida</span>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Audit Table of Real Ordinary Expenses */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-slate-100/90 px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Receipt className="w-4 h-4 text-blue-600" />
                    Composição Analítica dos Custos Ordinários Reais Auditados
                  </h4>
                  <p className="text-xs text-slate-500">
                    Média mensal consolidada dos contratos e concessionárias do Silo 240 com rateio em {simulatedUnits} unidades
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-slate-500 block">Total Operacional Mensal:</span>
                  <span className="text-sm font-bold font-mono text-slate-900">
                    R$ 75.917,34 / mês (R$ {(75917.34 / simulatedUnits).toFixed(2).replace('.', ',')} / unid.)
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Item de Custo Ordinário</th>
                      <th className="py-3 px-4">Classificação</th>
                      <th className="py-3 px-4">Base Contratual / Comprovação</th>
                      <th className="py-3 px-4 text-right">Custo Total Mensal</th>
                      <th className="py-3 px-4 text-right">Custo / Unid. ({simulatedUnits} unid.)</th>
                      <th className="py-3 px-4 text-right">% Orçamento</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {ordinaryExpensesBenchmark.map((item, idx) => {
                      const percentage = ((item.monthlyAverage / 75917.34) * 100).toFixed(1);
                      const perUnit = (item.monthlyAverage / simulatedUnits).toFixed(2).replace('.', ',');
                      return (
                        <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-2.5 px-4 font-semibold text-slate-900 flex items-center gap-2">
                            <span className="text-slate-400 font-mono text-[10px] w-4">{idx + 1}.</span>
                            <span>{item.name}</span>
                          </td>
                          <td className="py-2.5 px-4 text-slate-600">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                              item.essentiality === 'Obrigatório'
                                ? 'bg-red-50 text-red-700 border-red-200'
                                : item.essentiality === 'Concessionária'
                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                : item.essentiality === 'Contratual'
                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                : 'bg-slate-100 text-slate-700 border-slate-200'
                            }`}>
                              {item.essentiality}
                            </span>
                          </td>
                          <td className="py-2.5 px-4 text-slate-500 font-sans">
                            {item.basis}
                          </td>
                          <td className="py-2.5 px-4 text-right font-mono font-bold text-slate-800 whitespace-nowrap">
                            R$ {item.monthlyAverage.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td className="py-2.5 px-4 text-right font-mono font-semibold text-indigo-700 whitespace-nowrap">
                            R$ {perUnit}
                          </td>
                          <td className="py-2.5 px-4 text-right font-mono text-slate-500 whitespace-nowrap">
                            {percentage}%
                          </td>
                        </tr>
                      );
                    })}

                    {/* Subtotal Operacional Direto */}
                    <tr className="bg-slate-50 font-bold border-t-2 border-slate-300">
                      <td colSpan={3} className="py-3 px-4 text-slate-900 uppercase">
                        Subtotal dos Custos Operacionais Diretos
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-900 text-sm">
                        R$ 69.015,76
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-indigo-800 text-sm">
                        R$ {(69015.76 / simulatedUnits).toFixed(2).replace('.', ',')}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-700">
                        90,9%
                      </td>
                    </tr>

                    {/* Fundo de Reserva Legal 10% */}
                    <tr className="bg-amber-50/60 font-semibold text-amber-900">
                      <td colSpan={3} className="py-3 px-4">
                        + Provisão de Fundo de Reserva Legal (10% sobre custos operacionais)
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-amber-900">
                        R$ 6.901,58
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-amber-900">
                        R$ {(6901.58 / simulatedUnits).toFixed(2).replace('.', ',')}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-amber-700">
                        9,1%
                      </td>
                    </tr>

                    {/* Total Geral Necessário */}
                    <tr className="bg-emerald-50 font-bold text-emerald-950 border-t-2 border-emerald-300">
                      <td colSpan={3} className="py-3.5 px-4 text-sm uppercase">
                        Orçamento Ordinário Mensal Total Necessário (Custeio + Reserva)
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-emerald-800 text-base">
                        R$ 75.917,34
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-emerald-900 text-base">
                        R$ {(75917.34 / simulatedUnits).toFixed(2).replace('.', ',')}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-emerald-800">
                        100,0%
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Directives for Extraordinary Expenses */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
              <div className="flex items-center gap-2 text-indigo-700 font-bold text-base border-b border-slate-100 pb-3">
                <AlertTriangle className="w-5 h-5 text-indigo-600" />
                Regramento Contábil & Governança de Despesas Extraordinárias
              </div>

              <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/80 text-xs text-rose-950 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <strong>VEDAÇÃO EXPRESSA: BENS DE CAPITAL NÃO PERTENCEM À TAXA ORDINÁRIA</strong>
                  <p className="leading-relaxed">
                    Compras de equipamentos duráveis (geradores, catracas, mobília, climatização, maquinário de academia) 
                    e obras estruturais <strong>NÃO PODEM ser embutidas na cota ordinária mensal</strong>. 
                    A taxa ordinária serve apenas para manter a operação em marcha; investimentos de capital exigem deliberação prévia 
                    e cobrança exclusiva via <em>Taxa Extraordinária Temporária</em>.
                  </p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                Para que a redução da taxa ordinária permaneça sustentável ao longo do tempo, o condomínio deve adotar 
                uma <strong>política estrita de segregação contábil</strong>, apresentada e aprovada em Assembleia Geral:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-700">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-indigo-600" />
                    1. Vedação de Investimentos na Taxa Ordinária
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    Fica expressamente vedado embutir compras de bens de capital (como novos maquinários, catracas, mobília ou geradores) 
                    dentro da cota ordinária mensal. Cada compra deve ter origem contábil delimitada.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-indigo-600" />
                    2. Aprovação Prévia por Taxa Extraordinária Específica
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    Sempre que houver necessidade de aquisição de novos equipamentos duráveis, a gestão deverá submeter 
                    à Assembleia Geral uma proposta com <strong>mínimo de 3 orçamentos</strong>, definindo o valor total, 
                    o número exato de parcelas e o rateio por fração ideal.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-indigo-600" />
                    3. Extinção Automática da Cobrança ao Fim das Parcelas
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    A taxa extraordinária deve ser cobrada em linha apartada no boleto do aplicativo Gruvi e cessar 
                    automaticamente assim que a última parcela do bem for quitada, impedindo a perpetuação indevida de custos.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-indigo-600" />
                    4. Conformidade com a Lei do Inquilinato (Lei nº 8.245/91)
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    A separação clara entre ordinário e extraordinário resguarda os proprietários que alugam suas unidades, 
                    pois a lei determina que as benfeitorias duráveis competem ao locador (proprietário), enquanto o custeio de rotina compete ao locatário (inquilino).
                  </p>
                </div>
              </div>

              {/* Case Study Callout */}
              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/70 flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-950 space-y-1">
                  <strong>Caso Prático de Sucesso já executado no Silo 240:</strong>
                  <p className="text-emerald-900/90 leading-relaxed">
                    A implantação do sistema de segurança predial foi rateada através da rubrica carimbada 
                    <em>"Taxa Extra - Sistema de Segurança"</em>, que arrecadou R$ 47.668,58 com prestação de contas apartada. 
                    O mesmo modelo deve ser seguido para qualquer investimento futuro, protegendo a cota ordinária em seu valor justo e reduzido.
                  </p>
                </div>
              </div>
            </div>

            {/* Formal Draft for Assembly Agenda */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-600" />
                    Minuta da Proposta para Pauta da Próxima Assembleia Geral (AGO/AGE)
                  </h4>
                  <p className="text-xs text-slate-500">
                    Texto técnico pronto para ser copiado e protocolado formalmente perante a sindicatura e conselho
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCopyProposal}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors cursor-pointer shrink-0 shadow-xs"
                >
                  {copiedProposalText ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedProposalText ? 'Copiado!' : 'Copiar Texto Completo'}</span>
                </button>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 leading-relaxed font-mono whitespace-pre-wrap select-all max-h-96 overflow-y-auto">
{`PROPOSTA DE DELIBERAÇÃO ASSEMBLEAR - CONDOMÍNIO DO EDIFÍCIO MOINHO SILO 240

ITEM DE PAUTA SUGERIDO:
"Revisão e Redução do Valor da Taxa Condominial Ordinária para o Exercício 2026/2027 e Regulamentação das Despesas Extraordinárias de Capital."

1. JUSTIFICATIVA CONTÁBIL & BASE DE UNIDADES:
• A base cadastral do condomínio é composta por ${simulatedUnits} unidades autônomas, que atualmente recolhem R$ 1.545,90 por mês cada, gerando arrecadação bruta de R$ ${(simulatedUnits * 1545.90).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/mês.
• A taxa de R$ 1.545,90 foi fixada durante a implantação inicial para suportar compras de bens de capital duráveis (máquinas e equipamentos no total de R$ 76.800,00, pagas em 3x R$ 25.600,00). Esse custo pesava R$ ${(25600 / simulatedUnits).toFixed(2).replace('.', ',')}/mês por unidade e FOI 100% QUITADO em Julho/2026.
• O custeio operacional rotineiro real auditado do Silo 240 (portaria 24h Fênix, limpeza, energia comum, manutenção de elevadores, síndico, administradora Controlar, seguro predial e tributos) totaliza apenas R$ 69.015,76/mês (R$ ${(69015.76 / simulatedUnits).toFixed(2).replace('.', ',')}/unidade).
• Mesmo após pagar todas as máquinas, o condomínio acumulou R$ 281.045,94 em saldo de caixa/aplicações (sendo R$ 210.390,04 em capital de giro livre), o equivalente a 4,1 meses de sobrevida total. O superávit médio dos últimos 3 meses foi de + R$ 64.360,89/mês, configurando sobrearrecadação evidente.

2. PROPOSTA DE VOTAÇÃO:
a) APROVAR a redução imediata da cota condominial ordinária de referência de R$ 1.545,90 para R$ ${simulatedTaxa.toFixed(2).replace('.', ',')} por mês (redução de ${(((1545.90 - simulatedTaxa) / 1545.90) * 100).toFixed(1)}%, gerando economia anual de R$ ${((1545.90 - simulatedTaxa) * 12).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} por unidade e economia coletiva de R$ ${((simulatedUnits * 1545.90 - simulatedUnits * simulatedTaxa) * 12).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/ano no condomínio).
b) DESTINAR 10% da arrecadação ordinária mensal (aproximadamente R$ 6.900,00/mês) para o Fundo de Reserva Legal, preservando a higidez do patrimônio coletivo.
c) INSTITUIR que quaisquer futuras aquisições de bens duráveis, benfeitorias ou maquinários deverão ser propostas e aprovadas EXCLUSIVAMENTE sob a modalidade de Taxa Extraordinária específica, com mínimo de 3 orçamentos, prazo e número pré-determinado de parcelas, vedada a sua incorporação à taxa ordinária mensal.

Subscrito por: Condôminos e Proprietários do Complexo Multiuso Moinho Recife - Silo 240.`}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Detailed Monthly Balances Timeline */}
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

              {/* Auditoria Específica da Transição: Abril e Maio/2026 */}
              <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 mb-6 shadow-xs flex flex-col md:flex-row items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-amber-600 text-white rounded-lg shrink-0 mt-0.5 shadow-xs">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-amber-950 uppercase tracking-wider flex items-center gap-2">
                      <span>Auditoria do Período de Transição: Abril e Maio/2026</span>
                      <span className="bg-amber-200 text-amber-900 text-[10px] px-2 py-0.5 rounded font-bold">Esclarecimento Oficial</span>
                    </h5>
                    <div className="text-xs text-amber-900/90 mt-1.5 space-y-1.5 leading-relaxed">
                      <p>
                        • <strong>Abril/2026 (Encerramento da Innova):</strong> Teve receita ordinária emitida de <strong>R$ 83.890,56</strong> (cota ordinária padrão) e despesas de <strong>R$ 166.715,00</strong> (custeio operacional + custos rescisórios e conciliação final da Innova). O déficit de R$ 82.824,44 absorveu as obrigações pendentes e transferiu o saldo de <strong>R$ 133.134,08</strong> para a nova gestão.
                      </p>
                      <p>
                        • <strong>Maio/2026 (1º Mês Controlar / Gruvi):</strong> A receita aparente foi de <strong>R$ 51.879,14</strong> (sendo apenas R$ 21.533,50 de taxa ordinária) devido ao período de adaptação dos condôminos ao novo aplicativo <strong>Gruvi</strong> e migração da carteira de boletos bancários.
                      </p>
                      <p>
                        • <strong>Compensação em Junho/2026:</strong> Com a regularização dos cadastros, os boletos pendentes da transição foram pagos acumuladamente, fazendo a taxa ordinária saltar para <strong>R$ 148.068,86</strong> (receita total de <strong>R$ 184.384,42</strong>). A soma de Maio e Junho totalizou <strong>R$ 236.263,56</strong> (média saudável de R$ 118,1K/mês), restabelecendo plenamente a normalidade contábil.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white px-3.5 py-2.5 rounded-xl border border-amber-200 shrink-0 text-center shadow-2xs self-stretch md:self-auto flex flex-col justify-center min-w-[180px]">
                  <span className="text-[10px] uppercase font-bold text-amber-800">Saldo Transferido</span>
                  <span className="text-base font-black font-mono text-slate-900">R$ 133.134,08</span>
                  <span className="text-[10px] text-slate-500">Innova → Controlar (01/05)</span>
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
                                  : month.source === 'Controlar'
                                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                                  : 'bg-purple-50 text-purple-700 border-purple-200'
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

                    {/* Section 0: Síntese Executiva */}
                    {(pdfScope === 'all' || activeTab === 'resumoExecutivo') && (
                      <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 font-bold text-emerald-950">
                            <Sparkles className="w-4 h-4 text-emerald-600" />
                            Síntese Executiva: Viabilidade para Redução da Taxa para R$ 965,00/mês
                          </div>
                          <span className="text-[10px] font-mono font-bold bg-emerald-200/80 text-emerald-900 px-2 py-0.5 rounded">
                            -37,6% (Economia R$ 6.970,80/ano)
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] text-slate-700 pt-1">
                          <div>
                            <strong className="text-slate-900 block">• Caixa Desimpedido:</strong>
                            R$ 281.045,94 em conta, sendo R$ 210.390,04 totalmente livres (4,1 meses de sobrevida), muito acima da reserva legal obrigatória.
                          </div>
                          <div>
                            <strong className="text-slate-900 block">• Fim das Máquinas:</strong>
                            R$ 76.800,00 100% quitados em Julho/2026. Parcela de R$ 393,85/unidade eliminada em definitivo.
                          </div>
                          <div>
                            <strong className="text-slate-900 block">• Superávit Crônico:</strong>
                            Média móvel líquida de +R$ 64.360,89/mês nos últimos 3 meses (receita chegou ao dobro do custeio).
                          </div>
                          <div>
                            <strong className="text-slate-900 block">• Regramento Extraordinário:</strong>
                            Novos equipamentos e reformas devem ser suportados apenas por taxas extras temporárias aprovadas em assembleia.
                          </div>
                        </div>
                      </div>
                    )}

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
