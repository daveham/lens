import React, { Component, PropTypes } from 'react';

//import debugLib from 'debug';
//const debug = debugLib('app:SourceView');

import styles from './SourceView.scss';

export class SourceView extends Component {
  static propTypes = {
    params: PropTypes.shape({
      id: PropTypes.string
    })
  };

  render() {
    return (
      <div className={styles.container}>
        test-{this.props.params.id}
      </div>
    );
  }
}

export default SourceView;
