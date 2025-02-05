import PageHeader from "@/components/page-header";
import { Button } from "@/components/ui/button";
import CourseTable from "@/features/courses/components/course-table";
import { getCourseList } from "@/features/courses/db/courses";
import Link from "next/link";

const CoursesPage = async () => {
  const courses = await getCourseList();
  return (
    <div className="container my-6">
      <PageHeader title="Courses">
        <Button asChild>
          <Link href={"/admin/courses/new"}>New Course</Link>
        </Button>
      </PageHeader>
      <CourseTable courses={courses} />
    </div>
  );
};

export default CoursesPage;
