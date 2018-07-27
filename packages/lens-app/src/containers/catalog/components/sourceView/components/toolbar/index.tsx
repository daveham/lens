import * as React from 'react';
import faStyles from 'font-awesome/scss/font-awesome.scss';
import FontAwesome from 'react-fontawesome';

import { ToolButton, ToolMultiButton } from '../../../../../../components';
import { ResSmall, ResMedium, ResLarge } from './svg';

import styles from './styles.scss';

interface IProps {
  resolution: number;
  onChangeRes: (index: number) => void;
  onResetStats: () => void;
  onToggleSplit: () => void;
}

class Toolbar extends React.Component<IProps, any> {
  public render() {
    const multiSvg = [
      <ResLarge key={'large'}/>,
      <ResMedium key={'medium'}/>,
      <ResSmall key={'small'}/>
    ];

    return (
      <div className={styles.container}>
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

export default Toolbar;