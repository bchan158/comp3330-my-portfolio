"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function GitHubCalendar({
  username,
  themeColor,
  backgroundColor,
}) {
  const calendarRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  // Set attributes and mark as ready
  useEffect(() => {
    if (calendarRef.current) {
      calendarRef.current.setAttribute("username", username);

      if (themeColor) {
        calendarRef.current.setAttribute("theme-color", themeColor);
      } else {
        calendarRef.current.removeAttribute("theme-color");
      }

      if (backgroundColor) {
        calendarRef.current.setAttribute("background-color", backgroundColor);
      } else {
        calendarRef.current.removeAttribute("background-color");
      }

      // Verify element is in DOM before marking as ready
      const checkReady = () => {
        const element = document.getElementById("calendar-component");
        if (element && element.getAttribute("username")) {
          setIsReady(true);
        } else {
          // Retry if not ready
          setTimeout(checkReady, 50);
        }
      };

      // Start checking after a brief delay
      const timer = setTimeout(checkReady, 100);

      return () => clearTimeout(timer);
    }
  }, [username, themeColor, backgroundColor]);

  // Add styles to customize calendar layout after it renders
  useEffect(() => {
    const styleId = "github-calendar-custom-styles";

    const applyStyles = () => {
      // Check if calendar has rendered
      const calendarElement = document.getElementById("calendar-component");
      if (
        !calendarElement ||
        !calendarElement.querySelector(".calendar-wrapper")
      ) {
        // Calendar not ready yet, retry
        setTimeout(applyStyles, 100);
        return;
      }

      // Ensure weekdays container exists and is visible - override inline styles
      const weekdaysContainer =
        calendarElement.querySelector("#weekdays-name-container") ||
        calendarElement.querySelector("aside#weekdays-name-container");

      if (weekdaysContainer) {
        console.log("Weekdays container found, making visible");
        weekdaysContainer.style.cssText = `
          display: flex !important;
          flex-direction: column !important;
          visibility: visible !important;
          opacity: 1 !important;
          width: 40px !important;
          min-width: 40px !important;
          margin-right: 8px !important;
          flex-shrink: 0 !important;
          margin-left: 0 !important;
        `;

        // Also ensure each weekday-name is visible
        const weekdayNames =
          weekdaysContainer.querySelectorAll(".weekday-name");
        console.log(`Found ${weekdayNames.length} weekday names`);
        weekdayNames.forEach((day) => {
          day.style.cssText = `
            display: flex !important;
            align-items: center !important;
            justify-content: flex-end !important;
            width: 100% !important;
            min-width: 100% !important;
            height: 11px !important;
            margin-bottom: 3px !important;
            text-align: right !important;
            visibility: visible !important;
            opacity: 1 !important;
            font-size: 12px !important;
            line-height: 11px !important;
            color: inherit !important;
            padding: 0 !important;
          `;
        });
      } else {
        console.warn("Weekdays container not found in calendar element");
      }

      // Remove existing style if any
      const existingStyle = document.getElementById(styleId);
      if (existingStyle) {
        existingStyle.remove();
      }

      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        #calendar-component {
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          width: 100% !important;
        }
        
        /* Title - center aligned, above everything */
        #calendar-component h1 {
          width: 100% !important;
          text-align: center !important;
          margin-bottom: 1rem !important;
          margin-top: 0 !important;
          order: 1 !important;
        }
        
        /* Months - spread across entire graph width, above the graph */
        #calendar-component .months {
          width: 100% !important;
          margin-bottom: 0.5rem !important;
          order: 2 !important;
          display: flex !important;
          justify-content: space-between !important;
          align-items: center !important;
          padding-left: 48px !important;
          padding-right: 0 !important;
        }
        
        #calendar-component .months .month {
          flex: 1 !important;
          text-align: left !important;
          min-width: 0 !important;
        }
        
        /* Calendar wrapper - contains weekdays and graph */
        #calendar-component .calendar-wrapper {
          width: 100% !important;
          order: 3 !important;
          display: flex !important;
          flex-direction: row !important;
          align-items: flex-start !important;
        }
        
        /* Weekdays - keep on left side, ensure visible - override ALL styles */
        #calendar-component #weekdays-name-container,
        #calendar-component aside#weekdays-name-container {
          display: flex !important;
          flex-direction: column !important;
          margin-right: 8px !important;
          min-width: 40px !important;
          width: 40px !important;
          order: 1 !important;
          visibility: visible !important;
          opacity: 1 !important;
          flex-shrink: 0 !important;
          margin-left: 0 !important;
          background-color: transparent !important;
        }
        
        #calendar-component #weekdays-name-container .weekday-name,
        #calendar-component aside#weekdays-name-container .weekday-name {
          width: 100% !important;
          min-width: 100% !important;
          height: 11px !important;
          margin-bottom: 3px !important;
          text-align: right !important;
          display: flex !important;
          align-items: center !important;
          justify-content: flex-end !important;
          visibility: visible !important;
          opacity: 1 !important;
          color: inherit !important;
          font-size: 12px !important;
          line-height: 11px !important;
          padding: 0 !important;
        }
        
        /* Calendar graph - takes remaining space */
        #calendar-component #calendar {
          flex: 1 !important;
          order: 2 !important;
        }
      `;
      document.head.appendChild(style);

      // Retry applying inline styles multiple times to override widget's inline styles
      const retryApplyStyles = (attempt = 0) => {
        if (attempt > 5) return; // Max 5 retries

        setTimeout(() => {
          const weekdaysContainerRetry =
            calendarElement.querySelector("#weekdays-name-container") ||
            calendarElement.querySelector("aside#weekdays-name-container");

          if (weekdaysContainerRetry) {
            weekdaysContainerRetry.style.cssText = `
              display: flex !important;
              flex-direction: column !important;
              visibility: visible !important;
              opacity: 1 !important;
              width: 40px !important;
              min-width: 40px !important;
              margin-right: 8px !important;
              flex-shrink: 0 !important;
              margin-left: 0 !important;
            `;

            const weekdayNamesRetry =
              weekdaysContainerRetry.querySelectorAll(".weekday-name");
            weekdayNamesRetry.forEach((day) => {
              day.style.cssText = `
                display: flex !important;
                align-items: center !important;
                justify-content: flex-end !important;
                width: 100% !important;
                min-width: 100% !important;
                height: 11px !important;
                margin-bottom: 3px !important;
                text-align: right !important;
                visibility: visible !important;
                opacity: 1 !important;
                font-size: 12px !important;
                line-height: 11px !important;
                color: inherit !important;
                padding: 0 !important;
              `;
            });
          }

          // Continue retrying if not found yet
          if (attempt < 5) {
            retryApplyStyles(attempt + 1);
          }
        }, 300 * (attempt + 1)); // Increasing delay
      };

      retryApplyStyles();
    };

    // Start applying styles after a delay to ensure calendar is rendered
    const timer = setTimeout(applyStyles, 500);

    return () => {
      clearTimeout(timer);
      const styleToRemove = document.getElementById(styleId);
      if (styleToRemove) {
        styleToRemove.remove();
      }
    };
  }, [isReady]);

  return (
    <>
      <Card className="m-3">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">GitHub Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="w-full overflow-x-auto">
            <div
              ref={calendarRef}
              id="calendar-component"
              className="min-h-[200px]"
            />
          </div>
          <p className="text-sm text-muted-foreground text-center">
            View my contributions on{" "}
            <a
              href={`https://github.com/${username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              GitHub
            </a>
          </p>
        </CardContent>
      </Card>
      {isReady && (
        <Script
          src="https://cdn.jsdelivr.net/gh/imananoosheh/github-contributions-fetch@latest/github_calendar_widget.js"
          strategy="afterInteractive"
          type="module"
          onLoad={() => {
            // Verify the calendar was initialized, if not, try to re-initialize
            setTimeout(() => {
              const element = document.getElementById("calendar-component");
              if (element && !element.querySelector(".calendar-wrapper")) {
                // Calendar didn't render, try to manually trigger
                if (window.initGitHubCalendar) {
                  window.initGitHubCalendar();
                }
              }
            }, 500);
          }}
        />
      )}
    </>
  );
}
