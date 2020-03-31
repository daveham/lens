import React, { Component, Fragment } from 'react';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import Chip from '@material-ui/core/Chip';
import SwapHorizontalCircleIcon from '@material-ui/icons/SwapHorizontalCircle';
import SwapHorizontalCircleOutlinedIcon from '@material-ui/icons/SwapHorizontalCircleOutlined';

// import _debug from 'debug';
// const debug = _debug('lens:containers:app:commandBar');

export interface ICommand {
  command?: string;
  flashId: number;
  jobId: number;
}

interface IProps {
  connected?: boolean;
  command: ICommand;
  hasError?: boolean;
  pingFlash: () => void;
  pingJob: () => void;
}

interface IState {
  flashId: number;
  flashCounter: number;
  jobId: number;
  jobCounter: number;
  commandType: string;
}

class CommandBar extends Component<IProps, IState> {
  private static renderWithBadge(content, condition, children): any {
    if (!condition) {
      return children;
    }
    return (
      <Badge badgeContent={content} color='secondary'>
        {children}
      </Badge>
    );
  }

  constructor(props) {
    super(props);
    this.state = { jobId: -1, jobCounter: 0, flashId: -1, flashCounter: 0, commandType: '' };
  }

  public componentDidUpdate(prevProps) {
    const { command } = this.props;
    if (command && prevProps.command !== command) {
      const { flashId, jobId } = command;
      if (jobId >= 0 && jobId !== this.state.jobId) {
        this.setState(prevState => ({
          jobId,
          jobCounter: prevState.jobCounter + 1,
          commandType: 'j',
        }));
      } else if (flashId >= 0 && flashId !== this.state.flashId) {
        this.setState(prevState => ({
          flashId,
          flashCounter: prevState.flashCounter + 1,
          commandType: 'f',
        }));
      }
    }
  }

  public render(): any {
    const { connected, hasError, pingFlash, pingJob, command } = this.props;
    const commandStatus = command ? command.command : null;
    const { flashCounter, jobCounter, commandType } = this.state;
    const chipStyle = {
      color: commandType === 'j' ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,.7)',
      backgroundColor: hasError
        ? 'rgba(255,128,128,.7)'
        : commandType === 'j'
        ? 'rgba(255,255,255,.3)'
        : 'inherit',
      borderColor: 'rgba(255,255,255,1)',
      minWidth: '180px',
    };

    return (
      <Fragment>
        {commandStatus && (
          <Chip
            style={chipStyle}
            variant='outlined'
            color='default'
            label={hasError ? 'Socket Error' : commandStatus}
          />
        )}
        <IconButton color='inherit' onClick={pingFlash}>
          {CommandBar.renderWithBadge(
            flashCounter,
            flashCounter >= 0,
            <SwapHorizontalCircleOutlinedIcon />,
          )}
        </IconButton>
        <IconButton color='inherit' disabled={!connected} onClick={pingJob}>
          {CommandBar.renderWithBadge(jobCounter, jobCounter >= 0, <SwapHorizontalCircleIcon />)}
        </IconButton>
      </Fragment>
    );
  }
}

export default CommandBar;
