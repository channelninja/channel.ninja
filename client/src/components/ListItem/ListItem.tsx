import React from "react";
import "./list-item.css";

function ListItem({ children }: { children: React.ReactNode }) {
  return <li className="list-item">{children}</li>;
}

export default ListItem;
