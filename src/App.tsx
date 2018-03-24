import * as React from 'react';
import TelemetryWidget from './telemetry/TelemetryWidget';
import EventWidget from './events/EventWidget';
import PlantSelector from './plantSelector/PlantSelector';
import Grid from 'material-ui/Grid';
import './App.css';
import Plant from './common/Plant';
import AlertWidget from './events/AlertWidget';
import Utils from './common/Utils';
import PowerPlantEvent from './common/PowerPlantEvent';
import PowerPlantAlert from './common/PowerPlantAlert';

const logo = require('./logo.svg');

interface AppState {
  selectedPlantId: string;
  plants: Plant[];
  events: PowerPlantEvent[];
  alerts: PowerPlantAlert[];
}

class App extends React.Component<any, AppState> {

  private eventWebsocket: WebSocket;
  private eventWebsocketHeartbeatTimer: NodeJS.Timer;

  constructor(props: any) {
    super(props);

    const plants: Plant[] = [
      {id: '1', name: 'Power Plant 1'},
      {id: '2', name: 'Power Plant 2'}
    ];

    this.state = {
      selectedPlantId: plants[0].id,
      plants,
      events: [],
      alerts: []
    };
  }

  componentDidMount() {
    this.eventWebsocket = this.connectEventWebsocket(this.state.selectedPlantId);
  }

  componentWillUnmount() {
    clearInterval(this.eventWebsocketHeartbeatTimer);
    this.eventWebsocket.close();
  }

  render() {
    const {selectedPlantId, events, alerts} = this.state;
    const plants: Plant[] = [
      {id: '1', name: 'Power Plant 1'},
      {id: '2', name: 'Power Plant 2'}
    ];

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo"/>
          <h1 className="App-title">Power Plant Simulator</h1>
        </header>
        <div style={{margin: '20px'}}>
          <Grid container={true} spacing={24}>
            <Grid item={true} xs={12} sm={2}>
              <PlantSelector plants={plants} selectedPlantId={selectedPlantId} onChange={this.onChange}/>
            </Grid>
            <Grid item={true} xs={12} sm={10}>
              <TelemetryWidget id={selectedPlantId} numValues={20} minValue={0} maxValue={900}/>
            </Grid>
            <Grid item={true} xs={12} sm={6}>
              <EventWidget id={selectedPlantId} events={events}/>
            </Grid>
            <Grid item={true} xs={12} sm={6}>
              <AlertWidget id={selectedPlantId} alerts={alerts}/>
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }

  onChange = (event: React.FormEvent<HTMLSelectElement>) => {
    const plantId = event.currentTarget.value;
    this.setState((prevState: AppState) => {
      clearInterval(this.eventWebsocketHeartbeatTimer);
      this.eventWebsocket.close();
      this.eventWebsocket = this.connectEventWebsocket(plantId);

      return {
        selectedPlantId: plantId,
        events: [],
        alerts: []
      };
    });
  }

  private connectEventWebsocket = (id: string) => {
    const ws = new WebSocket(Utils.eventsUri(id));

    ws.onopen = (e) => {
      console.log('onopen');
      this.eventWebsocketHeartbeatTimer = setInterval(
        () => ws.send(JSON.stringify({heartbeat: true})),
        10000
      );
    };

    ws.onerror = (e) => {
      console.log('onerror');
    };

    ws.onmessage = (e) => {
      const message = JSON.parse(e.data);
      if (message.newState !== undefined) {
        const event = message as PowerPlantEvent;
        this.setState((prevState: AppState) => {
          prevState.events.push(event);
          const start = Math.max(0, prevState.events.length - this.props.numValues);
          const events = prevState.events.slice(start, prevState.events.length);
          return {events};
        });
      } else if (message.message !== undefined) {
        const alert = message as PowerPlantAlert;
        this.setState((prevState: AppState) => {
          prevState.alerts.push(alert);
          const start = Math.max(0, prevState.alerts.length - this.props.numValues);
          const alerts = prevState.alerts.slice(start, prevState.alerts.length);
          return {alerts};
        });
      }
    };

    return ws;
  }

}

export default App;
