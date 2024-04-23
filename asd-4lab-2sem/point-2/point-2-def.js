const canvasDef = document.getElementById('defined-graph-box');
const contextDef = canvasDef.getContext('2d');

const nodePositionsDef = [
    { x: 150, y: 150 },
    { x: 300, y: 120 },
    { x: 450, y: 150 },
    { x: 600, y: 120 },
    { x: 600, y: 320 },
    { x: 600, y: 580 },
    { x: 450, y: 550 },
    { x: 300, y: 580 },
    { x: 150, y: 550 },
    { x: 150, y: 320 },
    { x: 375, y: 350 }
];
const arrowPositionsDef = [
    { x: 160, y: 125 },
    { x: 310, y: 95 },
    { x: 460, y: 125 },
    { x: 610, y: 95 },
    { x: 625, y: 330 },
    { x: 585, y: 605 },
    { x: 435, y: 575 },
    { x: 285, y: 605 },
    { x: 135, y: 575 },
    { x: 125, y: 330 },
    { x: 360, y: 375 }
];

const nodeNumberDef = nodePositionsDef.length;
const kDef = 1 - 0.02 - 9 * 0.01 - 0.3;

const drawGraphNodesDef = () => {
    contextDef.fillStyle = 'white';

    nodePositionsDef.forEach((nodePositionDef, index) => {
        contextDef.beginPath();
        contextDef.arc(nodePositionDef.x, nodePositionDef.y, 20, 0, Math.PI * 2, true);
        contextDef.fill();
        contextDef.stroke();
    });

    contextDef.font = '14px Arial';
    contextDef.textAlign = 'center';
    contextDef.textBaseline = 'middle';
    contextDef.fillStyle = 'black';
    nodePositionsDef.forEach((nodePositionDef, index) => {
        contextDef.fillText(`${index + 1}`, nodePositionDef.x, nodePositionDef.y);
    });
};

const generateAdjacencyMatrixDef = () => {
    const seed = 3319;
    const matrix = [];

    Math.seedrandom(seed);
    for (let i = 0; i < nodeNumberNonDef; i++) {
        matrix[i] = [];
        for (let j = 0; j < nodeNumberNonDef; j++) {
            matrix[i][j] = Math.random() * 2 * kNonDef;
            matrix[i][j] = matrix[i][j] < 1 ? 0 : 1;
        }
    }
    return matrix;
}

function calculateAdjustedStartPoint(startX, startY, endX, endY, radius) {
    const angle = Math.atan2(endY - startY, endX - startX);

    const adjustedX = startX + (radius * Math.cos(angle));
    const adjustedY = startY + (radius * Math.sin(angle));

    return { x: adjustedX, y: adjustedY };
}

const drawGraphEdgesDef = (adjacencyMatrix) => {
    contextDef.strokeStyle = 'white';
    contextDef.lineWidth = 1;

    for (let i = 0; i < nodeNumberDef; i++) {
        for (let j = 0; j < nodeNumberDef; j++) {
            if (adjacencyMatrix[i][j] === 1) {
                const startX = nodePositionsDef[j].x;
                const startY = nodePositionsDef[j].y;

                const endX = nodePositionsDef[i].x;
                const endY = nodePositionsDef[i].y;

                if (i === j) {
                    contextDef.beginPath();
                    if (i < 4) {
                        contextDef.arc(endX,  (endY - 40), 20, -(Math.PI/2), 3*Math.PI/2, true);
                        drawArrow(arrowPositionsDef[i].x, arrowPositionsDef[i].y, -(3*Math.PI / 13));
                    } else if ((i > 4 && i < 9) || i === 10) {
                        contextDef.arc(endX,  (endY + 40), 20, Math.PI/2, -(3*Math.PI/2), true);
                        drawArrow(arrowPositionsDef[i].x, arrowPositionsDef[i].y, (3*Math.PI / 5));
                    } else if (i === 9) {
                        contextDef.arc((endX - 40),  endY, 20, 0, 2*Math.PI, true);
                        drawArrow(arrowPositionsDef[i].x, arrowPositionsDef[i].y, (3*Math.PI / 5));
                    } else {
                        contextDef.arc((endX + 40),  endY, 20, Math.PI, -(Math.PI), true);
                        drawArrow(arrowPositionsDef[i].x, arrowPositionsDef[i].y, (3*Math.PI / 11));
                    }
                    contextDef.stroke();
                } else {
                    contextDef.beginPath();
                    contextDef.moveTo(startX, startY);
                    contextDef.lineTo(endX, endY);

                    let adjustedStartPoint = calculateAdjustedStartPoint(startX, startY, endX, endY, 20);
                    const angle = Math.atan2(endY - startY, endX - startX);
                    drawArrow(adjustedStartPoint.x, adjustedStartPoint.y, angle);
                    contextDef.stroke();
                }
            }
        }
    }
};

const drawArrow = (x, y, angleInRadians) => {
    const arrowSize = 6;
    contextDef.save();
    contextDef.translate(x, y);
    contextDef.rotate(angleInRadians);
    contextDef.moveTo(0, 0);
    contextDef.lineTo(arrowSize, -arrowSize);
    contextDef.lineTo(arrowSize / 2, 0);
    contextDef.lineTo(arrowSize, arrowSize);
    contextDef.closePath();
    contextDef.restore();
}


const calculatePowersDef = (adjacencyMatrix) => {
    let degrees = {};

    for (let i = 0; i < nodeNumberDef; i++) {
        let degPlus = 0;
        let degMinus = 0;

        for (let j = 0; j < nodeNumberDef; j++) {
            if (adjacencyMatrix[j][i] === 1) {
                degPlus++;
            }
            if (adjacencyMatrix[i][j] === 1) {
                degMinus++;
            }
        }

        degrees[i + 1] = { 'deg+': degPlus, 'deg-': degMinus };
    }

    return degrees;
}

const listHangIsoNodesDef = (powers) => {
    const hangNodes = [];
    const isoNodes = [];

    Object.entries(powers).forEach(([node, power]) => {
        const { 'deg+': degPlus, 'deg-': degMinus } = power;

        if ((degPlus === 1 && degMinus === 0) || (degPlus === 0 && degMinus === 1)) {
            hangNodes.push(node);
        }
        if (degPlus === 0 && degMinus === 0) {
            isoNodes.push(node);
        }
    });

    return {
        'hanged nodes': hangNodes,
        'isolated nodes': isoNodes,
    };
}

const checkSimilarityDef = (powers) => {
    let similarity = true;
    let commonDeg = null;

    for (let [node, power] of Object.entries(powers)) {
        if (commonDeg === null) {
            if (power['deg+'] === power['deg-']) {
                commonDeg = power['deg+'];
            } else {
                similarity = false;
                break;
            }
        } else {
            if (power['deg+'] !== commonDeg || power['deg-'] !== commonDeg) {
                similarity = false;
                break;
            }
        }
    }
    return { similarity, commonDeg };
}

if (contextDef) {
    const adjacencyMatrix = generateAdjacencyMatrixDef();
    console.log(adjacencyMatrix);

    const powers = calculatePowersDef(adjacencyMatrix);
    console.log("Power of each node in defined graph:", powers);
    console.log("The lists of hanged and isolated nodes in defined graph:", listHangIsoNodesDef(powers));

    const { similarity, commonDeg } = checkSimilarityDef(powers);
    console.log('Is the defined graph similar?', similarity);
    if (similarity) {
        console.log('The similarity power of defined graph is:', commonDeg);
    }

    drawGraphEdgesDef(adjacencyMatrix);
    drawGraphNodesDef();
} else {
    console.log('canvas are not supported');
}
