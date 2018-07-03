import * as React from 'react';
/* tslint:disable-next-line: no-implicit-dependencies */
import moment from 'moment';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

interface ISimulationRow {
  id: number;
  created: number;
  modified: number;
  name: string;
  executionCount: number;
}

interface IProps {
  simulationRows: ISimulationRow[];
}

function renderRow(row: ISimulationRow): any {
  return (
    <TableRow key={row.id}>
      <TableCell>{row.name}</TableCell>
      <TableCell>{row.executionCount}</TableCell>
      <TableCell>{moment(row.created).format('MM/D YYYY h:mm:ss a')}</TableCell>
      <TableCell>{moment(row.modified).format('MM/D YYYY h:mm:ss a')}</TableCell>
    </TableRow>
  );
}

export default ({ simulationRows }: IProps) => {
  return (
    <div>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Executions</TableCell>
            <TableCell>Created</TableCell>
            <TableCell>Modified</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {simulationRows.map(renderRow)}
        </TableBody>
      </Table>
    </div>
  );
};
