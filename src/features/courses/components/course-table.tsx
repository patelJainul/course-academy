import ActionButton from "@/components/action-button";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatPlural } from "@/lib/formatters";
import { Trash2Icon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { deleteCourseAction } from "../actions/courses";

const CourseTable = ({
  courses,
}: {
  courses: {
    id: string;
    name: string;
    description: string;
    sectionCount: number;
    lessonCount: number;
    studentCount: number;
  }[];
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>
            {formatPlural(courses.length, {
              singular: "course",
              plural: "courses",
            })}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {courses.map((course) => (
          <TableRow key={course.id}>
            <TableCell>
              <div className="flex flex-col gap-1">
                <div className="font-semibold">{course.name}</div>
                <div className="text-muted-foreground">
                  {formatPlural(course.sectionCount, {
                    plural: "sections",
                    singular: "section",
                  })}{" "}
                  •{" "}
                  {formatPlural(course.lessonCount, {
                    plural: "lessons",
                    singular: "lesson",
                  })}
                </div>
              </div>
            </TableCell>
            <TableCell>{course.studentCount}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button asChild>
                  <Link href={`/admin/courses/${course.id}/edit`}>Edit</Link>
                </Button>
                <ActionButton
                  variant={"destructiveOutline"}
                  action={deleteCourseAction.bind(null, course.id)}
                  requireAreYouSure
                >
                  <Trash2Icon />
                  <span className="sr-only">delete</span>
                </ActionButton>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default CourseTable;
