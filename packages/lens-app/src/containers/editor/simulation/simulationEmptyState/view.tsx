import React from 'react';

// import _debug from 'debug';
// const debug = _debug('lens:editor/simulation/simulationEmptyState/view');

interface IProps {
  sourceId: string;
}

class View extends React.Component<IProps, any> {
  public render(): any {
    return (
      <div>{this.props.sourceId}</div>
    );
  }
}

export default View;
