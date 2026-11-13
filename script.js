
const API_URL = "https://api.coingecko.com/api/v3";

let coins = [];
let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
let currentTab = "all";

let visibleCoins = 20;
const coinsPerClick = 8;

const coinList = document.getElementById("coinList");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const viewMoreBtn = document.getElementById("viewMoreBtn");

const modal = document.getElementById("coinModal");
const modalContent = document.getElementById("modalContent");

async function fetchCoins() {
    document.getElementById("marketStatus").textContent = "Loading";

    try {
        const response = await fetch(
            `${API_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false`
        );

        if (!response.ok) {
            throw new Error("Market data could not be loaded.");
        }

        coins = await response.json();

        document.getElementById("totalCoins").textContent = coins.length;
        document.getElementById("marketStatus").textContent = "Live";
        document.getElementById("statusBox").classList.add("hidden");

        visibleCoins = 20;
        displayCoins();

    } catch (error) {
        document.getElementById("marketStatus").textContent = "Offline";

        document.getElementById("statusBox").classList.remove("hidden");
        document.getElementById("statusText").textContent = error.message;

        coinList.innerHTML = "";
        viewMoreBtn.classList.add("hidden");
    }
}


function displayCoins() {
    let filteredCoins = [...coins];

    
    const searchValue = searchInput.value.toLowerCase();

    filteredCoins = filteredCoins.filter(coin =>
        coin.name.toLowerCase().includes(searchValue) ||
        coin.symbol.toLowerCase().includes(searchValue)
    );

    
    if (currentTab === "watchlist") {
        filteredCoins = filteredCoins.filter(coin =>
            watchlist.includes(coin.id)
        );
    }

    
    const sortValue = sortSelect.value;

    if (sortValue === "market_cap_desc") {
        filteredCoins.sort((a, b) => b.market_cap - a.market_cap);
    } else if (sortValue === "market_cap_asc") {
        filteredCoins.sort((a, b) => a.market_cap - b.market_cap);
    } else if (sortValue === "price_desc") {
        filteredCoins.sort((a, b) => b.current_price - a.current_price);
    } else if (sortValue === "price_asc") {
        filteredCoins.sort((a, b) => a.current_price - b.current_price);
    } else if (sortValue === "change_desc") {
        filteredCoins.sort((a, b) =>
            b.price_change_percentage_24h - a.price_change_percentage_24h
        );
    } else if (sortValue === "change_asc") {
        filteredCoins.sort((a, b) =>
            a.price_change_percentage_24h - b.price_change_percentage_24h
        );
    }

    document.getElementById("watchlistCount").textContent = watchlist.length;

    coinList.innerHTML = "";

    if (filteredCoins.length === 0) {
        coinList.innerHTML = `
            <div class="col-span-full text-center py-12 text-gray-500">
                <i class="fa-solid fa-circle-info text-3xl mb-3"></i>
                <p>No coins found.</p>
            </div>
        `;

        viewMoreBtn.classList.add("hidden");
        return;
    }

    
    const coinsToShow = filteredCoins.slice(0, visibleCoins);

    coinsToShow.forEach(coin => {
        const isFavorite = watchlist.includes(coin.id);

        const change = coin.price_change_percentage_24h || 0;

        const card = document.createElement("div");

        card.className = `
            bg-white dark:bg-[#191a20]
            border border-gray-200 dark:border-gray-800
            rounded-2xl p-5
            hover:border-emerald-500
            transition duration-200
        `;

        card.innerHTML = `
            <div class="flex justify-between items-start mb-5">

                <div class="flex items-center gap-3">
                    <img src="${coin.image}" class="w-11 h-11" alt="${coin.name}">

                    <div>
                        <h3 class="font-bold">${coin.name}</h3>
                        <p class="text-sm text-gray-500 uppercase">${coin.symbol}</p>
                    </div>
                </div>

                <button class="watchBtn text-xl ${
                    isFavorite ? "text-yellow-500" : "text-gray-400"
                }" title="Add to watchlist">
                    <i class="${isFavorite ? "fa-solid" : "fa-regular"} fa-star"></i>
                </button>

            </div>

            <div class="mb-5">
                <p class="text-sm text-gray-500">Current Price</p>
                <h2 class="text-2xl font-bold mt-1">
                    $${Number(coin.current_price).toLocaleString()}
                </h2>

                <p class="text-sm mt-2 ${
                    change >= 0 ? "text-green-500" : "text-red-500"
                }">
                    <i class="fa-solid ${
                        change >= 0 ? "fa-arrow-up" : "fa-arrow-down"
                    }"></i>
                    ${change.toFixed(2)}% (24h)
                </p>
            </div>

            <div class="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2 text-sm">

                <div class="flex justify-between">
                    <span class="text-gray-500">Market Cap</span>
                    <span class="font-semibold">$${formatMoney(coin.market_cap)}</span>
                </div>

                <div class="flex justify-between">
                    <span class="text-gray-500">24h Volume</span>
                    <span class="font-semibold">$${formatMoney(coin.total_volume)}</span>
                </div>

                <div class="flex justify-between">
                    <span class="text-gray-500">Rank</span>
                    <span class="font-semibold">#${coin.market_cap_rank}</span>
                </div>

            </div>

            <button class="detailsBtn w-full mt-5 py-3 rounded-xl
                bg-emerald-500 text-white font-semibold
                hover:bg-emerald-400 hover:text-gray-950
                dark:hover:bg-emerald-400 dark:hover:text-gray-950
                transition">
                View Details
            </button>
        `;

        
        card.querySelector(".watchBtn").addEventListener("click", () => {
            toggleWatchlist(coin.id);
        });

        
        card.querySelector(".detailsBtn").addEventListener("click", () => {
            showCoinDetails(coin.id);
        });

        coinList.appendChild(card);
    });

    
    if (visibleCoins < filteredCoins.length) {
        viewMoreBtn.classList.remove("hidden");
    } else {
        viewMoreBtn.classList.add("hidden");
    }
}


viewMoreBtn.addEventListener("click", () => {
    visibleCoins += coinsPerClick;
    displayCoins();
});


function formatMoney(number) {
    if (number === null || number === undefined) {
        return "N/A";
    }

    return Number(number).toLocaleString("en-US", {
        maximumFractionDigits: 0
    });
}


function toggleWatchlist(coinId) {
    if (watchlist.includes(coinId)) {
        watchlist = watchlist.filter(id => id !== coinId);
    } else {
        watchlist.push(coinId);
    }

    localStorage.setItem("watchlist", JSON.stringify(watchlist));

    displayCoins();
}


async function showCoinDetails(coinId) {
    modal.classList.remove("hidden");
    modal.classList.add("flex");

    modalContent.scrollTop = 0;

    modalContent.innerHTML = `
        <div class="text-center py-10 text-gray-500">
            <i class="fa-solid fa-spinner fa-spin text-2xl mb-3"></i>
            <p>Loading coin information...</p>
        </div>
    `;

    try {
        const response = await fetch(`${API_URL}/coins/${coinId}`);

        if (!response.ok) {
            throw new Error("Unable to load coin information.");
        }

        const coin = await response.json();
        const market = coin.market_data;

        function detailItem(label, value) {
            return `
                <div class="bg-gray-100 dark:bg-[#25262e] rounded-xl p-4">
                    <p class="text-sm text-gray-500 dark:text-gray-400">${label}</p>
                    <p class="font-semibold mt-1 break-words">${value}</p>
                </div>
            `;
        }

        function price(value) {
            return value === null || value === undefined
                ? "Not available"
                : "$" + Number(value).toLocaleString("en-US", {
                    maximumFractionDigits: 4
                });
        }

        function amount(value) {
            return value === null || value === undefined
                ? "Not available"
                : Number(value).toLocaleString("en-US", {
                    maximumFractionDigits: 2
                });
        }

        const change = market.price_change_percentage_24h || 0;

        const description = coin.description?.en
            ? coin.description.en.replace(/<[^>]*>/g, "").trim()
            : "Description not available.";

        modalContent.innerHTML = `
            <div class="flex items-center gap-4 mb-6">
                <img src="${coin.image.large}" alt="${coin.name}" class="w-14 h-14">

                <div>
                    <h3 class="text-2xl font-bold">${coin.name}</h3>
                    <p class="text-gray-500 dark:text-gray-400 uppercase">
                        ${coin.symbol}
                    </p>
                </div>
            </div>

            <div class="mb-6">
                <p class="text-sm text-gray-500 dark:text-gray-400">
                    Current Price
                </p>

                <h2 class="text-3xl font-bold mt-1">
                    ${price(market.current_price?.usd)}
                </h2>

                <p class="mt-2 ${change >= 0 ? "text-green-500" : "text-red-500"}">
                    ${change.toFixed(2)}% (24h change)
                </p>
            </div>

            <h3 class="font-bold text-lg mb-3">Market Information</h3>

            <div class="grid grid-cols-2 gap-3 mb-6">

                ${detailItem("Market Cap", price(market.market_cap?.usd))}
                ${detailItem("24h Trading Volume", price(market.total_volume?.usd))}
                ${detailItem("24h High", price(market.high_24h?.usd))}
                ${detailItem("24h Low", price(market.low_24h?.usd))}
                ${detailItem("Circulating Supply", amount(market.circulating_supply))}
                ${detailItem("Total Supply", amount(market.total_supply))}
                ${detailItem("Maximum Supply", amount(market.max_supply))}
                ${detailItem("All-Time High", price(market.ath?.usd))}
                ${detailItem("All-Time Low", price(market.atl?.usd))}
                ${detailItem("Fully Diluted Valuation", price(market.fully_diluted_valuation?.usd))}

            </div>

            <h3 class="font-bold text-lg mb-3">About ${coin.name}</h3>

            <p class="text-sm leading-7 text-gray-600 dark:text-gray-300 whitespace-pre-line break-words">
                ${description}
            </p>
        `;

    } catch (error) {
        modalContent.innerHTML = `
            <p class="text-center text-red-500 py-8">
                ${error.message}
            </p>
        `;
    }
}


document.getElementById("closeModal").addEventListener("click", () => {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
});


modal.addEventListener("click", event => {
    if (event.target === modal) {
        modal.classList.add("hidden");
        modal.classList.remove("flex");
    }
});

const themeBtn = document.getElementById("themeBtn");
const themeIcon = document.getElementById("themeIcon");

function updateThemeIcon() {
    if (document.documentElement.classList.contains("dark")) {
        themeIcon.className = "fa-solid fa-sun";
    } else {
        themeIcon.className = "fa-solid fa-moon";
    }
}

if (localStorage.getItem("theme") === "dark") {
    document.documentElement.classList.add("dark");
} else {
    document.documentElement.classList.remove("dark");
}

updateThemeIcon();

themeBtn.addEventListener("click", () => {
    document.documentElement.classList.toggle("dark");

    const isDark = document.documentElement.classList.contains("dark");

    localStorage.setItem("theme", isDark ? "dark" : "light");

    updateThemeIcon();
});


searchInput.addEventListener("input", () => {
    visibleCoins = 20;
    displayCoins();
});


sortSelect.addEventListener("change", () => {
    visibleCoins = 20;
    displayCoins();
});


document.getElementById("homeTab").addEventListener("click", () => {
    currentTab = "all";
    visibleCoins = 20;

    document.getElementById("homeTab").className =
        "px-5 py-2.5 rounded-xl bg-emerald-500 text-white font-semibold";

    document.getElementById("watchlistTab").className =
        "px-5 py-2.5 rounded-xl bg-white dark:bg-[#191a20] text-gray-600 dark:text-gray-300 font-semibold border border-gray-200 dark:border-gray-800";

    displayCoins();
});


document.getElementById("watchlistTab").addEventListener("click", () => {
    currentTab = "watchlist";
    visibleCoins = 20;

    document.getElementById("watchlistTab").className =
        "px-5 py-2.5 rounded-xl bg-emerald-500 text-white font-semibold";

    document.getElementById("homeTab").className =
        "px-5 py-2.5 rounded-xl bg-white dark:bg-[#191a20] text-gray-600 dark:text-gray-300 font-semibold border border-gray-200 dark:border-gray-800";

    displayCoins();
});


document.getElementById("refreshBtn").addEventListener("click", fetchCoins);

document.getElementById("retryBtn").addEventListener("click", fetchCoins);

fetchCoins();
