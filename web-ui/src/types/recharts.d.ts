declare module 'recharts' {
  import { ComponentType, ReactNode } from 'react';

  export interface LineChartProps {
    data?: any[];
    margin?: {
      top?: number;
      right?: number;
      bottom?: number;
      left?: number;
    };
    children?: ReactNode;
  }

  export interface LineProps {
    type?: 'basis' | 'basisClosed' | 'basisOpen' | 'linear' | 'linearClosed' | 'natural' | 'monotoneX' | 'monotoneY' | 'monotone' | 'step' | 'stepBefore' | 'stepAfter';
    dataKey: string;
    stroke?: string;
    strokeWidth?: number;
    dot?: boolean | object;
    activeDot?: boolean | object;
  }

  export interface CartesianGridProps {
    strokeDasharray?: string;
    stroke?: string;
  }

  export interface XAxisProps {
    dataKey?: string;
    stroke?: string;
    fontSize?: number;
    tickLine?: boolean;
  }

  export interface YAxisProps {
    stroke?: string;
    fontSize?: number;
    tickLine?: boolean;
    axisLine?: boolean;
  }

  export interface TooltipProps {
    contentStyle?: object;
  }

  export const LineChart: ComponentType<LineChartProps>;
  export const Line: ComponentType<LineProps>;
  export const CartesianGrid: ComponentType<CartesianGridProps>;
  export const XAxis: ComponentType<XAxisProps>;
  export const YAxis: ComponentType<YAxisProps>;
  export const Tooltip: ComponentType<TooltipProps>;
  export const ResponsiveContainer: ComponentType<{
    width?: string | number;
    height?: string | number;
    children?: ReactNode;
  }>;
} 