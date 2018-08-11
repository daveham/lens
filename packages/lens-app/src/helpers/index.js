export function backupUrl(url, steps = 1) {
  let pos = url.lastIndexOf('/');
  for (let i = steps; i > 1; i--) {
    pos = url.lastIndexOf('/', pos - 1);
  }
  return url.substring(0, pos);
}
