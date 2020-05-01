import React from 'react';
import AdjustableList from './adjustableList';
import { IHike } from 'editor/interfaces';

// import getDebugLog from './debugLog';
// const debug = getDebugLog('hikes');

interface IProps {
  disabled?: boolean;
  items: ReadonlyArray<IHike>;
  selectedIndex: number;
  onListChanged: (
    items: ReadonlyArray<IHike>,
    removed?: ReadonlyArray<IHike>,
    addNew?: boolean,
  ) => void;
  onSelectionChanged: (index: number) => void;
}

class Hikes extends React.Component<IProps, any> {
  public render(): any {
    const { disabled, items, selectedIndex, onListChanged, onSelectionChanged } = this.props;
    return (
      <AdjustableList
        disabled={disabled}
        label='Hikes'
        items={items}
        selectedIndex={selectedIndex}
        displayProp='name'
        onListChanged={onListChanged}
        onSelectionChanged={onSelectionChanged}
      />
    );
  }
}

export default Hikes;
