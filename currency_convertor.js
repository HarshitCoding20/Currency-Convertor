
const Base_URL = "https://api.frankfurter.dev/v1/latest";

const dropdown = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");


const supportedCurrencies = [
    "AUD", "BGN", "BRL", "CAD", "CHF", "CNY", "CZK", "DKK",
    "EUR", "GBP", "HKD", "HUF", "IDR", "ILS", "INR", "ISK",
    "JPY", "KRW", "MXN", "MYR", "NOK", "NZD", "PHP", "PLN",
    "RON", "SEK", "SGD", "THB", "TRY", "USD", "ZAR"
];

for (let select of dropdown) {
    for (let currCode of supportedCurrencies) {
        let newOption = document.createElement("option");
        newOption.innerText = currCode;
        newOption.value = currCode;
        if (select.name === "from" && currCode === "USD") {
            newOption.selected = true;
        } else if (select.name === "to" && currCode === "INR") {
            newOption.selected = true;
        }
        select.append(newOption);
    }

    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
    });
}

const updateExchangeRate = async () => {
    let amount = document.querySelector(".amount input");
    let amtVal = parseFloat(amount.value);
    if (!amtVal || amtVal < 1) {
        amtVal = 1;
        amount.value = "1";
    }

    const from = fromCurr.value;
    const to = toCurr.value;

    if (from === to) {
        msg.innerText = `${amtVal} ${from} = ${amtVal.toFixed(2)} ${to}`;
        return;
    }

    try {
        msg.innerText = "Fetching exchange rate...";

        // v1 API: /v1/latest?from=USD&to=INR
        const URL = `${Base_URL}?from=${from}&to=${to}`;
        let response = await fetch(URL);

        if (!response.ok) throw new Error(`API error: ${response.status}`);

        let data = await response.json();
        // v1 response: { "rates": { "INR": 83.5 }, ... }
        let rate = data.rates[to];

        if (!rate) throw new Error("Rate not found");

        let finalAmount = (amtVal * rate).toFixed(2);
        msg.innerText = `${amtVal} ${from} = ${finalAmount} ${to}`;
    } catch (err) {
        msg.innerText = "Failed to fetch rate. Please try again.";
        console.error(err);
    }
};

const updateFlag = (element) => {
    let currCode = element.value;
    let countryCode = countryList[currCode];
    if (!countryCode) return;
    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    let img = element.parentElement.querySelector("img");
    img.src = newSrc;
};

btn.addEventListener("click", (evt) => {
    evt.preventDefault();
    updateExchangeRate();
});

window.addEventListener("load", () => {
    updateExchangeRate();
});