import React from 'react';

interface CalendarRef {
    getApi: () => any;
}
interface CalendarScrollOptions {
    stepDates?: number;
    numberOfStepLoadData?: number;
    numberOfDatesFromCurrentDate?: number;
    slotMinWidth?: number;
}
declare function useMultiCalendarScroll(calendarRef: React.RefObject<any | undefined>, scrollOptions: CalendarScrollOptions, fetchMore: (currentStartDate: Date, currentEndDate: Date, distanceDays: number) => void, firstLoad: (startDate: Date, endDate: Date) => void): readonly [number, (date: Date) => void, (direction: "next" | "prev" | "today") => void];

type ChildrenParams = {
    ref: any;
    numberDisplayDaysOfCalendar: number;
    moveToDate: (date: Date) => void;
    onMoveDirection: (direction: "next" | "prev" | "today") => void;
};
type Props = {
    scrollOptions: CalendarScrollOptions;
    children: (params: ChildrenParams) => React.ReactElement;
    fetchMore: (currentStartDate: Date, currentEndDate: Date, distanceDays: number) => void;
    firstLoad: (startDate: Date, endDate: Date) => void;
};
declare const FullCalendarInfiniteScrollWrapper: ({ children, fetchMore, firstLoad, scrollOptions }: Props) => React.ReactElement<any, string | React.JSXElementConstructor<any>>;

export { CalendarRef, CalendarScrollOptions, FullCalendarInfiniteScrollWrapper, useMultiCalendarScroll };
