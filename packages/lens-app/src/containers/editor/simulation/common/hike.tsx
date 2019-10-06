import React, { Component, Fragment } from 'react';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles} from '@material-ui/core/styles';
import { IHike } from 'editor/interfaces';
import ReadOnlyTextField from 'editor/components/readOnlyTextField';

// import _debug from 'debug';
// const debug = _debug('lens:editor:simulation:hike');

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

interface IHikeErrors {
  nameError?: string;
}

interface IProps {
  classes?: any;
  hike: IHike & IHikeErrors;
  disabled?: boolean;
  onChange?: (event: any) => void;
}

const hikeTypeLabels = {
  simple: 'Simple',
  one: 'One',
  two: 'Two',
  three: 'Three',
};

const hikeSizeLabels = {
  full: 'Full',
  double: 'Double',
  quad: 'Quad',
  half: 'Half',
};

const hikeLoggerLabels = {
  none: 'None',
  file: 'File',
};

const hikeTrackWriterLabels = {
  none: 'None',
  wire: 'Wire',
  '2d': '2-D',
  '3d': '3-D',
  animation: 'Animation',
};

class Hike extends Component<IProps, any> {
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
    const { hike } = this.props;

    const hikeTypeValue = hike.type ? hikeTypeLabels[hike.type] : '';
    const hikeSizeValue = hike.size ? hikeSizeLabels[hike.size] : '';
    const hikeLoggerValue = hike.logger ? hikeLoggerLabels[hike.logger] : '';
    const hikeTrackWriterValue = hike.trackWriter ? hikeTrackWriterLabels[hike.trackWriter] : '';

    return (
      <Fragment>
        <ReadOnlyTextField
          label='Name'
          margin='dense'
          multiline
          value={hike.name}
          fullWidth
          disabled
        />
        <ReadOnlyTextField
          label='Type'
          margin='dense'
          value={hikeTypeValue}
          fullWidth
          disabled
        />
        <ReadOnlyTextField
          label='Size'
          margin='dense'
          value={hikeSizeValue}
          fullWidth
          disabled
        />
        <ReadOnlyTextField
          label='Logger'
          margin='dense'
          value={hikeLoggerValue}
          fullWidth
          disabled
        />
        <ReadOnlyTextField
          label='Track Writer'
          margin='dense'
          value={hikeTrackWriterValue}
          fullWidth
          disabled
        />
      </Fragment>
    );
  }

  private renderEnabled(): any {
    const {
      classes,
      hike,
      onChange,
    } = this.props;

    return (
      <Fragment>
        <TextField
          label='Name'
          margin='normal'
          multiline
          onChange={onChange}
          inputProps={{
            name: 'name',
            id: 'hike-name'
          }}
          value={hike.name}
          helperText={hike.nameError}
          error={Boolean(hike.nameError)}
          fullWidth
          required
        />
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor='hike-type'>Type</InputLabel>
          <Select
            onChange={onChange}
            value={hike.type}
            inputProps={{
              name: 'type',
              id: 'hike-type'
            }}
          >
            <MenuItem value='simple'>Simple</MenuItem>
            <MenuItem value='one'>One</MenuItem>
            <MenuItem value='two'>Two</MenuItem>
            <MenuItem value='three'>Three</MenuItem>
          </Select>
        </FormControl>
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor='hike-size'>Size</InputLabel>
          <Select
            onChange={onChange}
            value={hike.size}
            inputProps={{
              name: 'size',
              id: 'hike-size'
            }}
          >
            <MenuItem value='full'>Full</MenuItem>
            <MenuItem value='double'>Double</MenuItem>
            <MenuItem value='quad'>Quad</MenuItem>
            <MenuItem value='half'>Half</MenuItem>
          </Select>
        </FormControl>
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor='hike-logger'>Logger</InputLabel>
          <Select
            onChange={onChange}
            value={hike.logger}
            inputProps={{
              name: 'logger',
              id: 'hike-logger'
            }}
          >
            <MenuItem value='none'><em>None</em></MenuItem>
            <MenuItem value='file'>File</MenuItem>
          </Select>
        </FormControl>
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor='hike-track-writer'>Track Writer</InputLabel>
          <Select
            onChange={onChange}
            value={hike.trackWriter}
            inputProps={{
              name: 'trackWriter',
              id: 'hike-track-writer'
            }}
          >
            <MenuItem value='none'><em>None</em></MenuItem>
            <MenuItem value='wire'>Wire</MenuItem>
            <MenuItem value='2d'>2-D</MenuItem>
            <MenuItem value='3d'>3-D</MenuItem>
            <MenuItem value='animation'>Animation</MenuItem>
          </Select>
        </FormControl>
      </Fragment>
    );
  }
}

export default withStyles(styles)(Hike);
