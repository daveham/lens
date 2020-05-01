import getParentDebugLog from '../debugLog';

const segment = 'tileAnalysis';

export default function getDebugLog(label) {
  return getParentDebugLog(label ? `${segment}:${label}` : segment);
}
