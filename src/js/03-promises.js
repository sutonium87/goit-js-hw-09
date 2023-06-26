import Notiflix from 'notiflix';

// Declaration of the function that creates a promise an contains the logic for resolve or reject
function createPromise(position, delay) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const shouldResolve = Math.random() > 0.3;
      if (shouldResolve) {
        resolve({ position, delay });
      } else {
        reject({ position, delay });
      }
    }, delay);
  });
}

//Handling the submit of the form
document.querySelector('.form').addEventListener('submit', function (event) {
  event.preventDefault();

  const firstDelay = parseInt(this.elements.delay.value);
  const step = parseInt(this.elements.step.value);
  const amount = parseInt(this.elements.amount.value);

  let currentDelay = firstDelay;

  // For the amount entered in the browser amessage will be displayed depending on the state of createPromise function
  for (let i = 1; i <= amount; i++) {
    createPromise(i, currentDelay)
      .then(({ position, delay }) => {
        Notiflix.Notify.success(
          `✅ Fulfilled promise ${position} in ${delay}ms`
        );
      })
      .catch(({ position, delay }) => {
        Notiflix.Notify.failure(
          `❌ Rejected promise ${position} in ${delay}ms`
        );
      });
    // the delay is incremented with step value for each interation
    currentDelay += step;
  }
});
