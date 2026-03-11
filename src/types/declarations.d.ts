/**
 * 第三方库类型声明
 */

// react-native-chart-kit 类型补充
declare module 'react-native-chart-kit' {
  import { Component } from 'react';
  
  export interface ChartConfig {
    backgroundColor?: string;
    backgroundGradientFrom?: string;
    backgroundGradientTo?: string;
    decimalPlaces?: number;
    color?: (opacity?: number) => string;
    labelColor?: (opacity?: number) => string;
    style?: {
      borderRadius?: number;
    };
    propsForDots?: {
      r?: string;
      strokeWidth?: string;
      stroke?: string;
    };
  }

  export interface LineChartProps {
    data: {
      labels?: string[];
      datasets: Array<{
        data: number[];
        color?: (opacity?: number) => string;
        strokeWidth?: number;
      }>;
      legend?: string[];
    };
    width: number;
    height: number;
    chartConfig: ChartConfig;
    bezier?: boolean;
    style?: any;
  }

  export interface BarChartProps {
    data: {
      labels: string[];
      datasets: Array<{
        data: number[];
        color?: (opacity?: number) => string;
      }>;
      legend?: string[];
    };
    width: number;
    height: number;
    chartConfig: ChartConfig;
    style?: any;
    showValuesOnTopOfBars?: boolean;
    fromZero?: boolean;
    yAxisLabel?: string;
    yAxisSuffix?: string;
  }

  export class LineChart extends Component<LineChartProps> {}
  export class BarChart extends Component<BarChartProps> {}
}

// react-native-sqlite-storage 类型
declare module 'react-native-sqlite-storage' {
  export interface SQLiteDatabase {
    executeSql: (sql: string, params?: any[]) => Promise<[any]>;
    close: () => Promise<void>;
  }

  export function openDatabase(params: {
    name: string;
    location?: string;
  }): Promise<SQLiteDatabase>;

  export function enablePromise(enable: boolean): void;
}

// react-native-vector-icons 类型已在 @types/react-native-vector-icons 中定义
