import React from 'react';
import AdjustableList from './adjustableList';
import { ITrail } from 'editor/interfaces';

// import _debug from 'debug';
// const debug = _debug('lens:editor:simulation:trails');

interface IProps {
  disabled?: boolean;
  items: ReadonlyArray<ITrail>;
  selectedIndex: number;
  onListChanged: (
    items: ReadonlyArray<ITrail>,
    removed?: ReadonlyArray<ITrail>,
    addNew?: boolean,
  ) => void;
  onSelectionChanged: (index: number) => void;
}

class Trails extends React.Component<IProps, any> {
  public render(): any {
    const { disabled, items, selectedIndex, onListChanged, onSelectionChanged } = this.props;
    return (
      <AdjustableList
        disabled={disabled}
        label='Trails'
        items={items}
        selectedIndex={selectedIndex}
        displayProp='name'
        onListChanged={onListChanged}
        onSelectionChanged={onSelectionChanged}
      />
    );
  }
}

export default Trails;
