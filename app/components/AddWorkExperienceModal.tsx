import { useState } from "react";
import { useFetcher } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { PlusCircleIcon, XIcon } from "lucide-react";
import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";

import { AddWorkExperienceSchema } from "~/types";

export function AddWorkExperienceModal({
  resumeId,
  onSuccess,
}: {
  resumeId: string;
  onSuccess?: (experience: AddWorkExperienceSchema) => void;
}) {
  const fetcher = useFetcher();
  const [isOpen, setIsOpen] = useState(false);

  const [form, fields] = useForm({
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: AddWorkExperienceSchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    onSubmit(event, { formData, submission }) {
      event.preventDefault();
      fetcher.submit(formData, {
        method: "POST",
        action: `/resume/${resumeId}/work-experience/new`,
      });
      setIsOpen(false);
      if (onSuccess && submission?.status === "success") {
        onSuccess(submission.value);
      }
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="icon" className="w-6 h-6">
          <PlusCircleIcon size={12} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Work Experience</DialogTitle>
        </DialogHeader>
        <fetcher.Form {...getFormProps(form)}>
          <div className="overflow-y-auto max-h-[80vh] space-y-4 pb-4 px-2 flex flex-col gap-2">
            <div>
              <Label htmlFor={fields.companyName.id}>Company Name</Label>
              <Input {...getInputProps(fields.companyName, { type: "text" })} />
              <div>{fields.companyName.errors}</div>
            </div>
            <div>
              <Label htmlFor={fields.logoUrl.id}>
                Company Logo URL (optional)
              </Label>
              <Input {...getInputProps(fields.logoUrl, { type: "url" })} />
              <div>{fields.logoUrl.errors}</div>
            </div>
            <div>
              <Label htmlFor={fields.description.id}>
                Company Description (optional)
              </Label>
              <Textarea
                {...getInputProps(fields.description, { type: "text" })}
              />
              <div>{fields.description.errors}</div>
            </div>
            <h3 className="text-lg font-semibold mt-4">Roles</h3>
            {fields.roles.getFieldList().map((role, roleIndex) => {
              const roleFields = role.getFieldset();

              return (
                <div key={role.key} className="border p-4 rounded-md space-y-2">
                  <Input
                    {...getInputProps(roleFields.id, { type: "hidden" })}
                  />
                  <div>
                    <Label htmlFor={roleFields.jobTitle.id}>Job Title</Label>
                    <Input
                      {...getInputProps(roleFields.jobTitle, { type: "text" })}
                    />
                    <div>{roleFields.jobTitle.errors}</div>
                  </div>
                  <div>
                    <Label htmlFor={roleFields.location.id}>Location</Label>
                    <Input
                      {...getInputProps(roleFields.location, { type: "text" })}
                    />
                    <div>{roleFields.location.errors}</div>
                  </div>
                  <div>
                    <Label htmlFor={roleFields.startDate.id}>Start Date</Label>
                    <Input
                      {...getInputProps(roleFields.startDate, { type: "date" })}
                    />
                    <div>{roleFields.startDate.errors}</div>
                  </div>
                  <div>
                    <Label htmlFor={roleFields.endDate.id}>
                      End Date (leave blank if current)
                    </Label>
                    <Input
                      {...getInputProps(roleFields.endDate, { type: "date" })}
                    />
                    <div>{roleFields.endDate.errors}</div>
                  </div>
                  <div className="space-y-2">
                    <Label>Responsibilities</Label>
                    {roleFields.responsibilities
                      .getFieldList()
                      .map((responsibility, respIndex) => (
                        <div
                          key={responsibility.key}
                          className="flex items-center space-x-2"
                        >
                          <Input
                            {...getInputProps(responsibility, { type: "text" })}
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            {...form.remove.getButtonProps({
                              name: roleFields.responsibilities.name,
                              index: respIndex,
                            })}
                          >
                            <XIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    <Button
                      variant="outline"
                      {...form.insert.getButtonProps({
                        name: roleFields.responsibilities.name,
                        defaultValue: "",
                      })}
                    >
                      Add Responsibility
                    </Button>
                  </div>
                  <Button
                    variant="destructive"
                    {...form.remove.getButtonProps({
                      name: fields.roles.name,
                      index: roleIndex,
                    })}
                  >
                    Remove Role
                  </Button>
                </div>
              );
            })}
            <Button
              {...form.insert.getButtonProps({
                name: fields.roles.name,
                defaultValue: {
                  jobTitle: "",
                  location: "",
                  startDate: "",
                  endDate: "",
                  responsibilities: [""],
                },
              })}
            >
              Add Role
            </Button>
          </div>
          <Button type="submit">Add Work Experience</Button>
        </fetcher.Form>
      </DialogContent>
    </Dialog>
  );
}
