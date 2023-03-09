export interface CalendarRef {
    getApi: () => any;
}

export interface CalendarScrollOptions {
    stepDates?: number;
    numberOfStepLoadData?: number;
    numberOfDatesFromCurrentDate?: number;
    slotMinWidth?: number;
}
