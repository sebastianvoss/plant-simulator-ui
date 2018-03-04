import * as React from 'react';
import TelemetryWidget from './telemetry/TelemetryWidget';
import EventWidget from './events/EventWidget';
import Grid from 'material-ui/Grid';
import './App.css';

const logo = require('./logo.svg');

class App extends React.Component {

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo"/>
          <h1 className="App-title">Power Plant Simulator</h1>
        </header>
        <div style={{margin: '20px'}}>
          <Grid container={true} spacing={24}>
            <Grid item={true} xs={12} sm={6}>
              <TelemetryWidget id={'1'} numValues={20} minValue={0} maxValue={100}/>
            </Grid>
            <Grid item={true} xs={12} sm={6}>
              <EventWidget id={'1'} numValues={5}/>
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }

}

export default App;
