import { ImageIcon } from '@radix-ui/react-icons';
import { AppButton } from '../../../components/ui/AppButton.jsx';
import { Field } from '../../../components/ui/Field.jsx';

export function ImageUploadInput({ previewUrl, currentImageUrl, onFileChange, onClear }) {
  const imageToShow = previewUrl || currentImageUrl;

  return (
    <Field label="Imagem do produto" hint="A imagem será enviada para o servidor antes de salvar o produto.">
      <div className="rounded-2xl bg-slate-50/80 p-4 shadow-[0_8px_22px_-18px_rgba(15,23,42,0.14)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <label className="flex-1">
            <span className="sr-only">Selecionar imagem</span>
            <input
              className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-emerald-600 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-emerald-700"
              type="file"
              accept=".jpg,.jpeg,.png"
              onChange={(event) => onFileChange(event.target.files?.[0] ?? null)}
            />
          </label>

          {imageToShow ? (
            <AppButton tone="secondary" type="button" onClick={onClear}>
              Remover
            </AppButton>
          ) : null}
        </div>

        <div className="mt-4 overflow-hidden rounded-2xl bg-white shadow-[0_8px_22px_-18px_rgba(15,23,42,0.14)]">
          {imageToShow ? (
            <img className="h-48 w-full object-cover" src={imageToShow} alt="Pré-visualização do produto" />
          ) : (
            <div className="flex h-48 items-center justify-center gap-3 text-sm text-slate-500">
              <ImageIcon className="h-5 w-5" />
              Nenhuma imagem selecionada
            </div>
          )}
        </div>
      </div>
    </Field>
  );
}
