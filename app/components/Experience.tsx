import { AddWorkExperienceModal } from "~/components/AddWorkExperienceModal";
import { EditWorkExperienceModal } from "~/components/EditWorkExperienceModal";
import { ExperienceSectionProps } from "~/types";
import { cn } from "~/lib/utils";
import { DeleteExperience } from "./DeleteExperience";

function CompanyIconThumbnail({
  logoUrl,
  companyName,
}: {
  logoUrl: string;
  companyName: string;
}) {
  return (
    <img src={logoUrl} alt={companyName} className="w-4 h-4 object-contain" />
  );
}

export function Experience({
  resumeId,
  experiences,
  onAddExperience,
  onEditExperience,
}: ExperienceSectionProps) {
  return (
    <section className="w-11/12 m-auto max-w-screen-lg py-8 experience-wrapper">
      <h2 className="text-2xl font-semibold flex items-center gap-4">
        Experience
        <AddWorkExperienceModal
          resumeId={resumeId}
          onSuccess={(addedExperience) => onAddExperience(addedExperience)}
        />
      </h2>
      {experiences.map((experience, idx) => {
        const isLast = idx === experiences.length - 1;

        const safeRoles = experience.roles || [];
        return (
          <>
            <div
              key={experience.id}
              className={cn("my-8 flex flex-col experience-item-wrapper")}
              data-experience-id={experience.id}
            >
              <div className="flex items-start justify-between mb-4 gap-24">
                <div
                  className="flex items-start flex-[0_0_30%] sticky top-4 print:static company-info-wrapper"
                  data-company-info-id={`company-info-${experience.id}`}
                >
                  <div>
                    <p className="text-sm text-gray-600 font-bold flex items-center gap-2 mb-2">
                      {experience.logoUrl && (
                        <CompanyIconThumbnail
                          logoUrl={experience.logoUrl}
                          companyName={experience.companyName}
                        />
                      )}
                      {experience.companyName}
                      <EditWorkExperienceModal
                        resumeId={resumeId}
                        workExperience={experience}
                        onSuccess={() => onEditExperience(experience.id)}
                        key={JSON.stringify(experience)}
                      />
                      <DeleteExperience
                        resumeId={resumeId}
                        experienceId={experience.id}
                        companyName={experience.companyName}
                      />
                    </p>
                    <p className="text-xs text-gray-500">
                      {experience.description}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col flex-1 roles-wrapper">
                  {safeRoles.map((role, idx) => {
                    const isLast = idx === safeRoles.length - 1;

                    return (
                      <>
                        <div
                          key={role.id}
                          className={cn(
                            "my-6 flex flex-col break-inside-avoid role-item"
                          )}
                          data-role-id={role.id}
                        >
                          <div className="flex flex-col justify-between items-baseline mb-2">
                            <h3 className="text-lg font-semibold mb-2">
                              {role.jobTitle}
                            </h3>
                            <div className="">
                              <p className="flex items-center gap-2 text-sm text-gray-600 font-semibold">
                                {experience.logoUrl && (
                                  <CompanyIconThumbnail
                                    logoUrl={experience.logoUrl}
                                    companyName={experience.companyName}
                                  />
                                )}
                                {experience.companyName} - {role.location}
                              </p>
                            </div>
                          </div>
                          <p className="text-xs text-gray-400 mb-4 font-semibold">
                            {role.startDate} - {role.endDate || "Present"}
                          </p>
                          <ul className="list-disc list-inside">
                            {role.responsibilities?.map((resp, idx) => (
                              <li key={idx} className="text-sm mb-1">
                                {resp}
                              </li>
                            ))}
                          </ul>
                        </div>
                        {!isLast && <hr className="border-t border-gray-200" />}
                      </>
                    );
                  })}
                </div>
              </div>
            </div>
            {!isLast && <hr className="border-t border-gray-300" />}
          </>
        );
      })}
    </section>
  );
}
