"use client";

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";

type ChartsProps = {
  data: {
    salesData: {
      month: string;
      totalSales: number;
    }[];
  };
};

export default function Charts({ data: { salesData } }: ChartsProps) {
  return (
    <ResponsiveContainer width='100%' height={350}>
      <BarChart data={salesData}>
        <XAxis
          dataKey='month'
          stroke='#888888'
          fontSize={12}
          tickLine={false}
          axisLine={true}
        />
        <YAxis tickFormatter={(value) => `£${value}`} fontSize={12} />
        <Bar
          dataKey='totalSales'
          fill='currentColor'
          radius={[2, 2, 0, 0]}
          className='fill-primary'
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
