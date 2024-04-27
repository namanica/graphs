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
const kDef = 1 - 0.005 - 9 * 0.005 - 0.27;

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
    for (let i = 0; i < nodeNumberDef; i++) {
        matrix[i] = [];
        for (let j = 0; j < nodeNumberDef; j++) {
            matrix[i][j] = Math.random() * 2 * kDef;
            matrix[i][j] = matrix[i][j] < 1 ? 0 : 1;
        }
    }
    return matrix;
}

const multiplyMatrices = (matrix1, matrix2) => {
    let result = [];
    const rows1 = matrix1.length;
    const rows2 = matrix2.length;
    const cols1 = matrix1[0].length;
    const cols2 = matrix2[0].length;

    if (cols1 === rows2) {
        for (let i = 0; i < rows1; i++) {
            result[i] = [];
            for (let j = 0; j < cols2; j++) {
                for (let k = 0; k < cols2; k++) {
                    result[i][j] = matrix1[i][k] * matrix2[k][j];
                }
            }
        }
    }
    return result;
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
    let powers = {};

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

        powers[i + 1] = { 'deg+': degPlus, 'deg-': degMinus };
    }

    return powers;
}

const findPathsLength2Def = (adjacencyMatrix) => {
    const paths = [];

    for (let i = 0; i < nodeNumberDef; i++) {
        for (let j = 0; j < nodeNumberDef; j++) {
            for (let k = 0; k < nodeNumberDef; k++) {
                if (adjacencyMatrix[i][k] === 1 && adjacencyMatrix[k][j] === 1) {
                    paths.push({ start: i + 1, middle: k + 1, end: j + 1 });
                }
            }
        }
    }
    paths.sort((a, b) => a.start - b.start);
    return paths;
};

const findPathsLength3Def = (adjacencyMatrix) => {
    const paths = [];

    for (let i = 0; i < nodeNumberDef; i++) {
        for (let j = 0; j < nodeNumberDef; j++) {
            for (let k = 0; k < nodeNumberDef; k++) {
                if (adjacencyMatrix[i][k] === 1 && adjacencyMatrix[k][j] === 1) {
                    for (let l = 0; l < nodeNumberDef; l++) {
                        if (adjacencyMatrix[j][l] === 1 && l !== i && l !== k) {
                            paths.push({ start: i + 1, middle1: k + 1, middle2: j + 1, end: l + 1 });
                        }
                    }
                }
            }
        }
    }
    paths.sort((a, b) => a.start - b.start);
    return paths;
};

if (contextDef) {
    const adjacencyMatrix = generateAdjacencyMatrixDef();

    const powers = calculatePowersDef(adjacencyMatrix);
    console.log("Power of each node in defined graph:", powers);

    const pathsLength2 = findPathsLength2Def(adjacencyMatrix);
    console.log("Paths of length 2 in defined graph:", pathsLength2);

    const pathsLength3 = findPathsLength3Def(adjacencyMatrix);
    console.log("Paths of length 3 in defined graph:", pathsLength3);

    drawGraphEdgesDef(adjacencyMatrix);
    drawGraphNodesDef();
} else {
    console.log('canvas are not supported');
}
