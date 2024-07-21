import { GithubIcon, EarthIcon, TwitterIcon, LinkedinIcon } from "lucide-react";
import { ResumeHeaderProps } from "~/types";

export function ResumeHeader({
  fullName,
  jobTitle,
  phoneNumber,
  email,
  websiteUrl,
  githubUrl,
  twitterUrl,
  linkedinUrl,
}: ResumeHeaderProps) {
  return (
    <header className="bg-teal-600 text-white py-6 ">
      <div className="flex justify-between w-11/12 m-auto max-w-screen-lg">
        <div className="flex flex-col items-start justify-center">
          <h1 className="text-2xl">{fullName}</h1>
          <p className="-mt-1 font-thin">{jobTitle}</p>
        </div>
        <div className="text-right flex flex-col">
          <div className="flex flex-col">
            <a className="text-sm" href={`tel:${phoneNumber}`}>
              tel: {phoneNumber}
            </a>
            <a className="text-sm" href={`mailto:${email}`}>
              email: {email}
            </a>
          </div>
          <div className="flex justify-end mt-4 space-x-4">
            {websiteUrl && (
              <a
                href={websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm hover:underline flex items-center gap-2"
              >
                <div className="flex items-center justify-center bg-white rounded-full p-[2px]">
                  <EarthIcon size={12} className="text-teal-600" />
                </div>
                {new URL(websiteUrl).hostname}
              </a>
            )}
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm hover:underline flex items-center gap-2"
              >
                <div className="flex items-center justify-center bg-white rounded-full p-[2px]">
                  <GithubIcon size={12} className="text-teal-600" />
                </div>
                /{githubUrl.split("/").pop()}
              </a>
            )}
            {twitterUrl && (
              <a
                href={twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm hover:underline flex items-center gap-2"
              >
                <div className="flex items-center justify-center bg-white rounded-full p-[2px]">
                  <TwitterIcon size={12} className="text-teal-600" />
                </div>
                /{twitterUrl.split("/").pop()}
              </a>
            )}
            {linkedinUrl && (
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm hover:underline flex items-center gap-2"
              >
                <div className="flex items-center justify-center bg-white rounded-full p-[2px]">
                  <LinkedinIcon size={12} className="text-teal-600" />
                </div>
                /{linkedinUrl.split("/").pop()}
              </a>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
