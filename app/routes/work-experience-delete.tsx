import { ActionFunction, json, redirect } from "@remix-run/node";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const action: ActionFunction = async ({ params }) => {
  const { resumeId, workExperienceId } = params;

  if (!resumeId || !workExperienceId) {
    return json({ error: "Invalid parameters" }, { status: 400 });
  }

  try {
    await prisma.workExperience.delete({
      where: { id: parseInt(workExperienceId) },
    });

    return redirect(`/resume/${resumeId}`);
  } catch (error) {
    console.error("Error deleting work experience:", error);
    return json({ error: "Failed to delete work experience" }, { status: 500 });
  }
};
