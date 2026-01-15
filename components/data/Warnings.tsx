import { Card, CardHeader, CardBody } from "@heroui/card";
export const Warnings: React.FC = () => {
  // placeholder for future warnings component
  return (
    <Card className="w-full p-4 bg-warning-400 dark:bg-warning-600 text-black rounded">
      <CardHeader className="border-b-1 border-b-warning">
        <h2 className="font-bold text-md">Warnings</h2>
      </CardHeader>
      <CardBody>
        <p>No warnings to display.</p>
      </CardBody>
    </Card>
  );
};
