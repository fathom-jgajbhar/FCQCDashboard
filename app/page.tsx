"use client";
import { Warnings } from "@/components/data/Warnings";
import { Summary } from "@/components/data/Summary";
import { useEffect, useState } from "react";

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
      {/* You can use the fetched data here */}
    </div>
  );
}
