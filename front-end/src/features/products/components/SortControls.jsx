import { AppSelect } from '../../../components/ui/AppSelect.jsx';
import { Field } from '../../../components/ui/Field.jsx';
import { SORT_BY_OPTIONS, SORT_DIRECTION_OPTIONS } from '../../../lib/constants.js';

export function SortControls({ sortBy, sortDirection, onSortByChange, onSortDirectionChange }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Field label="Ordenar por">
        <AppSelect options={SORT_BY_OPTIONS} value={sortBy} onValueChange={onSortByChange} />
      </Field>
      <Field label="Ordem">
        <AppSelect options={SORT_DIRECTION_OPTIONS} value={sortDirection} onValueChange={onSortDirectionChange} />
      </Field>
    </div>
  );
}
