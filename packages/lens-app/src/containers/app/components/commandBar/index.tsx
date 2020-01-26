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
  pingFlash: () => void;
  pingJob: () => void;
}

interface IState {
  flashId: number;
  jobId: number;
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
    this.state = { jobId: -1, flashId: -1, commandType: '' };
  }

  public componentDidUpdate(prevProps) {
    const { command } = this.props;
    if (command && prevProps.command !== command) {
      const { flashId, jobId } = command;
      if (jobId >= 0 && jobId !== this.state.jobId) {
        this.setState({ jobId, commandType: 'j' });
      } else if (flashId >= 0 && flashId !== this.state.flashId) {
        this.setState({ flashId, commandType: 'f' });
      }
    }
  }

  public render(): any {
    const { connected, pingFlash, pingJob, command } = this.props;
    const commandStatus = command ? command.command : null;
    const { flashId, jobId, commandType } = this.state;
    const chipStyle = {
      color: commandType === 'j' ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,.7)',
      backgroundColor: commandType === 'j' ? 'rgba(255,255,255,.3)' : 'inherit',
      borderColor: 'rgba(255,255,255,1)',
    };

    return (
      <Fragment>
        {
          commandStatus &&
            <Chip
              style={chipStyle}
              variant='outlined'
              color='default'
              label={commandStatus}
            />
        }
        <IconButton
          color='inherit'
          onClick={pingFlash}
        >
          {CommandBar.renderWithBadge(flashId, flashId >= 0, <SwapHorizontalCircleOutlinedIcon />)}
        </IconButton>
        <IconButton
          color='inherit'
          disabled={!connected}
          onClick={pingJob}
        >
          {CommandBar.renderWithBadge(jobId, jobId >= 0, <SwapHorizontalCircleIcon />)}
        </IconButton>
      </Fragment>
    );
  }
}

export default CommandBar;
