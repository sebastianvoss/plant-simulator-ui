import * as React from 'react';
import Paper from 'material-ui/Paper';
import * as ReactHighcharts from 'react-highcharts';
import Typography from 'material-ui/Typography';
import Utils from '../common/Utils';

interface TelemetryWidgetProps {
  id: string;
  numValues: number;
  minValue: number;
  maxValue: number;
}

interface TelemetryWidgetState {
}

class TelemetryWidget extends React.Component<TelemetryWidgetProps, TelemetryWidgetState> {
  private chart: any;

  constructor(props: TelemetryWidgetProps) {
    super(props);
  }

  componentDidMount() {
    const ws = new WebSocket(Utils.telemetryUri(this.props.id));

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      // const time = message.time;
      const time = new Date().getTime();
      const value = parseFloat(message.activePower);
      this.chart.series[0].addPoint([time, value], true, true);
    };
  }

  render() {
    const {numValues, minValue, maxValue} = this.props;
    const config = {
      title: {
        text: ''
      },
      xAxis: {
        type: 'datetime',
        tickPixelInterval: 150
      },
      yAxis: {
        title: {
          text: 'Value'
        },
        min: minValue,
        max: maxValue
      },
      series: [
        {
          name: 'Data',
          type: 'spline',
          data: (function () {
            // generate an array of random data
            let data: any[] = [], time = (new Date()).getTime(), i;

            for (i = -numValues; i < 0; i += 1) {
              data.push({
                x: time + i * 2500,
                y: 0
              });
            }
            return data;
          }())
        }
      ],
      legend: {
        enabled: false
      },
      exporting: {
        enabled: false
      },
    };

    return (
      <Paper>
        <Typography variant="headline" component="h3">
          Telemetry (Power Plant {this.props.id})
        </Typography>
        <ReactHighcharts
          config={config}
          callback={chart => this.chart = chart}
        />
      </Paper>
    );
  }

}

export default TelemetryWidget;
