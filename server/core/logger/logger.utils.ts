export const formatters = {
  level: (label: string, value: number) => {
    return { level: label.toUpperCase(), levelValue: value };
  },
};
