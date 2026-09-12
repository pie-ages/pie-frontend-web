import { ChangeEvent, useRef } from 'react';
import { Plus, X } from 'lucide-react';
import type { ProductImage } from '@/types/productForm';
import styles from './styles.module.css';

interface ProductImagesFieldProps {
  images: ProductImage[];
  onChange: (images: ProductImage[]) => void;
  error?: string;
  hint?: string;
}

function createImageId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `img-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function ProductImagesField({ images, onChange, error, hint }: ProductImagesFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const primary = images.find((image) => image.isPrimary) ?? images[0] ?? null;
  const others = images.filter((image) => image.id !== primary?.id);

  const handleFilesSelected = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const newImages: ProductImage[] = Array.from(files).map((file, index) => ({
      id: createImageId(),
      url: URL.createObjectURL(file),
      name: file.name,
      isPrimary: images.length === 0 && index === 0,
    }));

    onChange([...images, ...newImages]);
    event.target.value = '';
  };

  const handleSetPrimary = (id: string) => {
    onChange(images.map((image) => ({ ...image, isPrimary: image.id === id })));
  };

  const handleRemove = (id: string) => {
    const removed = images.find((image) => image.id === id);
    if (removed?.url.startsWith('blob:')) {
      URL.revokeObjectURL(removed.url);
    }

    const remaining = images.filter((image) => image.id !== id);
    if (removed?.isPrimary && remaining.length > 0) {
      remaining[0] = { ...remaining[0], isPrimary: true };
    }

    onChange(remaining);
  };

  return (
    <div className={styles.photosSection}>
      <span className={styles.sectionLabel}>Fotos</span>

      <div
        className={`${styles.mainPhoto} ${!primary ? styles.mainPhotoEmpty : ''}`}
        onClick={() => {
          if (!primary) inputRef.current?.click();
        }}
        role={!primary ? 'button' : undefined}
        tabIndex={!primary ? 0 : undefined}
      >
        {primary ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={primary.url} alt={primary.name} className={styles.mainPhotoImg} />
            <span className={styles.photoTag}>{primary.name}</span>
            <button
              type="button"
              className={styles.removeMainButton}
              onClick={(event) => {
                event.stopPropagation();
                handleRemove(primary.id);
              }}
              aria-label="Remover imagem principal"
            >
              <X size={14} />
            </button>
          </>
        ) : (
          <span className={styles.emptyLabel}>Clique para enviar a foto principal</span>
        )}
      </div>

      <div className={styles.thumbRow}>
        {others.map((image) => (
          <button
            key={image.id}
            type="button"
            className={styles.thumb}
            onClick={() => handleSetPrimary(image.id)}
            aria-label={`Definir ${image.name} como imagem principal`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image.url} alt={image.name} className={styles.thumbImg} />
            <span
              className={styles.removeThumbButton}
              role="button"
              tabIndex={0}
              aria-label={`Remover ${image.name}`}
              onClick={(event) => {
                event.stopPropagation();
                handleRemove(image.id);
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.stopPropagation();
                  handleRemove(image.id);
                }
              }}
            >
              <X size={12} />
            </span>
          </button>
        ))}

        <button type="button" className={styles.addTile} onClick={() => inputRef.current?.click()}>
          <Plus size={18} />
          <span>Adicionar</span>
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFilesSelected}
        className={styles.hiddenInput}
      />

      {hint && <p className={styles.photosHint}>{hint}</p>}

      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
}
