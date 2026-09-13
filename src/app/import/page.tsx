'use client';

import { useRef, useState } from 'react';
import { Upload } from 'lucide-react';
import { StoreHeader } from '@/components/layout/StoreHeader';
import styles from './page.module.css';

type ImportState = 'idle' | 'uploading' | 'done';

interface ErrorRow {
  line: number;
  column: string;
  value: string;
  problem: string;
}

interface ImportResult {
  filename: string;
  totalLines: number;
  imported: number;
  errors: number;
  duplicates: number;
  errorRows: ErrorRow[];
}

const MOCK_ERROR_ROWS: ErrorRow[] = [
  { line: 14, column: 'estilo', value: 'Boho', problem: 'Estilo fora da lista fixa do Piê' },
  { line: 27, column: 'preco', value: '199,00 reais', problem: 'Use apenas números (ex: 199.00)' },
  { line: 41, column: 'foto_url', value: '—', problem: 'Campo obrigatório em branco' },
  { line: 68, column: 'tamanhos', value: 'único', problem: 'Use U para tamanho único' },
  { line: 92, column: 'cor', value: 'Terra', problem: 'Cor não reconhecida — use Marrom' },
  {
    line: 119,
    column: 'link',
    value: 'sualoja/produto',
    problem: 'Link precisa começar com https://',
  },
];

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

export default function ImportPage() {
  const [importState, setImportState] = useState<ImportState>('done');
  const [result, setResult] = useState<ImportResult | null>({
    filename: 'produtos-agosto.csv',
    totalLines: 134,
    imported: 128,
    errors: 6,
    duplicates: 0,
    errorRows: MOCK_ERROR_ROWS,
  });
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.name.endsWith('.csv')) return;
    setImportState('uploading');
    setTimeout(() => {
      setResult({
        filename: file.name,
        totalLines: 134,
        imported: 128,
        errors: 6,
        duplicates: 0,
        errorRows: MOCK_ERROR_ROWS,
      });
      setImportState('done');
    }, 1500);
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
                com a lista fixa.
              </p>
              <button type="button" className={styles.outlineButton}>
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
                </div>
              )}

              <div className={styles.resultsFooter}>
                <div className={styles.footerActions}>
                  <button type="button" className={styles.primaryButton}>
                    Ver os {result.imported} produtos
                  </button>
                  <button type="button" className={styles.outlineButton}>
                    Baixar erros em .csv
                  </button>
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
