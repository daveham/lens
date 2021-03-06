import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import faStyles from 'font-awesome/scss/font-awesome.scss';
import FontAwesome from 'react-fontawesome';

import ToolButton from 'components/toolButton';
import ToolMultiButton from 'components/toolMultiButton';
import { ResSmall, ResMedium, ResLarge } from './svg';

const styles = {
  root: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
};

interface IProps {
  classes?: any;
  resolution: number;
  onChangeRes: (index: number) => void;
  onResetStats: () => void;
  onToggleSplit: () => void;
}

class ToolbarCmp extends React.Component<IProps, any> {
  public render() {
    const multiSvg = [
      <ResLarge key={'large'}/>,
      <ResMedium key={'medium'}/>,
      <ResSmall key={'small'}/>
    ];

    return (
      <div className={this.props.classes.root}>
        <ToolButton
          key='split'
          clickHandler={this.props.onToggleSplit}
        >
          <FontAwesome cssModule={faStyles} name='adjust' size='lg' />
        </ToolButton>
        <ToolMultiButton
          key='abc'
          selectedIndex={this.buttonIndexFromResolution()}
          clickHandler={this.props.onChangeRes}
        >
          {multiSvg}
        </ToolMultiButton>
        <ToolButton
          key='reset'
          clickHandler={this.props.onResetStats}
        >
          <FontAwesome cssModule={faStyles} name='eraser' size='lg' />
        </ToolButton>
      </div>
    );
  }

  private buttonIndexFromResolution() {
    const { resolution } = this.props;
    if (resolution === 8) {
      return 2;
    }
    if (resolution === 16) {
      return 1;
    }
    return 0;
  }
}

export const Toolbar = withStyles(styles)(ToolbarCmp);
