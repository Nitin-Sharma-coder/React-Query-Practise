import { useMutation, useQuery, useQueryClient } from "react-query";

import React from "react";
import {
  Button,
  Container,
  Flex,
  Grid,
  Heading,
  Spinner,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AddNewPost from "./component/AddNewPost";
import { deletePost, fetchPosts } from "../api/index";

const Home = () => {
  const { id } = useParams();
  const history = useNavigate();
  console.log(id);
  const cache = useQueryClient();
  const pageId = parseInt(id);

  const toast = useToast();
  const { data, isLoading } = useQuery(
    ["posts", pageId],
    () => fetchPosts(pageId),
    {
      keepPreviousData: true,
      onError: (error) => {
        toast({ status: "error", title: error.message });
      },
    }
  );

  const { isLoading: isMutating, mutateAsync } = useMutation(
    "deletePost",
    deletePost,
    {
      onError: (error) => {
        toast({ status: "error", title: error.message });
      },
      onSuccess: () => {
        cache.invalidateQueries("posts");
      },
    }
  );
  return (
    <Container maxW="1300px" mt="4">
      {isLoading ? (
        <Grid placeItems="center" height="100vh">
          <Spinner />
        </Grid>
      ) : (
        <>
          <AddNewPost />
          <Flex justify="space-between" mb="4">
            <Button
              colorScheme="red"
              onClick={() => {
                if (data.meta.pagination.links.previous !== null) {
                  history(`/${pageId - 1}`);
                }
              }}
              disabled={!data.meta.pagination.links.previous !== null}
            >
              Prev
            </Button>

            <Text>Current Page : {pageId}</Text>
            <Button
              colorScheme="green"
              onClick={() => {
                history(`/${pageId + 1}`);
              }}
            >
              {" "}
              Next
            </Button>
          </Flex>
          {data.data.map((post) => (
            <Stack
              key={post.id}
              p="4"
              boxShadow="md"
              borderRadius="xl"
              border="1px solid #ccc"
              mb="4"
            >
              <Flex justify="flex-end">
                <Button
                  size={"sm"}
                  colorScheme="orange"
                  isLoading={isMutating}
                  onClick={async () => await mutateAsync({ id: post.id })}
                >
                  Delete
                </Button>
              </Flex>
              <Link to={`/post/${post.id}`}>
                <Stack>
                  <Flex justify="space-between">
                    <Text>UserId: {post.user_id}</Text>
                    <Text>PostId: {post.id}</Text>
                  </Flex>
                  <Heading fontSize="2xl">{post.title}</Heading>
                  <Text>{post.body}</Text>
                </Stack>
              </Link>
            </Stack>
          ))}
        </>
      )}
    </Container>
  );
};

export default Home;
