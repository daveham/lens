import React from 'react';
import Button from '@material-ui/core/Button';
import styles from './styles.scss';

interface IProps {
  children: any;
  onCancel: () => void;
  onSave: () => void;
  tag?: string;
}

export default ({
  children,
  onCancel,
  onSave,
  tag
}: IProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.form}>
        {children}
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
        {tag && <div className={styles.tag}>{tag}</div>}
      </div>
    </div>
  );
};
