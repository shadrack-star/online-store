//handle the search query state
import { useState } from "react";

export const useSearchQuery = () => {
  const [searchQuery, setSearchQuery] = useState("");
  return { searchQuery, setSearchQuery };
};

// productUtils.js since it's a JavaScript 
// file containing utility function and not a React component.