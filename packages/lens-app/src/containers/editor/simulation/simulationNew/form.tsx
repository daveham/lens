import React from 'react';
import TextField from '@material-ui/core/TextField';
import FormContainer from '@editor/components/formContainer';

interface IProps {
  name: string;
  onCancel: () => void;
  onNameChange: (event) => void;
  onSave: () => void;
}

export default ({
  name,
  onCancel,
  onNameChange,
  onSave
}: IProps) => (
  <FormContainer
    onCancel={onCancel}
    onSave={onSave}
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
  </FormContainer>
);
