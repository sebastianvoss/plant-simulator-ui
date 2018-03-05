import * as React from 'react';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import * as moment from 'moment';
import Utils from '../common/Utils';

interface EventWidgetProps {
  id: string;
  numValues: number;
}

interface EventWidgetState {
  data: Event[];
}

class Event {
  newState: string;
  oldState: string;
  timeStamp: string;
}

class EventWidget extends React.Component<EventWidgetProps, EventWidgetState> {

  private ws: WebSocket;
  private timer: NodeJS.Timer;

  constructor(props: EventWidgetProps) {
    super(props);

    this.state = {
      data: []
    };
  }

  componentDidMount() {
    this.ws = this.connect(this.props.id);
    this.timer = this.setupHeartbeat(this.ws);
  }

  componentWillReceiveProps(props: EventWidgetProps) {
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
              {data.map((n, index) => {
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

  private connect = (id: string) => {
    const ws = new WebSocket(Utils.eventsUri(id));

    ws.onmessage = (e) => {
      const event = JSON.parse(e.data) as Event;
      this.setState((prevState: EventWidgetState) => {
        prevState.data.push(event);
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

export default EventWidget;
