import debug from 'debug';

const segment = 'lens:simulation';

export default function getDebugLog(label) {
  return debug(label ? `${segment}:${label}` : segment);
}
