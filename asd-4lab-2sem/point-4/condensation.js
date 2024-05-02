const canvasCon = document.getElementById('condensation-graph-box');
const contextCon = canvasCon.getContext('2d');

const nodePositionsCon = [
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
const arrowPositionsCon = [
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
const nodeNumberCon = nodePositionsCon.length;
const k = 1 - 0.005 - 9 * 0.005 - 0.27;

const drawGraphNodesCon = () => {
    contextCon.fillStyle = 'white';

    nodePositionsDef.forEach((nodePositionCon, index) => {
        contextCon.beginPath();
        contextCon.arc(nodePositionCon.x, nodePositionCon.y, 20, 0, Math.PI * 2, true);
        contextCon.fill();
        contextCon.stroke();
    });

    contextCon.font = '14px Arial';
    contextCon.textAlign = 'center';
    contextCon.textBaseline = 'middle';
    contextCon.fillStyle = 'black';
    nodePositionsDef.forEach((nodePositionCon, index) => {
        contextCon.fillText(`K ${index + 1}`, nodePositionCon.x, nodePositionCon.y);
    });
};

function calculateAdjustedStartPoint(startX, startY, endX, endY, radius) {
    const angle = Math.atan2(endY - startY, endX - startX);

    const adjustedX = startX + (radius * Math.cos(angle));
    const adjustedY = startY + (radius * Math.sin(angle));

    return { x: adjustedX, y: adjustedY };
}

const drawGraphEdgesCon = (adjacencyMatrix) => {
    contextCon.strokeStyle = 'white';
    contextCon.lineWidth = 1;

    for (let i = 0; i < nodeNumberCon; i++) {
        for (let j = 0; j < nodeNumberCon; j++) {
            if (adjacencyMatrix[i][j] === 1) {
                const startX = nodePositionsCon[j].x;
                const startY = nodePositionsCon[j].y;

                const endX = nodePositionsCon[i].x;
                const endY = nodePositionsCon[i].y;

                if (i === j) {
                    contextCon.beginPath();
                    if (i < 4) {
                        contextCon.arc(endX, (endY - 40), 20, -(Math.PI / 2), 3 * Math.PI / 2, true);
                        drawArrowCon(arrowPositionsCon[i].x, arrowPositionsCon[i].y, -(3 * Math.PI / 13));
                    } else if ((i > 4 && i < 9) || i === 10) {
                        contextCon.arc(endX, (endY + 40), 20, Math.PI / 2, -(3 * Math.PI / 2), true);
                        drawArrowCon(arrowPositionsCon[i].x, arrowPositionsCon[i].y, (3 * Math.PI / 5));
                    } else if (i === 9) {
                        contextCon.arc((endX - 40), endY, 20, 0, 2 * Math.PI, true);
                        drawArrowCon(arrowPositionsCon[i].x, arrowPositionsCon[i].y, (3 * Math.PI / 5));
                    } else {
                        contextCon.arc((endX + 40), endY, 20, Math.PI, -(Math.PI), true);
                        drawArrowCon(arrowPositionsCon[i].x, arrowPositionsCon[i].y, (3 * Math.PI / 11));
                    }
                    contextCon.stroke();
                } else {
                    contextCon.beginPath();
                    contextCon.moveTo(startX, startY);
                    contextCon.lineTo(endX, endY);

                    let adjustedStartPoint = calculateAdjustedStartPoint(startX, startY, endX, endY, 20);
                    const angle = Math.atan2(endY - startY, endX - startX);
                    drawArrowCon(adjustedStartPoint.x, adjustedStartPoint.y, angle);
                    contextCon.stroke();
                }
            }
        }
    }
};

const drawArrowCon = (x, y, angleInRadians) => {
    const arrowSize = 6;
    contextCon.save();
    contextCon.translate(x, y);
    contextCon.rotate(angleInRadians);
    contextCon.moveTo(0, 0);
    contextCon.lineTo(arrowSize, -arrowSize);
    contextCon.lineTo(arrowSize / 2, 0);
    contextCon.lineTo(arrowSize, arrowSize);
    contextCon.closePath();
    contextCon.restore();
}

const generateAdjacencyMatrixCon = () => {
    const seed = 3319;
    const matrix = [];

    Math.seedrandom(seed);
    for (let i = 0; i < nodeNumberCon; i++) {
        matrix[i] = [];
        for (let j = 0; j < nodeNumberCon; j++) {
            matrix[i][j] = Math.random() * 2 * k;
            matrix[i][j] = matrix[i][j] < 1 ? 0 : 1;
        }
    }
    return matrix;
}

const multiplyMatrices = (matrix1, matrix2) => {
    const rows1 = matrix1.length;
    const cols1 = matrix1[0].length;
    const cols2 = matrix2[0].length;

    if (cols1 !== matrix2.length) {
        console.error("Inappropriate rows and cols");
        return [];
    }

    let result = new Array(rows1);
    for (let i = 0; i < rows1; i++) {
        result[i] = new Array(cols2).fill(0);
    }

    for (let i = 0; i < rows1; i++) {
        for (let k = 0; k < cols1; k++) {
            const val = matrix1[i][k];
            for (let j = 0; j < cols2; j++) {
                result[i][j] += val * matrix2[k][j];
            }
        }
    }
    return result;
}

const sumMatrices = (matrix1, matrix2) => {
    const result = [];
    const rows = matrix1.length;
    const cols = matrix1[0].length;

    if (rows !== matrix2.length || cols !== matrix2[0].length) {
        console.error("Matrix sizes must be the same");
        return result;
    }

    for (let i = 0; i < rows; i++) {
        result[i] = [];
        for (let j = 0; j < cols; j++) {
            result[i][j] = matrix1[i][j] + matrix2[i][j];
        }
    }
    return result;
}

const generateUnoMatrix = (matrixLength) => {
    let matrix = [];
    for (let i = 0; i < matrixLength; i++) {
        matrix[i] = new Array(matrixLength).fill(0);
        matrix[i][i] = 1;
    }
    return matrix;
}

const booleanMatrix = (matrix) => {
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix.length; j++) {
            matrix[i][j] = matrix[i][j] = 0 ? 0 : 1;
        }
    }
    return matrix;
}

const transposeMatrix = (matrix) => {
    const transposedMatrix = [];
    for (let i = 0; i < matrix[0].length; i++) {
        transposedMatrix[i] = [];
        for (let j = 0; j < matrix.length; j++) {
            transposedMatrix[i][j] = matrix[j][i];
        }
    }
    return transposedMatrix;
}

function multiplyMatricesElem(matrix1, matrix2) {
    let result = [];

    if (matrix1.length !== matrix2.length || matrix1[0].length !== matrix2[0].length) {
        console.error("Matrices must have the same size");
        return result;
    }

    for (let i = 0; i < matrix1.length; i++) {
        result[i] = [];
        for (let j = 0; j < matrix1[0].length; j++) {
            result[i][j] = matrix1[i][j] * matrix2[i][j];
        }
    }
    return result;
}

const findSCCs = (adjacencyMatrix) => {
    const visitedNodes = new Array(nodeNumberCon).fill(false);
    const stack = [];

    const dfs1 = (node) => {
        visitedNodes[node] = true;
        for (let i = 0; i < nodeNumberCon; i++) {
            if (adjacencyMatrix[node][i] === 1 && !visitedNodes[i]) {
                dfs1(i);
            }
        }
        stack.push(node);
    };

    for (let i = 0; i < nodeNumberCon; i++) {
        if (!visitedNodes[i]) {
            dfs1(i);
        }
    }

    const transposedAdjMatrix = transposeMatrix(adjacencyMatrix);
    const SCCs = [];

    const dfs2 = (node, scc) => {
        visitedNodes[node] = true;
        scc.push(node);
        for (let i = 0; i < nodeNumberCon; i++) {
            if (transposedAdjMatrix[node][i] === 1 && !visitedNodes[i]) {
                dfs2(i, scc);
            }
        }
    };

    visitedNodes.fill(false);

    while (stack.length > 0) {
        const node = stack.pop();
        if (!visitedNodes[node]) {
            const scc = [];
            dfs2(node, scc);
            SCCs.push(scc);
        }
    }

    return SCCs;
}

if (contextCon) {
    const I = generateUnoMatrix(nodeNumberCon);
    const adjacencyMatrix = generateAdjacencyMatrixCon();

    const A2 = multiplyMatrices(adjacencyMatrix, adjacencyMatrix);
    console.log('A^2:', A2);

    const A3 = multiplyMatrices(A2, adjacencyMatrix);
    console.log('A^3:', A3);

    const A4 = multiplyMatrices(A3, adjacencyMatrix);

    const sumIA = sumMatrices(I, adjacencyMatrix);
    const sumIAA2 = sumMatrices(sumIA, A2);
    const sumIAA2A3 = sumMatrices(sumIAA2, A3);
    const sumIAA2A3A4 = sumMatrices(sumIAA2A3, A4);

    const R = booleanMatrix(sumIAA2A3A4);
    console.log('Reachability matrix:', R);

    const transposedR = transposeMatrix(R);
    const S = multiplyMatricesElem(R, transposedR);
    console.log('Strong connectivity matrix:', S);

    const SCC = findSCCs(S);
    console.log('Strongly Connected Components:', SCC);

    drawGraphEdgesCon(S);
    drawGraphNodesCon();
} else {
    console.log('canvas are not supported');
}
