import React, { useRef } from 'react'
import { useMultiCalendarScroll } from '../../hooks/useMultiCalendarScroll';
import { CalendarScrollOptions } from '../../types';

type ChildrenParams = {
    ref: any;
    numberDisplayDaysOfCalendar: number;
    moveToDate: (date: Date) => void;
    onMoveDirection: (direction: "next" | "prev" | "today") => void;
}

type Props = {
    scrollOptions: CalendarScrollOptions,
    children: (params: ChildrenParams) => React.ReactElement;
    fetchMore: (currentStartDate: Date, currentEndDate: Date, distanceDays: number) => void,
    firstLoad: (
        startDate: Date,
        endDate: Date,
    ) => void,
}

const FullCalendarInfiniteScrollWrapper = ({children, fetchMore, firstLoad, scrollOptions}: Props) => {
    const calendarRef = useRef<any>();
    const [days, moveToDate, handleMove] = useMultiCalendarScroll(
        calendarRef,
        scrollOptions,
        fetchMore,
        firstLoad,
    );

    return children({
        ref: calendarRef,
        numberDisplayDaysOfCalendar: days,
        moveToDate,
        onMoveDirection: handleMove
    });
}

export default FullCalendarInfiniteScrollWrapper