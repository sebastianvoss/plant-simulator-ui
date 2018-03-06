import * as React from 'react';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import * as moment from 'moment';
import PowerPlantEvent from '../common/PowerPlantEvent';

interface EventWidgetProps {
  id: string;
  events: PowerPlantEvent[];
}

interface EventWidgetState {
}

class EventWidget extends React.Component<EventWidgetProps, EventWidgetState> {

  render() {
    const {events} = this.props;

    return (
        <Paper>
          <Typography variant="headline" component="h3">
            Events (Power Plant {this.props.id})
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Time</TableCell>
                <TableCell>Old State</TableCell>
                <TableCell>New State</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {events.map((n, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell>{moment(n.timeStamp).format()}</TableCell>
                    <TableCell>{n.oldState}</TableCell>
                    <TableCell>{n.newState}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Paper>
    );
  }

}

export default EventWidget;
