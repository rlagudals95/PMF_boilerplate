import type { FieldValues, Path, UseFormSetError } from "react-hook-form";

export const applyActionErrors = <TValues extends FieldValues>(
  setError: UseFormSetError<TValues>,
  errors?: Record<string, string[] | undefined>,
) => {
  Object.entries(errors ?? {}).forEach(([field, messages]) => {
    const [message] = messages ?? [];

    if (message) {
      setError(field as Path<TValues>, {
        message,
      });
    }
  });
};
