'use client';

import { useState } from 'react';
import './wall-header.scss';
import Button from '../ui/Button/Button';
import { useApp } from '@/context/AppContext';

export default function WallHeader() {
  const { title } = useApp();
  const [filtersLabel, setFiltersLabel] = useState('Show Filters');
  const { toggleIsFiltersVisible } = useApp();

  const toggleAsideFilters = () => {
    toggleIsFiltersVisible();
    setFiltersLabel(prevState => prevState === 'Show Filters' ? 'Hide Filters' : 'Show Filters');
  };

  return (
    <div className="wall-header">
      <div className='blank-div'>{ }</div>
      <div>{title}</div>
      <Button variant="outline" className="toggle-filters-button" onClick={toggleAsideFilters}>{filtersLabel}</Button>

    </div>
  );
}