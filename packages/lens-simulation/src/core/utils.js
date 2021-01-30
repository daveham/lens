export function buildType(base, type) {
  return base ? `${base}:${type}` : type;
}
