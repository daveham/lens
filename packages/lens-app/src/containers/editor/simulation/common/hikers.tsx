import React from 'react';
import AdjustableList from './adjustableList';
import { IHiker } from 'editor/interfaces';

// import _debug from 'debug';
// const debug = _debug('lens:editor:simulation:hikers');

interface IProps {
  disabled?: boolean;
  items: ReadonlyArray<IHiker>;
  selectedIndex: number;
  onListChanged: (items: ReadonlyArray<IHiker>) => void;
  onSelectionChanged: (index: number) => void;
}

class Hikers extends React.Component<IProps, any> {
  public render(): any {
    const {
      disabled,
      items,
      selectedIndex,
      onListChanged,
      onSelectionChanged,
    } = this.props;
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
