import React, { useEffect } from "react";
import { useSelector } from "react-redux";

export const Controls = () => {
  const isLogged = useSelector((state) => state.logged);

  useEffect(() => {}, []);

  return <></>;
};
