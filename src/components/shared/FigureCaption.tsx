import type { CSSProperties, ReactNode } from 'react';
import '../../styles/figure-caption.css';

/** One caption treatment for diagrams, illustrations and photographic credits. */
export function FigureCaption({ children, number, as: Tag = 'figcaption', className = '', color }: {
  children: ReactNode;
  number?: number;
  as?: 'figcaption' | 'div' | 'span';
  className?: string;
  color?: string;
}) {
  return <Tag className={`figure-caption ${className}`} style={color ? { '--caption-ink': color } as CSSProperties : undefined}>
    {number !== undefined && <span className="figure-caption-number">fig. {String(number).padStart(2, '0')} — </span>}
    {children}
  </Tag>;
}
