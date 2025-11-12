import DetailClient from "./DetailClient";

interface DetailPageProps {
  params: {
    url: string;
    id: string;
  };
}

export default function DetailPage({ params }: DetailPageProps) {
  return <DetailClient url={params.url} id={params.id} />;
}
