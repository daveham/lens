import debug from 'debug';

const segment = 'lens:service';

export default function getDebugLog(label) {
  return debug(label ? `${segment}:${label}` : segment);
}
