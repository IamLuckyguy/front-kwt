import './explorer.css';
import React from "react";

export default function ExplorerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="explorer-layout">{children}</div>;
}
