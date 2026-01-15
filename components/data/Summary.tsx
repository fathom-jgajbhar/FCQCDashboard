import { Card, CardBody, CardHeader } from "@heroui/card";
import { useEffect } from "react";

export interface SummaryProps {
  data?: any; 
}

export const Summary: React.FC<SummaryProps> = ({
  data,
}) => {
  const firstDate = data?.date[0].label[0] ?? "Date unavailable";
  const lastDate = data?.date[data?.date.length - 1].label[0]

  return (
    <Card className="w-full p-4 bg-foreground/5 rounded">
      <CardHeader className="border-b-1 border-b-foreground/10">
        <h2 className="font-bold text-md">Summary</h2>
      </CardHeader>
      <CardBody className="w-full h-full flex flex-col gap-2 items-baseline justify-between text-sm">
        <div>Regions : {data ? data.region.length : 0}</div>
        <div className="flex flex-row justify-between w-full"><span>Forecast days : {data ? data.date.length : 0}</span>
          <div>
                   First date: {firstDate}
                 </div>
                 <div>
                   Last date: {lastDate}
                 </div>
        </div>
        <div className="flex flex-row gap-2 items-center justify-center">
          <span>Variables({data?.metadata.variables.length}) :</span>
          {/*<span>{data?.metadata.variables[0]?.name ?? "Unavailable"}</span>*/}
          {data?.metadata.variables.map((variable: any, index: number) => (
            <span>{variable.name.toUpperCase()}{index < data?.metadata.variables.length - 1 ? "," : ""}</span>
          ),)}
        </div>
      </CardBody>
    </Card>
  )
};