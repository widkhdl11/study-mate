import { STUDY_STATUS } from "@/lib/constants/study-status";

export const studyStatusConversion = (status: string) => {   
    switch (status) {
        case "recruiting":
            return "모집중";
        case "completed":
            return "모집완료";
        case "closed":
            return "마감";
    }
};

export const getStudyStatusExistValue = (status: string):string => {
    return Object.values(STUDY_STATUS).find((s: { label: string }) => s.label === status)?.value || "";
};