'use client';

import { useRef, useState } from 'react';
import { Upload, Link } from 'lucide-react';
import { StoreHeader } from '@/components/layout/StoreHeader/StoreHeader';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { getApiErrorMessage } from '@/utils/api-error';
import { importProductsCsv, downloadImportTemplate } from '@/lib/products/ProductsService';
import type { CsvImportResult } from '@/types/products';
import styles from './page.module.css';

const REQUIRED_COLUMNS = [
  'nome',
  'peca',
  'estilo',
  'cor',
  'tamanhos',
  'preco',
  'descricao',
  'link',
  'foto_url',
];

type ImportState = 'idle' | 'uploading' | 'done';

export default function ImportPage() {
  const { user } = useAuth();
  const companyId = user?.id ?? '';
  const [importState, setImportState] = useState<ImportState>('idle');
  const [result, setResult] = useState<CsvImportResult | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.name.endsWith('.csv')) return;
    if (!companyId) {
      toast.error('Empresa não identificada. Faça login novamente.');
      return;
    }
    setImportState('uploading');
    setResult(null);
    try {
      const res = await importProductsCsv(file);
      setResult(res);
      setImportState('done');
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Falha ao importar o arquivo.'));
      setImportState('idle');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const resetImport = () => {
    setImportState('idle');
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const downloadTemplate = () => {
    downloadImportTemplate().catch(() => {
      toast.error('Não foi possível baixar o modelo.');
    });
  };

  const downloadErrors = () => {
    if (!result) return;
    const lines = [
      'linha,coluna,valor,problema',
      ...result.errorRows.map((r) => `${r.line},${r.column},${r.value},${r.problem}`),
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=UTF-8' });
    const name = `erros-${result.filename}`;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={styles.page}>
      <StoreHeader />
      <main className={styles.container}>
        <div className={styles.content}>
          <header className={styles.header}>
            <p className={styles.pretitle}>Ateliê Nove</p>
            <h1 className={styles.title}>Importar produtos</h1>
            <p className={styles.subtitle}>
              Suba a planilha inteira de uma vez. O Piê processa e devolve um relatório com as
              <br />
              linhas que precisam de correção.
            </p>
          </header>

          <hr className={styles.divider} />

          <div
            className={`${styles.dropZone} ${isDragging ? styles.dropZoneDragging : ''} ${importState === 'uploading' ? styles.dropZoneUploading : ''}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              className={styles.fileInput}
              onChange={handleInputChange}
            />
            {importState === 'uploading' ? (
              <div className={styles.dropZoneContent}>
                <div className={styles.spinner} />
                <p className={styles.dropZoneTitle}>Processando arquivo…</p>
              </div>
            ) : (
              <div className={styles.dropZoneContent}>
                <Upload size={28} strokeWidth={1.5} className={styles.uploadIcon} />
                <p className={styles.dropZoneTitle}>Arraste seu arquivo .csv aqui</p>
                <p className={styles.dropZoneHint}>Até 5.000 linhas por envio · máx. 10 MB</p>
                <button
                  type="button"
                  className={styles.chooseFileButton}
                  onClick={() => fileInputRef.current?.click()}
                >
                  Escolher arquivo
                </button>
              </div>
            )}
          </div>

          <div className={styles.infoRow}>
            <div className={styles.infoSection}>
              <p className={styles.infoLabel}>MODELO DA PLANILHA</p>
              <p className={styles.infoText}>
                Use o modelo do Piê para não errar os nomes das colunas. Estilo e cor precisam bater
                com a lista fixa. Tamanhos múltiplos separam por ponto-e-vírgula (;).
              </p>
              <button type="button" className={styles.outlineButton} onClick={downloadTemplate}>
                Baixar modelo .csv
              </button>
            </div>
            <div className={styles.infoSectionDivider} />
            <div className={styles.infoSection}>
              <p className={styles.infoLabel}>COLUNAS OBRIGATÓRIAS</p>
              <p className={styles.columnsList}>
                {REQUIRED_COLUMNS.map((col, i) => (
                  <span key={col}>
                    <code className={styles.columnTag}>{col}</code>
                    {i < REQUIRED_COLUMNS.length - 1 && <span className={styles.dot}> · </span>}
                  </span>
                ))}
              </p>
            </div>
          </div>

          {importState === 'done' && result && (
            <>
              <div className={styles.fileBanner}>
                <span className={styles.fileInfo}>
                  <code className={styles.filename}>{result.filename}</code>
                  <span className={styles.fileLines}>{result.totalLines} linhas</span>
                </span>
                <button
                  type="button"
                  className={`${styles.outlineButton} ${styles.outlineButtonTransparent}`}
                  onClick={resetImport}
                >
                  Enviar outro arquivo
                </button>
              </div>

              <div className={styles.statsRow}>
                <div className={styles.statTile}>
                  <span className={styles.statNumber}>{result.imported}</span>
                  <span className={styles.statLabel}>PRODUTOS IMPORTADOS</span>
                </div>
                <div className={styles.statTile}>
                  <span
                    className={`${styles.statNumber} ${result.errors > 0 ? styles.statNumberError : ''}`}
                  >
                    {result.errors}
                  </span>
                  <span className={styles.statLabel}>LINHAS COM ERRO</span>
                </div>
                <div className={styles.statTile}>
                  <span className={styles.statNumber}>{result.duplicates}</span>
                  <span className={styles.statLabel}>DUPLICADOS IGNORADOS</span>
                </div>
              </div>

              {result.errorRows.length > 0 && (
                <div className={styles.errorSection}>
                  <p className={styles.errorSectionTitle}>RELATÓRIO DE ERROS</p>
                  <div className={styles.tableWrapper}>
                    <table className={styles.errorTable}>
                      <thead>
                        <tr>
                          <th className={styles.th}>LINHA</th>
                          <th className={styles.th}>COLUNA</th>
                          <th className={styles.th}>VALOR ENVIADO</th>
                          <th className={styles.th}>PROBLEMA</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.errorRows.map((row) => (
                          <tr key={row.line} className={styles.row}>
                            <td className={styles.td}>{row.line}</td>
                            <td className={styles.td}>
                              <code className={styles.code}>{row.column}</code>
                            </td>
                            <td className={styles.td}>{row.value}</td>
                            <td className={`${styles.td} ${styles.tdProblem}`}>{row.problem}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <button type="button" className={styles.outlineButton} onClick={downloadErrors}>
                    Baixar erros em .csv
                  </button>
                </div>
              )}

              <div className={styles.resultsFooter}>
                <div className={styles.footerActions}>
                  <Link href="/products" className={styles.primaryButton}>
                    Ver os {result.imported} produtos
                  </Link>
                </div>
                {result.errors > 0 && (
                  <p className={styles.footerNote}>
                    As {result.errors} linhas com erro não foram importadas.
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
