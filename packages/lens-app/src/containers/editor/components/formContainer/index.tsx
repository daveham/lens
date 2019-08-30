import React from 'react';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

const styles: any = (theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: theme.spacing(2),
    width: 400,
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: theme.spacing(2),
    '& button': {
      margin: theme.spacing(1),
      width: 60,
    },
  },
  tag: {
    color: theme.palette.text.disabled,
    marginTop: theme.spacing(1),
    fontSize: theme.editor.annotation.fontSize,
    fontFamily: theme.typography.fontFamily,
  },
});

interface IProps {
  classes?: any;
  children: any;
  onCancel?: () => void;
  onConfirm?: () => void;
  onSave?: () => void;
  tag?: string;
}

export default withStyles(styles)(({
  classes,
  children,
  onCancel,
  onConfirm,
  onSave,
  tag
}: IProps) => {
  const label = onSave ? 'Save' : 'Ok';
  const handler = onSave ? onSave : onConfirm;
  const showActions = handler || onCancel;
  return (
    <div className={classes.root}>
      <div className={classes.form}>
        {children}
        {showActions && (
          <div className={classes.actions}>
            <Button
              color='primary'
              onClick={handler}
            >
              {label}
            </Button>
            <Button
              color='default'
              onClick={onCancel}
            >
              Cancel
            </Button>
          </div>
        )}
        {tag && <div className={classes.tag}>{tag}</div>}
      </div>
    </div>
  );
});
