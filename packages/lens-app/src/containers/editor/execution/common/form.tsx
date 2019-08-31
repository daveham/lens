import React, { Fragment } from 'react';
import moment from 'moment';
import TextField from '@material-ui/core/TextField';
import { timestampFormat } from 'editor/constants';
import FormContainer from 'editor/components/formContainer';
import ReadOnlyTextField from 'editor/components/readOnlyTextField';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';

const styles: any = {
  root: {
    flex: '1 0 auto',
  },
};

// import _debug from 'debug';
// const debug = _debug('lens:editor:execution:common:form');

interface IProps {
  classes?: any;
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
    <Paper classes={{ root: classes.root }}>
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
    </Paper>
  );
};

export default withStyles(styles)(Form);
