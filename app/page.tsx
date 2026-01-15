"use client";
import { useEffect, useState } from "react";

import { Warnings } from "@/components/data/Warnings";
import { Summary } from "@/components/data/Summary";
import { RegionList } from "@/components/data/RegionList";

export default function HomePage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      const data = await fetch("/api/data").then((res) => res.json());

      setData(data);
    }
    fetchData();
  }, []);

  return (
    <div className="items-center justify-start flex h-full w-full flex-col gap-4">
      <Warnings />
      <Summary data={data} />
      <RegionList data={data} />
    </div>
  );
}
