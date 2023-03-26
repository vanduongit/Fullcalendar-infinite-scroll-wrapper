import React from "react";
export interface CalendarRef {
    getApi: () => any;
}
export interface CalendarScrollOptions {
    stepDates?: number;
    numberOfDatesFromCurrentDate?: number;
    slotMinWidth?: number;
}
export declare const CLASSNAME_WRAPPER = "full-calendar-infinite-scroll-wrapper";
export declare function useMultiCalendarScroll(calendarRef: React.RefObject<any | undefined>, scrollOptions: CalendarScrollOptions, onChangeCalendar?: (currentStartDate: Date, currentEndDate: Date, distanceDays: number) => void, firstLoad?: (startDate: Date, endDate: Date) => void): readonly [number, (date: Date) => void, (direction: "next" | "prev" | "today") => void];
