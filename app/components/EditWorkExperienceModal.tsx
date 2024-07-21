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
import { EditIcon, XIcon } from "lucide-react";
import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";

import { EditWorkExperienceSchema, Experience, PrintConfig } from "~/types";
import { createPrintConfiguration } from "~/lib/getPrintConfig";

export function EditWorkExperienceModal({
  resumeId,
  workExperience,
  onSuccess,
}: {
  resumeId: string;
  workExperience: Experience;
  onSuccess?: (experienceId: number) => void;
}) {
  const fetcher = useFetcher();
  const [isOpen, setIsOpen] = useState(false);

  const [form, fields] = useForm({
    id: "edit-work-experience",
    defaultValue: {
      ...workExperience,
      roles: workExperience.roles?.map((role) => ({
        ...role,
        startDate: new Date(role.startDate).toISOString().split("T")[0],
        endDate: role.endDate
          ? new Date(role.endDate).toISOString().split("T")[0]
          : undefined,
      })),
    },
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: EditWorkExperienceSchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    onSubmit(event, { formData }) {
      event.preventDefault();
      const maybePrintConfig = createPrintConfiguration();
      const parsedPrintConfig = PrintConfig.safeParse(maybePrintConfig);

      if (parsedPrintConfig.success) {
        formData.append("printConfig", JSON.stringify(parsedPrintConfig.data));
      }

      fetcher.submit(formData, {
        method: "POST",
        action: `/resume/${resumeId}/work-experience/${workExperience.id}/edit`,
      });
      setIsOpen(false);
      if (onSuccess) {
        onSuccess(workExperience.id);
      }
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="w-6 h-6">
          <EditIcon size={12} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Edit Work Experience at {workExperience.companyName}
          </DialogTitle>
        </DialogHeader>
        <fetcher.Form {...getFormProps(form)}>
          <div className="space-y-4 pb-4 px-2">
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
          <div className="flex justify-end space-x-2 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button>Save Changes</Button>
          </div>
        </fetcher.Form>
      </DialogContent>
    </Dialog>
  );
}
