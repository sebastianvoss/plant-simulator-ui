import * as React from 'react';
import * as ReactHighcharts from 'react-highcharts';
import Typography from 'material-ui/Typography';
import Utils from '../common/Utils';
import * as moment from 'moment';
import { PowerPlantTelemetry, Measurement } from '../common/PowerPlantTelemetry';

interface TelemetryWidgetProps {
  id: string;
  numValues: number;
  minValue: number;
  maxValue: number;
}

interface TelemetryWidgetState {
  telemetry: PowerPlantTelemetry;
  config: any;
}

class TelemetryWidget extends React.Component<TelemetryWidgetProps, TelemetryWidgetState> {
  private chart: any;
  private ws: WebSocket;

  constructor(props: TelemetryWidgetProps) {
    super(props);
    const telemetry = this.generateEmptyTelemetry();
    this.state = {
      telemetry,
      config: this.createConfig(telemetry)
    };
  }

  componentDidMount() {
    this.ws = this.connect(this.props.id);
  }

  componentWillReceiveProps(props: TelemetryWidgetProps) {
    if (this.props.id !== props.id) {
      this.setState(prevState => {
        this.ws.close();
        this.ws = this.connect(props.id);
        const telemetry = this.generateEmptyTelemetry();
        return {
          telemetry,
          config: this.createConfig(telemetry)
        };
      });
    }
  }

  componentWillUnmount() {
    this.ws.close();
  }

  render() {
    const {config} = this.state;

    return (
      <div>
        <Typography variant="headline" component="h3">
          Telemetry (Power Plant {this.props.id})
        </Typography>
        <ReactHighcharts
          isPureConfig={true}
          config={config}
          callback={chart => this.chart = chart}
        />
      </div>
    );
  }

  private connect = (id: string) => {
    const ws = new WebSocket(Utils.telemetryUri(id));

    ws.onmessage = (event) => {
      console.log(event.data);
      const message = JSON.parse(event.data);
      const date = moment(message.timestamp).toDate();
      const value = message.activePower;
      const setPoint = message.setPoint;

      this.setState(prevState => {
        prevState.telemetry.measurements.push({time: date, activePower: value, setPoint});
        const start = Math.max(0, this.state.telemetry.measurements.length - this.props.numValues);
        const measurements = prevState.telemetry.measurements.slice(
          start,
          prevState.telemetry.measurements.length
        );

        this.chart.series[0].addPoint([date.getTime(), value], true, false, true);
        this.chart.series[1].addPoint([date.getTime(), setPoint], true, false, true);

        return {telemetry: {measurements}};
      });
    };

    return ws;
  }

  private generateEmptyTelemetry = (): PowerPlantTelemetry => {
    let measurements: Measurement[] = [], time = (new Date()).getTime(), i;

    for (i = -this.props.numValues; i < 0; i += 1) {
      measurements.push({
        time: new Date(time + i * 2500),
        activePower: 0
      });
    }
    return {measurements};
  }

  private createConfig = (telemetry: PowerPlantTelemetry) => {
    const activePower = telemetry.measurements.map(m => [m.time.getTime(), m.activePower]);
    const setPoints = telemetry.measurements.map(m => [m.time.getTime(), m.setPoint]);
    return {
      chart : {
        type: 'spline',
      },
      title: {
        text: ''
      },
      xAxis: {
        type: 'datetime',
      },
      yAxis: {
        title: {
          text: 'Power'
        }
      },
      series: [
        {
          name: 'ActivePower',
          data: activePower
        },
        {
          name: 'SetPoint',
          data: setPoints,
          step: 'left'
        }
      ],
      legend: {
        title: 'activePower',
        align: 'right',
        verticalAlign: 'top',
        layout: 'vertical'
      }
    };
  }

}

export default TelemetryWidget;
