import * as React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

interface ISimulationRow {
  id: number;
  name: string;
}

interface IProps {
  simulationRows: ISimulationRow[];
}

export default ({ simulationRows }: IProps) => {
  return (
    <div>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Created</TableCell>
            <TableCell>Modified</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {simulationRows.map((r, index) => (
            <TableRow key={index}>
              <TableCell>{r.name}</TableCell>
              <TableCell>{`id=${r.id}`}</TableCell>
              <TableCell>controls</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
