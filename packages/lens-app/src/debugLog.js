import debug from 'debug';

const segment = 'lens:app';

export default function getDebugLog(label) {
  return debug(label ? `${segment}:${label}` : segment);
}
