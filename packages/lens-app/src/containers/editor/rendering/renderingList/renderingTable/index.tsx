import React from 'react';
/* tslint:disable-next-line: no-implicit-dependencies */
import moment from 'moment';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

import {IRendering } from 'editor/interfaces';
import RowToolbar from 'editor/components/rowToolbar';
import { timestampFormat } from 'editor/constants';

import styles from './styles.scss';

// import _debug from 'debug';
// const debug = _debug('lens:renderingTable');

interface IProps {
  renderingRows: ReadonlyArray<IRendering>;
  matchUrl: string;
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
    const { renderingRows } = this.props;
    return(
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell className={styles.toolbarCell} />
            <TableCell className={styles.timestampCell}>Created</TableCell>
            <TableCell className={styles.timestampCell}>Modified</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {renderingRows.map(this.renderRow)}
        </TableBody>
      </Table>
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
      const rowUrl = `${this.props.matchUrl}/${row.id}`;
      const links = {
        editItem: rowUrl,
        deleteItem: `${rowUrl}/delete`
      };
      return <RowToolbar links={links} />;
    }
    return <span className={styles.toolbarFill} />;
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
        <TableCell className={styles.toolbarCell}>{toolbar}</TableCell>
        <TableCell>{moment(row.created).format(timestampFormat)}</TableCell>
        <TableCell>{moment(row.modified).format(timestampFormat)}</TableCell>
      </TableRow>
    );
  }
}

export default RenderingTable;
