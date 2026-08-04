import React from 'react';
import { MapPin } from 'lucide-react';
import CustomSelect from './CustomSelect';
import { SUPPORTED_STATES } from '../config';

export default function RegionSelector({ selectedState, onSelectState }) {
  return (
    <CustomSelect
      label="Select State"
      value={selectedState}
      onChange={onSelectState}
      options={SUPPORTED_STATES}
      icon={MapPin}
    />
  );
}
