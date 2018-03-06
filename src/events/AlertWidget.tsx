import * as React from 'react';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import * as moment from 'moment';
import Utils from '../common/Utils';

interface AlertWidgetProps {
  id: string;
  numValues: number;
}

interface AlertWidgetState {
  data: Alert[];
}

class Alert {
  message: string;
  timeStamp: string;
}

class AlertWidget extends React.Component<AlertWidgetProps, AlertWidgetState> {

  private ws: WebSocket;
  private timer: NodeJS.Timer;

  constructor(props: AlertWidgetProps) {
    super(props);

    this.state = {
      data: []
    };
  }

  componentDidMount() {
    this.ws = this.connect(this.props.id);
    this.timer = this.setupHeartbeat(this.ws);
  }

  componentWillReceiveProps(props: AlertWidgetProps) {
    this.ws.close();
    this.ws = this.connect(props.id);
    this.timer = this.setupHeartbeat(this.ws);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
    this.ws.close();
  }

  render() {
    const {data} = this.state;

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
              {data.map((n, index) => {
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

  private connect = (id: string) => {
    const ws = new WebSocket(Utils.eventsUri(id));

    ws.onmessage = (e) => {
      const alert = JSON.parse(e.data) as Alert;
      this.setState((prevState: AlertWidgetState) => {
        prevState.data.push(alert);
        const start = Math.max(0, prevState.data.length - this.props.numValues);
        const data = prevState.data.slice(start, prevState.data.length);
        return {data};
      });
    };

    return ws;
  }

  private setupHeartbeat = (ws: WebSocket) =>
    setInterval(() => ws.send(JSON.stringify({heartbeat: true})), 10000)

}

export default AlertWidget;
