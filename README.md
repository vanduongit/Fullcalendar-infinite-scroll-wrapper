# Fullcalendar-timeline-infinite-scroll-wrapper

[![npm version](https://badge.fury.io/js/fullcalendar-timeline-infinite-scroll-wrapper.svg)](https://badge.fury.io/js/fullcalendar-timeline-infinite-scroll-wrapper)
![npm](https://img.shields.io/npm/dw/fullcalendar-timeline-infinite-scroll-wrapper)

This react library support infinite scrolling to [Fullcalendar resource timeline](https://fullcalendar.io/docs/timeline-standard-view-demo) in month view.

![GIF](https://user-images.githubusercontent.com/11327489/227763025-02437415-7d27-4b75-8021-4b6217e3ed01.gif)


## Installation

The package can be installed via [npm](https://github.com/npm/cli):

```
npm install fullcalendar-timeline-infinite-scroll-wrapper --save
```

Or via [yarn](https://github.com/yarnpkg/yarn):

```
yarn add fullcalendar-timeline-infinite-scroll-wrapper
```

You will need to use with [Fullcalendar react](https://www.npmjs.com/package/@fullcalendar/react) and plugins [@fullcalendar/resource-timeline](https://www.npmjs.com/package/@fullcalendar/resource-timeline)

## Demo
[View demo here](https://masterhuyenthoai.github.io/pages/)

## Usage

Example code:

```tsx
<FullCalendarInfiniteScrollWrapper
    scrollOptions={{slotMinWidth: 80}}
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
                center: "",
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

```

You can view full code at [here](https://github.com/vanduongit/Fullcalendar-infinite-scroll-wrapper/tree/main/examples/fullcalendar-timeline-infinite-scroll-example)

## Contribution
Open an issue and your problem will be solved.
