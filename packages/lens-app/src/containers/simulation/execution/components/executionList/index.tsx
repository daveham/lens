import React from 'react';
/* tslint:disable-next-line: no-implicit-dependencies */
import moment from 'moment';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

import {IExecution } from '../../../interfaces';
import RowToolbar from '../../../components/rowToolbar';
import { timestampFormat } from '../../../constants';

import styles from './styles.scss';

// import _debug from 'debug';
// const debug = _debug('lens:executionList');

interface IProps {
  executionRows: ReadonlyArray<IExecution>;
  sourceId: string;
  simulationId?: number;
}

interface IState {
  activeId: number;
}

class ExecutionList extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);

    this.state = {
      activeId: null
    };
  }

  public render(): any {
    const { executionRows } = this.props;
    return(
      <div>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Renderings</TableCell>
              <TableCell className={styles.toolbarCell} />
              <TableCell className={styles.timestampCell}>Created</TableCell>
              <TableCell className={styles.timestampCell}>Modified</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {executionRows.map(this.renderRow)}
          </TableBody>
        </Table>
      </div>
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

  private renderToolbar = (row: IExecution): any => {
    if (row.id === this.state.activeId) {
      const { sourceId } = this.props;
      const links = {
        editItem: `/Catalog/${sourceId}/Simulation/${row.id}/Execution/${row.id}`,
        renderings: `/Catalog/${sourceId}/Simulation/${row.id}/Execution/${row.id}/Rendering`,
        deleteItem: `/Catalog/${sourceId}/Simulation/${row.id}/Execution`
      };
      return <RowToolbar links={links}/>;
    }
    return <span className={styles.toolbarFill} />;
  };

  private renderRow = (row: IExecution): any => {
    const toolbar = this.renderToolbar(row);
    return (
      <TableRow
        key={row.id}
        onMouseEnter={this.handleMouseEnter(row.id)}
        onMouseLeave={this.handleMouseLeave}
      >
        <TableCell>{row.name}</TableCell>
        <TableCell>{row.renderingCount}</TableCell>
        <TableCell className={styles.toolbarCell}>{toolbar}</TableCell>
        <TableCell>{moment(row.created).format(timestampFormat)}</TableCell>
        <TableCell>{moment(row.modified).format(timestampFormat)}</TableCell>
      </TableRow>
    );
  }
}

export default ExecutionList;
