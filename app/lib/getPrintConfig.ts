import { PrintConfigContent } from "~/types";

type Opts = {
  pagePadding?: number;
  paperWidthPt?: number;
  paperHeightPt?: number;
  emptySpaceTop?: number;
};

const defaultConfig = {
  pages: [],
};

export function createPrintConfiguration(options: Opts = {}) {
  const A4_WIDTH_PT = options.paperWidthPt ?? 210.276; // 210mm in points
  const A4_HEIGHT_PT = options.paperHeightPt ?? 1200.89; // 297mm in points
  const FIRST_PAGE_HEIGHT_REDUCTION_PT = options.emptySpaceTop ?? 250; // Adjust as needed
  const PAGE_PADDING = options.pagePadding ?? 20;

  if (typeof document === "undefined") {
    return defaultConfig;
  }

  function createNewPage(pageNumber: number) {
    return {
      number: pageNumber,
      availableHeight:
        pageNumber === 1
          ? A4_HEIGHT_PT - FIRST_PAGE_HEIGHT_REDUCTION_PT - PAGE_PADDING * 2
          : A4_HEIGHT_PT - PAGE_PADDING * 2,
      availableWidth: A4_WIDTH_PT - PAGE_PADDING * 2,
      contents: [] as PrintConfigContent[],
    };
  }

  function pxToPoints(px: number) {
    return (px * 72) / 96; // Assuming default 96 DPI for screens
  }

  const pages = [createNewPage(1)];
  let currentPage = pages[0];

  const resumeWrapper = document.querySelector(
    ".resume-preview"
  ) as HTMLDivElement;

  if (!resumeWrapper) {
    return defaultConfig;
  }

  const experiences = resumeWrapper.querySelectorAll(
    ".experience-item-wrapper"
  ) as NodeListOf<HTMLDivElement>;

  if (experiences.length === 0) {
    return defaultConfig;
  }

  experiences.forEach((experience) => {
    const experienceId = experience.dataset.experienceId;
    if (!experienceId) {
      throw new Error("Experience ID not found");
    }

    const companyInfo = experience.querySelector(
      ".company-info-wrapper"
    ) as HTMLDivElement;
    const roles = experience.querySelectorAll(
      ".role-item"
    ) as NodeListOf<HTMLDivElement>;

    const companyInfoHeight = pxToPoints(companyInfo.offsetHeight);
    let currentExperience: PrintConfigContent = {
      experienceId: experienceId,
      rolesIds: [],
    };

    if (currentPage.availableHeight < companyInfoHeight) {
      pages.push(createNewPage(pages.length + 1));
      currentPage = pages[pages.length - 1];
    }

    currentPage.availableHeight -= companyInfoHeight;

    roles.forEach((role) => {
      const roleId = role.dataset.roleId;

      if (!roleId) {
        throw new Error("Role ID not found");
      }

      const roleHeight = pxToPoints(role.offsetHeight);

      if (currentPage.availableHeight < roleHeight) {
        if (currentExperience.rolesIds.length > 0) {
          currentPage.contents.push(currentExperience);
        }
        pages.push(createNewPage(pages.length + 1));
        currentPage = pages[pages.length - 1];
        currentExperience = {
          experienceId: experienceId,
          rolesIds: [],
        };
        currentPage.availableHeight -= companyInfoHeight;
      }

      currentExperience.rolesIds.push(roleId);
      currentPage.availableHeight -= roleHeight;
    });

    if (currentExperience.rolesIds.length > 0) {
      currentPage.contents.push(currentExperience);
    }
  });

  return { pages };
}
