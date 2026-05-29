
const thickerText = document.getElementById("thicker");

const COINS = {
  'BTC':  { id: 'bitcoin', color: '#f7931a', icon: '₿' },
  'ETH':  { id: 'ethereum', color: '#627eea', icon: 'Ξ' },
  'SOL':  { id: 'solana', color: '#00ffa3', icon: 'S' },
  'BNB':  { id: 'binancecoin', color: '#f3ba2f', icon: 'B' },
  'XRP':  { id: 'ripple', color: '#23292f', icon: 'X' },
  'DOGE': { id: 'dogecoin', color: '#c2a633', icon: 'Ð' },
  'CORE': { id: 'coredao', color: '#3b82f6', icon: 'C' },
  'MNT':  { id: 'mantle', color: '#1a1a1a', icon: 'M' },
  'TON':  { id: 'toncoin', color: '#0088cc', icon: 'T' },
  'LTC':  { id: 'litecoin', color: '#bfbbbb', icon: 'Ł' },
  'APE':  { id: 'apecoin', color: '#0054f9', icon: 'A' },
  'ATOM': { id: 'cosmos', color: '#2e3148', icon: 'A' },
  'CHZ':  { id: 'chiliz', color: '#cd0124', icon: 'C' },
  'DOGS': { id: 'dogs-2', color: '#000000', icon: 'D' },
  'FLOKI':{ id: 'floki', color: '#e84142', icon: 'F' },
  'MOVE': { id: 'movement', color: '#000000', icon: 'M' }
};

let previousPrices = {};
let isFirstLoad = true;

function fmt(price){

    if(price === undefined || price === null)
        return '---';

    if(price >= 1000){
        return '$' + price.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    if(price >= 1)
        return '$' + price.toFixed(2);

    if(price >= 0.01)
        return '$' + price.toFixed(4);

    return '$' + price.toFixed(6);
}

async function fetchPrices() {

  const ids = Object.values(COINS)
    .map(c => c.id)
    .join(',');

  const url =
    `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`;

  try {

    const res = await fetch(url);

    if (!res.ok)
      throw new Error(`HTTP ${res.status}`);

    const data = await res.json();

    render(data);

    // document.getElementById('loading').style.opacity = '0';

    // setTimeout(() => {
    //   document.getElementById('loading').style.display = 'none';
    // }, 500);

    document.getElementById('status').innerHTML =
      `<span class="live-dot"></span>
       UPDATED: ${new Date().toLocaleTimeString()}
       | AUTO-REFRESH: 10s`;

  } catch (err) {

    console.error('Fetch error:', err);

    document.getElementById('status').innerHTML =
      `<span style="color:#ff4757">
        Error: ${err.message}. Retrying...
      </span>`;
  }
}

let expanded = false;

function render(data){

    const track = document.getElementById("tickerTrack");

    let html = "";

    const entries = Object.entries(COINS);

    const visibleCoins = expanded
        ? entries
        : entries.slice(0, 6);

    visibleCoins.forEach(([sym, config]) => {

        const coinData = data[config.id];

        const price = coinData?.usd;

        const change24h = coinData?.usd_24h_change ?? 0;

        const changeClass =
            change24h >= 0 ? "up" : "down";

        const changeArrow =
            change24h >= 0 ? "▲" : "▼";

        html += `
        
        <div class="coin-item">

            <div class="coin-icon"
                 style="background:${config.color}">
                 ${config.icon}
            </div>

            <div class="coin-info">

                <span class="coin-sym">
                    ${sym}
                </span>

                <span class="coin-price">
                    ${fmt(price)}
                </span>

                <span class="coin-change ${changeClass}">
                    ${changeArrow}
                    ${Math.abs(change24h).toFixed(2)}%
                </span>

            </div>

        </div>
        `;
    });

  // seamless loop
  track.innerHTML = html + html;

  setTimeout(() => {

    document
      .querySelectorAll('.flash-up, .flash-down')
      .forEach(el => {

        el.classList.remove(
          'flash-up',
          'flash-down'
        );

      });

  }, 800);

  isFirstLoad = false;
}

fetchPrices();

setInterval(fetchPrices, 10000);

const readMoreBtn =
    document.getElementById("readMoreBtn");

readMoreBtn.addEventListener("click", () => {

    expanded = !expanded;

    fetchPrices();

    readMoreBtn.textContent =
        expanded
        ? "Show Less"
        : "Read More";

});

const isMobile = window.innerWidth < 768;

setInterval(
  fetchPrices,
  isMobile ? 15000 : 10000
);

const menuBar = document.getElementById("menu-bar");
const menuId = document.getElementById("menuId");

let isOpen = false;

menuBar.addEventListener("click", () => {

    isOpen = !isOpen;

    menuId.style.left = isOpen ? "0" : "-100%";

    menuBar.innerHTML = isOpen
        ? '<i class="ri-close-line"></i>'
        : '<i class="ri-menu-2-line"></i>';

});