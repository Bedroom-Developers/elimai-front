export const ValidationError = ({ error, dataTestId }: { error?: string, dataTestId?: string }) => {
  return <span className="text-red-500 text-xs" data-testid={dataTestId}>{error}</span>;
};
