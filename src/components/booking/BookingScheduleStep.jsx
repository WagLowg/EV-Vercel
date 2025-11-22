import React from "react";

const BookingScheduleStep = ({
  calendarLabel,
  handlePrevMonth,
  handleNextMonth,
  canGoPrevMonth,
  canGoNextMonth,
  calendarDays,
  today,
  maxBookingDate,
  formData,
  handleDateSelection,
  isDateBefore,
  isDateAfter,
  isSameDay,
  timeSlots,
  isTimeSlotInPast,
  handleInputChange,
}) => (
  <div className="booking-step-content">
    <div className="form-section">
      <h2>
        <span className="form-section-icon">📅</span>
        Cả Văn Dịch Vụ
      </h2>

      <div className="calendar-section">
        <div className="calendar-header">
          <h3 style={{ textTransform: "capitalize" }}>{calendarLabel}</h3>
          <div className="calendar-nav-btns">
            <button
              className="calendar-nav-btn"
              onClick={handlePrevMonth}
              disabled={!canGoPrevMonth}
            >
              ‹
            </button>
            <button
              className="calendar-nav-btn"
              onClick={handleNextMonth}
              disabled={!canGoNextMonth}
            >
              ›
            </button>
          </div>
        </div>

        <div className="calendar-grid">
          <div className="calendar-weekdays">
            <div className="calendar-weekday">Th 2</div>
            <div className="calendar-weekday">Th 3</div>
            <div className="calendar-weekday">Th 4</div>
            <div className="calendar-weekday">Th 5</div>
            <div className="calendar-weekday">Th 6</div>
            <div className="calendar-weekday">Th 7</div>
            <div className="calendar-weekday">CN</div>
          </div>

          <div className="calendar-days">
            {calendarDays.map((item, index) => {
              if (!item) {
                return (
                  <div key={`empty-${index}`} className="calendar-day empty" />
                );
              }

              const { day, date } = item;
              const isBeforeToday = isDateBefore(date, today);
              const isAfterLimit = isDateAfter(date, maxBookingDate);
              const selectable = !isBeforeToday && !isAfterLimit;
              const isSelected =
                formData.selectedDate && isSameDay(formData.selectedDate, date);

              return (
                <button
                  key={date.toISOString()}
                  className={`calendar-day ${
                    selectable ? "available" : "disabled"
                  } ${isSelected ? "selected" : ""}`}
                  onClick={() => selectable && handleDateSelection(date)}
                  disabled={!selectable}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {formData.selectedDate && (
        <div className="time-slots-section">
          <h4>Khung thời gian khả dụng</h4>
          <div className="time-slots-grid">
            {timeSlots.map((time) => {
              const disabled = isTimeSlotInPast(time, formData.selectedDate);
              const isSelected = formData.selectedTime === time;
              return (
                <button
                  key={time}
                  className={`time-slot ${isSelected ? "selected" : ""} ${
                    disabled ? "disabled" : ""
                  }`}
                  onClick={() => !disabled && handleInputChange("selectedTime", time)}
                  disabled={disabled}
                >
                  {time}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  </div>
);

export default BookingScheduleStep;

