export const STUDY_REGIONS = {
  // 0: 온라인
  ONLINE: {
    code: 0,
    label: "온라인",
    value: "ONLINE",
    subcategories: {},
  },

  // 1000: 서울
  SEOUL: {
    code: 1000,
    label: "서울",
    value: "SEOUL",
    subcategories: {
      GANGNAM_GU: { code: 1001, label: "강남구" },
      GANGDONG_GU: { code: 1002, label: "강동구" },
      GANGBUK_GU: { code: 1003, label: "강북구" },
      GANGSEO_GU: { code: 1004, label: "강서구" },
      GWANAK_GU: { code: 1005, label: "관악구" },
      GWANGJIN_GU: { code: 1006, label: "광진구" },
      GURO_GU: { code: 1007, label: "구로구" },
      GEUMCHEON_GU: { code: 1008, label: "금천구" },
      NOWON_GU: { code: 1009, label: "노원구" },
      DOBONG_GU: { code: 1010, label: "도봉구" },
      DONGDAEMUN_GU: { code: 1011, label: "동대문구" },
      DONGJAK_GU: { code: 1012, label: "동작구" },
      MAPO_GU: { code: 1013, label: "마포구" },
      SEODAEMUN_GU: { code: 1014, label: "서대문구" },
      SEOCHO_GU: { code: 1015, label: "서초구" },
      SEONGDONG_GU: { code: 1016, label: "성동구" },
      SEONGBUK_GU: { code: 1017, label: "성북구" },
      SONGPA_GU: { code: 1018, label: "송파구" },
      YANGCHEON_GU: { code: 1019, label: "양천구" },
      YEONGDEUNGPO_GU: { code: 1020, label: "영등포구" },
      YONGSAN_GU: { code: 1021, label: "용산구" },
      EUNPYEONG_GU: { code: 1022, label: "은평구" },
      JONGNO_GU: { code: 1023, label: "종로구" },
      JUNG_GU: { code: 1024, label: "중구" },
      JUNGNANG_GU: { code: 1025, label: "중랑구" },
    },
  },

  // 2000: 경기
  GYEONGGI: {
    code: 2000,
    label: "경기",
    value: "GYEONGGI",
    subcategories: {
      SUWON: { code: 2001, label: "수원시" },
      SEONGNAM: { code: 2002, label: "성남시" },
      YONGIN: { code: 2003, label: "용인시" },
      BUCHEON: { code: 2004, label: "부천시" },
      ANSAN: { code: 2005, label: "안산시" },
      ANYANG: { code: 2006, label: "안양시" },
      NAMYANGJU: { code: 2007, label: "남양주시" },
      HWASEONG: { code: 2008, label: "화성시" },
      PYEONGTAEK: { code: 2009, label: "평택시" },
      UIJEONGBU: { code: 2010, label: "의정부시" },
      SIHEUNG: { code: 2011, label: "시흥시" },
      PAJU: { code: 2012, label: "파주시" },
      GWANGMYEONG: { code: 2013, label: "광명시" },
      GIMPO: { code: 2014, label: "김포시" },
      GUNPO: { code: 2015, label: "군포시" },
    },
  },

  // 3000: 인천
  INCHEON: {
    code: 3000,
    label: "인천",
    value: "INCHEON",
    subcategories: {
      JUNG_GU: { code: 3001, label: "중구" },
      DONG_GU: { code: 3002, label: "동구" },
      MICHUHOL_GU: { code: 3003, label: "미추홀구" },
      YEONSU_GU: { code: 3004, label: "연수구" },
      NAMDONG_GU: { code: 3005, label: "남동구" },
      BUPYEONG_GU: { code: 3006, label: "부평구" },
      GYEYANG_GU: { code: 3007, label: "계양구" },
      SEO_GU: { code: 3008, label: "서구" },
    },
  },

  // 4000: 부산
  BUSAN: {
    code: 4000,
    label: "부산",
    value: "BUSAN",
    subcategories: {
      HAEUNDAE: { code: 4001, label: "해운대구" },
      BUSANJIN: { code: 4002, label: "부산진구" },
      DONGNAE: { code: 4003, label: "동래구" },
      NAM_GU: { code: 4004, label: "남구" },
      SUYEONG: { code: 4005, label: "수영구" },
    },
  },

  // 5000: 대구
  DAEGU: {
    code: 5000,
    label: "대구",
    value: "DAEGU",
    subcategories: {
      JUNG_GU: { code: 5001, label: "중구" },
      DONG_GU: { code: 5002, label: "동구" },
      SEO_GU: { code: 5003, label: "서구" },
      NAM_GU: { code: 5004, label: "남구" },
      BUK_GU: { code: 5005, label: "북구" },
      SUSEONG: { code: 5006, label: "수성구" },
    },
  },

  // 6000: 대전
  DAEJEON: {
    code: 6000,
    label: "대전",
    value: "DAEJEON",
    subcategories: {
      DONG_GU: { code: 6001, label: "동구" },
      JUNG_GU: { code: 6002, label: "중구" },
      SEO_GU: { code: 6003, label: "서구" },
      YUSEONG: { code: 6004, label: "유성구" },
    },
  },

  // 7000: 광주
  GWANGJU: {
    code: 7000,
    label: "광주",
    value: "GWANGJU",
    subcategories: {
      DONG_GU: { code: 7001, label: "동구" },
      SEO_GU: { code: 7002, label: "서구" },
      NAM_GU: { code: 7003, label: "남구" },
      BUK_GU: { code: 7004, label: "북구" },
      GWANGSAN: { code: 7005, label: "광산구" },
    },
  },

  // 8000: 울산
  ULSAN: {
    code: 8000,
    label: "울산",
    value: "ULSAN",
    subcategories: {
      JUNG_GU: { code: 8001, label: "중구" },
      NAM_GU: { code: 8002, label: "남구" },
      DONG_GU: { code: 8003, label: "동구" },
      BUK_GU: { code: 8004, label: "북구" },
    },
  },

  // 9000: 세종
  SEJONG: {
    code: 9000,
    label: "세종",
    value: "SEJONG",
    subcategories: {},
  },
} as const;

// 코드로 지역 라벨 찾기
export const getRegionLabelByCode = (code: number): string => {
  for (const region of Object.values(STUDY_REGIONS)) {
    if (region.code === code) return region.label;

    for (const subregion of Object.values(region.subcategories)) {
      if (subregion.code === code) return subregion.label;
    }
  }
  return "";
};

export const getSubregionLabelByCode = (code: number): string => {
  for (const region of Object.values(STUDY_REGIONS)) {
    if (region.code === code) return region.label;

    for (const subregion of Object.values(region.subcategories)) {
      if (subregion.code === code) return subregion.label;
    }
  }
  return "";
};

export const getMainRegion = () => {
  return Object.values(STUDY_REGIONS).map((region) => ({
    value: region.value,
    label: region.label,
  }));
};

export const getSubRegion = (region: string) => {
  const regionObj = STUDY_REGIONS[region as keyof typeof STUDY_REGIONS];
  if (!regionObj) return [];
  return Object.values(regionObj.subcategories).map((subregion) => ({
    value: subregion.code.toString(),
    label: subregion.label,
  }));
};


export const getRegionCodeByValue = (value: string): number => {
  for (const region of Object.values(STUDY_REGIONS)) {
    if (region.value === value) return region.code;
    for (const subregion of Object.values(region.subcategories)) {
      if (subregion.value === value) return subregion.code;
    }
  }
  return 0;
};

export const getRegionPath = (code: number): string[] => {
  for (const region of Object.values(STUDY_REGIONS)) {
    if (region.code === code) return [region.label];
    for (const subregion of Object.values(region.subcategories)) {
      if (subregion.code === code) return [region.label, subregion.label];
    }
  }
  return [];
};
