// Match the back-facing illustration against the mirrored camera preview.
// Scale distances to shoulder width so seated children can play at different distances.
export function matchesDirectionPose(points, direction, aspect = 4 / 3) {
  const visible = p => p && Number.isFinite(p.x) && Number.isFinite(p.y)
    && (p.visibility ?? 0) >= 0.5 && p.x >= 0 && p.x <= 1 && p.y >= 0 && p.y <= 1;
  if (![11, 12, 15, 16].every(i => visible(points?.[i]))) return { visible: false, matches: false };
  if (!Number.isFinite(aspect) || aspect <= 0) return { visible: false, matches: false };
  const shoulders = [points[11], points[12]];
  const wrists = [points[15], points[16]];
  const width = Math.hypot((shoulders[0].x - shoulders[1].x) * aspect, shoulders[0].y - shoulders[1].y);
  if (width < 0.08) return { visible: false, matches: false };
  const arms = shoulders.map((s, i) => ({ x: (s.x - wrists[i].x) * aspect / width, y: (wrists[i].y - s.y) / width }));
  let matches = false;
  if (direction === 'up') matches = arms.every(a => a.y < -0.65);
  if (direction === 'down') matches = arms.every(a => a.y > 0.65 && Math.abs(a.x) < 0.65);
  // Positive x points right on the mirrored preview. Require the other arm down.
  if (direction === 'left' || direction === 'right') {
    const sign = direction === 'left' ? -1 : 1;
    matches = arms.some((a, i) => a.x * sign > 0.85 && Math.abs(a.y) < 0.45 && arms[1 - i].y > 0.45);
  }
  return { visible: true, matches };
}
