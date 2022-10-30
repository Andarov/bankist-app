'use strict';
// Data
const accounts = [
  {
    owner: 'Jonas Schmedtmann',
    movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
    interestRate: 1.2,
    pin: 1111,
  },
  {
    owner: 'Jessica Davis',
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 2222,
  },
  {
    owner: 'Steven Thomas Williams',
    movements: [200, -200, 340, -300, -20, 50, 400, -460],
    interestRate: 0.7,
    pin: 3333,
  },
  {
    owner: 'Sarah Smith',
    movements: [430, 1000, 700, 50, 90],
    interestRate: 1,
    pin: 4444,
  },
]

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app-wrapper');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

// Displayni yangilash
const updateUI = function(account){
  displayMov(account.movements);
  displayBalance(account);
  displaySummary(account)
  displayDate()
}

// User yaratish
const createUser = function(accs){
  accs.forEach(function(acc){
    acc.user = acc.owner.toLowerCase().split(' ').map(name => name[0]).join('');
  })
}
createUser(accounts);

// Displayga joriy vaqtni chiqarish
const displayDate = function(){
  const now = new Date()
  const options = {
    hour: 'numeric',
    minute: 'numeric',
    day: 'numeric',
    month: '2-digit',
    year: 'numeric',
  }
  const locale = navigator.language;
  labelDate.textContent = new Intl.DateTimeFormat(locale, options).format(now)
}


// Login qilish
let currentAcc; 
btnLogin.addEventListener('click', function(e){
  e.preventDefault()
  currentAcc = accounts.find(acc => acc.user === inputLoginUsername.value)
  if(currentAcc.pin === Number(inputLoginPin.value)){
    containerApp.style.opacity = 100;
    inputLoginPin.value = inputLoginUsername.value = '';
    labelWelcome.textContent = `Xush kelibsiz, ${currentAcc.owner.split(' ')[0]}`;
  }
  

  updateUI(currentAcc)
})

// Movementlarni displayga chiqarish
const displayMov = function(movements, sort = false){
  containerMovements.innerHTML = '';
  const movs = sort ? movements.slice().sort((a, b)=> b-a) : movements
  movs.forEach(function(mov, i){
    const type = mov > 0 ? 'kirim' : 'chiqim';
    const html = `
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__value">${mov}€</div>
    </div>
    `
    containerMovements.insertAdjacentHTML('afterbegin', html)
  })
}

// Umumiy balansni chiqarish va uni displayga chiqarish
const displayBalance = function(account) {
  account.balance = account.movements.reduce((acc, cur) => acc + cur, 0)
  labelBalance.innerHTML = `${account.balance}€`;
}

// Outcome income va interestlarmni hisoblash
const displaySummary = function(account){
  const incomes = account.movements.filter(mov => mov > 0).reduce((acc, mov) => acc + mov)
  labelSumIn.innerHTML = `${incomes}€`
  const outcomes = account.movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov)
  labelSumOut.innerHTML = `${Math.abs(outcomes)}€`
  const interst = account.movements.filter(mov => mov > 0).map(deposit => (deposit * account.interestRate)/100).reduce((acc, mov) => acc + mov)
  labelSumInterest.innerHTML = `${Math.floor(interst)}€`
}

// Sortlash
let sorted = false
btnSort.addEventListener('click', function(e){
  e.preventDefault();
  displayMov(currentAcc.movements, !sorted)
  sorted = !sorted
})

// Transfer qilish
btnTransfer.addEventListener('click', function(e){
  e.preventDefault();
  const reciever = accounts.find(acc => acc.user === inputTransferTo.value)
  const amount = Number(inputTransferAmount.value)
  if(amount > 0 && currentAcc.balance >= amount && reciever.user !== currentAcc.user) {
    currentAcc.movements.push(-amount)
    currentAcc.balance - amount
    reciever.movements.push(amount)
    reciever.balance + amount
    updateUI(currentAcc)
    inputTransferTo.value = inputTransferAmount.value = ''
  }
})

// Kredit olish
btnLoan.addEventListener('click', function(e){
  e.preventDefault();
  const loan = Number(Math.floor(inputLoanAmount.value));
  if(loan > 0 && currentAcc.movements.some(mov => mov >= loan * 0.1)){
    currentAcc.movements.push(loan);
    inputLoanAmount.value = ''
    updateUI(currentAcc)
  }
})

// Tizimdan chiqish
btnClose.addEventListener('click', function(e){
  e.preventDefault();
  if(currentAcc.pin === Number(inputClosePin.value) && currentAcc.user === inputCloseUsername.value){
    const delAcc = accounts.findIndex(acc => acc.user === currentAcc.user)
    accounts.splice(delAcc, 1)
    containerApp.style.opacity = 0
    inputClosePin.value = inputCloseUsername.value = ''
    labelWelcome.textContent = 'Log in to get started'
  }
})  



