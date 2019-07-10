import React, { Component, Fragment } from 'react';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles} from '@material-ui/core/styles';
import { ITrail } from 'editor/interfaces';
import ReadOnlyTextField from 'editor/components/readOnlyTextField';

import _debug from 'debug';
const debug = _debug('lens:editor:simulation:trail');

const styles: any = (theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: theme.spacing.unit * 18,
    maxWidth: theme.spacing.unit * 22,
  },
});

interface IProps {
  classes?: any;
  trail: ITrail;
  disabled?: boolean;
  onChange?: (event: any) => void;
}

const trailTypeLabels = {
  simple: 'Simple',
  one: 'One',
  two: 'Two',
  three: 'Three',
};

class Trail extends Component<IProps, any> {
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
    const { trail } = this.props;

    const trailTypeValue = trail.type ? trailTypeLabels[trail.type] : '';

    return (
      <Fragment>
        <ReadOnlyTextField
          label='Name'
          margin='dense'
          multiline
          value={trail.name}
          fullWidth
          disabled
        />
        <ReadOnlyTextField
          label='Type'
          margin='dense'
          value={trailTypeValue}
          fullWidth
          disabled
        />
      </Fragment>
    );
  }

  private renderEnabled(): any {
    const {
      classes,
      trail,
      onChange,
    } = this.props;

    debug('renderEnabled', { trail });

    return (
      <Fragment>
        <TextField
          label='Name'
          margin='normal'
          multiline
          onChange={onChange}
          inputProps={{
            name: 'name',
            id: 'trail-name'
          }}
          value={trail.name}
          fullWidth
          required
        />
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor='trail-type'>Type</InputLabel>
          <Select
            onChange={onChange}
            value={trail.type}
            inputProps={{
              name: 'type',
              id: 'trail-type'
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

export default withStyles(styles)(Trail);
