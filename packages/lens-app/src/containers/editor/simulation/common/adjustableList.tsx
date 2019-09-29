import React from 'react';
import RootRef from '@material-ui/core/RootRef';
import InputLabel from '@material-ui/core/InputLabel';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Add from '@material-ui/icons/Add';
import Remove from '@material-ui/icons/Remove';
import ExpandMore from '@material-ui/icons/ExpandMoreRounded';
import ExpandLess from '@material-ui/icons/ExpandLessRounded';
import { withStyles} from '@material-ui/core/styles';

import _debug from 'debug';
const debug = _debug('lens:editor:simulation:adjustableList');

const styles: any = (theme) => {
  const borderStyle = `1px solid ${theme.palette.divider}`;
  const unit = theme.spacing(1);
  return {
    root: {
      display: 'flex',
      flexDirection: 'column',
      marginTop: unit,
      marginBottom: unit,
    },
    controlWrapper: {
      padding: `${unit - 2}px 0 ${unit - 1}px`,
    },
    list: {
      border: borderStyle,
      height: unit * 19 + 2,
      overflow: 'hidden auto',
    },
    iconButtonRoot: {
      padding: 1,
    },
    toolbarRoot: {
      borderLeft: borderStyle,
      borderRight: borderStyle,
      borderBottom: borderStyle,
      minHeight: unit * 4,
      padding: 0,
      justifyContent: 'flex-end',
    },
  };
};

interface IProps {
  classes?: any;
  disabled?: boolean;
  label?: string;
  displayProp: string;
  items: ReadonlyArray<any>;
  selectedIndex: number;
  onListChanged: (list: any[], removed?: any[]) => void;
  onSelectionChanged: (index: number) => void;
}

class AdjustableList extends React.Component<IProps, any> {
  private readonly activeItemRef: any;
  private readonly containerRef: any;

  constructor(props: IProps) {
    super(props);
    this.activeItemRef = React.createRef();
    this.containerRef = React.createRef();
  }

  public componentDidUpdate(prevProps, prevState): void {
    const { selectedIndex } = this.props;
    if (prevProps.selectedIndex !== selectedIndex) {
      const selectedRect = this.activeItemRef.current.getBoundingClientRect();
      const containerRect = this.containerRef.current.getBoundingClientRect();
      if (selectedRect.top < containerRect.top) {
        this.activeItemRef.current.scrollIntoView({
          block: 'start',
          inline: 'nearest',
          behavior: 'smooth',
        });
      } else if (selectedRect.bottom > containerRect.bottom) {
        this.activeItemRef.current.scrollIntoView({
          block: 'end',
          inline: 'nearest',
          behavior: 'smooth',
        });
      }
    }
  }

  public render(): JSX.Element {
    const {
      classes,
      disabled,
      displayProp,
      items,
      selectedIndex,
      label,
    } = this.props;

    const listElements = items.map((item, index) => {
      const selected = index === selectedIndex;
      const li = (
        <ListItem
          key={index}
          button
          selected={selected}
          onClick={this.handleListItemClicked(index)}
        >
          <ListItemText
            primary={item[displayProp]}
          />
        </ListItem>
      );
      return selected
      ? (
        <RootRef key={index} rootRef={this.activeItemRef}>
          {li}
        </RootRef>
      )
        : li;
    });

    const iconButtonClasses = { root: classes.iconButtonRoot };

    return (
      <div className={classes.root}>
        {label && (
          <InputLabel shrink>{label}</InputLabel>
        )}
        <div className={classes.controlWrapper}>
          <RootRef rootRef={this.containerRef}>
            <List
              dense
              disablePadding
              className={classes.list}
            >
              {listElements}
            </List>
          </RootRef>
          {!disabled && (
            <Toolbar classes={{ root: classes.toolbarRoot }}>
              <IconButton
                classes={iconButtonClasses}
                onClick={this.handleAddClicked}
              >
                <Add />
              </IconButton>
              <IconButton
                classes={iconButtonClasses}
                disabled={listElements.length === 0}
                onClick={this.handleRemoveClicked}
              >
                <Remove />
              </IconButton>
              <IconButton
                classes={iconButtonClasses}
                disabled={selectedIndex >= listElements.length - 1}
                onClick={this.handleMoveDownClicked}
              >
                <ExpandMore />
              </IconButton>
              <IconButton
                classes={iconButtonClasses}
                disabled={selectedIndex === 0}
                onClick={this.handleMoveUpClicked}
              >
                <ExpandLess />
              </IconButton>
            </Toolbar>
          )}
        </div>
      </div>
    );
  }

  private handleListItemClicked = (index) => () => {
    this.props.onSelectionChanged(index);
  };

  private handleMoveUpClicked = () => {
    const {
      items,
      selectedIndex,
      onListChanged,
      onSelectionChanged,
    } = this.props;
    if (selectedIndex > 0 && items.length > 1) {
      const adjustedItems = [...items];
      const removedItems = adjustedItems.splice(selectedIndex, 1);
      adjustedItems.splice(selectedIndex - 1, 0, removedItems[0]);
      onListChanged(adjustedItems);
      onSelectionChanged(selectedIndex - 1);
    }
  };

  private handleMoveDownClicked = () => {
    const {
      items,
      selectedIndex,
      onListChanged,
      onSelectionChanged,
    } = this.props;
    if (selectedIndex < items.length && items.length > 1) {
      const adjustedItems = [...items];
      const removedItems = adjustedItems.splice(selectedIndex, 1);
      adjustedItems.splice(selectedIndex + 1, 0, removedItems[0]);
      onListChanged(adjustedItems);
      onSelectionChanged(selectedIndex + 1);
    }
  };

  private handleRemoveClicked = () => {
    const {
      items,
      selectedIndex,
      onListChanged,
      onSelectionChanged,
    } = this.props;
    if (items.length > 0) {
      const adjustedItems = [...items];
      const removed = adjustedItems.splice(selectedIndex, 1);
      const adjustedIndex = selectedIndex > 0
        ? selectedIndex - 1
        : 0;
      onListChanged(adjustedItems, removed);
      onSelectionChanged(adjustedIndex);
    }
  };

  private handleAddClicked = () => {
    debug('handleAddClicked');
  };
}

export default withStyles(styles)(AdjustableList);
