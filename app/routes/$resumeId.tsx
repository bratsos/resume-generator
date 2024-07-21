import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useRevalidator } from "@remix-run/react";
import { PrismaClient } from "@prisma/client";
import { ResumeHeader } from "~/components/ResumeHeader";
import { IntroAndBuzzwords } from "~/components/IntroAndBuzzwords";
import { Experience } from "~/components/Experience";
import { ExperienceSchema, Resume } from "~/types";
import { sortExperiencesByEarliestStartDate } from "~/lib/utils";

const prisma = new PrismaClient();

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const resume = (await prisma.resume.findUnique({
    where: { id: Number(params.resumeId) },
    include: {
      experiences: {
        include: { roles: true },
      },
    },
  })) as Resume | null;

  if (!resume) {
    throw new Response("Resume not found", { status: 404 });
  }

  const resumeWithsortedExperiences =
    sortExperiencesByEarliestStartDate(resume);

  return json({
    resume: resumeWithsortedExperiences,
  });
};

export const getFormattedExperiences = (experiences: ExperienceSchema[]) => {
  return experiences.map((experience) => ({
    ...experience,
    roles: experience.roles?.map((role) => ({
      ...role,
      responsibilities: role.responsibilities?.map((r) => r.trim()),
      startDate: new Date(role.startDate).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      }),
      endDate: role.endDate
        ? new Date(role.endDate).toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          })
        : null,
    })),
  }));
};

export default function ResumeShow() {
  const { resume } = useLoaderData<typeof loader>();
  const refetchLoader = useRevalidator();
  const buzzwordsList = resume.buzzwords
    .split(",")
    .map((word: string) => word.trim());

  const formattedExperiences = getFormattedExperiences(resume.experiences);

  const refreshResume = async () => refetchLoader.revalidate();

  return (
    <div>
      <div className="w-full resume-preview print:hidden">
        {/* Header */}
        <ResumeHeader
          fullName={resume.fullName}
          jobTitle={resume.jobTitle}
          phoneNumber={resume.phoneNumber || ""}
          email={resume.email}
          websiteUrl={resume.websiteUrl || ""}
          githubUrl={resume.githubUrl || ""}
          twitterUrl={resume.twitterUrl || ""}
          linkedinUrl={resume.linkedinUrl || ""}
        />

        {/* Introduction */}
        <IntroAndBuzzwords
          introduction={resume.introduction}
          buzzwords={buzzwordsList}
        />

        <Experience
          resumeId={resume.id.toString()}
          experiences={formattedExperiences}
          onAddExperience={() => refreshResume()}
          onEditExperience={() => {
            refreshResume();
          }}
        />
      </div>
      <div className="print-wrapper hidden print:block">
        {resume.printConfig?.pages.map((page, idx) => {
          const maybeExperiences = page.contents.map(
            ({ experienceId, rolesIds }) => {
              const experienceData = resume.experiences.find(
                (e) => e.id === Number(experienceId)
              );
              if (!experienceData) {
                return null;
              }

              const formattedExperience = getFormattedExperiences([
                experienceData,
              ])[0];

              const roleIds = rolesIds.map((roleId) => Number(roleId));

              return {
                ...formattedExperience,
                roles: formattedExperience?.roles?.filter((role) =>
                  roleIds.includes(role.id)
                ),
              };
            }
          );
          const experiences = ExperienceSchema.array().parse(maybeExperiences);

          return (
            <div key={idx} className="page-break break-inside-avoid-page">
              <div className="w-full">
                <ResumeHeader
                  fullName={resume.fullName}
                  jobTitle={resume.jobTitle}
                  phoneNumber={resume.phoneNumber || ""}
                  email={resume.email}
                  websiteUrl={resume.websiteUrl || ""}
                  githubUrl={resume.githubUrl || ""}
                  twitterUrl={resume.twitterUrl || ""}
                  linkedinUrl={resume.linkedinUrl || ""}
                />

                {idx === 0 && (
                  <>
                    <IntroAndBuzzwords
                      introduction={resume.introduction}
                      buzzwords={buzzwordsList}
                    />
                  </>
                )}

                <Experience
                  resumeId={resume.id.toString()}
                  experiences={experiences}
                  onAddExperience={() => {}}
                  onEditExperience={() => {}}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
