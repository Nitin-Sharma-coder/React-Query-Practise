import { QueryClient, QueryClientProvider } from "react-query";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../reactquerypractise/Home/Home";
import Post from "../reactquerypractise/Post/Post";

const queryClient = new QueryClient();

const ReactQueryUsage = () => {
  return (
    <ChakraProvider>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            <Route path="/post/:id" exact element={<Post />} />
            <Route path="/:id" exact element={<Home />} />
          </Routes>
        </Router>
      </QueryClientProvider>
    </ChakraProvider>
  );
};

export default ReactQueryUsage;
