'use client';

import { useState } from 'react';
import { User } from 'lucide-react';
import styles from './avatar.module.css';

interface AvatarProps {
  name: string;
  src?: string | null;
  size?: number;
}

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

export function Avatar({ name, src, size = 32 }: AvatarProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  const imageSrc = src && src !== failedSrc ? src : null;
  const initials = getInitials(name);

  return (
    <span
      className={styles.avatar}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.38) }}
      aria-hidden="true"
    >
      {imageSrc ? (
        <img
          src={imageSrc}
          alt=""
          className={styles.image}
          onError={() => setFailedSrc(imageSrc)}
        />
      ) : initials ? (
        initials
      ) : (
        <User size={Math.round(size * 0.55)} />
      )}
    </span>
  );
}
