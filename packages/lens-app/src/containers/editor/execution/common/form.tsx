import React, { Fragment } from 'react';
import moment from 'moment';
import TextField from '@material-ui/core/TextField';
import { timestampFormat } from 'editor/constants';
import FormContainer from 'editor/components/formContainer';

// import _debug from 'debug';
// const debug = _debug('lens:editor:execution:common:form');

interface IProps {
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

export default ({
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
  return (
    <FormContainer
      onCancel={onCancel}
      onConfirm={onConfirm}
      onSave={onSave}
      tag={tag}
    >
      <TextField
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
          <TextField
            label='Modified'
            margin='normal'
            value={moment(modified).format(timestampFormat)}
            fullWidth
            disabled
          />
          <TextField
            label='Created'
            margin='normal'
            value={moment(created).format(timestampFormat)}
            fullWidth
            disabled
          />
        </Fragment>
      )}
    </FormContainer>
  );
};