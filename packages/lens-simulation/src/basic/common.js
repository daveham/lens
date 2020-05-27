import * as R from 'ramda';
import * as RA from 'ramda-adjunct';

const sizeProps = ['width', 'height'];
const pointProps = ['x', 'y'];
const pointAngleProps = ['length', 'angle'];

export const isHeadNumber = R.pipe(R.head, RA.isNumber);
export const isHeadEmpty = R.pipe(R.head, RA.isNilOrEmpty);

export const defaultUndefinedItemsToZero = R.map(R.defaultTo(0));
export const twoEmptyNumbers = R.always([0, 0]);
export const takeTwo = R.take(2);

export const pipeSizeProps = R.pipe(R.props(sizeProps), defaultUndefinedItemsToZero);
export const pipePointProps = R.pipe(R.props(pointProps), defaultUndefinedItemsToZero);
export const pipeAngleProps = R.pipe(
  R.props(pointAngleProps),
  defaultUndefinedItemsToZero,
  R.append(true),
);

export const getWidthAndHeightFrom = R.cond([
  [RA.isArray, takeTwo],
  [R.has('width'), pipeSizeProps],
  [RA.isNilOrEmpty, twoEmptyNumbers],
  [R.has('x'), pipePointProps],
  [R.T, twoEmptyNumbers],
]);

export const getWidthAndHeightFromArguments = R.cond([
  [isHeadNumber, takeTwo],
  [R.T, R.pipe(R.head, getWidthAndHeightFrom)],
]);

export const getXAndYFrom = R.cond([
  [RA.isArray, takeTwo],
  [R.has('x'), pipePointProps],
  [R.has('width'), pipeSizeProps],
  [R.has('angle'), pipeAngleProps],
  [RA.isNilOrEmpty, twoEmptyNumbers],
  [R.T, twoEmptyNumbers],
]);

export const getXAndYFromArguments = R.cond([
  [isHeadNumber, takeTwo],
  [R.T, R.pipe(R.head, getXAndYFrom)],
]);

export const isZeroFrom = zeroTestFn => {
  const curryZeroTestFn = R.curry(zeroTestFn);
  return R.cond([
    [RA.isArray, R.all(curryZeroTestFn)],
    [R.has('x'), R.pipe(R.props(pointProps), R.all(curryZeroTestFn))],
    [R.has('width'), R.pipe(R.props(sizeProps), R.any(curryZeroTestFn))],
    [R.T, R.always(false)],
  ]);
};

export const isZeroFromArguments = zeroTestFn =>
  R.cond([
    [isHeadNumber, R.pipe(R.head, R.curry(zeroTestFn))],
    [R.T, R.pipe(R.head, isZeroFrom(zeroTestFn))],
  ]);
