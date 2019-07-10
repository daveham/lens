import React, { Fragment } from 'react';
import moment from 'moment';
import TextField from '@material-ui/core/TextField';
import { timestampFormat } from 'editor/constants';
import FormContainer from 'editor/components/formContainer';
import ReadOnlyTextField from 'editor/components/readOnlyTextField';
import Paper from '@material-ui/core/Paper/Paper';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography/Typography';

const styles: any = (theme) => {
  const paddingHalf = theme.spacing.unit;
  const padding = paddingHalf * 2;
  return {
    root: {
      display: 'flex',
      flex: '1 0 auto',
      flexDirection: 'column',
    },
    split: {
      display: 'flex',
      flex: '1 0 auto',
    },
    splitRight: {
      display: 'flex',
      flexDirection: 'column',
      flex: '1 0 auto',
      padding: `${padding}px ${padding}px ${padding * 2}px`,
    },
    splitLeft: {
      width: theme.spacing.unit * 30,
      borderRight: `solid 1px ${theme.palette.divider}`,
      padding: `${padding}px ${padding}px ${padding * 2}px`,
    },
    contents: {
      flex: '1 0 auto',
      padding,
    },
    formHeader: {
      backgroundColor: theme.palette.primary.dark,
      display: 'flex',
    },
    formTitle: {
      padding: `${paddingHalf}px ${padding}px`,
      width: theme.spacing.unit * 30,
    },
    formTitleColor: {
      color: theme.palette.primary.contrastText,
    },
    formControls: {
      color: theme.palette.primary.contrastText,
      flex: '1 0 auto',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
    },
  };
};

// import _debug from 'debug';
// const debug = _debug('lens:editor:simulation:common:form');

interface IProps {
  classes?: any;
  controls?: any;
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
  controls,
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
  const formTitleColorClasses: any = {
    colorTextPrimary: classes.formTitleColor
  };

  return (
    <Paper className={classes.root}>
      <div className={classes.formHeader}>
        <div className={classes.formTitle}>
          <Typography
            classes={formTitleColorClasses}
            color='textPrimary'
            variant='h5'
          >
            Simulation
          </Typography>
        </div>
        <div className={classes.formControls}>
          {controls}
        </div>
      </div>
      <div className={classes.split}>
        <div className={classes.splitLeft}>
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
              onChange={(isEdit || isNew) ? onNameChange : undefined}
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
        </div>
        <div className={classes.splitRight}>
          <div className={classes.contents}>
            {children}
          </div>
        </div>
      </div>
    </Paper>
  );
};

export default withStyles(styles)(Form);
