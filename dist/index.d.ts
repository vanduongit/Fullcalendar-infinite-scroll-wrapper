import React from 'react';

interface CalendarScrollOptions {
    stepDates?: number;
    numberOfStepLoadData?: number;
    numberOfDatesFromCurrentDate?: number;
    slotMinWidth?: number;
}

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

export { FullCalendarInfiniteScrollWrapper };
