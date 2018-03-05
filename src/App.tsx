import * as React from 'react';
import TelemetryWidget from './telemetry/TelemetryWidget';
import EventWidget from './events/EventWidget';
import PlantSelector from './plantSelector/PlantSelector';
import Grid from 'material-ui/Grid';
import './App.css';
import Plant from './common/Plant';

const logo = require('./logo.svg');

interface AppState {
  selectedPlantId: string;
  plants: Plant[];
}

class App extends React.Component<any, AppState> {

  constructor(props: any) {
    super(props);

    const plants: Plant[] = [
      {id: '1', name: 'Power Plant 1'},
      {id: '2', name: 'Power Plant 2'}
    ];

    this.state = {
      selectedPlantId: plants[0].id,
      plants
    };
  }

  render() {
    const {selectedPlantId} = this.state;
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
            <Grid item={true} xs={12} sm={6}>
              <PlantSelector plants={plants} selectedPlantId={selectedPlantId} onChange={this.onChange}/>
            </Grid>
            <Grid item={true} xs={12} sm={6}>
              <EventWidget id={selectedPlantId} numValues={5}/>
            </Grid>
            <Grid item={true} xs={12} sm={6}>
              <TelemetryWidget id={selectedPlantId} numValues={20} minValue={0} maxValue={900}/>
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }

  onChange = (event: React.FormEvent<HTMLSelectElement>) => {
    this.setState({
      selectedPlantId: event.currentTarget.value
    });
  }

}

export default App;
