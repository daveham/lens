import React from 'react';
import moment from 'moment';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { timestampFormat } from '@editor/constants';
import styles from './styles.scss';

// import _debug from 'debug';
// const debug = _debug('lens:simulationEdit:form');

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
  <div className={styles.container}>
    <div className={styles.form}>
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
      <div className={styles.actions}>
        <Button
          color='primary'
          onClick={onSave}
        >
          Save
        </Button>
        <Button
          color='default'
          onClick={onCancel}
        >
          Cancel
        </Button>
      </div>
      <div className={styles.tag}>{tag}</div>
    </div>
  </div>
);
