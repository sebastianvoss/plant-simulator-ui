import * as React from 'react';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import * as moment from 'moment';
import PowerPlantAlert from '../common/Alert';

interface AlertWidgetProps {
  id: string;
  alerts: PowerPlantAlert[];
}

interface AlertWidgetState {
}

class AlertWidget extends React.Component<AlertWidgetProps, AlertWidgetState> {

  render() {
    const {alerts} = this.props;

    return (
        <Paper>
          <Typography variant="headline" component="h3">
            Alerts (Power Plant {this.props.id})
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Time</TableCell>
                <TableCell>Message</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {alerts.map((n, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell>{moment(n.timeStamp).format()}</TableCell>
                    <TableCell>{n.message}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Paper>
    );
  }

}

export default AlertWidget;
