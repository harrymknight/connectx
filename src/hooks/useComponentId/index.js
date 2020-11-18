import { useRef } from 'react';

let uniqueId = 0;
const getUniqueId = () => uniqueId++;

export default function useComponentId() {
  const idRef = useRef(getUniqueId());
  return idRef.current;
}