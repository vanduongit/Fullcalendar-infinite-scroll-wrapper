interface CalendarRef {
    getApi: () => any;
}
interface CalendarScrollOptions {
    stepDates?: number;
    numberOfStepLoadData?: number;
    numberOfDatesFromCurrentDate?: number;
    slotMinWidth?: number;
}

export { CalendarRef, CalendarScrollOptions };
