// Upper-body, scale-relative checks support seated play. A clap is approximated
// by hands together; the camera does not verify an audible clap or finger contact.
export function matchesSequencePose(points, gesture, aspect = 4 / 3) {
  const visible = p => p && Number.isFinite(p.x) && Number.isFinite(p.y) && (p.visibility ?? 0) >= 0.5 && p.x >= 0 && p.x <= 1 && p.y >= 0 && p.y <= 1;
  if (![0, 11, 12, 15, 16].every(i => visible(points?.[i]))) return { visible: false, matches: false };
  const [nose, left, right, a, b] = [0, 11, 12, 15, 16].map(i => points[i]);
  const distance = (p, q) => Math.hypot((p.x - q.x) * aspect, p.y - q.y);
  const width = Math.max(0.08, distance(left, right));
  let matches = false;
  if (gesture === 'arms') matches = a.y < left.y - width * 0.18 && b.y < right.y - width * 0.18;
  if (gesture === 'head') matches = distance(a, nose) < width * 0.8 && distance(b, nose) < width * 0.8 && a.y < left.y && b.y < right.y;
  if (gesture === 'clap') matches = distance(a, b) < width * 0.55 && a.y > nose.y + width * 0.2 && b.y > nose.y + width * 0.2 && a.y < left.y + width * 1.4 && b.y < right.y + width * 1.4;
  return { visible: true, matches };
}