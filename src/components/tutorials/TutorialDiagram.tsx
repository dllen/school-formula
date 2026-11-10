import { useEffect, useRef } from 'react';
import type { Diagram } from '../../data/tutorials';

interface TutorialDiagramProps {
  diagram: Diagram;
}

/* The tutorial SVGs are authored in the data with literal paints. On the paper
 * canvas they are re-tokenised: white becomes the card surface, black the ink,
 * and a hue becomes the matching status role. Everything stays a var(--color-*)
 * so the diagram belongs to the same palette as the page. */
const parseHex = (value: string): [number, number, number] | null => {
  const match = value.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/);
  if (!match) return null;
  const hex = match[1];
  const full = hex.length === 3 ? hex.split('').map(c => c + c).join('') : hex;
  return [
    parseInt(full.slice(0, 2), 16),
    parseInt(full.slice(2, 4), 16),
    parseInt(full.slice(4, 6), 16),
  ];
};

const roleForHue = (hue: number): 'error' | 'warning' | 'success' | 'accent' => {
  if (hue >= 340 || hue < 20) return 'error';
  if (hue < 55) return 'warning';
  if (hue < 170) return 'success';
  return 'accent';
};

const tokenPaint = (raw: string, property: 'fill' | 'stroke'): string => {
  const value = raw.trim().toLowerCase();
  if (value === 'none' || value === 'currentcolor' || value.startsWith('url(')) return raw;
  if (value === 'white') return property === 'fill' ? 'var(--color-card)' : 'var(--color-paper)';
  if (value === 'black') return 'var(--color-ink)';

  const rgb = parseHex(value);
  if (!rgb) return raw;

  const [r, g, b] = rgb;
  if (r === 255 && g === 255 && b === 255) {
    return property === 'fill' ? 'var(--color-card)' : 'var(--color-paper)';
  }
  if (r === 0 && g === 0 && b === 0) return 'var(--color-ink)';

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const chroma = max - min;

  // A near-grey is a rule, never a status.
  if (chroma < 20) {
    return property === 'fill' ? 'var(--color-paper-3)' : 'var(--color-ink-3)';
  }

  const delta = max - min;
  let hue: number;
  if (max === r) hue = ((g - b) / delta) % 6;
  else if (max === g) hue = (b - r) / delta + 2;
  else hue = (r - g) / delta + 4;
  hue *= 60;
  if (hue < 0) hue += 360;

  // A fill is a soft ground; a stroke is the signal drawn on it.
  const role = roleForHue(hue);
  if (property === 'fill') {
    return `var(--color-${role === 'accent' ? 'accent-soft' : `${role}-bg`})`;
  }
  return `var(--color-${role})`;
};

const themeSvg = (markup: string): string =>
  markup.replace(/(fill|stroke)="([^"]+)"/g, (_match, property: string, value: string) =>
    `${property}="${tokenPaint(value, property as 'fill' | 'stroke')}"`,
  );

/* Mermaid's own colour parser predates OKLCH, so the token value is converted
 * to sRGB at render time. The tokens stay the single source of colour. */
const oklchToRgb = (value: string): string => {
  const match = value.match(/^oklch\(\s*([\d.]+)%?\s+([\d.]+)%?\s+([\d.]+)/);
  if (!match) return value;

  const lightness = match[1].includes('%') ? parseFloat(match[1]) / 100 : parseFloat(match[1]);
  const chroma = parseFloat(match[2]) / (match[2].includes('%') ? 100 : 1);
  const hue = (parseFloat(match[3]) * Math.PI) / 180;

  const a = chroma * Math.cos(hue);
  const b = chroma * Math.sin(hue);

  const lPrime = lightness + 0.3963377774 * a + 0.2158037573 * b;
  const mPrime = lightness - 0.1055613458 * a - 0.0638541728 * b;
  const sPrime = lightness - 0.0894841775 * a - 1.291485548 * b;

  const l = lPrime ** 3;
  const m = mPrime ** 3;
  const s = sPrime ** 3;

  const red = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const green = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const blue = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;

  const channel = (linear: number) => {
    const encoded = linear <= 0.0031308 ? 12.92 * linear : 1.055 * linear ** (1 / 2.4) - 0.055;
    return Math.max(0, Math.min(255, Math.round(encoded * 255)));
  };

  return `rgb(${channel(red)}, ${channel(green)}, ${channel(blue)})`;
};

const labelSvg = (container: HTMLElement, label: string, keepNaturalWidth: boolean) => {
  const svg = container.querySelector('svg');
  if (!svg) return;
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', label);

  const box = svg.viewBox?.baseVal;
  if (!box || !box.width || !box.height) return;

  if (keepNaturalWidth) {
    // Mermaid renders at its natural size; below that the labels stop being
    // legible, so a narrow screen scrolls the figure instead of shrinking it.
    svg.style.maxWidth = 'none';
    svg.setAttribute('width', String(Math.ceil(box.width)));
    svg.setAttribute('height', String(Math.ceil(box.height)));
  } else {
    // Authored diagrams cap at their own size and may shrink, never upscale.
    svg.style.width = '100%';
    svg.style.maxWidth = `${Math.ceil(box.width)}px`;
    svg.removeAttribute('height');
  }
};

export const TutorialDiagram = ({ diagram }: TutorialDiagramProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const label = diagram.caption || '本课示意图';

    if (diagram.type === 'svg') {
      container.innerHTML = themeSvg(diagram.content);
      labelSvg(container, label, false);
      return;
    }

    let cancelled = false;

    const renderMermaid = async () => {
      try {
        const mermaid = await import('mermaid');
        const style = getComputedStyle(document.documentElement);
        const token = (name: string) => style.getPropertyValue(name).trim();
        const color = (name: string) => oklchToRgb(token(name));

        mermaid.default.initialize({
          startOnLoad: false,
          theme: 'base',
          securityLevel: 'strict',
          themeVariables: {
            background: color('--color-paper'),
            mainBkg: color('--color-paper-2'),
            primaryColor: color('--color-paper-2'),
            primaryTextColor: color('--color-ink'),
            primaryBorderColor: color('--color-rule-strong'),
            secondaryColor: color('--color-paper-3'),
            secondaryTextColor: color('--color-ink'),
            secondaryBorderColor: color('--color-rule'),
            tertiaryColor: color('--color-paper'),
            tertiaryTextColor: color('--color-ink'),
            tertiaryBorderColor: color('--color-divider'),
            lineColor: color('--color-ink-3'),
            textColor: color('--color-ink'),
            fontFamily: token('--font-sans'),
            fontSize: '14px',
            edgeLabelBackground: color('--color-paper'),
          },
        });
        const id = `mermaid-${Math.random().toString(36).slice(2, 11)}`;
        const { svg } = await mermaid.default.render(id, diagram.content);
        if (!cancelled && container) {
          container.innerHTML = svg;
          labelSvg(container, label, true);
        }
      } catch (error) {
        console.error(error);
        if (!cancelled && container) {
          container.innerHTML =
            '<p class="text-body-s text-error-ink">图表渲染失败，请检查 Mermaid 语法</p>';
        }
      }
    };

    renderMermaid();

    return () => {
      cancelled = true;
    };
  }, [diagram]);

  return (
    <figure className="my-6">
      <div
        ref={containerRef}
        className="flex overflow-x-auto [&_svg]:mx-auto [&_svg]:h-auto [&_svg_text]:fill-ink"
      />
      {diagram.caption && (
        <figcaption className="mt-2 text-center text-caption text-ink-3">
          {diagram.caption}
        </figcaption>
      )}
    </figure>
  );
};
