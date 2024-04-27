const canvasNonDef = document.getElementById('non-defined-graph-box');
const contextNonDef = canvasNonDef.getContext('2d');

const nodePositionsNonDef = [
    { x: 150, y: 150 },
    { x: 300, y: 150 },
    { x: 450, y: 150 },
    { x: 600, y: 150 },
    { x: 600, y: 350 },
    { x: 600, y: 550 },
    { x: 450, y: 550 },
    { x: 300, y: 550 },
    { x: 150, y: 550 },
    { x: 150, y: 350 },
    { x: 375, y: 350 }
];

const nodeNumberNonDef = nodePositionsNonDef.length;
const kNonDef = 1 - 0.005 - 9 * 0.005 - 0.27;

const drawGraphNodesNonDef = () => {
    contextNonDef.fillStyle = 'white';

    nodePositionsNonDef.forEach((nodePositionNonDef, index) => {
        contextNonDef.beginPath();
        contextNonDef.arc(nodePositionNonDef.x, nodePositionNonDef.y, 20, 0, Math.PI * 2, true);
        contextNonDef.fill();
        contextNonDef.stroke();
    });

    contextNonDef.font = '14px Arial';
    contextNonDef.textAlign = 'center';
    contextNonDef.textBaseline = 'middle';
    contextNonDef.fillStyle = 'black';
    nodePositionsNonDef.forEach((nodePositionNonDef, index) => {
        contextNonDef.fillText(`${index + 1}`, nodePositionNonDef.x, nodePositionNonDef.y);
    });
};

const generateAdjacencyMatrixNonDef = () => {
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

const drawGraphEdgesNonDef = (adjacencyMatrix) => {
    contextNonDef.strokeStyle = 'white';
    contextNonDef.lineWidth = 1;

    for (let i = 0; i < nodeNumberNonDef; i++) {
        for (let j = 0; j < nodeNumberNonDef; j++) {
            if (adjacencyMatrix[i][j] === 1) {
                const startX = nodePositionsNonDef[j].x;
                const startY = nodePositionsNonDef[j].y;

                const endX = nodePositionsNonDef[i].x;
                const endY = nodePositionsNonDef[i].y;

                const midX = (startX + endX) / 2;

                if (i === j) {
                    contextNonDef.beginPath();
                    if (i < 4) {
                        contextNonDef.arc(endX,  (endY - 40), 20, -(Math.PI/2), 3*Math.PI/2, true);
                    } else if ((i > 4 && i < 9) || i === 10) {
                        contextNonDef.arc(endX,  (endY + 40), 20, Math.PI/2, -(3*Math.PI/2), true);
                    } else if (i === 9) {
                        contextNonDef.arc((endX - 40),  endY, 20, 0, 2*Math.PI, true);
                    } else {
                        contextNonDef.arc((endX + 40),  endY, 20, Math.PI, -(Math.PI), true);
                    }
                    contextNonDef.stroke();
                } else {
                    contextNonDef.beginPath();
                    if (i < 4) {
                        contextNonDef.moveTo(startX, startY);
                        contextNonDef.lineTo(midX, startY - 50);
                        contextNonDef.lineTo(endX, endY);
                    } else if ((i > 4) && (i < 9)) {
                        contextNonDef.moveTo(startX, startY);
                        contextNonDef.lineTo(startX + 50, startY + 50);
                        contextNonDef.lineTo(endX, endY);
                    } else {
                        contextNonDef.moveTo(startX, startY);
                        contextNonDef.lineTo(startX - 100, startY + 50);
                        contextNonDef.lineTo(endX, endY);
                    }
                    contextNonDef.stroke();
                }
            }
        }
    }
};

const calculatePowersNonDef = (adjacencyMatrix) => {
    const powers = new Array(nodeNumberNonDef).fill(0);

    for (let i = 0; i < nodeNumberNonDef; i++) {
        for (let j = 0; j < nodeNumberNonDef; j++) {
            if (adjacencyMatrix[i][j] === 1) {
                powers[i] += 1;
                if (i !== j) {
                    powers[j] += 1;
                } else {
                    powers[i] += 1;
                }
            }
        }
    }

    const powersObject = powers.reduce((acc, power, index) => {
        acc[index + 1] = power;
        return acc;
    }, {});

    return powersObject;
}

const findPathsLength2NonDef = (adjacencyMatrix) => {
    const paths = [];

    for (let i = 0; i < nodeNumberNonDef; i++) {
        for (let j = 0; j < nodeNumberNonDef; j++) {
                for (let k = 0; k < nodeNumberNonDef; k++) {
                    if (adjacencyMatrix[i][k] === 1 && adjacencyMatrix[k][j] === 1) {
                        paths.push({ start: i + 1, middle: k + 1, end: j + 1 });
                        paths.push({ start: j + 1, middle: k + 1, end: i + 1 });
                    }
                }
        }
    }
    paths.sort((a, b) => a.start - b.start);
    return paths;
};

const findPathsLength3NonDef = (adjacencyMatrix) => {
    const paths = [];

    for (let i = 0; i < nodeNumberNonDef; i++) {
        for (let j = 0; j < nodeNumberNonDef; j++) {
            for (let k = 0; k < nodeNumberNonDef; k++) {
                    for (let l = 0; l < nodeNumberNonDef; l++) {
                        if (adjacencyMatrix[i][k] === 1 && adjacencyMatrix[k][l] === 1 && adjacencyMatrix[l][j] === 1) {
                            paths.push({ start: i + 1, middle1: k + 1, middle2: l + 1, end: j + 1 });
                            paths.push({ start: j + 1, middle1: l + 1, middle2: k + 1, end: i + 1 });
                    } else if (adjacencyMatrix[i][k] === 1 && adjacencyMatrix[k][j] === 1 && adjacencyMatrix[j][l] === 1) {
                            paths.push({ start: i + 1, middle1: k + 1, middle2: j + 1, end: l + 1 });
                            paths.push({ start: l + 1, middle1: j + 1, middle2: k + 1, end: i + 1 });
                        } else if (adjacencyMatrix[i][l] === 1 && adjacencyMatrix[l][k] === 1 && adjacencyMatrix[k][j] === 1) {
                            paths.push({ start: i + 1, middle1: l + 1, middle2: k + 1, end: j + 1 });
                            paths.push({ start: j + 1, middle1: k + 1, middle2: l + 1, end: i + 1 });
                        } else if (adjacencyMatrix[i][l] === 1 && adjacencyMatrix[l][j] === 1 && adjacencyMatrix[j][k] === 1) {
                            paths.push({ start: i + 1, middle1: l + 1, middle2: j + 1, end: k + 1 });
                            paths.push({ start: k + 1, middle1: j + 1, middle2: l + 1, end: i + 1 });
                        } else if (adjacencyMatrix[i][j] === 1 && adjacencyMatrix[j][k] === 1 && adjacencyMatrix[k][l] === 1) {
                            paths.push({ start: i + 1, middle1: j + 1, middle2: k + 1, end: l + 1 });
                            paths.push({ start: l + 1, middle1: k + 1, middle2: j + 1, end: i + 1 });
                        } else if (adjacencyMatrix[i][j] === 1 && adjacencyMatrix[j][l] === 1 && adjacencyMatrix[l][k] === 1) {
                            paths.push({ start: i + 1, middle1: j + 1, middle2: l + 1, end: k + 1 });
                            paths.push({ start: k + 1, middle1: l + 1, middle2: j + 1, end: i + 1 });
                        }
                }
            }
        }
    }
    const comparePaths = (a, b) => {
        if (a.start !== b.start) {
            return a.start - b.start;
        } else {
            return a.end - b.end;
        }
    };

    paths.sort(comparePaths);
    return paths;
};

if (contextNonDef) {
    const adjacencyMatrix = generateAdjacencyMatrixNonDef();
    console.log('Adjacency matrix:', adjacencyMatrix);

    const adjacencyMatrixSqrt = multiplyMatrices(adjacencyMatrix, adjacencyMatrix);
    const adjacencyMatrixCubed = multiplyMatrices(adjacencyMatrixSqrt, adjacencyMatrix);
    console.log('Adjacency matrix squared:', adjacencyMatrixSqrt);
    console.log('Adjacency matrix cubed:', adjacencyMatrixCubed);

    const powers = calculatePowersNonDef(adjacencyMatrix);
    console.log("Power of each node in non-defined graph:", powers);

    const pathsLength2 = findPathsLength2NonDef(adjacencyMatrix);
    console.log("Paths of length 2 in non-defined graph:", pathsLength2);

    const pathsLength3 = findPathsLength3NonDef(adjacencyMatrix);
    console.log("Paths of length 3 in non-defined graph:", pathsLength3);

    drawGraphEdgesNonDef(adjacencyMatrix);
    drawGraphNodesNonDef();
} else {
    console.log('canvas are not supported');
}
