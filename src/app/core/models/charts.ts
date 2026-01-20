export type LineChartPoint = {
  name: string;   // usually year as string
  value: number;  // medals count
};
export type LineChartSeries = {
  name: string;           // country name
  series: LineChartPoint[];
};
