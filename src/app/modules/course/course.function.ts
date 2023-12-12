const durationInWeeksCalculation=(startDate,endDate)=>{
    const startDateObject = new Date(startDate);
    const endDateObject = new Date(endDate);
    const durationInWeeks = Math.ceil(
        (endDateObject.getTime() - startDateObject.getTime()) /
          (7 * 24 * 60 * 60 * 1000)
      );
      return durationInWeeks;
}
export const courseFunctions={
    durationInWeeksCalculation
}