import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface MonthSummaryForPdf {
  id: string;
  name: string;
  periodLabel: string;
  source: 'Innova' | 'Controlar' | 'Transição';
  saldoAnterior: number;
  receitas: number;
  despesas: number;
  saldoFinal: number;
  movLiquido: number;
  mediaMovel3Meses: number;
  mediaMovelDesc: string;
  notes: string;
}

export interface FinancialItemForPdf {
  id: string;
  name: string;
  category: string;
  amount: number;
  monthId: string;
  monthLabel: string;
  details?: string;
}

export interface TopGrouping {
  topExpenses: FinancialItemForPdf[];
  otherExpensesTotal: number;
  totalExpensesSum: number;
  topRevenues: FinancialItemForPdf[];
  otherRevenuesTotal: number;
  totalRevenuesSum: number;
}

const formatCurrency = (val: number): string => {
  return 'R$ ' + val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

// Colors palette matching executive theme
const NAVY = [15, 23, 42]; // #0f172a
const BLUE_HEADER = [30, 58, 138]; // #1e3a8a
const SLATE_DARK = [51, 65, 85]; // #334155
const SLATE_LIGHT = [241, 245, 249]; // #f1f5f9
const EMERALD = [16, 185, 129]; // #10b981
const EMERALD_DARK = [4, 120, 87]; // #047857
const ROSE_DARK = [190, 18, 60]; // #be123c

export function generateExecutivePdf(
  scope: 'current' | 'all',
  activeTab: 'dashboard' | 'inadimplencia' | 'analise281k' | 'propostaTaxa' | 'timeline' | 'documentos',
  monthlyTimeline: MonthSummaryForPdf[],
  grouping: TopGrouping,
  selectedFilterLabel: string
): { doc: jsPDF; fileName: string; blob: Blob; blobUrl: string } {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;

  const addHeader = (title: string, subtitle: string) => {
    // Top banner
    doc.setFillColor(NAVY[0], NAVY[1], NAVY[2]);
    doc.rect(0, 0, pageWidth, 24, 'F');

    // Title & Brand
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('CONDOMÍNIO DO EDIFÍCIO MOINHO SILO 240', margin, 9);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.text('CNPJ: 47.289.584/0002-01 • Inscrição Municipal: 7765541 • Bairro do Recife, Recife-PE', margin, 14);

    // Document Type Pill
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(191, 219, 254);
    doc.text(title.toUpperCase(), pageWidth - margin, 9, { align: 'right' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(203, 213, 225);
    doc.text('Emissão: 24/09/2026 • Auditoria Contábil', pageWidth - margin, 14, { align: 'right' });

    // Thin accent bar
    doc.setFillColor(BLUE_HEADER[0], BLUE_HEADER[1], BLUE_HEADER[2]);
    doc.rect(0, 24, pageWidth, 1.5, 'F');

    // Section Subtitle
    doc.setTextColor(SLATE_DARK[0], SLATE_DARK[1], SLATE_DARK[2]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text(subtitle, margin, 32);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text('Dados oficiais consolidados das prestações de contas Innova Housing e Controlar Condomínio Digital', margin, 36);
  };

  const addSignatures = (startY: number) => {
    let y = startY;
    if (y > pageHeight - 38) {
      doc.addPage();
      y = 35;
    }

    doc.setDrawColor(203, 213, 225);
    doc.line(margin, y, pageWidth - margin, y);
    y += 5;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(SLATE_DARK[0], SLATE_DARK[1], SLATE_DARK[2]);
    doc.text('RESPONSÁVEIS PELA PRESTAÇÃO DE CONTAS E AUDITORIA', margin, y);
    y += 8;

    const colWidth = (pageWidth - margin * 2) / 3;

    // Signatory 1
    doc.setDrawColor(100, 116, 139);
    doc.line(margin + 5, y + 8, margin + colWidth - 5, y + 8);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(15, 23, 42);
    doc.text('Maurício Lacerda Sobrinho', margin + colWidth / 2, y + 12, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(100, 116, 139);
    doc.text('Síndico Profissional', margin + colWidth / 2, y + 15, { align: 'center' });

    // Signatory 2
    doc.line(margin + colWidth + 5, y + 8, margin + colWidth * 2 - 5, y + 8);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(15, 23, 42);
    doc.text('Carla Cristina Belchior', margin + colWidth * 1.5, y + 12, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(100, 116, 139);
    doc.text('Gerência Financeira', margin + colWidth * 1.5, y + 15, { align: 'center' });

    // Signatory 3
    doc.line(margin + colWidth * 2 + 5, y + 8, pageWidth - margin - 5, y + 8);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(15, 23, 42);
    doc.text('Fabio Luiz Siqueira de Paula', margin + colWidth * 2.5, y + 12, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(100, 116, 139);
    doc.text('Controller / Auditoria Fiscal', margin + colWidth * 2.5, y + 15, { align: 'center' });
  };

  const addPageNumbers = () => {
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(148, 163, 184);
      doc.text(
        `Página ${i} de ${totalPages} • Condomínio Moinho Silo 240 • Documento Gerado em 24/09/2026`,
        pageWidth / 2,
        pageHeight - 6,
        { align: 'center' }
      );
    }
  };

  // Helper to draw KPI summary boxes
  const drawKpiBoxes = (boxes: { label: string; value: string; sub: string; color: number[] }[], startY: number) => {
    const count = boxes.length;
    const gap = 3;
    const boxWidth = (pageWidth - margin * 2 - gap * (count - 1)) / count;
    const boxHeight = 16;

    boxes.forEach((box, idx) => {
      const bx = margin + idx * (boxWidth + gap);
      doc.setFillColor(SLATE_LIGHT[0], SLATE_LIGHT[1], SLATE_LIGHT[2]);
      doc.roundedRect(bx, startY, boxWidth, boxHeight, 1.5, 1.5, 'F');

      // Top colored border indicator
      doc.setFillColor(box.color[0], box.color[1], box.color[2]);
      doc.rect(bx, startY, boxWidth, 1.2, 'F');

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      doc.setTextColor(100, 116, 139);
      doc.text(box.label.toUpperCase(), bx + boxWidth / 2, startY + 4.5, { align: 'center' });

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(box.color[0], box.color[1], box.color[2]);
      doc.text(box.value, bx + boxWidth / 2, startY + 9.5, { align: 'center' });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6);
      doc.setTextColor(100, 116, 139);
      doc.text(box.sub, bx + boxWidth / 2, startY + 13.5, { align: 'center' });
    });
  };

  // 1. RENDER DASHBOARD TAB (Top 10 Custos e Receitas)
  const renderDashboardSection = (isFirstPage: boolean) => {
    if (!isFirstPage) doc.addPage();
    addHeader('Relatório Executivo: Custos & Receitas', `10 Maiores Custos e 10 Maiores Receitas (${selectedFilterLabel})`);

    drawKpiBoxes([
      { label: 'Total de Receitas', value: formatCurrency(grouping.totalRevenuesSum), sub: 'Arrecadação total do período', color: EMERALD_DARK },
      { label: 'Total de Despesas', value: formatCurrency(grouping.totalExpensesSum), sub: 'Custos operacionais liquidados', color: ROSE_DARK },
      {
        label: 'Resultado Líquido',
        value: `${grouping.totalRevenuesSum - grouping.totalExpensesSum >= 0 ? '+' : ''}${formatCurrency(grouping.totalRevenuesSum - grouping.totalExpensesSum)}`,
        sub: grouping.totalRevenuesSum - grouping.totalExpensesSum >= 0 ? 'Superávit no período' : 'Déficit no período',
        color: grouping.totalRevenuesSum - grouping.totalExpensesSum >= 0 ? EMERALD_DARK : ROSE_DARK
      },
      { label: 'Saldo Final (Ago/26)', value: 'R$ 281.045,94', sub: 'Disponibilidade bancária', color: BLUE_HEADER }
    ], 40);

    // Top 10 Custos Table
    let currentY = 60;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(SLATE_DARK[0], SLATE_DARK[1], SLATE_DARK[2]);
    doc.text('10 MAIORES DESPESAS / CUSTOS DO PERÍODO', margin, currentY);

    const expenseRows = grouping.topExpenses.map((e, index) => {
      const pct = grouping.totalExpensesSum > 0 ? ((e.amount / grouping.totalExpensesSum) * 100).toFixed(1) + '%' : '0%';
      return [
        `#${index + 1}`,
        e.name,
        e.category,
        formatCurrency(e.amount),
        pct
      ];
    });

    if (grouping.otherExpensesTotal > 0) {
      const otherPct = grouping.totalExpensesSum > 0 ? ((grouping.otherExpensesTotal / grouping.totalExpensesSum) * 100).toFixed(1) + '%' : '0%';
      expenseRows.push(['•', 'Outras Despesas e Custos Agrupados', 'Diversos', formatCurrency(grouping.otherExpensesTotal), otherPct]);
    }
    expenseRows.push(['TOTAL', 'TOTAL GERAL DE DESPESAS', 'Consolidado', formatCurrency(grouping.totalExpensesSum), '100%']);

    autoTable(doc, {
      startY: currentY + 2,
      head: [['#', 'Descrição da Despesa / Fornecedor', 'Categoria', 'Valor (R$)', '% Total']],
      body: expenseRows,
      theme: 'grid',
      headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 7, halign: 'left' },
      styles: { fontSize: 6.8, cellPadding: 1.5, textColor: [30, 41, 59] },
      columnStyles: {
        0: { cellWidth: 10, halign: 'center' },
        1: { cellWidth: 90 },
        2: { cellWidth: 35 },
        3: { cellWidth: 30, halign: 'right', fontStyle: 'bold' },
        4: { cellWidth: 17, halign: 'right' }
      },
      didParseCell: (data) => {
        if (data.row.index === expenseRows.length - 1) {
          data.cell.styles.fontStyle = 'bold';
          data.cell.styles.fillColor = [241, 245, 249];
          data.cell.styles.textColor = [15, 23, 42];
        }
      }
    });

    // Top 10 Receitas Table
    currentY = (doc as any).lastAutoTable.finalY + 8;
    if (currentY > pageHeight - 75) {
      doc.addPage();
      currentY = 32;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(SLATE_DARK[0], SLATE_DARK[1], SLATE_DARK[2]);
    doc.text('10 MAIORES RECEITAS DO PERÍODO', margin, currentY);

    const revenueRows = grouping.topRevenues.map((r, index) => {
      const pct = grouping.totalRevenuesSum > 0 ? ((r.amount / grouping.totalRevenuesSum) * 100).toFixed(1) + '%' : '0%';
      return [
        `#${index + 1}`,
        r.name,
        r.category,
        formatCurrency(r.amount),
        pct
      ];
    });

    if (grouping.otherRevenuesTotal > 0) {
      const otherPct = grouping.totalRevenuesSum > 0 ? ((grouping.otherRevenuesTotal / grouping.totalRevenuesSum) * 100).toFixed(1) + '%' : '0%';
      revenueRows.push(['•', 'Outras Receitas e Juros Agrupados', 'Diversos', formatCurrency(grouping.otherRevenuesTotal), otherPct]);
    }
    revenueRows.push(['TOTAL', 'TOTAL GERAL DE RECEITAS', 'Consolidado', formatCurrency(grouping.totalRevenuesSum), '100%']);

    autoTable(doc, {
      startY: currentY + 2,
      head: [['#', 'Descrição da Receita / Origem', 'Categoria', 'Valor (R$)', '% Total']],
      body: revenueRows,
      theme: 'grid',
      headStyles: { fillColor: [4, 120, 87], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 7, halign: 'left' },
      styles: { fontSize: 6.8, cellPadding: 1.5, textColor: [30, 41, 59] },
      columnStyles: {
        0: { cellWidth: 10, halign: 'center' },
        1: { cellWidth: 90 },
        2: { cellWidth: 35 },
        3: { cellWidth: 30, halign: 'right', fontStyle: 'bold' },
        4: { cellWidth: 17, halign: 'right' }
      },
      didParseCell: (data) => {
        if (data.row.index === revenueRows.length - 1) {
          data.cell.styles.fontStyle = 'bold';
          data.cell.styles.fillColor = [241, 245, 249];
          data.cell.styles.textColor = [15, 23, 42];
        }
      }
    });

    addSignatures((doc as any).lastAutoTable.finalY + 8);
  };

  // 2. RENDER INADIMPLENCIA TAB
  const renderInadimplenciaSection = (isFirstPage: boolean) => {
    if (!isFirstPage) doc.addPage();
    addHeader('Auditoria de Inadimplência & Cobrança', 'Evolução da Inadimplência, Quitação da Construtora e Acordos');

    drawKpiBoxes([
      { label: 'Inadimplência Atual', value: 'R$ 3.692,43', sub: 'Residual 3,2% (96,8% Adimplente)', color: EMERALD_DARK },
      { label: 'Pico em Fevereiro', value: 'R$ 85.230,29', sub: '98,4% concentrado na Construtora', color: ROSE_DARK },
      { label: 'Recuperado em Março', value: 'R$ 84.330,91', sub: '98,9% da dívida paga em 30 dias', color: BLUE_HEADER },
      { label: 'Queda Histórica', value: '- 95,7%', sub: 'Redução drástica da inadimplência', color: EMERALD_DARK }
    ], 40);

    let currentY = 60;
    // Executive Highlight Box: Construtora Case
    doc.setFillColor(240, 253, 244);
    doc.setDrawColor(187, 247, 208);
    doc.roundedRect(margin, currentY, pageWidth - margin * 2, 22, 1.5, 1.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(4, 120, 87);
    doc.text('CASE OFICIAL: QUITAÇÃO INTEGRAL DA CONSTRUTORA (R$ 83.890,56)', margin + 3, currentY + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.8);
    doc.setTextColor(30, 41, 59);
    doc.text(
      '• Origem do Débito: Em Fevereiro/2026, a construtora constava como devedora do Recibo nº 1522622 (venc. 27/02/2026) no valor de R$ 83.890,56.\n' +
      '• Solução e Liquidação: A pendência foi formalizada e 100% QUITADA em 10/03/2026 através do Acordo nº 76806, com depósito confirmado no Itaú.\n' +
      '• Impacto Contábil: A quitação restaurou a liquidez imediata do condomínio, elevando o saldo bancário para R$ 215.958,52 em Março/2026.',
      margin + 3,
      currentY + 10
    );

    currentY += 27;

    // Debtors analytical table
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(SLATE_DARK[0], SLATE_DARK[1], SLATE_DARK[2]);
    doc.text('RELAÇÃO ANALÍTICA DE UNIDADES AUDITADAS NOS RELATÓRIOS', margin, currentY);

    const debtorRows = [
      ['CONSTRUTORA', 'Recibo 1522622 (27/02)', 'Cota Condominial Bloco A / Unidades em estoque', 'R$ 83.890,56', '100% QUITADO', 'Acordo 76806 pago em 10/03/2026'],
      ['Unidade 0706', 'Recibo 1521743 (10/02)', 'Taxa Ordinária + Fundo Reserva Fev/2026', 'R$ 440,35', '100% QUITADO', 'Quitado em Março com juros (R$ 442,12)'],
      ['Unidade 0106', 'Recibo 1526435 (10/03)', 'Taxa Extra: Sistema de Segurança 1/5', 'R$ 483,86', 'Em Cobrança', 'Pendente no fechamento de Março'],
      ['Unidade 0203', 'Recibo 1526442 (10/03)', 'Taxa Extra: Sistema de Segurança 1/5', 'R$ 483,86', 'Em Cobrança', 'Pendente no fechamento de Março'],
      ['Unidade 0304', 'Recibo 1526450 (10/03)', 'Taxa Extra: Sistema de Segurança 1/5', 'R$ 678,61', 'Em Acordo', 'Parcelado via Acordo nº 78264'],
      ['Unidade 0306', 'Recibo 1526452 (10/03)', 'Taxa Extra: Sistema de Segurança 1/5', 'R$ 483,86', 'Em Acordo', 'Parcelado via Acordo nº 78265'],
      ['Unidade 0504', 'Recibo 1526463 (10/03)', 'Taxa Extra: Sistema de Segurança 1/5', 'R$ 678,61', 'Em Cobrança', 'Pendente no fechamento de Março'],
      ['Unidade 0808', 'Recibo 1526487 (10/03)', 'Taxa Extra: Sistema de Segurança 1/5', 'R$ 883,63', 'Em Cobrança', 'Pendente no fechamento de Março']
    ];

    autoTable(doc, {
      startY: currentY + 2,
      head: [['Unidade', 'Recibo / Vencimento', 'Composição da Cobrança', 'Valor Nominal', 'Status', 'Parecer da Cobrança']],
      body: debtorRows,
      theme: 'grid',
      headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 6.8 },
      styles: { fontSize: 6.5, cellPadding: 1.5 },
      columnStyles: {
        0: { cellWidth: 25, fontStyle: 'bold' },
        1: { cellWidth: 32 },
        2: { cellWidth: 45 },
        3: { cellWidth: 22, halign: 'right', fontStyle: 'bold' },
        4: { cellWidth: 23, halign: 'center', fontStyle: 'bold' },
        5: { cellWidth: 35 }
      },
      didParseCell: (data) => {
        if (data.column.index === 4) {
          if (data.cell.raw === '100% QUITADO') {
            data.cell.styles.textColor = [4, 120, 87];
          } else if (data.cell.raw === 'Em Acordo') {
            data.cell.styles.textColor = [30, 58, 138];
          } else {
            data.cell.styles.textColor = [180, 83, 9];
          }
        }
      }
    });

    currentY = (doc as any).lastAutoTable.finalY + 6;

    // Recuperações na gestão Controlar
    doc.setFillColor(SLATE_LIGHT[0], SLATE_LIGHT[1], SLATE_LIGHT[2]);
    doc.roundedRect(margin, currentY, pageWidth - margin * 2, 16, 1.5, 1.5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(SLATE_DARK[0], SLATE_DARK[1], SLATE_DARK[2]);
    doc.text('RECUPERAÇÕES ADMINISTRATIVAS CONTÍNUAS (GESTÃO CONTROLAR)', margin + 3, currentY + 4.5);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.text(
      '• Maio/2026: R$ 1.045,64 recuperados via acordo • Junho/2026: R$ 10.317,66 em acordos quitados\n' +
      '• Julho/2026: R$ 440,35 recuperados • Agosto/2026: R$ 385,40 recuperados + R$ 2.611,01 de juros/multas acumulados.',
      margin + 3,
      currentY + 9
    );

    addSignatures(currentY + 22);
  };

  // 3. RENDER ANALISE 281K TAB
  const renderAnalise281kSection = (isFirstPage: boolean) => {
    if (!isFirstPage) doc.addPage();
    addHeader('Auditoria e Parecer: R$ 281.045,94', 'Avaliação de Comprometimento, Destinação Legal e Disponibilidade');

    drawKpiBoxes([
      { label: 'Saldo Total em Conta', value: 'R$ 281.045,94', sub: 'Posição em 31/08/2026 (Controlar)', color: BLUE_HEADER },
      { label: 'Giro Livre Operacional', value: 'R$ 210.390,04', sub: '74,8% livre para despesas ordinárias', color: EMERALD_DARK },
      { label: 'Fundos Carimbados', value: 'R$ 70.655,90', sub: '25,2% vinculados a reservas/obras', color: [180, 83, 9] },
      { label: 'Dívidas / Empréstimos', value: 'R$ 0,00', sub: 'Condomínio sem passivos bancários', color: EMERALD_DARK }
    ], 40);

    let currentY = 60;

    // Resposta Oficial aos 3 Questionamentos do Usuário
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(SLATE_DARK[0], SLATE_DARK[1], SLATE_DARK[2]);
    doc.text('PARECER DE AUDITORIA: O SALDO DE R$ 281K ESTÁ COMPROMETIDO?', margin, currentY);

    const questionsRows = [
      [
        '1. Máquinas e Equipamentos (R$ 76.800,00)',
        '100% QUITADAS',
        'O condomínio adquiriu R$ 76.800,00 em máquinas e equipamentos para o Silo 240. Esse valor foi integralmente quitado em 3 parcelas de R$ 25.600,00 (Maio, Junho e Julho/2026). Em Agosto/2026 a despesa com máquinas foi R$ 0,00. NENHUM centavo dos R$ 281K está mais comprometido com isso.'
      ],
      [
        '2. Fundos Vinculados (Carimbados)',
        'R$ 70.655,90 (25,2%)',
        'Estão vinculados por convenção e assembleia: Fundo de Reserva Acumulado (R$ 19.564,62), Fundo do Sistema de Segurança (R$ 47.668,58) e Taxa de Fiscalização/Laudo Predial (R$ 3.422,70). Esses valores devem ser mantidos preservados para suas finalidades específicas.'
      ],
      [
        '3. Capital de Giro Livre Operacional',
        'R$ 210.390,04 (74,8%)',
        'Subtraindo os fundos carimbados, sobram R$ 210.390,04 em caixa totalmente livre. Como a despesa operacional média mensal é de ~R$ 32.000, esse saldo assegura 6,6 meses de operação contínua sem necessidade de arrecadar um único real.'
      ],
      [
        '4. Empréstimos ou Dívidas Bancárias',
        'R$ 0,00 (Inexistente)',
        'Todos os 4 relatórios contábeis atestam que o Condomínio Moinho Silo 240 não possui contratos de financiamento, empréstimos ou dívidas ativas com instituições financeiras ou terceiros.'
      ]
    ];

    autoTable(doc, {
      startY: currentY + 2,
      head: [['Item Auditado', 'Status / Valor', 'Parecer Técnico Conclusivo']],
      body: questionsRows,
      theme: 'grid',
      headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 7 },
      styles: { fontSize: 6.8, cellPadding: 2 },
      columnStyles: {
        0: { cellWidth: 45, fontStyle: 'bold' },
        1: { cellWidth: 35, fontStyle: 'bold' },
        2: { cellWidth: 102 }
      },
      didParseCell: (data) => {
        if (data.column.index === 1) {
          if (data.cell.raw === '100% QUITADAS' || data.cell.raw === 'R$ 0,00 (Inexistente)') {
            data.cell.styles.textColor = [4, 120, 87];
          }
        }
      }
    });

    currentY = (doc as any).lastAutoTable.finalY + 6;

    // Table: Destinação do Saldo Acumulado
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(SLATE_DARK[0], SLATE_DARK[1], SLATE_DARK[2]);
    doc.text('COMPOSIÇÃO E DESTINAÇÃO DO SALDO FINAL (AGOSTO/2026)', margin, currentY);

    const breakdownRows = [
      ['Capital Livre de Giro (Conta Corrente / Operacional)', 'R$ 210.390,04', '74,8%', 'Livre movimentação para despesas rotineiras'],
      ['Fundo de Reserva Legal Acumulado', 'R$ 19.564,62', '7,0%', 'Vinculado a contingências e fundo legal'],
      ['Fundo de Investimento em Segurança e Acesso', 'R$ 47.668,58', '17,0%', 'Vinculado ao projeto de segurança aprovado'],
      ['Fundo de Fiscalização Predial e Laudo WOM', 'R$ 3.422,70', '1,2%', 'Vinculado às vistorias e laudos de entrega da obra'],
      ['TOTAL CONSOLIDADO EM CONTA (31/08/2026)', 'R$ 281.045,94', '100,0%', 'Posição financeira auditada no relatório da Controlar']
    ];

    autoTable(doc, {
      startY: currentY + 2,
      head: [['Rubrica de Destinação', 'Saldo Vinculado (R$)', '% Saldo', 'Regra de Utilização']],
      body: breakdownRows,
      theme: 'grid',
      headStyles: { fillColor: [30, 58, 138], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 7 },
      styles: { fontSize: 6.8, cellPadding: 1.6 },
      columnStyles: {
        0: { cellWidth: 70, fontStyle: 'bold' },
        1: { cellWidth: 32, halign: 'right', fontStyle: 'bold' },
        2: { cellWidth: 18, halign: 'right' },
        3: { cellWidth: 62 }
      },
      didParseCell: (data) => {
        if (data.row.index === breakdownRows.length - 1) {
          data.cell.styles.fontStyle = 'bold';
          data.cell.styles.fillColor = [241, 245, 249];
          data.cell.styles.textColor = [15, 23, 42];
        }
      }
    });

    addSignatures((doc as any).lastAutoTable.finalY + 8);
  };

  // 4. RENDER PROPOSTA NOVA TAXA ORDINÁRIA
  const renderPropostaTaxaSection = (isFirstPage: boolean) => {
    if (!isFirstPage) doc.addPage();
    addHeader('Parecer Contábil: Proposta de Nova Taxa Condominial Ordinária', 'Argumentação Técnica, Custo Operacional Auditado, Base de 65 Unidades e Redução da Cota (Silo 240)');

    drawKpiBoxes([
      { label: 'Taxa Atual (65 Unidades)', value: 'R$ 1.545,90', sub: 'Total: R$ 100.483,50/mês', color: ROSE_DARK },
      { label: 'Nova Taxa Recomendada', value: 'R$ 965,00', sub: 'Redução de - 37,6% (- R$ 580,90/mês)', color: EMERALD_DARK },
      { label: 'Economia Anual / Morador', value: 'R$ 6.970,80', sub: 'Coletiva: R$ 453.102,00/ano', color: BLUE_HEADER },
      { label: 'Saldo Caixa / Investimentos', value: 'R$ 281.045,94', sub: '4,1 meses de sobrevida (R$ 210K livre)', color: SLATE_DARK }
    ], 40);

    let currentY = 58;

    // Card de Fundamentação Jurídico-Contábil
    doc.setFillColor(SLATE_LIGHT[0], SLATE_LIGHT[1], SLATE_LIGHT[2]);
    doc.roundedRect(margin, currentY, pageWidth - margin * 2, 29, 1.5, 1.5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(SLATE_DARK[0], SLATE_DARK[1], SLATE_DARK[2]);
    doc.text('FUNDAMENTAÇÃO CONTÁBIL, RATEIO EM 65 UNIDADES E REGRAMENTO EXTRAORDINÁRIO (LEI 4.591/64 E CC ART. 1.336/1.341)', margin + 3, currentY + 4.5);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.1);
    doc.text(
      '1. Base de Rateio (65 Unidades): A receita ordinária mensal estabilizada em R$ 100.504,10 (Agosto/26) confirma a base de 65 unidades a R$ 1.545,90/mês.\n' +
      '   O custo operacional real auditado é de R$ 69.015,76/mês (R$ 1.061,78/unid.) e com 10% de Fundo de Reserva é de R$ 75.917,34/mês (R$ 1.167,96/unid.).\n' +
      '2. Quitação Integral das Máquinas (R$ 76.800): As 3 parcelas de R$ 25.600,00 (Mai, Jun e Jul/26) que pesavam R$ 393,85/unidade/mês foram 100% quitadas\n' +
      '   em Julho/26. Manter a cota em R$ 1.545,90 após o término dos pagamentos constitui enriquecimento sem causa do caixa e oneração indevida dos condôminos.\n' +
      '3. Saldo Excessivo de R$ 281 Mil & Superávit Crônico: A média móvel líquida de Jun a Ago foi de + R$ 64.360,89/mês e o caixa soma R$ 281.045,94 (4,1 meses de giro).\n' +
      '   A boa prática contábil (Secovi) recomenda 1,5 a 2 meses de giro (R$ 138K), havendo R$ 143K de excesso retido. O CDI rende ~R$ 2.500/mês em receitas passivas.\n' +
      '4. Diretriz Imperativa para Gastos Extraordinários: Novos equipamentos duráveis ou reformas NÃO PODEM compor a taxa ordinária. Devem ser custeados\n' +
      '   exclusivamente por Taxa Extraordinária com 3 orçamentos, aprovação assemblear, prazo pré-fixado e extinção automática ao término das parcelas.',
      margin + 3,
      currentY + 8.5
    );

    currentY += 33;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(SLATE_DARK[0], SLATE_DARK[1], SLATE_DARK[2]);
    doc.text('1. CUSTOS OPERACIONAIS ORDINÁRIOS REAIS DO CONDOMÍNIO (MÉDIA MENSAL AUDITADA • 65 UNIDADES)', margin, currentY);

    const costRows = [
      ['Mão de Obra Terceirizada (Portaria 24h & Limpeza)', 'Contrato Fênix Terceirizações', 'R$ 37.000,00', 'R$ 569,23', '48,7%'],
      ['Pró-Labore do Síndico Profissional', 'Assembleia Geral de Instalação (RPA)', 'R$ 5.891,92', 'R$ 90,64', '7,8%'],
      ['Neoenergia (Áreas Comuns, Bombas e Gerador)', 'Concessionária Elétrica Estadual', 'R$ 5.200,00', 'R$ 80,00', '6,8%'],
      ['Manutenção Preventiva de Elevadores (Otis/Atlas)', 'Assistência Técnica Homologada', 'R$ 1.862,19', 'R$ 28,65', '2,5%'],
      ['Internet, Telecomunicações e Plataforma Gruvi', 'Link Dedicado + Licenciamento Digital', 'R$ 1.650,00', 'R$ 25,38', '2,2%'],
      ['Taxa de Gestão da Administradora (Controlar)', 'Contrato Mensal de Administração', 'R$ 1.620,00', 'R$ 24,92', '2,1%'],
      ['Seguro Predial Obrigatório Contra Incêndio', 'Parcelamento Apólice Regulamentar', 'R$ 1.174,53', 'R$ 18,07', '1,5%'],
      ['Tributos e Encargos Federais/Municipais (INSS/DARF/ISS)', 'Retenções sobre Serviços e Pró-Labore', 'R$ 2.800,00', 'R$ 43,08', '3,7%'],
      ['Materiais de Limpeza, Conservação e Descartáveis', 'Reposição Mensal de Insumos', 'R$ 2.500,00', 'R$ 38,46', '3,3%'],
      ['Demais Contratos (CFTV, Gás, Jurídico, Reparos, Tarifas)', 'Contratos de Rotina Operacional', 'R$ 9.317,12', 'R$ 143,34', '12,3%'],
      ['SUBTOTAL DOS CUSTOS OPERACIONAIS ORDINÁRIOS', 'Despesa Corrente de Funcionamento', 'R$ 69.015,76', 'R$ 1.061,78', '90,9%'],
      ['PROVISÃO DE FUNDO DE RESERVA LEGAL (10%)', 'Vinculado por Lei nº 4.591/64', 'R$ 6.901,58', 'R$ 106,18', '9,1%'],
      ['ORÇAMENTO ORDINÁRIO MENSAL NECESSÁRIO', 'Custeio Integral + Provisão de Reserva', 'R$ 75.917,34', 'R$ 1.167,96', '100,0%']
    ];

    autoTable(doc, {
      startY: currentY + 2,
      head: [['Item de Custo Operacional', 'Base de Apuração / Contrato', 'Custo Mensal (R$)', 'Custo / Unid. (65 un)', '% Total']],
      body: costRows,
      theme: 'grid',
      headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 6.8 },
      styles: { fontSize: 6.0, cellPadding: 1.1 },
      columnStyles: {
        0: { cellWidth: 62, fontStyle: 'bold' },
        1: { cellWidth: 54 },
        2: { cellWidth: 26, halign: 'right', fontStyle: 'bold' },
        3: { cellWidth: 24, halign: 'right', fontStyle: 'bold', textColor: [30, 58, 138] },
        4: { cellWidth: 16, halign: 'right' }
      },
      didParseCell: (data) => {
        if (data.row.index >= costRows.length - 3) {
          data.cell.styles.fontStyle = 'bold';
          data.cell.styles.fillColor = data.row.index === costRows.length - 1 ? [220, 252, 231] : [241, 245, 249];
          data.cell.styles.textColor = data.row.index === costRows.length - 1 ? [4, 120, 87] : [15, 23, 42];
        }
      }
    });

    currentY = (doc as any).lastAutoTable.finalY + 5;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(SLATE_DARK[0], SLATE_DARK[1], SLATE_DARK[2]);
    doc.text('2. CENÁRIOS COMPARATIVOS DE REDUÇÃO DA COTA MENSAL (RATEIO EM 65 UNIDADES)', margin, currentY);

    const scenarioRows = [
      ['Cenário Atual (Superavitário)', 'R$ 1.545,90', 'R$ 100.483,50', 'R$ 0,00 (0,0%)', 'R$ 0,00', 'Superávit excessivo de +R$ 64K/mês; máquinas já quitadas'],
      ['Cenário 1: Redução Conservadora', 'R$ 1.150,00', 'R$ 74.750,00', '- R$ 395,90 (-25,6%)', 'R$ 4.750,80', 'Transição segura com folga; absorve fim das parcelas de máquinas'],
      ['Cenário 2: COTA RECOMENDADA', 'R$ 965,00', 'R$ 62.725,00', '- R$ 580,90 (-37,6%)', 'R$ 6.970,80', 'Equilíbrio ideal: cobre custos (R$ 69K), amortiza excesso de caixa de R$ 281K'],
      ['Cenário 3: Custeio Estrito Enxuto', 'R$ 850,00', 'R$ 55.250,00', '- R$ 695,90 (-45,0%)', 'R$ 8.350,80', 'Alinhado estritamente ao custeio; amparado nos R$ 210K de caixa livre']
    ];

    autoTable(doc, {
      startY: currentY + 2,
      head: [['Cenário Proposto', 'Nova Cota (R$)', 'Total Mensal (65 un)', 'Redução Mensal', 'Economia Anual / Morador', 'Parecer Contábil']],
      body: scenarioRows,
      theme: 'grid',
      headStyles: { fillColor: [30, 58, 138], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 6.8 },
      styles: { fontSize: 6.0, cellPadding: 1.2 },
      columnStyles: {
        0: { cellWidth: 38, fontStyle: 'bold' },
        1: { cellWidth: 22, halign: 'right', fontStyle: 'bold' },
        2: { cellWidth: 26, halign: 'right', fontStyle: 'bold' },
        3: { cellWidth: 26, halign: 'right', fontStyle: 'bold' },
        4: { cellWidth: 28, halign: 'right', fontStyle: 'bold' },
        5: { cellWidth: 42 }
      },
      didParseCell: (data) => {
        if (data.row.index === 2) {
          data.cell.styles.fontStyle = 'bold';
          data.cell.styles.fillColor = [236, 253, 245];
          data.cell.styles.textColor = [4, 120, 87];
        }
      }
    });

    addSignatures((doc as any).lastAutoTable.finalY + 6);
  };

  // 5. RENDER TIMELINE TAB (Saldos Mensais e Médias Móveis)
  const renderTimelineSection = (isFirstPage: boolean) => {
    if (!isFirstPage) doc.addPage();
    addHeader('Demonstrativo de Saldos Mensais', 'Evolução Cronológica dos Saldos, Diferenças e Média Móvel (3 Meses)');

    drawKpiBoxes([
      { label: 'Saldo Atual (Ago/26)', value: 'R$ 281.045,94', sub: 'Pico de liquidez em conta', color: BLUE_HEADER },
      { label: 'Média Móvel Líquida (3M)', value: '+ R$ 64.360,89', sub: 'Média Jun, Jul e Ago/2026', color: EMERALD_DARK },
      { label: 'Média Líquida Geral', value: '+ R$ 35.130,74', sub: 'Sobra média dos 8 meses', color: SLATE_DARK },
      { label: 'Média Líquida Innova', value: '+ R$ 71.986,17', sub: 'Média Jan, Fev e Mar (Innova)', color: [180, 83, 9] }
    ], 40);

    let currentY = 60;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(SLATE_DARK[0], SLATE_DARK[1], SLATE_DARK[2]);
    doc.text('DEMONSTRATIVO MÊS A MÊS: RECEITAS, DESPESAS, DIFERENÇAS E MÉDIA MÓVEL (LÍQUIDA)', margin, currentY);

    const timelineRows = monthlyTimeline.map((m) => {
      const diffStr = (m.movLiquido >= 0 ? '+' : '') + formatCurrency(m.movLiquido);
      const mmStr = (m.mediaMovel3Meses >= 0 ? '+' : '') + formatCurrency(m.mediaMovel3Meses);
      return [
        m.name,
        m.source,
        formatCurrency(m.saldoAnterior),
        formatCurrency(m.receitas),
        formatCurrency(m.despesas),
        diffStr,
        formatCurrency(m.saldoFinal),
        mmStr
      ];
    });

    autoTable(doc, {
      startY: currentY + 2,
      head: [['Mês / Ano', 'Gestão', 'Saldo Anterior', 'Receitas (+)', 'Despesas (-)', 'Diferença (+/-)', 'Saldo Final (=)', 'Média Móvel 3M (Diferença)']],
      body: timelineRows,
      theme: 'grid',
      headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 6.8, halign: 'center' },
      styles: { fontSize: 6.5, cellPadding: 1.6, textColor: [30, 41, 59] },
      columnStyles: {
        0: { cellWidth: 18, fontStyle: 'bold' },
        1: { cellWidth: 18, halign: 'center' },
        2: { cellWidth: 23, halign: 'right' },
        3: { cellWidth: 23, halign: 'right', textColor: [4, 120, 87] },
        4: { cellWidth: 23, halign: 'right', textColor: [190, 18, 60] },
        5: { cellWidth: 24, halign: 'right', fontStyle: 'bold' },
        6: { cellWidth: 25, halign: 'right', fontStyle: 'bold', textColor: [30, 58, 138] },
        7: { cellWidth: 28, halign: 'right', fontStyle: 'bold' }
      },
      didParseCell: (data) => {
        if ((data.column.index === 5 || data.column.index === 7) && data.row.section === 'body') {
          const val = data.cell.raw as string;
          if (val && val.startsWith('+')) {
            data.cell.styles.textColor = [4, 120, 87];
          } else if (val && val.startsWith('-')) {
            data.cell.styles.textColor = [190, 18, 60];
          }
        }
      }
    });

    currentY = (doc as any).lastAutoTable.finalY + 6;

    // Notas explicativas do cálculo
    doc.setFillColor(SLATE_LIGHT[0], SLATE_LIGHT[1], SLATE_LIGHT[2]);
    doc.roundedRect(margin, currentY, pageWidth - margin * 2, 28, 1.5, 1.5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(SLATE_DARK[0], SLATE_DARK[1], SLATE_DARK[2]);
    doc.text('METODOLOGIA E ANÁLISE DA EVOLUÇÃO ORÇAMENTÁRIA', margin + 3, currentY + 4.5);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.2);
    doc.text(
      '• Diferença Mensal (Superávit/Déficit): Apurada estritamente como Receitas Líquidas menos Despesas Pagas no mês.\n' +
      '• Média Móvel (3M): Calculada sobre a coluna Diferença (Receitas - Despesas), nunca sobre o Saldo Final acumulado.\n' +
      '• Período de Transição (Abril/2026): Encerramento da Innova com emissão da cota ordinária de R$ 83.890,56 e liquidação de custos\n' +
      '  operacionais e rescisórios de R$ 166.715,00, entregando saldo de abertura de R$ 133.134,08 à Controlar em 01/05/2026.\n' +
      '• Migração Gruvi (Maio e Junho/2026): Em Maio, a taxa ordinária arrecadada foi de R$ 21.533,50 devido à adaptação cadastral dos moradores,\n' +
      '  sendo quitada cumulativamente em Junho (R$ 148.068,86), restabelecendo a média normal de arrecadação do condomínio (~R$ 118K/mês).\n' +
      '• Superávit Recente: Nos últimos 3 meses (Jun a Ago/2026), a média móvel líquida alcançou expressivos + R$ 64.360,89 por mês.',
      margin + 3,
      currentY + 8.5
    );

    addSignatures(currentY + 33);
  };

  // 5. RENDER DOCUMENTOS TAB
  const renderDocumentosSection = (isFirstPage: boolean) => {
    if (!isFirstPage) doc.addPage();
    addHeader('Dossiê de Fontes e Documentos Auditados', 'Fichamento das Prestações de Contas e Balancetes Oficiais');

    let currentY = 42;
    const docsInfo = [
      {
        title: 'Arquivo 1: Prestação de Contas Innova - Fevereiro/2026 (159 páginas)',
        desc: 'Balancete completo do Condomínio 5030 - Moinho 240 Residencial. Registra saldo inicial de R$ 83.890,56, receitas de R$ 79.142,01 (incluindo transferência indevida de R$ 51.200,00 estornada), despesas de R$ 122.675,95 e saldo final de R$ 40.356,62. Registra o pico de inadimplência de R$ 85.230,29.'
      },
      {
        title: 'Arquivo 2: Prestação de Contas Innova - Março/2026 (134 páginas)',
        desc: 'Balancete comprovando a recuperação histórica de R$ 84.330,91 da inadimplência, quitação da construtora (R$ 83.890,56 via Acordo 76806), receitas de R$ 193.367,85, despesas de R$ 17.765,95 e salto do saldo final para R$ 215.958,52.'
      },
      {
        title: 'Arquivo 3: Manual Controlar - Condomínio Digital & Gruvi (14 páginas)',
        desc: 'Guia do aplicativo Gruvi para condôminos e síndicos, demonstrando o acesso às pastas mensais digitalizadas, emissão de 2ª via de boletos, reserva de espaços e prestação de contas interativa.'
      },
      {
        title: 'Arquivo 4: Relatório Comparativo Controlar - Silo 240 (Janeiro a Agosto/2026)',
        desc: 'Demonstrativo oficial de receitas e despesas da gestão Controlar, demonstrando arrecadação total de R$ 455.192,47, despesas de R$ 307.280,61, aquisição de máquinas e equipamentos (R$ 76.800,00 quitadas) e saldo acumulado de R$ 281.045,94.'
      }
    ];

    docsInfo.forEach((d) => {
      doc.setFillColor(SLATE_LIGHT[0], SLATE_LIGHT[1], SLATE_LIGHT[2]);
      doc.roundedRect(margin, currentY, pageWidth - margin * 2, 24, 1.5, 1.5, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(BLUE_HEADER[0], BLUE_HEADER[1], BLUE_HEADER[2]);
      doc.text(d.title, margin + 4, currentY + 5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.8);
      doc.setTextColor(30, 41, 59);
      const splitText = doc.splitTextToSize(d.desc, pageWidth - margin * 2 - 8);
      doc.text(splitText, margin + 4, currentY + 10);

      currentY += 28;
    });

    addSignatures(currentY + 6);
  };

  // ORCHESTRATE GENERATION ACCORDING TO SCOPE
  if (scope === 'all') {
    renderDashboardSection(true);
    renderInadimplenciaSection(false);
    renderAnalise281kSection(false);
    renderPropostaTaxaSection(false);
    renderTimelineSection(false);
    renderDocumentosSection(false);
  } else {
    // Current tab only
    if (activeTab === 'dashboard') {
      renderDashboardSection(true);
    } else if (activeTab === 'inadimplencia') {
      renderInadimplenciaSection(true);
    } else if (activeTab === 'analise281k') {
      renderAnalise281kSection(true);
    } else if (activeTab === 'propostaTaxa') {
      renderPropostaTaxaSection(true);
    } else if (activeTab === 'timeline') {
      renderTimelineSection(true);
    } else if (activeTab === 'documentos') {
      renderDocumentosSection(true);
    }
  }

  addPageNumbers();

  const fileName = scope === 'all'
    ? 'Dossie_Financeiro_Consolidado_Silo_240.pdf'
    : `Relatorio_${activeTab.toUpperCase()}_Silo_240.pdf`;

  const blob = doc.output('blob');
  const blobUrl = URL.createObjectURL(blob);

  return { doc, fileName, blob, blobUrl };
}
