import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {addDays, addMonths, subMonths, subDays} from "date-fns";

import {checkIsMacDevice, throttle} from "../utils";

export interface CalendarRef {
    getApi: () => any;
}

export interface CalendarScrollOptions {
    stepDates?: number;
    numberOfDatesFromCurrentDate?: number;
    slotMinWidth?: number;
}

export const CLASSNAME_WRAPPER = "full-calendar-infinite-scroll-wrapper";

const defaultOptions = {
    stepDates: 20,
    numberOfDatesFromCurrentDate: 15,
    slotMinWidth: 80
};

function getScroller(calendarDom: HTMLDivElement) {
    return calendarDom.querySelector("tfoot th:nth-child(3) .fc-scroller");
}

export function useMultiCalendarScroll(
    calendarRef: React.RefObject<any | undefined>,
    scrollOptions: CalendarScrollOptions,
    onChangeCalendar?: (currentStartDate: Date, currentEndDate: Date, distanceDays: number) => void,
    firstLoad?: (startDate: Date, endDate: Date) => void
) {
    const {
        stepDates = defaultOptions.stepDates,
        numberOfDatesFromCurrentDate = defaultOptions.numberOfDatesFromCurrentDate,
        slotMinWidth = defaultOptions.slotMinWidth
    } = scrollOptions;

    const LATENCY_SCROLL = slotMinWidth * 3; // pixel unit, latency to scroll to start or end

    const [days, setDays] = useState(0);
    const [calendarDom, setCalendarDom] = useState<HTMLDivElement>();

    const getCalendarApi = useCallback(
        function getCalendarApi() {
            const {current} = calendarRef;
            return current?.getApi();
        },
        [calendarRef]
    );

    const handleChangeCalendar = useCallback((
            currentStartDate: Date,
            currentEndDate: Date,
            distanceDays: number
        ) => {
            const activeStartDate = addDays(currentStartDate, distanceDays);
            const activeEndDate = addDays(currentEndDate, distanceDays);

            onChangeCalendar?.(activeStartDate, activeEndDate, distanceDays);
        },
        [onChangeCalendar]
    );

    const calendarMove = useCallback(
        function calendarMove(steps: number) {
            if (!calendarDom) {
                return;
            }
            const calendarApi = getCalendarApi();
            if (calendarApi?.view) {
                const {activeStart, activeEnd} = calendarApi.view;
                const scroller = getScroller(calendarDom);

                if (!scroller) {
                    return;
                }
                const {scrollLeft} = scroller;
                const scrollDaysBackToCurrentDateView = Math.floor(
                    (scrollLeft - steps * slotMinWidth) / slotMinWidth
                );
                const remain =
                    scrollLeft -
                    steps * slotMinWidth -
                    scrollDaysBackToCurrentDateView * slotMinWidth;
                calendarApi.batchRendering(() => {
                    setTimeout(() => {
                        calendarApi.gotoDate(addDays(activeStart, steps));
                        if (!scrollerClickedRef.current) {
                            calendarApi.scrollToTime({days: scrollDaysBackToCurrentDateView});
                            scroller.scrollLeft += remain;
                        } else {
                            // Make scroll move to load more data when user keep click on scrollbar
                            scroller.scrollLeft += remain > 0 ? -1 : 1;
                        }
                    }, 100);
                });
                handleChangeCalendar(activeStart, activeEnd, steps);
            }
        },
        [calendarDom, getCalendarApi, handleChangeCalendar, slotMinWidth]
    );

    const throttleCalendarMove = useMemo(() => throttle(calendarMove, 1000), [calendarMove]);
    const scrollerClickedRef = useRef<boolean>(false);

    const navigateCalendar = useCallback(
        (event: Event) => {
            const {scrollWidth, scrollLeft, clientWidth} = event.target as HTMLDivElement;
            const nearlyStart = scrollLeft - LATENCY_SCROLL < 0;
            if (nearlyStart) {
                throttleCalendarMove(-stepDates);
            }

            const nearlyEnd = scrollWidth - scrollLeft < clientWidth + LATENCY_SCROLL;
            if (nearlyEnd) {
                throttleCalendarMove(stepDates);
            }
        },
        [LATENCY_SCROLL, stepDates, throttleCalendarMove]
    );

    useEffect(() => {
        if (!calendarDom) {
            return;
        }
        const scroller = getScroller(calendarDom);
        if (!scroller) {
            return;
        }

        function handleScrollEvent(event: Event) {
            if (!event.target) {
                return;
            }

            navigateCalendar(event);
        }

        scroller.addEventListener("scroll", handleScrollEvent);

        if (checkIsMacDevice()) {
            const scrollerMacOs1 = calendarDom.querySelector("tbody td:nth-child(3) .fc-scroller");
            if (scrollerMacOs1) {
                scrollerMacOs1.className += " fc-scroller-hide-scroll";
            }
            const scrollerMacOs2 = calendarDom.querySelector("thead th:nth-child(3) .fc-scroller");
            if (scrollerMacOs2) {
                scrollerMacOs2.className += " fc-scroller-hide-scroll";
            }
        }

        return () => {
            scroller.removeEventListener("scroll", handleScrollEvent);
        };
    }, [calendarDom, navigateCalendar]);

    useEffect(() => {
        if (!calendarDom) {
            return;
        }
        const scroller = getScroller(calendarDom);

        function mousedownEvent() {
            scrollerClickedRef.current = true;
        }

        function mouseupEvent() {
            scrollerClickedRef.current = false;
        }

        if (scroller) {
            scroller.addEventListener("mousedown", mousedownEvent);
            scroller.addEventListener("mouseup", mouseupEvent);
            const {clientWidth} = scroller;
            const numberOfDatesOnView = Math.round(clientWidth / slotMinWidth);
            setDays(Math.max(numberOfDatesOnView + 40, 45));
        }

        return () => {
            if (scroller) {
                scroller.removeEventListener("mousedown", mousedownEvent);
                scroller.removeEventListener("mouseup", mouseupEvent);
            }
        };
    }, [calendarDom, slotMinWidth]);

    useEffect(() => {
        setTimeout(() => {
            const calendarApi = getCalendarApi();
            if (calendarApi?.view) {
                const {activeStart, activeEnd} = calendarApi.view;
                firstLoad?.(
                    subDays(activeStart, stepDates + 1),
                    addDays(activeEnd, stepDates + 1)
                );
            }
        }, 500); // wait multicalendar first load done.
    }, []);

    useEffect(() => {
        document.body.style.overscrollBehaviorX = "none";
        return () => {
            document.body.style.overscrollBehaviorX = "auto";
        };
    }, []);

    useEffect(() => {
        const calendar = document.querySelector(`.${CLASSNAME_WRAPPER}`);
        if (calendar) {
            setCalendarDom(calendar as HTMLDivElement);
        }
    }, []);

    const handleMoveToDate = useCallback(
        (date: Date) => {
            const calendarApi = getCalendarApi();
            calendarApi?.batchRendering(() => {
                setTimeout(() => {
                    calendarApi.gotoDate(subDays(date, 15));
                    calendarApi.scrollToTime({
                        days: 15
                    });
                    const {activeStart, activeEnd} = calendarApi.view;
                    handleChangeCalendar(activeStart, activeEnd, 0);
                }, 0);
            });
        },
        [getCalendarApi, handleChangeCalendar]
    );

    const handleMove = useCallback(
        function handleMove(direction: "next" | "prev" | "today") {
            const calendarApi = getCalendarApi();

            if (calendarApi) {
                const {activeStart} = calendarApi.view;

                if (direction === "next") {
                    calendarApi.batchRendering(() => {
                        setTimeout(() => {
                            calendarApi.gotoDate(addMonths(activeStart, 1));
                            calendarApi.scrollToTime({
                                days: numberOfDatesFromCurrentDate
                            });
                            const {activeStart: newActiveStart, activeEnd: newActiveEnd} =
                                calendarApi.view;

                            handleChangeCalendar(
                                newActiveStart,
                                newActiveEnd,
                                0
                            );
                        }, 0);
                    });
                } else if (direction === "prev") {
                    setTimeout(() => {
                        calendarApi.gotoDate(subMonths(activeStart, 1));
                        calendarApi.scrollToTime({
                            days: numberOfDatesFromCurrentDate
                        });
                        const {activeStart: newActiveStart, activeEnd: newActiveEnd} =
                            calendarApi.view;
                            handleChangeCalendar(newActiveStart, newActiveEnd, 0);
                    }, 0);
                } else if (direction === "today") {
                    calendarApi.batchRendering(() => {
                        setTimeout(() => {
                            calendarApi.gotoDate(subDays(new Date(), 15));

                            calendarApi.scrollToTime({
                                days: numberOfDatesFromCurrentDate
                            });
                        }, 0);
                        const {activeStart: newActiveStart, activeEnd: newActiveEnd} =
                            calendarApi.view;
                            handleChangeCalendar(newActiveStart, newActiveEnd, 0);
                    });
                }
            }
        },
        [getCalendarApi, handleChangeCalendar, numberOfDatesFromCurrentDate]
    );

    return [days, handleMoveToDate, handleMove] as const;
}
