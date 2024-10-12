const clocks = {
    est: document.getElementById('estClock'),
    pst: document.getElementById('pstClock'),
    mst: document.getElementById('mstClock'),
    ist: document.getElementById('istClock'),
};

const timeZoneMapping = {
    EST: 'America/New_York',
    PST: 'America/Los_Angeles',
    MST: 'America/Denver',
    IST: 'Asia/Kolkata',
};

function createClockSVG() {
    return `
        <svg viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="90" fill="rgba(255, 235, 205, 0.8)" stroke="#ff6347" stroke-width="5"/>
            <g class="numbers"></g>
            <g class="hands">
                <line class="hour" x1="100" y1="100" x2="100" y2="50" stroke="green" stroke-width="6"/>
                <line class="minute" x1="100" y1="100" x2="100" y2="30" stroke="blue" stroke-width="4"/>
                <line class="second" x1="100" y1="100" x2="100" y2="20" stroke="red" stroke-width="2"/>
            </g>
        </svg>
    `;
}

function drawClock(clock, timeZone) {
    const svg = createClockSVG();
    clock.innerHTML = svg;

    const numbersGroup = clock.querySelector('.numbers');
    for (let i = 1; i <= 12; i++) {
        const angle = (i * Math.PI) / 6;
        const x = 100 + Math.cos(angle) * 70;
        const y = 100 + Math.sin(angle) * 70;
        const number = document.createElementNS("http://www.w3.org/2000/svg", "text");
        number.setAttribute("x", x);
        number.setAttribute("y", y);
        number.setAttribute("text-anchor", "middle");
        number.setAttribute("alignment-baseline", "middle");
        number.setAttribute("fill", "lightgray");
        number.setAttribute("font-size", "18");
        number.textContent = i;
        numbersGroup.appendChild(number);
    }

    const now = new Date();
    const options = { timeZone, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
    const timeString = new Intl.DateTimeFormat('en-US', options).format(now);
    const [hour, minute, second] = timeString.split(':').map(Number);

    // Set hand positions
    setHandRotation(clock, 'hour', (hour % 12) * 30 + minute * 0.5);
    setHandRotation(clock, 'minute', minute * 6 + second * 0.1);
    setHandRotation(clock, 'second', second * 6);

    // Change number colors based on time
    const isDaytime = (hour >= 6 && hour < 18);
    const numberColor = isDaytime ? 'lightgray' : 'darkgray';
    numbersGroup.querySelectorAll('text').forEach(number => {
        number.setAttribute("fill", numberColor);
    });
}

function setHandRotation(clock, handClass, degrees) {
    const hand = clock.querySelector(`.${handClass}`);
    hand.setAttribute("transform", `rotate(${degrees} 100 100)`);
}

function updateClocks() {
    drawClock(clocks.est, 'America/New_York');
    drawClock(clocks.pst, 'America/Los_Angeles');
    drawClock(clocks.mst, 'America/Denver');
    drawClock(clocks.ist, 'Asia/Kolkata');

    requestAnimationFrame(updateClocks);
}

function showTimeInfo(timeZone) {
    const now = new Date();
    const options = { timeZone: timeZoneMapping[timeZone], year: 'numeric', month: 'long', day: 'numeric', weekday: 'long', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
    const timeString = new Intl.DateTimeFormat('en-US', options).format(now);
    
    const timeInfoDiv = document.getElementById('timeInfo');
    timeInfoDiv.innerHTML = `<strong>${timeZone} Time:</strong> ${timeString}`;
    timeInfoDiv.classList.add('visible');
}

document.addEventListener('DOMContentLoaded', updateClocks);
