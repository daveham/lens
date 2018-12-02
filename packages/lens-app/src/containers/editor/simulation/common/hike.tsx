import React, { Component } from 'react';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles} from '@material-ui/core/styles';

// import _debug from 'debug';
// const debug = _debug('lens:editor:simulation:hike');

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
  hikeType: string;
  hikeSize: string;
  hikeLogger: string;
  hikeTrackWriter: string;
  onChange: (event: any) => void;
}

class Hike extends Component<IProps, any> {
  public render(): any {
    const {
      classes,
      hikeType,
      hikeSize,
      hikeLogger,
      hikeTrackWriter,
      onChange,
    } = this.props;

    return (
      <div className={classes.root}>
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor='hike-type'>Type</InputLabel>
          <Select
            onChange={onChange}
            value={hikeType}
            inputProps={{
              name: 'hikeType',
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
            value={hikeSize}
            inputProps={{
              name: 'hikeSize',
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
            value={hikeLogger}
            inputProps={{
              name: 'hikeLogger',
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
            value={hikeTrackWriter}
            inputProps={{
              name: 'hikeTrackWriter',
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
      </div>
    );
  }
}

export default withStyles(styles)(Hike);
