import React from 'react';
import { CalendarScrollOptions } from '../../hooks/useMultiCalendarScroll';
export type ChildrenParams = {
    ref: any;
    numberDisplayDaysOfCalendar: number;
    moveToDate: (date: Date) => void;
    onMoveDirection: (direction: "next" | "prev" | "today") => void;
};
export type Props = {
    scrollOptions: CalendarScrollOptions;
    children: (params: ChildrenParams) => React.ReactElement;
    onChangeCalendar?: (currentStartDate: Date, currentEndDate: Date, distanceDays: number) => void;
    firstLoad?: (startDate: Date, endDate: Date) => void;
};
declare const FullCalendarInfiniteScrollWrapper: ({ children, onChangeCalendar, firstLoad, scrollOptions }: Props) => JSX.Element;
export default FullCalendarInfiniteScrollWrapper;
