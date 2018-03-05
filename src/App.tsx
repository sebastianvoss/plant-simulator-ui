import * as React from 'react';
import TelemetryWidget from './telemetry/TelemetryWidget';
import EventWidget from './events/EventWidget';
import Grid from 'material-ui/Grid';
import './App.css';

const logo = require('./logo.svg');

class App extends React.Component {

  render() {
    const id = '2';

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo"/>
          <h1 className="App-title">Power Plant Simulator</h1>
        </header>
        <div style={{margin: '20px'}}>
          <Grid container={true} spacing={24}>
            <Grid item={true} xs={12} sm={6}>
              <TelemetryWidget id={id} numValues={20} minValue={0} maxValue={900}/>
            </Grid>
            <Grid item={true} xs={12} sm={6}>
              <EventWidget id={id} numValues={5}/>
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }

}

export default App;
