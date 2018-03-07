import * as React from 'react';
import Paper from 'material-ui/Paper';
import * as ReactHighcharts from 'react-highcharts';
import Typography from 'material-ui/Typography';
import Utils from '../common/Utils';
import * as moment from 'moment';

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
  private ws: WebSocket;

  constructor(props: TelemetryWidgetProps) {
    super(props);
  }

  componentDidMount() {
    this.ws = this.connect(this.props.id);
  }

  componentWillReceiveProps(props: TelemetryWidgetProps) {
    this.ws.close();
    this.ws = this.connect(props.id);
  }

  componentWillUnmount() {
    this.ws.close();
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
          name: 'activePower',
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
        title: 'activePower',
        align: 'right',
        verticalAlign: 'top',
        layout: 'vertical'
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

  private connect = (id: string) => {
    const ws = new WebSocket(Utils.telemetryUri(id));

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      const time = moment(message.timestamp).toDate().getTime();
      const value = message.activePower;
      this.chart.series[0].addPoint([time, value], true, true);
    };

    return ws;
  }

}

export default TelemetryWidget;
