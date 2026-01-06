// ==================== 카테고리 코드 체계 ====================
// 대분류: 100, 200, 300...
// 중분류: 110, 120, 130...
// 소분류: 111, 112, 113...

export const STUDY_CATEGORIES = {
  // 100: IT/개발
  IT_DEVELOPMENT: {
    code: 100,
    label: "IT/개발",
    value: "IT_DEVELOPMENT",
    subcategories: {
      FRONTEND: {
        code: 110,
        label: "프론트엔드",
        value: "FRONTEND",
        details: [
          { code: 111, label: "React" },
          { code: 112, label: "Vue" },
          { code: 113, label: "Angular" },
          { code: 114, label: "Svelte" },
          { code: 115, label: "Next.js" },
          { code: 116, label: "TypeScript" },
        ],
      },
      BACKEND: {
        code: 120,
        label: "백엔드",
        value: "BACKEND",
        details: [
          { code: 121, label: "Spring" },
          { code: 122, label: "Node.js" },
          { code: 123, label: "Django" },
          { code: 124, label: "FastAPI" },
          { code: 125, label: "NestJS" },
          { code: 126, label: "Express" },
        ],
      },
      MOBILE: {
        code: 130,
        label: "모바일",
        value: "MOBILE",
        details: [
          { code: 131, label: "iOS" },
          { code: 132, label: "Android" },
          { code: 133, label: "React Native" },
          { code: 134, label: "Flutter" },
          { code: 135, label: "Swift" },
          { code: 136, label: "Kotlin" },
        ],
      },
      AI_ML: {
        code: 140,
        label: "AI/머신러닝",
        value: "AI_ML",
        details: [
          { code: 141, label: "Python" },
          { code: 142, label: "TensorFlow" },
          { code: 143, label: "PyTorch" },
          { code: 144, label: "딥러닝" },
          { code: 145, label: "데이터 분석" },
        ],
      },
      DEVOPS: {
        code: 150,
        label: "DevOps/인프라",
        value: "DEVOPS",
        details: [
          { code: 151, label: "AWS" },
          { code: 152, label: "Docker" },
          { code: 153, label: "Kubernetes" },
          { code: 154, label: "CI/CD" },
          { code: 155, label: "Linux" },
        ],
      },
      DATABASE: {
        code: 160,
        label: "데이터베이스",
        value: "DATABASE",
        details: [
          { code: 161, label: "MySQL" },
          { code: 162, label: "PostgreSQL" },
          { code: 163, label: "MongoDB" },
          { code: 164, label: "Redis" },
          { code: 165, label: "SQL" },
        ],
      },
      SECURITY: {
        code: 170,
        label: "보안",
        value: "SECURITY",
        details: [
          { code: 171, label: "네트워크 보안" },
          { code: 172, label: "웹 해킹" },
          { code: 173, label: "시스템 보안" },
          { code: 174, label: "암호학" },
        ],
      },
      GAME: {
        code: 180,
        label: "게임 개발",
        value: "GAME",
        details: [
          { code: 181, label: "Unity" },
          { code: 182, label: "Unreal" },
          { code: 183, label: "C++" },
          { code: 184, label: "C#" },
          { code: 185, label: "게임 기획" },
        ],
      },
    },
  },

  // 200: 디자인
  DESIGN: {
    code: 200,
    label: "디자인",
    value: "DESIGN",
    subcategories: {
      UI_UX: {
        code: 210,
        label: "UI/UX",
        value: "UI_UX",
        details: [
          { code: 211, label: "Figma" },
          { code: 212, label: "Adobe XD" },
          { code: 213, label: "Sketch" },
          { code: 214, label: "프로토타이핑" },
          { code: 215, label: "사용성 테스트" },
        ],
      },
      GRAPHIC: {
        code: 220,
        label: "그래픽 디자인",
        value: "GRAPHIC",
        details: [
          { code: 221, label: "Photoshop" },
          { code: 222, label: "Illustrator" },
          { code: 223, label: "브랜딩" },
          { code: 224, label: "타이포그래피" },
        ],
      },
      VIDEO: {
        code: 230,
        label: "영상/모션",
        value: "VIDEO",
        details: [
          { code: 231, label: "Premiere Pro" },
          { code: 232, label: "After Effects" },
          { code: 233, label: "Final Cut" },
          { code: 234, label: "DaVinci" },
        ],
      },
      THREE_D: {
        code: 240,
        label: "3D/모델링",
        value: "THREE_D",
        details: [
          { code: 241, label: "Blender" },
          { code: 242, label: "Maya" },
          { code: 243, label: "3ds Max" },
          { code: 244, label: "Cinema 4D" },
        ],
      },
    },
  },

  // 300: 외국어
  LANGUAGE: {
    code: 300,
    label: "외국어",
    value: "LANGUAGE",
    subcategories: {
      ENGLISH: {
        code: 310,
        label: "영어",
        value: "ENGLISH",
        details: [
          { code: 311, label: "토익" },
          { code: 312, label: "토스" },
          { code: 313, label: "오픽" },
          { code: 314, label: "회화" },
          { code: 315, label: "비즈니스 영어" },
        ],
      },
      JAPANESE: {
        code: 320,
        label: "일본어",
        value: "JAPANESE",
        details: [
          { code: 321, label: "JLPT" },
          { code: 322, label: "JPT" },
          { code: 323, label: "회화" },
          { code: 324, label: "비즈니스 일본어" },
        ],
      },
      CHINESE: {
        code: 330,
        label: "중국어",
        value: "CHINESE",
        details: [
          { code: 331, label: "HSK" },
          { code: 332, label: "TSC" },
          { code: 333, label: "회화" },
        ],
      },
    },
  },

  // 400: 비즈니스/금융
  BUSINESS: {
    code: 400,
    label: "비즈니스/금융",
    value: "BUSINESS",
    subcategories: {
      STARTUP: {
        code: 410,
        label: "창업/스타트업",
        value: "STARTUP",
        details: [
          { code: 411, label: "사업 계획" },
          { code: 412, label: "IR 피칭" },
          { code: 413, label: "투자 유치" },
        ],
      },
      MARKETING: {
        code: 420,
        label: "마케팅",
        value: "MARKETING",
        details: [
          { code: 421, label: "디지털 마케팅" },
          { code: 422, label: "SNS 마케팅" },
          { code: 423, label: "콘텐츠 마케팅" },
        ],
      },
      FINANCE: {
        code: 430,
        label: "재무/회계",
        value: "FINANCE",
        details: [
          { code: 431, label: "재무제표" },
          { code: 432, label: "투자" },
          { code: 433, label: "주식" },
        ],
      },
    },
  },

  // 500: 자격증/시험
  CERTIFICATION: {
    code: 500,
    label: "자격증/시험",
    value: "CERTIFICATION",
    subcategories: {
      IT_CERT: {
        code: 510,
        label: "IT 자격증",
        value: "IT_CERT",
        details: [
          { code: 511, label: "정보처리기사" },
          { code: 512, label: "네트워크관리사" },
          { code: 513, label: "AWS" },
        ],
      },
      PUBLIC_SERVANT: {
        code: 520,
        label: "공무원",
        value: "PUBLIC_SERVANT",
        details: [
          { code: 521, label: "국가직" },
          { code: 522, label: "지방직" },
          { code: 523, label: "서울시" },
        ],
      },
    },
  },

  // 600: 학업/입시
  ACADEMICS: {
    code: 600,
    label: "학업/입시",
    value: "ACADEMICS",
    subcategories: {
      UNIVERSITY: {
        code: 610,
        label: "대학 입시",
        value: "UNIVERSITY",
        details: [
          { code: 611, label: "수능" },
          { code: 612, label: "논술" },
          { code: 613, label: "면접" },
        ],
      },
      MATH: {
        code: 620,
        label: "수학",
        value: "MATH",
        details: [
          { code: 621, label: "미적분" },
          { code: 622, label: "선형대수" },
          { code: 623, label: "확률과 통계" },
        ],
      },
    },
  },

  // 700: 취미/라이프
  HOBBY: {
    code: 700,
    label: "취미/라이프",
    value: "HOBBY",
    subcategories: {
      SPORTS: {
        code: 710,
        label: "운동/스포츠",
        value: "SPORTS",
        details: [
          { code: 711, label: "러닝" },
          { code: 712, label: "헬스" },
          { code: 713, label: "요가" },
        ],
      },
      MUSIC: {
        code: 720,
        label: "음악",
        value: "MUSIC",
        details: [
          { code: 721, label: "기타" },
          { code: 722, label: "피아노" },
          { code: 723, label: "보컬" },
        ],
      },
    },
  },

  // 800: 자기계발
  SELF_IMPROVEMENT: {
    code: 800,
    label: "자기계발",
    value: "SELF_IMPROVEMENT",
    subcategories: {
      PRODUCTIVITY: {
        code: 810,
        label: "생산성/습관",
        value: "PRODUCTIVITY",
        details: [
          { code: 811, label: "시간 관리" },
          { code: 812, label: "습관 만들기" },
          { code: 813, label: "노션" },
        ],
      },
    },
  },
} as const;

// 코드로 라벨 찾기
export const getCategoryLabelByCode = (code: number): string => {
  // 대분류 체크
  for (const mainCat of Object.values(STUDY_CATEGORIES)) {
    if (mainCat.code === code) return mainCat.label;

    // 중분류 체크
    for (const subCat of Object.values(mainCat.subcategories)) {
      if (subCat.code === code) return subCat.label;

      // 소분류 체크
      const detail = subCat.details?.find(
        (d: { code: number }) => d.code === code
      );
      if (detail) return detail.label;
    }
  }
  return "";
};
// 라벨로 코드 찾기 (역방향)
export const getCategoryCodeByLabel = (label: string): number | null => {
  console.log("getCategoryCodeByLabel:", label);
  for (const mainCat of Object.values(STUDY_CATEGORIES)) {
    if (mainCat.label === label) return mainCat.code;

    for (const subCat of Object.values(mainCat.subcategories)) {
      if (subCat.label === label) return subCat.code;

      const detail = subCat.details?.find(
        (d: { label: string }) => d.label === label
      );
      if (detail) return detail.code;
    }
  }
  return null;
};

export const getCategoryCodeByValue = (value: string): number | null => {
  console.log("getCategoryCodeByValue:", value);
  for (const mainCat of Object.values(STUDY_CATEGORIES)) {
    if (mainCat.value === value) return mainCat.code;

    for (const subCat of Object.values(mainCat.subcategories)) {
      if (subCat.value === value) return subCat.code;

      const detail = subCat.details?.find(
        (d: { value: string }) => d.value === value
      );
      if (detail) return detail.code;
    }
  }
  return null;
};

// 전체 경로 얻기 (계층 구조)
export const getCategoryPath = (code: number): string[] => {
  for (const mainCat of Object.values(STUDY_CATEGORIES)) {
    if (mainCat.code === code) return [mainCat.label];

    for (const subCat of Object.values(mainCat.subcategories)) {
      if (subCat.code === code) return [mainCat.label, subCat.label];

      const detail = subCat.details?.find(
        (d: { code: number }) => d.code === code
      );
      if (detail) return [mainCat.label, subCat.label, detail.label];
    }
  }
  return [];
};

export const getMainCategories = (): { value: string; label: string }[] => {
  return Object.values(STUDY_CATEGORIES).map((cat) => ({
    value: cat.value,
    label: cat.label,
  }));
};

export const getSubcategories = (
  mainCategory: string
): { value: string; label: string }[] => {
  if (!mainCategory) return [];
  const category =
    STUDY_CATEGORIES[mainCategory as keyof typeof STUDY_CATEGORIES];
  return Object.values(category.subcategories).map((sub) => ({
    value: sub.value,
    label: sub.label,
  }));
};

export const getDetailCategories = (
  mainCategory: string,
  subcategory: string
): { value: string; label: string }[] => {
  const mainCat =
    STUDY_CATEGORIES[mainCategory as keyof typeof STUDY_CATEGORIES];
  const subCat = Object.values(mainCat.subcategories).find(
    (sub) => sub.value === subcategory
  );
  return (
    subCat?.details?.map((detail: { code: number; label: string }) => ({
      value: detail.code.toString(),
      label: detail.label,
    })) || []
  );
};


