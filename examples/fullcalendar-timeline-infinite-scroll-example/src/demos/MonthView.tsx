import React, { memo, useCallback } from 'react'
import FullCalendar from '@fullcalendar/react'
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import interactionPlugin from "@fullcalendar/interaction";

import { FullCalendarInfiniteScrollWrapper } from "fullcalendar-timeline-infinite-scroll-wrapper";

type Props = {}

const scrollOptions = {slotMinWidth: 80};

const MonthView = (props: Props) => {
    const onChangeCalendar = useCallback((currentStartDate: Date, currentEndDate: Date, distanceDays: number) => {
        console.log("distanceDays:", distanceDays)
        console.log("currentEndDate:", currentEndDate)
        console.log("currentStartDate:", currentStartDate)
    }, []);

    const handleFirstLoad = useCallback((startDate: Date, endDate: Date) => {
        console.log("handleFirstLoad endDate:", endDate)
        console.log("handleFirstLoad startDate:", startDate)
    }, []);

    return (
        <FullCalendarInfiniteScrollWrapper
            scrollOptions={scrollOptions}
            onChangeCalendar={onChangeCalendar}
            firstLoad={handleFirstLoad}
        >
            {({ref, numberDisplayDaysOfCalendar, moveToDate, onMoveDirection}) => (
                <>
                    <button onClick={() => onMoveDirection("next")}>next</button>&nbsp;
                    <button onClick={() => onMoveDirection("today")}>today</button>&nbsp;
                    <button onClick={() => onMoveDirection("prev")}>prev</button>&nbsp;

                    <FullCalendar
                        ref={ref}
                        schedulerLicenseKey="GPL-My-Project-Is-Open-Source"
                        initialView="resourceTimelineMonthCustom"
                        plugins={[resourceTimelinePlugin, interactionPlugin]}
                        views={{
                            resourceTimelineMonthCustom: {
                                type: "resourceTimeline",
                                duration: {
                                    days: numberDisplayDaysOfCalendar || 30
                                }
                            }
                        }}
                        headerToolbar={{
                            left: "",
                            center: "title",
                            right: ""
                        }}
                        scrollTime={{days: 15}}
                        scrollTimeReset={false}
                        selectable
                        height="auto"
                        resourceOrder="false"
                        slotMinWidth={80}
                        resourceAreaHeaderContent="Rooms"
                        resources="https://fullcalendar.io/api/demo-feeds/resources.json"
                        events="https://fullcalendar.io/api/demo-feeds/events.json?single-day&for-resource-timeline"
                    />
                </>
            )}
        </FullCalendarInfiniteScrollWrapper>
    )
}

export default memo(MonthView);
