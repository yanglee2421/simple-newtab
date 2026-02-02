export const calc = (
  totalWidth: number,
  columns: number,
  span: number,
  columnSpacing: number,
) => {
  const noSpacingWidth = (totalWidth * span) / columns;
  const spacingWidth = (columns - span) * (columnSpacing / columns);

  return noSpacingWidth - spacingWidth;
};
