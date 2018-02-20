import React from 'react';
import faStyles from 'font-awesome/scss/font-awesome.scss';
import FontAwesome from 'react-fontawesome';
import CommandButton from './command-button/index';

import styles from './styles.scss';

interface ICommand {
  command?: string;
  flashId?: number;
  jobId?: number;
}

interface IProps {
  connected?: boolean;
  command: ICommand;
  pingFlash: () => void;
  pingJob: () => void;
}

const Footer = ({ connected, pingFlash, pingJob, command }: IProps) => {

  const commandStatus = command ? command.command : null;
  const commandId = command ? command.jobId || command.flashId : 0;
  const statusElement =
    commandStatus && (
      <div className={styles.commandStatus}>
        {`${commandId}:${commandStatus}`}
      </div>
    );

  return (
    <div className={styles.container}>
      <div>
        <CommandButton
          connected={true}
          clickHandler={pingFlash}
        >
          <FontAwesome cssModule={faStyles} name='share-square-o' size='lg' />
        </CommandButton>
      </div>
      <div>
        <CommandButton
          connected={connected}
          clickHandler={pingJob}
        >
          <FontAwesome cssModule={faStyles} name='share-square' size='lg' />
        </CommandButton>
      </div>
      {statusElement}
    </div>
  );
};

export default Footer;
