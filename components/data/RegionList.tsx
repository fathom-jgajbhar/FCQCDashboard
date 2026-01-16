import React, { useState } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { redirect } from "next/navigation";

export interface RegionListProps {
  data?: any;
}

export const RegionList: React.FC<RegionListProps> = ({ data }) => {
  const regions = data?.metadata?.dimensions?.region?.labels ?? [];
  const [page, setPage] = useState(1);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const rowsPerPage = 10;

  // Filter regions by search query
  const filteredRegions = regions.filter((region: string) =>
    region.toLowerCase().includes(search.toLowerCase()),
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filteredRegions.length / rowsPerPage),
  );
  const paginatedRegions = filteredRegions.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage,
  );

  // Reset to page 1 when search changes
  React.useEffect(() => {
    setPage(1);
  }, [search]);

  return (
    <Card className="w-full bg-foreground/0 rounded p-4">
      <CardHeader className="border-b-1 border-b-foreground-500 font-bold text-md flex flex-row justify-between items-baseline">
        <span>Select a region to Explore Further</span>
        <Input
          fullWidth={false}
          placeholder="Search regions..."
          size="sm"
          type="text"
          value={search}
          variant="underlined"
          width="md"
          onChange={(e) => setSearch(e.target.value)}
        />
      </CardHeader>
      <CardBody>
        <Table
          hideHeader
          removeWrapper
          aria-label="Region Table"
          selectedKeys={selectedRegion ? [selectedRegion] : []}
          selectionBehavior="toggle"
          selectionMode="single"
          onSelectionChange={(keys) => {
            const selected = Array.from(keys)[0];

            setSelectedRegion(selected as string);
            redirect(`/regions/${selected}`);
          }}
        >
          <TableHeader>
            <TableColumn key="name">Name</TableColumn>
          </TableHeader>
          <TableBody>
            {paginatedRegions.length > 0 ? (
              paginatedRegions.map((region: any) => (
                <TableRow key={region} className="p-0 hover:cursor-pointer">
                  <TableCell>{region}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell>No regions found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="flex justify-center items-center gap-4 mt-6">
          <Button
            className="min-w-[90px]"
            disabled={page === 1}
            size="sm"
            variant="flat"
            onPress={() => setPage(page - 1)}
          >
            Previous
          </Button>
          <span className="font-medium text-sm">
            Page {page} of {totalPages}
          </span>
          <Button
            className="min-w-[90px]"
            disabled={page === totalPages || totalPages === 0}
            size="sm"
            variant="flat"
            onPress={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};
