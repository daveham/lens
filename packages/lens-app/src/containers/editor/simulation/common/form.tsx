import React, { Fragment } from 'react';
import moment from 'moment';
import TextField from '@material-ui/core/TextField';
import { timestampFormat } from 'editor/constants';
import FormContainer from 'editor/components/formContainer';
import ReadOnlyTextField from 'editor/components/readOnlyTextField';
import Paper from '@material-ui/core/Paper/Paper';
import { withStyles } from '@material-ui/core/styles';

const styles: any = (theme) => {
  const padding = theme.spacing.unit * 2;
  return {
    root: {
      display: 'flex',
      flex: '1 0 auto',
      flexDirection: 'column',
    },
    split: {
      display: 'flex',
      flex: '1 0 auto',
      padding: `${padding}px ${padding}px 0`,
    },
    splitRight: {
      display: 'flex',
      flexDirection: 'column',
      flex: '1 0 auto',
      padding: `${padding}px ${padding}px ${padding * 2}px`,
    },
    paper: {
      flex: '1 0 auto',
      padding,
    },
  };
};

// import _debug from 'debug';
// const debug = _debug('lens:editor:simulation:common:form');

interface IProps {
  classes?: any;
  children?: any;
  created?: number;
  modified?: number;
  name: string;
  onCancel?: () => void;
  onConfirm?: () => void;
  onNameChange?: (event) => void;
  onSave?: () => void;
  tag?: string;
  isNew?: boolean;
  isEdit?: boolean;
  isDelete?: boolean;
}

const Form = ({
  classes,
  children,
  created,
  modified,
  name,
  onCancel,
  onConfirm,
  onNameChange,
  onSave,
  tag,
  isNew,
  isEdit,
  isDelete
}: IProps) => {
  const isShow = !(isNew || isEdit || isDelete);
  const FieldElement = isEdit ? TextField : ReadOnlyTextField;

  return (
    <Paper className={classes.root}>
      <div className={classes.split}>
        <FormContainer
          onCancel={onCancel}
          onConfirm={onConfirm}
          onSave={onSave}
          tag={tag}
        >
          <FieldElement
            label='Name'
            margin='normal'
            multiline
            onChange={(isEdit || isNew) ? onNameChange : null}
            value={name}
            fullWidth
            required={isEdit || isNew}
            disabled={isDelete || isShow}
          />
          {!isNew && (
            <Fragment>
              <ReadOnlyTextField
                label='Modified'
                margin='normal'
                value={moment(modified).format(timestampFormat)}
                fullWidth
                disabled
              />
              <ReadOnlyTextField
                label='Created'
                margin='normal'
                value={moment(created).format(timestampFormat)}
                fullWidth
                disabled
              />
            </Fragment>
          )}
        </FormContainer>
        <div className={classes.splitRight}>
          <Paper elevation={8} className={classes.paper}>
            {children}
          </Paper>
        </div>
      </div>
    </Paper>
  );
};

export default withStyles(styles)(Form);
