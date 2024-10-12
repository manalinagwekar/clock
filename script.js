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

// Create the orange-shaped clock using an SVG path
function createClockSVG(fruitColor) {
    return `
        <svg viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="90" fill="${fruitColor}" stroke="#ff6347" stroke-width="5" />
            <g class="numbers"></g>
            <g class="hands">
                <line class="hour" x1="100" y1="100" x2="100" y2="50" stroke="green" stroke-width="6"/>
                <line class="minute" x1="100" y1="100" x2="100" y2="30" stroke="blue" stroke-width="4"/>
                <line class="second" x1="100" y1="100" x2="100" y2="20" stroke="red" stroke-width="2"/>
            </g>
        </svg>
    `;
}

// Function to position numbers correctly
function positionNumbers(clock) {
    const numbersGroup = clock.querySelector('.numbers');
    const centerX = 100;
    const centerY = 100;
    const radius = 75; // Radius for number positioning

    for (let i = 1; i <= 12; i++) {
        const angle = (i * Math.PI) / 6; // 30 degrees in radians
        const x = centerX + Math.cos(angle - Math.PI / 2) * radius; // Adjusted for top position (12 o'clock)
        const y = centerY + Math.sin(angle - Math.PI / 2) * radius; // Adjusted for top position (12 o'clock)
        const number = document.createElementNS("http://www.w3.org/2000/svg", "text");
        number.setAttribute("x", x);
        number.setAttribute("y", y);
        number.setAttribute("text-anchor", "middle");
        number.setAttribute("alignment-baseline", "middle");
        number.setAttribute("fill", "white"); // Change to white for better visibility
        number.setAttribute("font-size", "18");
        number.setAttribute("font-family", "Arial, sans-serif");
        number.textContent = i;
        numbersGroup.appendChild(number);
    }
}

function drawClock(clock, timeZone, fruitColor) {
    const svg = createClockSVG(fruitColor);
    clock.innerHTML = svg;

    positionNumbers(clock);

    const now = new Date();
    const options = { timeZone, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true, year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
    const timeString = new Intl.DateTimeFormat('en-US', options).format(now);
    
    const [datePart, timePart] = timeString.split(', ');
    const [year, month, day] = datePart.split(' '); // Split the date part to extract components
    const [hour, minute, second] = timePart.split(':').map(Number);

    // Set hand positions
    setHandRotation(clock, 'hour', (hour % 12) * 30 + minute * 0.5);
    setHandRotation(clock, 'minute', minute * 6 + second * 0.1);
    setHandRotation(clock, 'second', second * 6);

    // Update date information
    const dateInfoDiv = clock.querySelector('.date-info');
    dateInfoDiv.textContent = `${month} ${day}, ${year} (${new Intl.DateTimeFormat('en-US', { weekday: 'long', timeZone }).format(now)}) ${timePart}`;

    // Change number colors based on time
    const isDaytime = (hour >= 6 && hour < 18);
    const numberColor = isDaytime ? 'white' : 'darkgray';
    clock.querySelectorAll('text').forEach(number => {
        number.setAttribute("fill", numberColor);
    });
}

function setHandRotation(clock, handClass, degrees) {
    const hand = clock.querySelector(`.${handClass}`);
    hand.setAttribute("transform", `rotate(${degrees} 100 100)`);
}

function updateClocks() {
    drawClock(clocks.est, 'America/New_York', '#ffa500'); // Orange color for EST
    drawClock(clocks.pst, 'America/Los_Angeles', '#ff4500'); // Dark Orange for PST
    drawClock(clocks.mst, 'America/Denver', '#ff7f50'); // Coral for MST
    drawClock(clocks.ist, 'Asia/Kolkata', '#ff6347'); // Tomato for IST

    requestAnimationFrame(updateClocks);
}

function showTimeInfo(timeZone) {
    const now = new Date();
    const options = { timeZone: timeZoneMapping[timeZone], year: 'numeric', month: 'long', day: 'numeric', weekday: 'long', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
    const timeString = new Intl.DateTimeFormat('en-US', options).format(now);
    
    const timeInfoDiv = document.getElementById('timeInfo');
    timeInfoDiv.innerHTML = `<strong>${timeZone} Time:</strong> ${timeString}`;
    timeInfoDiv.classList.add('visible');
}

document.addEventListener('DOMContentLoaded', updateClocks);
