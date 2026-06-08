import { useFormStore } from '../../store/useFormStore';

interface Props {
  id: string;
  value?: string;
  onChange?: (value: string) => void;
  inputRef?: React.Ref<HTMLInputElement>;
}

function CountryAutocomplete({ id, value, onChange, inputRef }: Props) {
  const countries = useFormStore((s) => s.countries);
  const listId = `${id}-list`;
  return (
    <>
      <input
        id={id}
        name="country"
        list={listId}
        autoComplete="off"
        placeholder="Select a country..."
        ref={inputRef}
        value={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
      />
      <datalist id={listId}>
        {countries.map((c) => <option key={c} value={c} />)}
      </datalist>
    </>
  );
}

export default CountryAutocomplete;
