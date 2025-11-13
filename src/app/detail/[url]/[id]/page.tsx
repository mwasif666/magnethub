import DetailClient from "./DetailClient";
import listing from "../../../../../data/listing.json";

export async function generateStaticParams() {
  return listing.map((item: any) => ({
    url: item.url,   
    id: item.id.toString(), 
  }));
}

interface DetailPageProps {
  params: {
    url: string;
    id: string;
  };
}

export default async function DetailPage({ params }: DetailPageProps) {
  const resolvedParams = await params;
  return <DetailClient url={resolvedParams.url} id={resolvedParams.id} />;
}
