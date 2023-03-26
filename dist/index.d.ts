import React from 'react';

interface CalendarRef {
    getApi: () => any;
}
interface CalendarScrollOptions {
    stepDates?: number;
    numberOfDatesFromCurrentDate?: number;
    slotMinWidth?: number;
}
declare const CLASSNAME_WRAPPER = "full-calendar-infinite-scroll-wrapper";
declare function useMultiCalendarScroll(calendarRef: React.RefObject<any | undefined>, scrollOptions: CalendarScrollOptions, onChangeCalendar?: (currentStartDate: Date, currentEndDate: Date, distanceDays: number) => void, firstLoad?: (startDate: Date, endDate: Date) => void): readonly [number, (date: Date) => void, (direction: "next" | "prev" | "today") => void];

type ChildrenParams = {
    ref: any;
    numberDisplayDaysOfCalendar: number;
    moveToDate: (date: Date) => void;
    onMoveDirection: (direction: "next" | "prev" | "today") => void;
};
type Props = {
    scrollOptions: CalendarScrollOptions;
    children: (params: ChildrenParams) => React.ReactElement;
    onChangeCalendar?: (currentStartDate: Date, currentEndDate: Date, distanceDays: number) => void;
    firstLoad?: (startDate: Date, endDate: Date) => void;
};
declare const FullCalendarInfiniteScrollWrapper: ({ children, onChangeCalendar, firstLoad, scrollOptions }: Props) => JSX.Element;

export { CLASSNAME_WRAPPER, CalendarRef, CalendarScrollOptions, FullCalendarInfiniteScrollWrapper, useMultiCalendarScroll };
