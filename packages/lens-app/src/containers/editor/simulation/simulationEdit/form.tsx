import React from 'react';
import moment from 'moment';
import TextField from '@material-ui/core/TextField';
import { timestampFormat } from 'editor/constants';
import FormContainer from 'editor/components/formContainer';

// import _debug from 'debug';
// const debug = _debug('lens:editor:simulation:simulationEdit:form');

interface IProps {
  created: number;
  modified: number;
  name: string;
  onCancel: () => void;
  onNameChange: (event) => void;
  onSave: () => void;
  tag: string;
}

export default ({
  created,
  modified,
  name,
  onCancel,
  onNameChange,
  onSave,
  tag
}: IProps) => (
  <FormContainer
    onCancel={onCancel}
    onSave={onSave}
    tag={tag}
  >
    <TextField
      label='Name'
      margin='normal'
      multiline
      onChange={onNameChange}
      value={name}
      fullWidth
      required
    />
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
  </FormContainer>
);
