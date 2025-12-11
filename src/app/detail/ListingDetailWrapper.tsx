"use client";
import DetailClient from "@/components/listing-detail/DetailClient";
import Loading from "@/components/loading/Loading";
import { useSearchParams } from "next/navigation";

const ListingDetailsWrapper = () => {
  const params = useSearchParams();
  const id = params.get("id");
  const url = params.get("url");
  
  if (!id || !url) return <Loading loadingText={"Loading..."}/>;

  return <DetailClient id={id} url={url} />;
};

export default ListingDetailsWrapper;
