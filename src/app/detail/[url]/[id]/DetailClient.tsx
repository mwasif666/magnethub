"use client";
import React from "react";

interface DetailClientProps {
  url: string;
  id: string;
}

const DetailClient: React.FC<DetailClientProps> = ({ url, id }) => {
  return (
    <div>
      <h1>Detail Page</h1>
      <p>URL Slug: {url}</p>
      <p>ID: {id}</p>
    </div>
  );
};

export default DetailClient;
