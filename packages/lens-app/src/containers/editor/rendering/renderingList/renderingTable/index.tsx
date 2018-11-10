import React from 'react';
/* tslint:disable-next-line: no-implicit-dependencies */
import moment from 'moment';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

import {IRendering } from 'editor/interfaces';
import RowToolbar from 'editor/components/rowToolbar';
import { timestampFormat } from 'editor/constants';
import { withStyles } from '@material-ui/core/styles';
import { styles } from 'editor/styles/tables';

// import _debug from 'debug';
// const debug = _debug('lens:renderingTable');

interface IProps {
  classes: any;
  renderingRows: ReadonlyArray<IRendering>;
  url: string;
}

interface IState {
  activeId: number;
}

class RenderingTable extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);

    this.state = {
      activeId: null
    };
  }

  public render(): any {
    const { classes, renderingRows } = this.props;
    return(
      <Paper className={classes.root}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell className={classes.toolbarCell} />
              <TableCell className={classes.timestampCell}>Created</TableCell>
              <TableCell className={classes.timestampCell}>Modified</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {renderingRows.map(this.renderRow)}
          </TableBody>
        </Table>
      </Paper>
    );
  }

  private handleMouseEnter = (id) => () => {
    if (this.state.activeId !== id) {
      this.setState({ activeId: id });
    }
  };

  private handleMouseLeave = () => {
    if (this.state.activeId) {
      this.setState({ activeId: null });
    }
  };

  private renderToolbar = (row: IRendering): any => {
    if (row.id === this.state.activeId) {
      const rowUrl = `${this.props.url}/${row.id}`;
      const links = {
        showItem: rowUrl,
        editItem: `${rowUrl}/edit`,
        deleteItem: `${rowUrl}/delete`
      };
      return <RowToolbar links={links} />;
    }
    return <span className={this.props.classes.toolbarFill} />;
  };

  private renderRow = (row: IRendering): any => {
    const toolbar = this.renderToolbar(row);
    return (
      <TableRow
        key={row.id}
        onMouseEnter={this.handleMouseEnter(row.id)}
        onMouseLeave={this.handleMouseLeave}
      >
        <TableCell>{row.name}</TableCell>
        <TableCell className={this.props.classes.toolbarCell}>{toolbar}</TableCell>
        <TableCell>{moment(row.created).format(timestampFormat)}</TableCell>
        <TableCell>{moment(row.modified).format(timestampFormat)}</TableCell>
      </TableRow>
    );
  }
}

export default withStyles(styles)(RenderingTable);
