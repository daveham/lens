import React from 'react';
import TextField, { TextFieldProps } from '@material-ui/core/TextField';
import cx from 'classnames';
import { withStyles, createStyles } from '@material-ui/core/styles';

// import getDebugLog from '../debugLog';
// const debug = getDebugLog('readOnlyTextField');

const styles = (theme) => createStyles({
  input: {
    color: theme.palette.text.primary,
  },
});

interface IProps {
  classes: {
    input: string;
  };
  InputProps?: TextFieldProps["InputProps"];
  label: TextFieldProps["label"];
  margin: TextFieldProps["margin"];
  multiline?: TextFieldProps["multiline"];
  value: TextFieldProps["value"];
  fullWidth?: TextFieldProps["fullWidth"];
  disabled?: TextFieldProps["disabled"];
}

const ReadOnlyTextField = (props: IProps): JSX.Element => {
  const { classes, InputProps = {}, ...other } = props;

  const tmpClasses = InputProps.classes || {};
  const inputPropsClasses = {
    ...InputProps.classes,
    input: cx(classes.input, Boolean(tmpClasses.input) && tmpClasses.input),
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
