import { useRef } from 'react';

let uniqueId = 0;
const getUniqueId = () => {
  uniqueId++
  return uniqueId.toString();
};

function useComponentId() {
  const idRef = useRef(getUniqueId());
  return idRef.current;
}

export default useComponentId;