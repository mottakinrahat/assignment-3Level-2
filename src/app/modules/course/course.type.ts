export type filterCourseQuery= {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    minPrice?: number;
    maxPrice?: number;
    tags?: string;
    startDate?: string;
    endDate?: string;
    language?: string;
    provider?: string;
    durationInWeeks?: number;
    level?: string;
  }