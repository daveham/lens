import compile from './compile';

export function build() {
  return compile(false);
}

export function buildChanged() {
  return compile(true);
}
