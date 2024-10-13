const timeZones = {
    EST: 'America/New_York',
    PST: 'America/Los_Angeles',
    MST: 'America/Denver',
    IST: 'Asia/Kolkata',
};

function createClockSVG() {
    return `
        <svg viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="90" fill="#FFA500" stroke="green" stroke-width="5"></circle>
            <g class="numbers"></g>
            <g class="hands">
                <line class="hour" x1="100" y1="100" x2="100" y2="50" stroke="green" stroke-width="6"></line>
                <line class="minute" x1="100" y1="100" x2="100" y2="30" stroke="blue" stroke-width="4"></line>
                <line class="second" x1="100" y1="100" x2="100" y2="20" stroke="red" stroke-width="2"></line>
            </g>
        </svg>
    `;
}

function positionNumbers(clock) {
    const numbersGroup = clock.querySelector('.numbers');
    const centerX = 100;
    const centerY = 100;
    const radius = 75; // Adjust radius for better number positioning

    const numberPositions = [
        { num: 12, angle: 0 },
        { num: 1, angle: 30 },
        { num: 2, angle: 60 },
        { num: 3, angle: 90 },
        { num: 4, angle: 120 },
        { num: 5, angle: 150 },
        { num: 6, angle: 180 },
        { num: 7, angle: 210 },
        { num: 8, angle: 240 },
        { num: 9, angle: 270 },
        { num: 10, angle: 300 },
        { num: 11, angle: 330 },
    ];

    numberPositions.forEach(({ num, angle }) => {
        const x = centerX + Math.cos((angle * Math.PI) / 180) * radius;
        const y = centerY + Math.sin((angle * Math.PI) / 180) * radius;
        const number = document.createElementNS("http://www.w3.org/2000/svg", "text");
        number.setAttribute("x", x);
        number.setAttribute("y", y);
        number.setAttribute("text-anchor", "middle");
        number.setAttribute("alignment-baseline", "middle");
        number.setAttribute("fill", "black");
        number.setAttribute("font-size", "18");
        number.textContent = num;
        numbersGroup.appendChild(number);
    });
}

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
    dateInfoDiv.textContent = dateInfo;
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

    drawClock(estClock, timeZones.EST);
    drawClock(pstClock, timeZones.PST);
    drawClock(mstClock, timeZones.MST);
    drawClock(istClock, timeZones.IST);

    requestAnimationFrame(updateClocks);
}

document.addEventListener('DOMContentLoaded', updateClocks);
