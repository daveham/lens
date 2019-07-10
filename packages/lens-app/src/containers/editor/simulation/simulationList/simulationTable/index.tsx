import React from 'react';
/* tslint:disable-next-line: no-implicit-dependencies */
import moment from 'moment';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

import { ISimulation } from 'editor/interfaces';
import RowToolbar from 'editor/components/rowToolbar';
import { timestampFormat } from 'editor/constants';
import { withStyles } from '@material-ui/core/styles';
import { styles } from 'editor/styles/tables';

import _debug from 'debug';
const debug = _debug('lens:editor:simulationTable');

interface IProps {
  classes?: any;
  simulationRows: ReadonlyArray<ISimulation>;
  url: string;
}

interface IState {
  activeId: number;
}

class SimulationTable extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);

    this.state = {
      activeId: 0
    };
  }

  public render(): any {
    const { classes, simulationRows } = this.props;
    debug('render', { simulationRows });
    return (
      <Paper className={classes.root}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Executions</TableCell>
              <TableCell className={classes.toolbarCell} />
              <TableCell className={classes.timestampCell}>Created</TableCell>
              <TableCell className={classes.timestampCell}>Modified</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {simulationRows.map(this.renderRow)}
          </TableBody>
        </Table>
      </Paper>
    );
  }

  private handleMouseEnter = (id) => () => {
    // debug('handleMouseEnter', id);
    if (this.state.activeId !== id) {
      this.setState({ activeId: id });
    }
  };

  private handleMouseLeave = (id) => () => {
    // debug('handleMouseLeave', id);
    if (this.state.activeId === id) {
      this.setState({ activeId: 0 });
    }
  };

  private handleMouseOver = (id) => () => {
    // debug('handleMouseOver', id);
    if (this.state.activeId !== id) {
      this.setState({ activeId: id });
    }
  };

  private handleMouseOut = (id) => () => {
    // debug('handleMouseOut', id);
  };

  private renderToolbar = (row: ISimulation): any => {
    if (row.id === this.state.activeId) {
      const rowUrl = `${this.props.url}/${row.id}`;
      const links = {
        showItem: rowUrl,
        editItem: `${rowUrl}/edit`,
        executions: `${rowUrl}/Execution`,
        deleteItem: `${rowUrl}/delete`
      };
      return <RowToolbar links={links} />;
    }
    return <span className={this.props.classes.toolbarFill} />;
  };

  private renderRow = (row: ISimulation): any => {
    const toolbar = this.renderToolbar(row);
    const backgroundColor = this.state.activeId === row.id
      ? '#eee' : 'inherit';
    return (
      <TableRow
        style={{ backgroundColor }}
        key={row.id}
        onMouseEnter={this.handleMouseEnter(row.id)}
        onMouseLeave={this.handleMouseLeave(row.id)}
      >
        <TableCell>{row.name}</TableCell>
        <TableCell>{row.executionCount}</TableCell>
        <TableCell
          className={this.props.classes.toolbarCell}
          onMouseEnter={this.handleMouseEnter(row.id)}
          onMouseLeave={this.handleMouseLeave(row.id)}
          onMouseOver={this.handleMouseOver(row.id)}
          onMouseOut={this.handleMouseOut(row.id)}
        >
          {toolbar}
        </TableCell>
        <TableCell>{moment(row.created).format(timestampFormat)}</TableCell>
        <TableCell>{moment(row.modified).format(timestampFormat)}</TableCell>
      </TableRow>
    );
  }
}

export default withStyles(styles)(SimulationTable);
