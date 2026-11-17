import { useEffect, useRef, useState } from "react";

export const ReadsRefInRender = () => {
  const ref = useRef(0);
  return <div>{ref.current}</div>;
};

export const SetsStateInEffect = ({ value }: { value: string }) => {
  const [copy, setCopy] = useState(value);
  useEffect(() => {
    setCopy(value);
  }, [value]);
  return <div>{copy}</div>;
};
