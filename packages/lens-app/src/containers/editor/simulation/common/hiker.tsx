import React, { Component, Fragment } from 'react';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles} from '@material-ui/core/styles';
import { IHiker } from 'editor/interfaces';
import ReadOnlyTextField from 'editor/components/readOnlyTextField';

import _debug from 'debug';
const debug = _debug('lens:editor:simulation:hiker');

const styles: any = (theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: theme.spacing(18),
    maxWidth: theme.spacing(22),
  },
});

interface IProps {
  classes?: any;
  hiker: IHiker;
  disabled?: boolean;
  onChange?: (event: any) => void;
}

const hikerTypeLabels = {
  simple: 'Simple',
  one: 'One',
  two: 'Two',
  three: 'Three',
};

class Hiker extends Component<IProps, any> {
  public render(): any {
    const {
      classes,
      disabled,
    } = this.props;

    return (
      <div className={classes.root}>
        {disabled && this.renderDisabled()}
        {!disabled && this.renderEnabled()}
      </div>
    );
  }

  private renderDisabled(): any {
    const { hiker } = this.props;

    const hikerTypeValue = hiker.type ? hikerTypeLabels[hiker.type] : '';

    return (
      <Fragment>
        <ReadOnlyTextField
          label='Name'
          margin='dense'
          multiline
          value={hiker.name}
          fullWidth
          disabled
        />
        <ReadOnlyTextField
          label='Type'
          margin='dense'
          value={hikerTypeValue}
          fullWidth
          disabled
        />
      </Fragment>
    );
  }

  private renderEnabled(): any {
    const {
      classes,
      hiker,
      onChange,
    } = this.props;

    debug('renderEnabled', { hiker });

    return (
      <Fragment>
        <TextField
          label='Name'
          margin='normal'
          multiline
          onChange={onChange}
          inputProps={{
            name: 'name',
            id: 'hiker-name'
          }}
          value={hiker.name}
          fullWidth
          required
        />
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor='hiker-type'>Type</InputLabel>
          <Select
            onChange={onChange}
            value={hiker.type}
            inputProps={{
              name: 'type',
              id: 'hiker-type'
            }}
          >
            <MenuItem value='simple'>Simple</MenuItem>
            <MenuItem value='one'>One</MenuItem>
            <MenuItem value='two'>Two</MenuItem>
            <MenuItem value='three'>Three</MenuItem>
          </Select>
        </FormControl>
      </Fragment>
    );
  }
}

export default withStyles(styles)(Hiker);
