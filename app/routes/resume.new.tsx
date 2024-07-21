import { Form, useActionData, useNavigation } from "@remix-run/react";
import { json, redirect, ActionFunction } from "@remix-run/node";
import { PrismaClient } from "@prisma/client";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";

const prisma = new PrismaClient();

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  try {
    const resume = await prisma.resume.create({
      data: {
        fullName: data.fullName as string,
        jobTitle: data.jobTitle as string,
        email: data.email as string,
        phoneNumber: data.phoneNumber as string,
        websiteUrl: data.websiteUrl as string,
        githubUrl: data.githubUrl as string,
        twitterUrl: data.twitterUrl as string,
        linkedinUrl: data.linkedinUrl as string,
        introduction: data.introduction as string,
        buzzwords: data.buzzwords as string,
      },
    });

    return redirect(`/resume/${resume.id}`);
  } catch (error) {
    return json({ error: "Failed to create resume" }, { status: 400 });
  }
};

export default function NewResume() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();

  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Create New Resume</h1>
      <Form method="post" className="space-y-4">
        <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input type="text" id="fullName" name="fullName" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="jobTitle">Job Title</Label>
          <Input type="text" id="jobTitle" name="jobTitle" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input type="email" id="email" name="email" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input type="tel" id="phoneNumber" name="phoneNumber" />
        </div>
        <h2 className="text-xl font-semibold mb-4">Online Presence</h2>
        <div className="space-y-2">
          <Label htmlFor="websiteUrl">Website URL</Label>
          <Input type="url" id="websiteUrl" name="websiteUrl" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="githubUrl">GitHub URL</Label>
          <Input type="url" id="githubUrl" name="githubUrl" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="twitterUrl">Twitter URL</Label>
          <Input type="url" id="twitterUrl" name="twitterUrl" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
          <Input type="url" id="linkedinUrl" name="linkedinUrl" />
        </div>
        <h2 className="text-xl font-semibold mb-4">Professional Summary</h2>
        <div className="space-y-2">
          <Label htmlFor="introduction">Introduction</Label>
          <Textarea id="introduction" name="introduction" rows={4} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="buzzwords">Buzzwords (comma-separated)</Label>
          <Input type="text" id="buzzwords" name="buzzwords" />
        </div>

        <div className="flex justify-end mt-6">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Resume"}
          </Button>
        </div>
      </Form>
      {actionData?.error && (
        <p className="text-red-500 mt-4">{actionData.error}</p>
      )}
    </div>
  );
}
