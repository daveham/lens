import * as R from 'ramda';
import * as RA from 'ramda-adjunct';

const sizeProps = ['width', 'height'];
const pointProps = ['x', 'y'];
const pointAngleProps = ['length', 'angle'];

export const isHeadNumber = R.pipe(R.head, RA.isNumber);
export const isHeadArray = R.pipe(R.head, RA.isArray);
export const isHeadEmpty = R.pipe(R.head, RA.isNilOrEmpty);
export const isHeadWidthProperty = R.pipe(R.head, R.has('width'));
export const isHeadXProperty = R.pipe(R.head, R.has('x'));
export const isHeadAngleProperty = R.pipe(R.head, R.has('angle'));

export const defaultUndefinedItemsToZero = R.map(R.defaultTo(0));
export const widthAndHeightFromObject = R.pipe(
  R.head,
  R.props(sizeProps),
  defaultUndefinedItemsToZero,
);
export const xAndYFromObject = R.pipe(R.head, R.props(pointProps), defaultUndefinedItemsToZero);
export const angleAndLengthFromObject = R.pipe(
  R.head,
  R.props(pointAngleProps),
  defaultUndefinedItemsToZero,
  R.append(true),
);
export const takeTwoNumbers = R.take(2);
export const takeTwoNumbersFromArray = R.pipe(R.head, takeTwoNumbers);
export const twoEmptyNumbers = R.always([0, 0]); // () => [0, 0];

export const getWidthAndHeightFromArguments = R.cond([
  [isHeadNumber, takeTwoNumbers],
  [isHeadArray, takeTwoNumbersFromArray],
  [isHeadWidthProperty, widthAndHeightFromObject],
  [isHeadEmpty, twoEmptyNumbers],
  [isHeadXProperty, xAndYFromObject],
  [R.T, twoEmptyNumbers],
]);

export const getXAndYFromArguments = R.cond([
  [isHeadNumber, takeTwoNumbers],
  [isHeadArray, takeTwoNumbersFromArray],
  [isHeadXProperty, xAndYFromObject],
  [isHeadWidthProperty, widthAndHeightFromObject],
  [isHeadAngleProperty, angleAndLengthFromObject], // need to signal post processing of angle
  [isHeadEmpty, twoEmptyNumbers],
  [R.T, twoEmptyNumbers],
]);

export const isZeroFromArguments = zeroTestFn => {
  const curryZeroTestFn = R.curry(zeroTestFn);
  return R.cond([
    [isHeadNumber, R.pipe(R.head, curryZeroTestFn)],
    [isHeadArray, R.pipe(R.head, R.all(curryZeroTestFn))],
    [isHeadXProperty, R.pipe(R.head, R.props(pointProps), R.all(curryZeroTestFn))],
    [isHeadWidthProperty, R.pipe(R.head, R.props(sizeProps), R.any(curryZeroTestFn))],
    [R.T, R.always(false)],
  ]);
};
