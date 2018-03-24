class PowerPlantTelemetry {
  measurements: Measurement[];
}

class Measurement {
  time: Date;
  activePower: number;
  setPoint?: number;
}

export {PowerPlantTelemetry, Measurement};
