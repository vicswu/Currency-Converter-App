document.querySelector(".extra-currency-btn").addEventListener("mousedown", ExtraCurrencyBtnClick);

function ExtraCurrencyBtnClick() {
    document.querySelector(".extra-currency-btn").classList.toggle("open");
}

const addCurrency = document.querySelector(".extra-currency");
const currenciesList = document.querySelector(".currencies");

const dataURL = "https://api.exchangeratesapi.io/latest";

const initialCurrencies = ["CAD", "USD", "EUR", "JPY", "GBP"];
let baseCurrency;
let baseCurrencyAmount;
let currencies = [{
        name: "Canadian Dollar",
        abbreviation: "CAD",
        symbol: "\u0024",
        flagURL: "https://www.geonames.org/flags/x/ca.gif"
    },
    {
        name: "US Dollar",
        abbreviation: "USD",
        symbol: "\u0024",
        flagURL: "https://www.geonames.org/flags/x/us.gif"
    },
    {
        name: "Euro",
        abbreviation: "EUR",
        symbol: "\u20AC",
        flagURL: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Flag_of_Europe.svg/2560px-Flag_of_Europe.svg.png"
    },
    {
        name: "Japanese Yen",
        abbreviation: "JPY",
        symbol: "\u00A5",
        flagURL: "https://www.geonames.org/flags/x/jp.gif"
    },
    {
        name: "Great Britain Pound",
        abbreviation: "GBD",
        symbol: "\u00A3",
        flagURL: "https://www.geonames.org/flags/x/uk.gif"
    },
    {
        name: "Australian Dollar",
        abbreviation: "AUD",
        symbol: "\u0024",
        flagURL: "https://www.geonames.org/flags/x/au.gif"
    },
    {
        name: "Chinese Yuan",
        abbreviation: "CNY",
        symbol: "\u00A5",
        flagURL: "https://img.geonames.org/flags/x/cn.gif"
    },
    {
        name: "Swiss Franc",
        abbreviation: "CHF",
        symbol: "\u0043\u0048\u0046",
        flagURL: "https://www.geonames.org/flags/x/ch.gif"
    },
    {
        name: "Hong Kong Dollar",
        abbreviation: "HKD",
        symbol: "\u0024",
        flagURL: "https://www.geonames.org/flags/x/hk.gif"
    },
    {
        name: "Swedish Krona",
        abbreviation: "SEK",
        symbol: "\u006B\u0072",
        flagURL: "https://www.geonames.org/flags/x/se.gif"
    },
    {
        name: "South Korea Won",
        abbreviation: "KRW",
        symbol: "\u20A9",
        flagURL: "https://img.geonames.org/flags/x/kr.gif"
    },
    {
        name: "Singapore Dollar",
        abbreviation: "SGD",
        symbol: "\u0024",
        flagURL: "https://www.geonames.org/flags/x/sg.gif"
    },
    {
        name: "Indian Rupee",
        abbreviation: "INR",
        symbol: "\u20B9",
        flagURL: "https://www.geonames.org/flags/x/in.gif"
    },
    {
        name: "Russian Rubble",
        abbreviation: "RUB",
        symbol: "\u20BD",
        flagURL: "https://www.geonames.org/flags/x/ru.gif"
    },
    {
        name: "Thai Baht",
        abbreviation: "THB",
        symbol: "\u0E3F",
        flagURL: "https://www.geonames.org/flags/x/th.gif"
    },
    {
        name: "Saudi Riyal",
        abbreviation: "SAR",
        symbol: "\FDFC",
        flagURL: "https://www.geonames.org/flags/x/sa.gif"
    }
]

addCurrency.addEventListener("mousedown", addCurrencyClick);

function addCurrencyClick(event) {
    const clickedListItem = event.target.closest("li");
    if (!clickedListItem.classList.contains("disabled")) {
        const newCurrency = currencies.find(c => c.abbreviation === clickedListItem.getAttribute("data-currency"));
        if (newCurrency) newCurrenciesListItem(newCurrency);
    }
}

currenciesList.addEventListener("mousedown", currenciesListClick);

function currenciesListClick(event) {
    if (event.target.classList.contains("close")) {
        const parentNode = event.target.parentNode;
        parentNode.remove();
        addCurrency.querySelector(`[data-currency=${parentNode.id}]`).classList.remove("disabled");
        if (parentNode.classList.contains("base-currency")) {
            const newBaseCurrency = currenciesList.querySelector(".currency");
            if (newBaseCurrency) {
                setNewBaseCurrency(newBaseCurrency);
                baseCurrencyAmount = Number(newBaseCurrency.querySelector(".input input").value);
            }
        }
    }
}

function setNewBaseCurrency(newBaseCurrency) {
    newBaseCurrency.classList.add("base-currency");
    baseCurrency = newBaseCurrency.id;
    const baseCurrencyRate = currencies.find(currency => currency.abbreviation === baseCurrency).rate;
    currenciesList.querySelectorAll(".currency").forEach(currencyLI => {
        const currencyRate = currencies.find(currency => currency.abbreviation === addCurrencyClick.id).rate;
        const exchangeRate = currencyLI.id === baseCurrency ? 1 : (currencyRate / baseCurrency).toFixed(4);
        currencyLI.querySelector(".base-currency-rate").textContent = `1 ${baseCurrency} =${exchangeRate} ${currencyLI.id}`;
    });
}

currenciesList.addEventListener("input", currenciesChange);

function currenciesChange(event) {
    const isNewBaseCurrency = event.target.closest("li").id !== baseCurrency;
    if (isNewBaseCurrency) {
        currenciesList.querySelector(`#${baseCurrency}`).classList.remove("base-currency");
        setNewBaseCurrency(event.target.closest("li"));
    }
    const newBaseCurrencyAmount = isNaN(event.target.value) ? 0 : Number(event.target.value);
    if (baseCurrencyAmount !== newBaseCurrencyAmount || isNewBaseCurrency) {
        baseCurrencyAmount = newBaseCurrencyAmount;
        const baseCurrencyRate = currencies.find(currency => currency.abbreviation === baseCurrency).rate;
        currenciesList.querySelectorAll(".currency").forEach(currencyLI => {
            if (currencyLI.id !== baseCurrency) {
                const currencyRate = currencies.find(currency => currency.abbreviation === currencyLI.id).rate;
                const exchangeRate = currencyLI.id === baseCurrency ? 1 : (currencyRate / baseCurrencyRate).toFixed(4);
                currencyLI.querySelector(".input input").value = exchangeRate * baseCurrencyAmount !== 0 ? (exchangeRate * baseCurrencyAmount).toFixed(4) : "";
            }
        });
    }
}

currenciesList.addEventListener("focusout", currenciesListFO);

function currenciesListFO(event) {
    const inputValue = event.target.value;
    if (isNaN(inputValue) || Number(inputValue) === 0) event.target.value = "";
    else event.target.value = (Number(inputValue)).toFixed(4);
}


function populateAddCurrency() {
    for (let i = 0; i < currencies.length; i++) {
        addCurrency.insertAdjacentHTML('beforeend',
            `<li data-currency=${currencies[i].abbreviation}>
         <img src=${currencies[i].flagURL} class="flag"><span>${currencies[i].abbreviation} - ${currencies[i].name}</span></li>
        `);
    }
}

function populateCurrenciesList() {
    for (let i = 0; i < initialCurrencies.length; i++) {
        const currency = currencies.find(c => c.abbreviation === initialCurrencies[i]);
        if (currency) newCurrenciesListItem(currency);
    }
}

function newCurrenciesListItem(currency) {
    if (currenciesList.childElementCount === 0) {
        baseCurrency = currency.abbreviation;
        baseCurrencyAmount = 0;
    }
    addCurrency.querySelector(`[data-currency=${currency.abbreviation}]`).classList.add("disabled");
    const baseCurrencyRate = currencies.find(c => c.abbreviation === baseCurrency).rate;
    const exchangeRate = currency.abbreviation === baseCurrency ? 1 : (currency.rate / baseCurrencyRate).toFixed(4);
    const inputValue = baseCurrencyAmount ? (baseCurrencyAmount * exchangeRate).toFixed(4) : "";

    currenciesList.insertAdjacentHTML("beforeend",
        `<li class="currency ${currency.abbreviation===baseCurrency? "base-currency":""}" id=${currency.abbreviation}>
        <img src=${currency.flagURL} class="flag">
        <div class="info">
            <p class="input"><span class="currency-symbol">${currency.symbol}</span><input placeholder="0.000" value=${inputValue}></p>
            <p class="currency-name">${currency.abbreviation} - ${currency.name}</p>
            <p class="base-currency-rate">1 ${baseCurrency} = ${exchangeRate} ${currency.abbreviation}</p>
        </div>
        <span class="close">&times</span> </li>
`);
}
fetch(dataURL)
    .then(res => res.json())
    .then(data => {
        console.log(data);
        document.querySelector(".date").textContent = data.date;
        data.rates["EUR"] = 1;
        currencies = currencies.filter(currency => data.rates[currency.abbreviation]);
        currencies.forEach(currency => currency.rate = data.rates[currency.abbreviation]);
        populateAddCurrency();
        populateCurrenciesList();
    })
    .catch(err => console.log(err));