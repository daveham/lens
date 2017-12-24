import React from 'react';
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
          title={'ping(f)'}
          connected={true}
          clickHandler={pingFlash}
        />
      </div>
      <div>
        <CommandButton
          title={'ping(j)'}
          connected={connected}
          clickHandler={pingJob}
        />
      </div>
      {statusElement}
    </div>
  );
};

export default Footer;
