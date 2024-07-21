import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Resume, Role } from "~/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sortExperiencesByEarliestStartDate(resume: Resume) {
  const sortedExperiences = [...resume.experiences];

  sortedExperiences.sort((a, b) => {
    const aEarliestDate = findEarliestStartDate(a.roles ?? []);
    const bEarliestDate = findEarliestStartDate(b.roles ?? []);

    return bEarliestDate.getTime() - aEarliestDate.getTime();
  });

  return {
    ...resume,
    experiences: sortedExperiences,
  };
}

function findEarliestStartDate(roles: Role[]) {
  return roles.reduce((earliest, role) => {
    const startDate = new Date(role.startDate);
    return startDate < earliest ? startDate : earliest;
  }, new Date(roles[0].startDate));
}
