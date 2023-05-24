import { Heading, Stack, useToast } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { InputControl, SubmitButton, TextareaControl } from "formik-chakra-ui";
import React from "react";
import { useMutation, useQueryClient } from "react-query";
import { addNewPost, updatePost } from "../../api";

const AddNewPost = ({ isUpdate, id }) => {
  const toast = useToast();
  const cache = useQueryClient();
  const { isLoading, data, mutateAsync } = useMutation(
    isUpdate ? "updatePost" : "addNewPost",
    isUpdate ? updatePost : addNewPost,
    {
      onSuccess: () => {
        isUpdate
          ? cache.invalidateQueries(["post", id])
          : cache.invalidateQueries("posts");
      },
      onMutate: async (newPost) => {
        if (isUpdate) {
          await cache.cancelQueries("post");
          const previousPost = cache.getQueryData(["post", id]);
          cache.setQueryData(["post", id], (oldPost) => {
            console.log(oldPost);
            return { data: newPost };
          });
          return { previousPost };
        }
      },
      onError: (error, newPost, context) => {
        cache.setQueryData(["post", id], context.previousPost);
        toast({
          status: "error",
          title: error.message ? error.message : "Not Found",
        });
      },
      onSettled: () => {
        cache.invalidateQueries(["post", id]);
      },
    }
  );
  console.log(data);
  return (
    <div>
      <Formik
        initialValues={{ title: "", body: "" }}
        onSubmit={async (values) => {
          isUpdate
            ? await mutateAsync({ title: values.title, body: values.body, id })
            : await mutateAsync({ title: values.title, body: values.body });
        }}
      >
        <Form>
          <Stack my="4">
            <Heading fontSize="2xl" textAlign="center">
              {isUpdate ? "Update" : "Add New"} Post
            </Heading>
            <InputControl name="title" label="Title" />
            <TextareaControl name="body" label="Content" />
            <SubmitButton isLoading={isLoading}>
              {isUpdate ? "Update" : "Add New"} POST
            </SubmitButton>
          </Stack>
        </Form>
      </Formik>
    </div>
  );
};

export default AddNewPost;
