export const STAR_GOAL = 5;
const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
export function visiblePoint(point) {
  return point && Number.isFinite(point.x) && Number.isFinite(point.y) &&
    (point.visibility ?? 0) >= 0.5 && point.x >= 0 && point.x <= 1 && point.y >= 0 && point.y <= 1;
}
export function makeStarTarget(landmarks, index) {
  const left = landmarks?.[11], right = landmarks?.[12];
  if (!visiblePoint(left) || !visiblePoint(right)) return null;
  const center = 1 - (left.x + right.x) / 2;
  const y = (left.y + right.y) / 2;
  const span = clamp(Math.abs(left.x - right.x), 0.16, 0.4);
  const offsets = [0, -0.25, 0.25, -0.15, 0.15];
  return { x: clamp(center + offsets[index % offsets.length] * span, 0.12, 0.88), y: clamp(y - 0.12, 0.13, 0.82) };
}
export function handTouchesStar(point, star, width, height) {
  if (!visiblePoint(point) || !star || width <= 0 || height <= 0) return false;
  // Mirroring and hit testing use the same uncropped video coordinates.
  const dx = (1 - point.x - star.x) * width;
  const dy = (point.y - star.y) * height;
  return Math.hypot(dx, dy) <= Math.min(width, height) * 0.115;
}

export function bothHandsTouchStar(landmarks, star, width, height) {
  return [15, 16].every(index => handTouchesStar(landmarks?.[index], star, width, height));
}
