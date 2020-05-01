import debug from 'debug';

const segment = 'lens:api';

export default function getDebugLog(label) {
  return debug(label ? `${segment}:${label}` : segment);
}
