export const ValidationError = ({ error }: { error?: string }) => {
  return <span className="text-red-500">{error}</span>;
};
