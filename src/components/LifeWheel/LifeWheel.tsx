import { useEffect, useMemo, useState } from 'react';
import type { LifeArea } from '../../types';
import { desireService, lifeAreaService } from '../../services/db';
import Header from '../Header/Header';
import './LifeWheel.css';
import { useI18n } from '../../i18n';

const AREAS: LifeArea[] = ['health', 'love', 'growth', 'family', 'home', 'work', 'hobby', 'finance'];

const AREA_COLORS: Record<LifeArea, string> = {
  health: '#49a078',
  love: '#f2b6c6',
  growth: '#5a7ba7',
  family: '#9aa0a6',
  home: '#58c6d6',
  work: '#2d4f7a',
  hobby: '#f4c542',
  finance: '#c44d58',
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function polarToCartesian(cx: number, cy: number, r: number, angleRad: number) {
  return { x: cx + r * Math.cos(angleRad), y: cy + r * Math.sin(angleRad) };
}

function sectorPath(cx: number, cy: number, r: number, a0: number, a1: number) {
  const p0 = polarToCartesian(cx, cy, r, a0);
  const p1 = polarToCartesian(cx, cy, r, a1);
  const largeArc = a1 - a0 > Math.PI ? 1 : 0;
  return `M ${cx} ${cy} L ${p0.x} ${p0.y} A ${r} ${r} 0 ${largeArc} 1 ${p1.x} ${p1.y} Z`;
}

export default function LifeWheel({
  onCreateWish,
  onCreateWishInArea,
  onShowAllDesires,
}: {
  onCreateWish: () => void;
  onCreateWishInArea: (area: LifeArea) => void;
  onShowAllDesires: (area?: LifeArea) => void;
}) {
  const { t } = useI18n();
  const [scores, setScores] = useState<Record<LifeArea, number>>(() => {
    const init = {} as Record<LifeArea, number>;
    for (const a of AREAS) init[a] = 0;
    return init;
  });
  const [counts, setCounts] = useState<Record<LifeArea, number>>(() => {
    const init = {} as Record<LifeArea, number>;
    for (const a of AREAS) init[a] = 0;
    return init;
  });

  const load = async () => {
    const [s, c] = await Promise.all([lifeAreaService.getAll(), desireService.getCountsByArea(AREAS)]);
    setScores((prev) => ({ ...prev, ...s }));
    setCounts(c);
  };

  useEffect(() => {
    load();
  }, []);

  // SVG geometry
  // Рендерим SVG в 280px, но viewBox делаем больше, чтобы подписи по внешнему контуру не обрезались
  const pxSize = 280;
  const viewSize = 340;
  const cx = viewSize / 2;
  const cy = viewSize / 2;
  // Увеличиваем круг, чтобы он подходил ближе к подписям по внешнему контуру
  const R = 140;
  const ringStep = R / 10;
  const labelR = R + 18;

  const angles = useMemo(() => {
    // start at -90deg (top), clockwise
    const start = -Math.PI / 2;
    const step = (2 * Math.PI) / AREAS.length;
    return AREAS.map((a, i) => ({ area: a, a0: start + i * step, a1: start + (i + 1) * step }));
  }, []);

  const handlePointer = async (clientX: number, clientY: number, target: SVGSVGElement) => {
    const rect = target.getBoundingClientRect();
    // Переводим координаты из px в координаты viewBox
    const sx = viewSize / rect.width;
    const sy = viewSize / rect.height;
    const x = (clientX - rect.left) * sx;
    const y = (clientY - rect.top) * sy;
    const dx = x - cx;
    const dy = y - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > R) return;

    // angle in [0..2pi)
    let ang = Math.atan2(dy, dx);
    // convert to start at top (-pi/2) => shift
    const start = -Math.PI / 2;
    const twoPi = 2 * Math.PI;
    let rel = ang - start;
    while (rel < 0) rel += twoPi;
    while (rel >= twoPi) rel -= twoPi;

    const idx = Math.floor((rel / twoPi) * AREAS.length);
    const area = AREAS[clamp(idx, 0, AREAS.length - 1)];

    const score = clamp(Math.ceil(dist / ringStep), 0, 10);
    setScores((prev) => ({ ...prev, [area]: score }));
    await lifeAreaService.setScore(area, score);
  };

  return (
    <div className="life-wheel-screen">
      <Header onLogoClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />

      <div className="life-wheel-content">
        <div className="life-wheel-title">
          <div className="life-wheel-title-main">{t('wheel.title')}</div>
          <div className="life-wheel-title-sub">{t('wheel.subtitle')}</div>
        </div>

        <div className="life-wheel-wrapper">
          <svg
            className="life-wheel-svg"
            width={pxSize}
            height={pxSize}
            viewBox={`0 0 ${viewSize} ${viewSize}`}
            onPointerDown={(e) => handlePointer(e.clientX, e.clientY, e.currentTarget)}
          >
            {/* rings */}
            {Array.from({ length: 10 }).map((_, i) => (
              <circle
                key={i}
                cx={cx}
                cy={cy}
                r={(i + 1) * ringStep}
                className="life-wheel-ring"
              />
            ))}

            {/* sector dividers */}
            {angles.map(({ area, a0 }) => {
              const p = polarToCartesian(cx, cy, R, a0);
              return <line key={area} x1={cx} y1={cy} x2={p.x} y2={p.y} className="life-wheel-divider" />;
            })}

            {/* fills */}
            {angles.map(({ area, a0, a1 }) => {
              const score = scores[area] ?? 0;
              if (!score) return null;
              const r = score * ringStep;
              return (
                <path
                  key={`fill-${area}`}
                  d={sectorPath(cx, cy, r, a0, a1)}
                  fill={AREA_COLORS[area]}
                  opacity={0.75}
                />
              );
            })}

            {/* outer circle */}
            <circle cx={cx} cy={cy} r={R} className="life-wheel-outline" />

            {/* labels around wheel (one per sector) */}
            {angles.map(({ area, a0, a1 }) => {
              const mid = (a0 + a1) / 2;
              const p = polarToCartesian(cx, cy, labelR, mid);
              // Пишем по касательной к внешнему контуру
              const rotate = (mid * 180) / Math.PI + 90;
              // Keep text readable: flip on bottom half
              const flip = rotate > 90 && rotate < 270;
              const textRotate = flip ? rotate + 180 : rotate;
              return (
                <text
                  key={`lbl-${area}`}
                  x={p.x}
                  y={p.y}
                  className="life-wheel-label"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  transform={`rotate(${textRotate} ${p.x} ${p.y})`}
                >
                  {t(`areas.${area}` as never)}
                </text>
              );
            })}
          </svg>
        </div>

        <div className="life-wheel-grid">
          {AREAS.map((area) => (
            <button
              key={area}
              type="button"
              className="life-area-tile"
              onClick={() => {
                const count = counts[area] ?? 0;
                if (count > 0) return onShowAllDesires(area);
                return onCreateWishInArea(area);
              }}
            >
              <div className="life-area-label">{t(`areas.${area}` as never)}</div>
              <div className="life-area-square" style={{ background: AREA_COLORS[area] }}>
                <div className="life-area-count">{counts[area] ?? 0}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="life-wheel-bottom">
        <div className="life-wheel-bottom-row">
          <button className="life-wheel-all-button" onClick={() => onShowAllDesires()} type="button">
            {t('wheel.allDesires')}
          </button>
          <button className="life-wheel-create" onClick={onCreateWish} type="button">
            {t('wheel.create')}
          </button>
        </div>
      </div>
    </div>
  );
}


