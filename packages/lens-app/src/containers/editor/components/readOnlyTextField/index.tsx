import React from 'react';
import TextField from '@material-ui/core/TextField';
import cx from 'classnames';
import { withStyles } from '@material-ui/core/styles';

// import _debug from 'debug';
// const debug = _debug('lens:editor:readOnlyTestField');

const styles: any = (theme) => ({
  input: {
    color: theme.palette.text.primary,
  },
});

interface IProps {
  classes?: any;
  InputProps: any;
}

const ReadOnlyTextField = (props: IProps): any => {
  const { classes, InputProps = {}, ...other } = props;

  const tmpClasses = InputProps.classes || {};
  const inputPropsClasses = {
    ...InputProps.classes,
    input: cx(classes.input, { [tmpClasses.input]: tmpClasses.input }),
  };

  const mergedInputProps = {
    ...InputProps,
    classes: inputPropsClasses,
    disableUnderline: true,
  };

  return (
    <TextField
      InputProps={mergedInputProps}
      {...other}
    />
  );
};

export default withStyles(styles)(ReadOnlyTextField);
