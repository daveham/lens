import * as R from 'ramda';
import * as RA from 'ramda-adjunct';

const sizeProps = ['width', 'height'];
const pointProps = ['x', 'y'];
const pointAngleProps = ['length', 'angle'];
const rectProps = ['x', 'y', 'width', 'height'];
const boundsProps = ['left', 'top', 'right', 'bottom'];
const pointSizeProps = ['point', 'size'];
const fromToProps = ['from', 'to'];

const defaultItemsToZero = R.map(R.defaultTo(0));
const twoEmptyNumbers = R.always([0, 0]);
const fourEmptyNumbers = R.always([0, 0, 0, 0]);
const takeTwo = R.take(2);
const takeFour = R.take(4);

const isHeadNumber = R.pipe(R.head, RA.isNumber);
const isLengthTwo = RA.lengthEq(2);
const hasWidth = R.has('width');
const hasX = R.has('x');
const hasAngle = R.has('angle');
const hasSize = R.has('size');
const hasPoint = R.has('point');
const hasPointSize = R.both(hasPoint, hasSize);
const hasTop = R.has('top');
const hasFrom = R.has('from');

const hasPointSizeArgs = ([point, size]) => hasX(point) && hasWidth(size);
const hasPointPointArgs = ([point1, point2]) => hasX(point1) && hasX(point2);

const coordsToRect = (val, idx, list) => (idx < 2 ? val : Math.abs(val - list[idx - 2]));
const sortedCoords = (val, idx, list) =>
  idx < 2 ? Math.min(val, list[idx + 2]) : Math.max(val, list[idx - 2]);

const collectSizeProps = R.pipe(R.props(sizeProps), defaultItemsToZero);
const collectPointProps = R.pipe(R.props(pointProps), defaultItemsToZero);
const collectAngleProps = R.pipe(R.props(pointAngleProps), defaultItemsToZero, R.append(true));
const collectRectProps = R.pipe(R.props(rectProps), defaultItemsToZero);
const collectBoundsProps = R.pipe(R.props(boundsProps), defaultItemsToZero);

export const getSizeParams = R.cond([
  [RA.isArray, takeTwo],
  [hasWidth, collectSizeProps],
  [RA.isNilOrEmpty, twoEmptyNumbers],
  [hasX, collectPointProps],
  [R.T, twoEmptyNumbers],
]);

export const getSizeParamsFromArguments = R.ifElse(
  isHeadNumber,
  takeTwo,
  R.pipe(R.head, getSizeParams),
);

export const getPointParams = R.cond([
  [RA.isArray, takeTwo],
  [hasX, collectPointProps],
  [hasWidth, collectSizeProps],
  [hasAngle, collectAngleProps],
  [RA.isNilOrEmpty, twoEmptyNumbers],
  [R.T, twoEmptyNumbers],
]);

export const getPointParamsFromArguments = R.ifElse(
  isHeadNumber,
  takeTwo,
  R.pipe(R.head, getPointParams),
);

const fromPointSizeValues = R.apply(R.useWith(R.concat, [getPointParams, getSizeParams]));
const fromPointPointValues = R.pipe(
  R.apply(R.useWith(R.concat, [getPointParams, getPointParams])),
  RA.mapIndexed(sortedCoords),
  RA.mapIndexed(coordsToRect),
);
const fromBoundsValues = R.pipe(
  collectBoundsProps,
  RA.mapIndexed(sortedCoords),
  RA.mapIndexed(coordsToRect),
);

export const getRectParamsFromTwoArgs = R.cond([
  [hasPointSizeArgs, fromPointSizeValues],
  [hasPointPointArgs, fromPointPointValues],
  [R.T, fromPointSizeValues],
]);

export const getRectParamsFromOneArg = R.cond([
  [RA.isArray, takeFour],
  [hasX, collectRectProps],
  [hasPointSize, R.pipe(R.props(pointSizeProps), fromPointSizeValues)],
  [hasTop, fromBoundsValues],
  [hasFrom, R.pipe(R.props(fromToProps), fromPointPointValues)],
  [RA.isNilOrEmpty, fourEmptyNumbers],
  [RA.isObject, R.identity],
  [R.T, fourEmptyNumbers],
]);

export const getRectParamsFromArguments = R.cond([
  [isHeadNumber, takeFour],
  [isLengthTwo, getRectParamsFromTwoArgs],
  [R.T, R.pipe(R.head, getRectParamsFromOneArg)],
]);

export const isZero = zeroTestFn => {
  const curryZeroTestFn = R.curry(zeroTestFn);
  return R.cond([
    [RA.isArray, R.all(curryZeroTestFn)],
    [hasX, R.pipe(R.props(pointProps), R.all(curryZeroTestFn))],
    [hasWidth, R.pipe(R.props(sizeProps), R.any(curryZeroTestFn))],
    [R.T, R.always(false)],
  ]);
};

export const isZeroFromArguments = zeroTestFn =>
  R.ifElse(isHeadNumber, R.pipe(R.head, R.curry(zeroTestFn)), R.pipe(R.head, isZero(zeroTestFn)));
