import { json, ActionFunction } from "@remix-run/node";
import { PrismaClient } from "@prisma/client";
import { parseWithZod } from "@conform-to/zod";
import { AddWorkExperienceSchema } from "~/types";

const prisma = new PrismaClient();

export const action: ActionFunction = async ({ request, params }) => {
  const resumeId = params.resumeId;

  if (!resumeId) {
    return json({ error: "Resume ID is required" }, { status: 400 });
  }

  const formData = await request.formData();

  const parsedData = parseWithZod(formData, {
    schema: AddWorkExperienceSchema,
  });

  if (parsedData.status !== "success") {
    return json({ error: parsedData.error }, { status: 400 });
  }

  const { companyName, logoUrl, description, roles = [] } = parsedData.value;

  const rolesWithParsedDates = roles.map((role) => ({
    ...role,
    startDate: new Date(role.startDate),
    endDate: role.endDate ? new Date(role.endDate) : null,
  }));

  try {
    const workExperience = await prisma.workExperience.create({
      data: {
        companyName,
        logoUrl,
        description,
        resumeId: parseInt(resumeId),
        roles: {
          create: rolesWithParsedDates,
        },
      },
      include: {
        roles: true,
      },
    });

    return json({ success: true, workExperience });
  } catch (error) {
    return json({ error: "Failed to add work experience" }, { status: 400 });
  }
};
