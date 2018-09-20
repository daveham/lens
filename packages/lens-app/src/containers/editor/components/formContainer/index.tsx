import React from 'react';
import Button from '@material-ui/core/Button';
import styles from './styles.scss';

interface IProps {
  children: any;
  onCancel?: () => void;
  onConfirm?: () => void;
  onSave?: () => void;
  tag?: string;
}

export default ({
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
    <div className={styles.container}>
      <div className={styles.form}>
        {children}
        {showActions && (
          <div className={styles.actions}>
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
        {tag && <div className={styles.tag}>{tag}</div>}
      </div>
    </div>
  );
};
