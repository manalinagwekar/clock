const timeZones = {
    est: 'America/New_York',
    pst: 'America/Los_Angeles',
    mst: 'America/Denver',
    ist: 'Asia/Kolkata',
};

// Create the clock SVG for each fruit clock
function createClockSVG() {
    return `
        <svg viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="90" fill="#FFA500" stroke="green" stroke-width="5"></circle>
            <g class="numbers"></g>
            <g class="hands">
                <line class="hour" x1="100" y1="100" x2="100" y2="60" stroke="green" stroke-width="6"></line>
                <line class="minute" x1="100" y1="100" x2="100" y2="40" stroke="blue" stroke-width="4"></line>
                <line class="second" x1="100" y1="100" x2="100" y2="20" stroke="red" stroke-width="2"></line>
            </g>
        </svg>
    `;
}

// Add numbers to the clock SVG
function positionNumbers(clock) {
    const numbersGroup = clock.querySelector('.numbers');
    const centerX = 100;
    const centerY = 100;
    const radius = 80;

    for (let i = 1; i <= 12; i++) {
        const angle = (i * Math.PI) / 6; // 30 degrees in radians
        const x = centerX + Math.cos(angle - Math.PI / 2) * radius;
        const y = centerY + Math.sin(angle - Math.PI / 2) * radius;
        const number = document.createElementNS("http://www.w3.org/2000/svg", "text");
        number.setAttribute("x", x);
        number.setAttribute("y", y);
        number.setAttribute("text-anchor", "middle");
        number.setAttribute("alignment-baseline", "middle");
        number.setAttribute("fill", "white");
        number.setAttribute("font-size", "18");
        number.textContent = i;
        numbersGroup.appendChild(number);
    }
}

// Draw the clock with the correct time
function drawClock(clock, timeZone) {
    const svg = createClockSVG();
    clock.innerHTML = svg;
    positionNumbers(clock);

    const now = new Date();
    const options = { timeZone, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
    const timeString = new Intl.DateTimeFormat('en-US', options).format(now);
    const [hour, minute, second] = timeString.split(':').map(Number);

    setHandRotation(clock, 'hour', (hour % 12) * 30 + minute * 0.5);
    setHandRotation(clock, 'minute', minute * 6);
    setHandRotation(clock, 'second', second * 6);

    const dateInfoDiv = clock.querySelector('.date-info');
    const dateInfo = now.toLocaleDateString('en-US', { timeZone, year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' });
    dateInfoDiv.textContent = `${dateInfo}`;
}

function setHandRotation(clock, handClass, degrees) {
    const hand = clock.querySelector(`.${handClass}`);
    hand.setAttribute('transform', `rotate(${degrees} 100 100)`);
}

function updateClocks() {
    const estClock = document.getElementById('estClock');
    const pstClock = document.getElementById('pstClock');
    const mstClock = document.getElementById('mstClock');
    const istClock = document.getElementById('istClock');

    drawClock(estClock, timeZones.est);
    drawClock(pstClock, timeZones.pst);
    drawClock(mstClock, timeZones.mst);
    drawClock(istClock, timeZones.ist);

    requestAnimationFrame(updateClocks);
}

document.addEventListener('DOMContentLoaded', updateClocks);
