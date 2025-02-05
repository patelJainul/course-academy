"use client";
import RequiredLabelIcon from "@/components/icons/required-label";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { actionToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createCourseAction, updateCourseAction } from "../actions/courses";
import { courseSchema } from "../schemas/courses";

const CourseForm = ({
  course,
}: {
  course?: {
    id: string;
    name: string;
    description: string;
  };
}) => {
  const form = useForm<z.infer<typeof courseSchema>>({
    resolver: zodResolver(courseSchema),
    defaultValues: course ?? {
      name: "",
      description: "",
    },
  });
  const onSubmit = async (values: z.infer<typeof courseSchema>) => {
    const action = course
      ? updateCourseAction.bind(null, course.id)
      : createCourseAction;
    const data = await action(values);
    actionToast({ actionData: data });
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <>
              <FormItem>
                <FormLabel>
                  <RequiredLabelIcon /> Name
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            </>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <>
              <FormItem>
                <FormLabel>
                  <RequiredLabelIcon /> Description
                </FormLabel>
                <FormControl>
                  <Textarea {...field} className="min-h-20 resize-none" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </>
          )}
        />
        <div className="self-end">
          <Button disabled={form.formState.isSubmitting} type="submit">
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CourseForm;
