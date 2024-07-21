import { json, ActionFunction } from "@remix-run/node";
import { useLoaderData, useSubmit, Link } from "@remix-run/react";
import { PrismaClient } from "@prisma/client";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { MoreVertical, Plus } from "lucide-react";
import { ResumeSchema } from "~/types";

const prisma = new PrismaClient();

export const loader = async () => {
  const maybeResumes = await prisma.resume.findMany({
    select: { id: true, fullName: true, jobTitle: true, createdAt: true },
  });
  const resumes = ResumeSchema.pick({
    id: true,
    fullName: true,
    jobTitle: true,
    createdAt: true,
  })
    .array()
    .parse(maybeResumes);

  return json({ resumes });
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const action = formData.get("action");
  const resumeId = formData.get("resumeId");

  if (!resumeId || typeof resumeId !== "string") {
    return json({ error: "Invalid resume ID" }, { status: 400 });
  }

  try {
    switch (action) {
      case "delete":
        await prisma.resume.delete({ where: { id: parseInt(resumeId) } });
        return json({ success: true, action: "delete" });

      case "duplicate": {
        const maybeOriginalResume = await prisma.resume.findUnique({
          where: { id: parseInt(resumeId) },
          include: {
            experiences: {
              include: { roles: true },
            },
          },
        });

        if (!maybeOriginalResume) {
          return json({ error: "Resume not found" }, { status: 404 });
        }

        const originalResume = ResumeSchema.parse(maybeOriginalResume);

        const duplicatedResume = await prisma.resume.create({
          data: {
            fullName: `${originalResume.fullName} (Copy)`,
            jobTitle: originalResume.jobTitle,
            phoneNumber: originalResume.phoneNumber,
            email: originalResume.email,
            websiteUrl: originalResume.websiteUrl,
            githubUrl: originalResume.githubUrl,
            twitterUrl: originalResume.twitterUrl,
            linkedinUrl: originalResume.linkedinUrl,
            introduction: originalResume.introduction,
            buzzwords: originalResume.buzzwords,
            experiences: {
              create: originalResume.experiences.map((exp) => ({
                companyName: exp.companyName,
                logoUrl: exp.logoUrl,
                description: exp.description,
                roles: exp.roles
                  ? {
                      create: exp.roles.map((role) => ({
                        jobTitle: role.jobTitle,
                        location: role.location,
                        startDate: role.startDate,
                        endDate: role.endDate,
                        responsibilities: role.responsibilities,
                      })),
                    }
                  : undefined,
              })),
            },
            printConfig: originalResume.printConfig ?? undefined,
          },
        });

        return json({
          success: true,
          action: "duplicate",
          newResumeId: duplicatedResume.id,
        });
      }
      default:
        return json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error processing action:", error);
    return json({ error: "Failed to process action" }, { status: 500 });
  }
};

export default function Dashboard() {
  const { resumes } = useLoaderData<typeof loader>();
  const submit = useSubmit();

  const handleAction = (action: string, resumeId: number) => {
    const formData = new FormData();
    formData.append("action", action);
    formData.append("resumeId", resumeId.toString());
    submit(formData, { method: "post" });
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Resumes</h1>
        <Button>
          <Link to="/resume/new" className="flex gap-2 items-center">
            Add new
            <Plus className="mr-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {resumes.map((resume) => (
          <Card key={resume.id}>
            <CardHeader>
              <CardTitle>{resume.fullName}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{resume.jobTitle}</p>
              <p className="text-sm text-gray-500">
                Created: {new Date(resume.createdAt).toLocaleDateString()}
              </p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">
                <Link to={`/resume/${resume.id}`}>View</Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onSelect={() => handleAction("duplicate", resume.id)}
                  >
                    Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => handleAction("delete", resume.id)}
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
