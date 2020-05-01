import React from 'react';
import AdjustableList from './adjustableList';
import { IHiker } from 'editor/interfaces';

// import getDebugLog from './debugLog';
// const debug = getDebugLog('hikers');

interface IProps {
  disabled?: boolean;
  items: ReadonlyArray<IHiker>;
  selectedIndex: number;
  onListChanged: (
    items: ReadonlyArray<IHiker>,
    removed?: ReadonlyArray<IHiker>,
    addNew?: boolean,
  ) => void;
  onSelectionChanged: (index: number) => void;
}

class Hikers extends React.Component<IProps, any> {
  public render(): any {
    const { disabled, items, selectedIndex, onListChanged, onSelectionChanged } = this.props;
    return (
      <AdjustableList
        disabled={disabled}
        label='Hikers'
        items={items}
        selectedIndex={selectedIndex}
        displayProp='name'
        onListChanged={onListChanged}
        onSelectionChanged={onSelectionChanged}
      />
    );
  }
}

export default Hikers;
