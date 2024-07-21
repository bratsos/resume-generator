import { json, ActionFunction, LoaderFunction } from "@remix-run/node";
import { PrismaClient } from "@prisma/client";
import { parseWithZod } from "@conform-to/zod";
import { EditWorkExperienceSchema, PrintConfig } from "~/types";

const prisma = new PrismaClient();

export const loader: LoaderFunction = async ({ params }) => {
  const { workExperienceId } = params;
  if (!workExperienceId) {
    return json({ error: "Work Experience ID is required" }, { status: 400 });
  }

  const workExperience = await prisma.workExperience.findUnique({
    where: { id: parseInt(workExperienceId) },
    include: { roles: true },
  });

  if (!workExperience) {
    return json({ error: "Work Experience not found" }, { status: 404 });
  }

  return json({ workExperience });
};

export const action: ActionFunction = async ({ request, params }) => {
  const { workExperienceId, resumeId } = params;
  if (!workExperienceId) {
    return json({ error: "Work Experience ID is required" }, { status: 400 });
  }

  if (!resumeId) {
    return json({ error: "Resume ID is required" }, { status: 400 });
  }

  const formData = await request.formData();
  const parsedData = parseWithZod(formData, {
    schema: EditWorkExperienceSchema,
  });

  const maybePrintConfigString = formData.get("printConfig");
  let printConfig: PrintConfig | undefined;

  if (maybePrintConfigString) {
    const maybePrintConfig = JSON.parse(maybePrintConfigString as string);
    const parsedPrintConfig = PrintConfig.safeParse(maybePrintConfig);

    if (parsedPrintConfig.success) {
      printConfig = parsedPrintConfig.data;
    }
  }

  if (parsedData.status !== "success") {
    return json({ error: parsedData.error }, { status: 400 });
  }

  const { companyName, logoUrl, description, roles = [] } = parsedData.value;

  if (printConfig) {
    await prisma.resume.update({
      where: { id: parseInt(resumeId) },
      data: { printConfig },
    });
  }

  const rolesWithParsedDates = roles.map((role) => ({
    ...role,
    startDate: new Date(role.startDate),
    endDate: role.endDate ? new Date(role.endDate) : null,
  }));

  const dbRoles = await prisma.role.findMany({
    where: { workExperienceId: parseInt(workExperienceId) },
  });

  if (rolesWithParsedDates.length === 0) {
    try {
      await prisma.workExperience.update({
        where: { id: parseInt(workExperienceId) },
        data: {
          companyName,
          logoUrl,
          description,
          roles: {
            deleteMany: {
              id: {
                in: dbRoles.map((role) => role.id) as number[],
              },
            },
          },
        },
      });

      return json({ success: true });
    } catch (error) {
      console.error("Error updating work experience", error);
      return json(
        { error: "Failed to update work experience" },
        { status: 400 }
      );
    }
  } else {
    const existingRoles = rolesWithParsedDates.filter((role) => role.id);

    const newRoles = rolesWithParsedDates.filter((role) => !role.id);

    try {
      const txs = [];
      for (const role of existingRoles) {
        if (!role.id) {
          continue;
        }

        txs.push(
          prisma.role.update({
            where: {
              id: role.id,
            },
            data: {
              jobTitle: role.jobTitle,
              location: role.location,
              startDate: role.startDate,
              endDate: role.endDate,
              responsibilities: role.responsibilities,
            },
          })
        );
      }

      await prisma.$transaction(txs);

      const updatedWorkExperience = await prisma.workExperience.update({
        where: { id: parseInt(workExperienceId) },
        data: {
          companyName,
          logoUrl,
          description,
          roles: {
            createMany: {
              data: newRoles.map((role) => ({
                ...role,
              })),
            },
          },
        },
        include: { roles: true },
      });
      return json({ success: true, workExperience: updatedWorkExperience });
    } catch (error) {
      console.error("Error updating work experience", error);
      return json(
        { error: "Failed to update work experience" },
        { status: 400 }
      );
    }
  }
};
