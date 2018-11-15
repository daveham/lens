import React, { Component, Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import moment from 'moment';

// import _debug from 'debug';
// const debug = _debug('lens:catalog:sourceView/details');

const addCommas = (v) => v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
const formatDate =  (v) => moment(v).format('h:mm a, MM/DD/YY');

const detailsTemplate = [
  { l: 'Modified', k: 'ctime', c: formatDate },
  { l: 'Format', k: 'format' },
  { g: [
    { l: 'Size', k: 'size', c: addCommas },
    { l: 'File Size', k: 'filesize' }
  ]},
  { g: [
    { l: 'Width', k: 'width', c: addCommas },
    { l: 'Height', k: 'height', c: addCommas },
    { l: 'Depth', k: 'depth' }
  ]},
  { l: 'Resolution', k: 'resolution' }
];

const createValueFromDetail = (value, converter) => {
  if (!value) {
    return '...';
  }
  return converter ? converter(value) : value;
};

const styles: any = (theme) => {
  const { unit } = theme.spacing;
  return {
    root: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: unit / 2,
      fontFamily: theme.typography.fontFamily,
      fontSize: '10pt',
    },
    row: {
      display: 'flex',
      justifyContent: 'flex-start',
      lineHeight: '1.5',
      width: '100%',
    },
    label: {
      color: theme.palette.text.primary,
      fontWeight: 900,
      padding: `0 ${unit / 2}px`,
      '&:not(:first-child)': {
        paddingLeft: unit * 2,
      },
    },
    detail: {
      textAlign: 'left',
      color: theme.palette.text.secondary,
      '&:last-child': {
        flexGrow: 1,
      }
    },
  };
};

interface IProps {
  classes?: any;
  stats: any;
}

class Details extends Component<IProps, any> {
  public render(): any {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        {detailsTemplate.map(this.renderDetailRow)}
      </div>
    );
  }

  private renderDetailRow = (detail, key): any => {
    const { classes } = this.props;
    const detailOrGroup = detail.g || detail;

    return (
      <div key={key} className={classes.row}>
        {
          Array.isArray(detailOrGroup)
            ? detailOrGroup.map(this.renderDetailColumns)
            : this.renderDetailColumns(detailOrGroup)
        }
      </div>
    );
  };

  private renderDetailColumns = (detail): any => {
    const { classes, stats } = this.props;

    return (
      <Fragment key={detail.k}>
        <div key={detail.k} className={classes.label}>
          {detail.l}
        </div>
        <div key={`${detail.k}-d`} className={classes.detail}>
          {createValueFromDetail(stats[detail.k], detail.c)}
        </div>
      </Fragment>
    );
  };
}

export default withStyles(styles)(Details);
