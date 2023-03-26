import React, {useRef} from "react";

import {CLASSNAME_WRAPPER, useMultiCalendarScroll} from "./useMultiCalendarScroll";
import {CalendarScrollOptions} from "./types";

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

const FullCalendarInfiniteScrollWrapper = ({
    children,
    onChangeCalendar,
    firstLoad,
    scrollOptions
}: Props) => {
    const calendarRef = useRef<any>();
    const [days, moveToDate, handleMove] = useMultiCalendarScroll(
        calendarRef,
        scrollOptions,
        onChangeCalendar,
        firstLoad
    );

    return (
        <div className={CLASSNAME_WRAPPER}>
            {children({
                ref: calendarRef,
                numberDisplayDaysOfCalendar: days,
                moveToDate,
                onMoveDirection: handleMove
            })}
        </div>
    )
};

export { FullCalendarInfiniteScrollWrapper };
