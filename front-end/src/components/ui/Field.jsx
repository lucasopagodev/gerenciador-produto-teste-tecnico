export function Field({ label, error, hint, required = false, children }) {
  return (
    <label className="block space-y-2.5">
      {label ? (
        <span className="label-text">
          {label}
          {required ? <span className="ml-1 text-red-600">*</span> : null}
        </span>
      ) : null}
      {children}
      {error ? <p className="error-text">{error}</p> : null}
      {!error && hint ? <p className="hint-text">{hint}</p> : null}
    </label>
  );
}
