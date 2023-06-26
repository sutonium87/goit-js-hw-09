import flatpickr from 'flatpickr';
import '/node_modules/flatpickr/dist/flatpickr.min.css';
import Notiflix from 'notiflix';

const datetimePicker = document.getElementById('datetime-picker');
const startButton = document.querySelector('[data-start]');
const daysValue = document.querySelector('[data-days]');
const hoursValue = document.querySelector('[data-hours]');
const minutesValue = document.querySelector('[data-minutes]');
const secondsValue = document.querySelector('[data-seconds]');

let countdownInterval = null;
let countdown = 0;

const convertMs = ms => {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
};

const addLeadingZero = value => {
  return value.toString().padStart(2, '0');
};

flatpickr('#datetime-picker', {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];

    if (selectedDate <= new Date()) {
      Notiflix.Notify.warning('Please choose a date in the future');
      startButton.disabled = true;
    } else {
      startButton.disabled = false;
    }
  },
});

startButton.addEventListener('click', () => {
  const selectedDate = new Date(datetimePicker.value);
  const currentDate = new Date();
  countdown = selectedDate.getTime() - currentDate.getTime();

  if (countdown <= 0) {
    Notiflix.Notify.warning('Please choose a date in the future');
    return;
  }

  startButton.disabled = true;
});

countdownInterval = setInterval(() => {
  if (countdown > 0) {
    const timeLeft = convertMs(countdown);
    daysValue.textContent = addLeadingZero(timeLeft.days);
    hoursValue.textContent = addLeadingZero(timeLeft.hours);
    minutesValue.textContent = addLeadingZero(timeLeft.minutes);
    secondsValue.textContent = addLeadingZero(timeLeft.seconds);

    countdown -= 1000;

    if (countdown <= 0) {
      clearInterval(countdownInterval);
      countdownInterval = null;
      startButton.disabled = false;
      daysValue.textContent = addLeadingZero(0);
      hoursValue.textContent = addLeadingZero(0);
      minutesValue.textContent = addLeadingZero(0);
      secondsValue.textContent = addLeadingZero(0);
      Notiflix.Notify.success(
        'Countdown finished. Refresh the page for a new countdown!'
      );
    }
  }
}, 1000);
