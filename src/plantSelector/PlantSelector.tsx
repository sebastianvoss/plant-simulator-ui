import * as React from 'react';
import Paper from 'material-ui/Paper';
import { Radio, FormControl, RadioGroup, FormControlLabel } from 'material-ui';
import Plant from '../common/Plant';

interface PlantSelectorProps {
  plants: Plant[];
  selectedPlantId: string;
  onChange: (event: React.FormEvent<HTMLSelectElement>) => void;
}

class PlantSelector extends React.Component<PlantSelectorProps, any> {

  render() {
    const {plants, selectedPlantId, onChange} = this.props;
    return (
      <Paper>
        <FormControl component="fieldset" required={true} style={{margin: '20px'}}>
          <RadioGroup
            aria-label="gender"
            name="gender1"
            value={selectedPlantId}
            onChange={onChange}
          >
            {plants.map(p => (
              <FormControlLabel
                key={p.id}
                value={p.id}
                control={<Radio />}
                label={p.name}
              />
            ))}
          </RadioGroup>
        </FormControl>
      </Paper>
    );
  }

}

export default PlantSelector;