import React from "react";
import { CalendarScrollOptions } from "../types";
export declare function useMultiCalendarScroll(calendarRef: React.RefObject<any | undefined>, scrollOptions: CalendarScrollOptions, fetchMore: (currentStartDate: Date, currentEndDate: Date, distanceDays: number) => void, firstLoad: (startDate: Date, endDate: Date) => void): readonly [number, (date: Date) => void, (direction: "next" | "prev" | "today") => void];
