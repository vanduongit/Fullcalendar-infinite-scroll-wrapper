import { useState, useCallback, useMemo, useRef, useEffect } from 'react';

function toInteger(dirtyNumber) {
  if (dirtyNumber === null || dirtyNumber === true || dirtyNumber === false) {
    return NaN;
  }

  var number = Number(dirtyNumber);

  if (isNaN(number)) {
    return number;
  }

  return number < 0 ? Math.ceil(number) : Math.floor(number);
}

function requiredArgs(required, args) {
  if (args.length < required) {
    throw new TypeError(required + ' argument' + (required > 1 ? 's' : '') + ' required, but only ' + args.length + ' present');
  }
}

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }
/**
 * @name toDate
 * @category Common Helpers
 * @summary Convert the given argument to an instance of Date.
 *
 * @description
 * Convert the given argument to an instance of Date.
 *
 * If the argument is an instance of Date, the function returns its clone.
 *
 * If the argument is a number, it is treated as a timestamp.
 *
 * If the argument is none of the above, the function returns Invalid Date.
 *
 * **Note**: *all* Date arguments passed to any *date-fns* function is processed by `toDate`.
 *
 * @param {Date|Number} argument - the value to convert
 * @returns {Date} the parsed date in the local time zone
 * @throws {TypeError} 1 argument required
 *
 * @example
 * // Clone the date:
 * const result = toDate(new Date(2014, 1, 11, 11, 30, 30))
 * //=> Tue Feb 11 2014 11:30:30
 *
 * @example
 * // Convert the timestamp to date:
 * const result = toDate(1392098430000)
 * //=> Tue Feb 11 2014 11:30:30
 */

function toDate(argument) {
  requiredArgs(1, arguments);
  var argStr = Object.prototype.toString.call(argument); // Clone the date

  if (argument instanceof Date || _typeof(argument) === 'object' && argStr === '[object Date]') {
    // Prevent the date to lose the milliseconds when passed to new Date() in IE10
    return new Date(argument.getTime());
  } else if (typeof argument === 'number' || argStr === '[object Number]') {
    return new Date(argument);
  } else {
    if ((typeof argument === 'string' || argStr === '[object String]') && typeof console !== 'undefined') {
      // eslint-disable-next-line no-console
      console.warn("Starting with v2.0.0-beta.1 date-fns doesn't accept strings as date arguments. Please use `parseISO` to parse strings. See: https://github.com/date-fns/date-fns/blob/master/docs/upgradeGuide.md#string-arguments"); // eslint-disable-next-line no-console

      console.warn(new Error().stack);
    }

    return new Date(NaN);
  }
}

/**
 * @name addDays
 * @category Day Helpers
 * @summary Add the specified number of days to the given date.
 *
 * @description
 * Add the specified number of days to the given date.
 *
 * @param {Date|Number} date - the date to be changed
 * @param {Number} amount - the amount of days to be added. Positive decimals will be rounded using `Math.floor`, decimals less than zero will be rounded using `Math.ceil`.
 * @returns {Date} - the new date with the days added
 * @throws {TypeError} - 2 arguments required
 *
 * @example
 * // Add 10 days to 1 September 2014:
 * const result = addDays(new Date(2014, 8, 1), 10)
 * //=> Thu Sep 11 2014 00:00:00
 */

function addDays(dirtyDate, dirtyAmount) {
  requiredArgs(2, arguments);
  var date = toDate(dirtyDate);
  var amount = toInteger(dirtyAmount);

  if (isNaN(amount)) {
    return new Date(NaN);
  }

  if (!amount) {
    // If 0 days, no-op to avoid changing times in the hour before end of DST
    return date;
  }

  date.setDate(date.getDate() + amount);
  return date;
}

/**
 * @name addMonths
 * @category Month Helpers
 * @summary Add the specified number of months to the given date.
 *
 * @description
 * Add the specified number of months to the given date.
 *
 * @param {Date|Number} date - the date to be changed
 * @param {Number} amount - the amount of months to be added. Positive decimals will be rounded using `Math.floor`, decimals less than zero will be rounded using `Math.ceil`.
 * @returns {Date} the new date with the months added
 * @throws {TypeError} 2 arguments required
 *
 * @example
 * // Add 5 months to 1 September 2014:
 * const result = addMonths(new Date(2014, 8, 1), 5)
 * //=> Sun Feb 01 2015 00:00:00
 */

function addMonths(dirtyDate, dirtyAmount) {
  requiredArgs(2, arguments);
  var date = toDate(dirtyDate);
  var amount = toInteger(dirtyAmount);

  if (isNaN(amount)) {
    return new Date(NaN);
  }

  if (!amount) {
    // If 0 months, no-op to avoid changing times in the hour before end of DST
    return date;
  }

  var dayOfMonth = date.getDate(); // The JS Date object supports date math by accepting out-of-bounds values for
  // month, day, etc. For example, new Date(2020, 0, 0) returns 31 Dec 2019 and
  // new Date(2020, 13, 1) returns 1 Feb 2021.  This is *almost* the behavior we
  // want except that dates will wrap around the end of a month, meaning that
  // new Date(2020, 13, 31) will return 3 Mar 2021 not 28 Feb 2021 as desired. So
  // we'll default to the end of the desired month by adding 1 to the desired
  // month and using a date of 0 to back up one day to the end of the desired
  // month.

  var endOfDesiredMonth = new Date(date.getTime());
  endOfDesiredMonth.setMonth(date.getMonth() + amount + 1, 0);
  var daysInMonth = endOfDesiredMonth.getDate();

  if (dayOfMonth >= daysInMonth) {
    // If we're already at the end of the month, then this is the correct date
    // and we're done.
    return endOfDesiredMonth;
  } else {
    // Otherwise, we now know that setting the original day-of-month value won't
    // cause an overflow, so set the desired day-of-month. Note that we can't
    // just set the date of `endOfDesiredMonth` because that object may have had
    // its time changed in the unusual case where where a DST transition was on
    // the last day of the month and its local time was in the hour skipped or
    // repeated next to a DST transition.  So we use `date` instead which is
    // guaranteed to still have the original time.
    date.setFullYear(endOfDesiredMonth.getFullYear(), endOfDesiredMonth.getMonth(), dayOfMonth);
    return date;
  }
}

/**
 * @name subDays
 * @category Day Helpers
 * @summary Subtract the specified number of days from the given date.
 *
 * @description
 * Subtract the specified number of days from the given date.
 *
 * @param {Date|Number} date - the date to be changed
 * @param {Number} amount - the amount of days to be subtracted. Positive decimals will be rounded using `Math.floor`, decimals less than zero will be rounded using `Math.ceil`.
 * @returns {Date} the new date with the days subtracted
 * @throws {TypeError} 2 arguments required
 *
 * @example
 * // Subtract 10 days from 1 September 2014:
 * const result = subDays(new Date(2014, 8, 1), 10)
 * //=> Fri Aug 22 2014 00:00:00
 */

function subDays(dirtyDate, dirtyAmount) {
  requiredArgs(2, arguments);
  var amount = toInteger(dirtyAmount);
  return addDays(dirtyDate, -amount);
}

/**
 * @name subMonths
 * @category Month Helpers
 * @summary Subtract the specified number of months from the given date.
 *
 * @description
 * Subtract the specified number of months from the given date.
 *
 * @param {Date|Number} date - the date to be changed
 * @param {Number} amount - the amount of months to be subtracted. Positive decimals will be rounded using `Math.floor`, decimals less than zero will be rounded using `Math.ceil`.
 * @returns {Date} the new date with the months subtracted
 * @throws {TypeError} 2 arguments required
 *
 * @example
 * // Subtract 5 months from 1 February 2015:
 * const result = subMonths(new Date(2015, 1, 1), 5)
 * //=> Mon Sep 01 2014 00:00:00
 */

function subMonths(dirtyDate, dirtyAmount) {
  requiredArgs(2, arguments);
  var amount = toInteger(dirtyAmount);
  return addMonths(dirtyDate, -amount);
}

function checkIsMacDevice() {
    return window.navigator.userAgent.toUpperCase().indexOf("MAC") >= 0;
}
function throttle(func, limit) {
    var inThrottle;
    var lastResult;
    return function () {
        var args = arguments;
        var context = this;
        if (!inThrottle) {
            inThrottle = true;
            setTimeout(function () { return (inThrottle = false); }, limit);
            lastResult = func.apply(context, args);
        }
        return lastResult;
    };
}

var defaultOptions = {
    stepDates: 20,
    numberOfStepLoadData: 2,
    numberOfDatesFromCurrentDate: 15,
    slotMinWidth: 80,
};
function getScroller(calendarDom) {
    return calendarDom.querySelector("tfoot th:nth-child(3) .fc-scroller");
}
function useMultiCalendarScroll(calendarRef, scrollOptions, fetchMore, firstLoad) {
    var _a = scrollOptions.stepDates, stepDates = _a === void 0 ? defaultOptions.stepDates : _a, _b = scrollOptions.numberOfDatesFromCurrentDate, numberOfDatesFromCurrentDate = _b === void 0 ? defaultOptions.numberOfDatesFromCurrentDate : _b, _c = scrollOptions.numberOfStepLoadData, numberOfStepLoadData = _c === void 0 ? defaultOptions.numberOfStepLoadData : _c, _d = scrollOptions.slotMinWidth, slotMinWidth = _d === void 0 ? defaultOptions.slotMinWidth : _d;
    var LATENCY_SCROLL = slotMinWidth * 3; // pixel unit, latency to scroll to start or end
    var _e = useState(0), days = _e[0], setDays = _e[1];
    var _f = useState(), calendarDom = _f[0], setCalendarDom = _f[1];
    var getCalendarApi = useCallback(function getCalendarApi() {
        var current = calendarRef.current;
        return current === null || current === void 0 ? void 0 : current.getApi();
    }, [calendarRef]);
    var handleFetchMore = useCallback(function handleFetchMore(currentStartDate, currentEndDate, distanceDays) {
        var activeStartDate = addDays(currentStartDate, numberOfStepLoadData * distanceDays);
        var activeEndDate = addDays(currentEndDate, numberOfStepLoadData * distanceDays);
        fetchMore(activeStartDate, activeEndDate, distanceDays);
    }, [fetchMore]);
    var calendarMove = useCallback(function calendarMove(steps) {
        if (!calendarDom) {
            return;
        }
        var calendarApi = getCalendarApi();
        if (calendarApi === null || calendarApi === void 0 ? void 0 : calendarApi.view) {
            var _a = calendarApi.view, activeStart_1 = _a.activeStart, activeEnd = _a.activeEnd;
            var scroller_1 = getScroller(calendarDom);
            if (!scroller_1) {
                return;
            }
            var scrollLeft = scroller_1.scrollLeft;
            var scrollDaysBackToCurrentDateView_1 = Math.floor((scrollLeft - steps * slotMinWidth) / slotMinWidth);
            var remain_1 = scrollLeft -
                steps * slotMinWidth -
                scrollDaysBackToCurrentDateView_1 * slotMinWidth;
            calendarApi.batchRendering(function () {
                setTimeout(function () {
                    calendarApi.gotoDate(addDays(activeStart_1, steps));
                    if (!scrollerClickedRef.current) {
                        calendarApi.scrollToTime({ days: scrollDaysBackToCurrentDateView_1 });
                        scroller_1.scrollLeft += remain_1;
                    }
                    else {
                        // Make scroll move to load more data when user keep click on scrollbar
                        scroller_1.scrollLeft += remain_1 > 0 ? -1 : 1;
                    }
                }, 100);
            });
            handleFetchMore(activeStart_1, activeEnd, steps);
        }
    }, [calendarDom, getCalendarApi, handleFetchMore]);
    var throttleCalendarMove = useMemo(function () { return throttle(calendarMove, 1000); }, [calendarMove]);
    var scrollerClickedRef = useRef(false);
    var navigateCalendar = useCallback(function (event) {
        var _a = event.target, scrollWidth = _a.scrollWidth, scrollLeft = _a.scrollLeft, clientWidth = _a.clientWidth;
        var nearlyStart = scrollLeft - LATENCY_SCROLL < 0;
        if (nearlyStart) {
            throttleCalendarMove(-stepDates);
        }
        var nearlyEnd = scrollWidth - scrollLeft < clientWidth + LATENCY_SCROLL;
        if (nearlyEnd) {
            throttleCalendarMove(stepDates);
        }
    }, [throttleCalendarMove]);
    useEffect(function () {
        if (!calendarDom) {
            return;
        }
        var scroller = getScroller(calendarDom);
        if (!scroller) {
            return;
        }
        function handleScrollEvent(event) {
            if (!event.target) {
                return;
            }
            navigateCalendar(event);
        }
        scroller.addEventListener("scroll", handleScrollEvent);
        if (checkIsMacDevice()) {
            var scrollerMacOs1 = calendarDom.querySelector("tbody td:nth-child(3) .fc-scroller");
            if (scrollerMacOs1) {
                scrollerMacOs1.className += " fc-scroller-hide-scroll";
            }
            var scrollerMacOs2 = calendarDom.querySelector("thead th:nth-child(3) .fc-scroller");
            if (scrollerMacOs2) {
                scrollerMacOs2.className += " fc-scroller-hide-scroll";
            }
        }
        return function () {
            scroller.removeEventListener("scroll", handleScrollEvent);
        };
    }, [calendarDom, navigateCalendar]);
    useEffect(function () {
        if (!calendarDom) {
            return;
        }
        var scroller = getScroller(calendarDom);
        function mousedownEvent() {
            scrollerClickedRef.current = true;
        }
        function mouseupEvent() {
            scrollerClickedRef.current = false;
        }
        if (scroller) {
            scroller.addEventListener("mousedown", mousedownEvent);
            scroller.addEventListener("mouseup", mouseupEvent);
            var clientWidth = scroller.clientWidth;
            var numberOfDatesOnView = Math.round(clientWidth / slotMinWidth);
            setDays(Math.max(numberOfDatesOnView + 40, 45));
        }
        return function () {
            if (scroller) {
                scroller.removeEventListener("mousedown", mousedownEvent);
                scroller.removeEventListener("mouseup", mouseupEvent);
            }
        };
    }, [calendarDom]);
    useEffect(function () {
        setTimeout(function () {
            var calendarApi = getCalendarApi();
            if (calendarApi === null || calendarApi === void 0 ? void 0 : calendarApi.view) {
                var _a = calendarApi.view, activeStart = _a.activeStart, activeEnd = _a.activeEnd;
                firstLoad(subDays(activeStart, stepDates * numberOfStepLoadData + 1), addDays(activeEnd, stepDates * numberOfStepLoadData + 1));
            }
        }, 500); // wait multicalendar first load done.
    }, []);
    useEffect(function () {
        document.body.style.overscrollBehaviorX = "none";
        return function () {
            document.body.style.overscrollBehaviorX = "auto";
        };
    }, []);
    useEffect(function () {
        var calendar = document.querySelector(".multiCalendar");
        if (calendar) {
            setCalendarDom(calendar);
        }
    }, []);
    var handleMoveToDate = useCallback(function (date) {
        var calendarApi = getCalendarApi();
        calendarApi === null || calendarApi === void 0 ? void 0 : calendarApi.batchRendering(function () {
            setTimeout(function () {
                calendarApi.gotoDate(subDays(date, 15));
                calendarApi.scrollToTime({
                    days: 15
                });
                var _a = calendarApi.view, activeStart = _a.activeStart, activeEnd = _a.activeEnd;
                firstLoad(subDays(activeStart, stepDates * numberOfStepLoadData + 1), addDays(activeEnd, stepDates * numberOfStepLoadData + 1));
            }, 0);
        });
    }, [firstLoad, getCalendarApi]);
    var handleMove = useCallback(function handleMove(direction) {
        var calendarApi = getCalendarApi();
        if (calendarApi) {
            var activeStart_2 = calendarApi.view.activeStart;
            if (direction === "next") {
                calendarApi.batchRendering(function () {
                    setTimeout(function () {
                        calendarApi.gotoDate(addMonths(activeStart_2, 1));
                        calendarApi.scrollToTime({
                            days: numberOfDatesFromCurrentDate
                        });
                        var _a = calendarApi.view, newActiveStart = _a.activeStart, newActiveEnd = _a.activeEnd;
                        fetchMore(newActiveStart, newActiveEnd, stepDates * numberOfStepLoadData);
                    }, 0);
                });
            }
            else if (direction === "prev") {
                setTimeout(function () {
                    calendarApi.gotoDate(subMonths(activeStart_2, 1));
                    calendarApi.scrollToTime({
                        days: numberOfDatesFromCurrentDate
                    });
                    var _a = calendarApi.view, newActiveStart = _a.activeStart, newActiveEnd = _a.activeEnd;
                    fetchMore(newActiveStart, newActiveEnd, -stepDates * numberOfStepLoadData);
                }, 0);
            }
            else if (direction === "today") {
                calendarApi.batchRendering(function () {
                    setTimeout(function () {
                        calendarApi.gotoDate(subDays(new Date(), 15));
                        calendarApi.scrollToTime({
                            days: numberOfDatesFromCurrentDate
                        });
                    }, 0);
                });
            }
        }
    }, [fetchMore, getCalendarApi]);
    return [days, handleMoveToDate, handleMove];
}

var FullCalendarInfiniteScrollWrapper = function (_a) {
    var children = _a.children, fetchMore = _a.fetchMore, firstLoad = _a.firstLoad, scrollOptions = _a.scrollOptions;
    var calendarRef = useRef();
    var _b = useMultiCalendarScroll(calendarRef, scrollOptions, fetchMore, firstLoad), days = _b[0], moveToDate = _b[1], handleMove = _b[2];
    return children({
        ref: calendarRef,
        numberDisplayDaysOfCalendar: days,
        moveToDate: moveToDate,
        onMoveDirection: handleMove
    });
};

export { FullCalendarInfiniteScrollWrapper, useMultiCalendarScroll };
//# sourceMappingURL=index.js.map
