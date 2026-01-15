import { Card, CardBody, CardHeader } from "@heroui/card";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";

export interface SummaryProps {
  data?: any;
}

export const Summary: React.FC<SummaryProps> = ({ data }) => {
  // Prepare summary values
  const regionsCount = data?.region?.length ?? 0;
  const forecastDaysCount = data?.date?.length ?? 0;
  const firstDate = data?.date?.[0]?.label?.[0] ?? "Date unavailable";
  const lastDate =
    data?.date?.[data?.date?.length - 1]?.label?.[0] ?? "Date unavailable";
  const variables =
    data?.metadata?.variables
      ?.map((v: any) => v.name.toUpperCase())
      .join(", ") ?? "Unavailable";

  // Table items
  const items = [
    { key: "regions", label: "Regions", value: regionsCount },
    { key: "forecast_days", label: "Forecast Days", value: forecastDaysCount },
    { key: "first_date", label: "First Date", value: firstDate },
    { key: "last_date", label: "Last Date", value: lastDate },
    {
      key: "variables",
      label: `Variables (${data?.metadata?.variables?.length ?? 0})`,
      value: variables,
    },
  ];

  return (
    <Card className="w-full bg-foreground/5 rounded p-4">
      <CardHeader className="border-b-1 border-b-foreground-500 font-bold text-md">
        Summary
      </CardHeader>
      <CardBody>
        <Table hideHeader isStriped removeWrapper aria-label="Summary Table">
          <TableHeader>
            <TableColumn key="name">Name</TableColumn>
            <TableColumn key="value">Value</TableColumn>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.key}>
                <TableCell>{item.label}</TableCell>
                <TableCell>{item.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardBody>
    </Card>
  );
};
