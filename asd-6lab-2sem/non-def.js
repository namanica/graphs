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
const kNonDef = 1 - 0.01 - 9 * 0.005 - 0.05;

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

const generateUpperTriangularMatrix = (n) => {
    let matrix = [];
    for (let i = 0; i < n; i++) {
        let row = [];
        for (let j = 0; j < n; j++) {
            if (j >= i) {
                row.push(1);
            } else {
                row.push(0);
            }
        }
        matrix.push(row);
    }
    return matrix;
}

const generateWeightsMatrixNonDef = (adjacencyMatrix) => {
    const seed = 3319;
    const B = [];
    const C = [];
    const D = [];
    const H = [];
    const Tr = generateUpperTriangularMatrix(nodeNumberNonDef);
    const W = [];


    Math.seedrandom(seed);
    for (let i = 0; i < nodeNumberNonDef; i++) {
        B[i] = [];
        C[i] = [];
        D[i] = [];
        H[i] = [];
        W[i] = [];
        for (let j = 0; j < nodeNumberNonDef; j++) {
            B[i][j] = Math.random() * 2;
            C[i][j] = Math.ceil(B[i][j] * 100 * adjacencyMatrix[i][j]);
            if (C[i][j] === 0) {
                D[i][j] = 0;
            } else if (C[i][j] > 0) {
                D[i][j] = 1;
            }
            H[i][j] = (i < nodeNumberNonDef && j < nodeNumberNonDef && D[i] && D[j]) ? (D[i][j] === D[j][i] ? 0 : 1) : 0;
            if (i < nodeNumberNonDef && j < nodeNumberNonDef && D[i] && D[j] && H[i] && H[j] && Tr[i] && Tr[j] && C[i]) {
                const val = (D[i][j] + H[i][j] * Tr[i][j]) * C[i][j];
                W[i][j] = val;
                W[j][i] = val;
            }
        }
    }
    return W;
}

const drawGraphEdgesNonDef = (adjacencyMatrix, weightsMatrix) => {
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

                const weight = weightsMatrix[i][j];
                const textX = (startX + endX) / 2;
                const textY = (startY + endY) / 2;

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
                        contextNonDef.fillStyle = 'white';
                        contextNonDef.fillText(weight, textX, textY - 50);
                    } else if ((i > 4) && (i < 9)) {
                        contextNonDef.moveTo(startX, startY);
                        contextNonDef.lineTo(startX + 50, startY + 50);
                        contextNonDef.lineTo(endX, endY);
                        contextNonDef.fillStyle = 'white';
                        contextNonDef.fillText(weight, textX, textY + 50);
                    } else {
                        contextNonDef.moveTo(startX, startY);
                        contextNonDef.lineTo(startX - 100, startY + 50);
                        contextNonDef.lineTo(endX, endY);
                        contextNonDef.fillStyle = 'white';
                        contextNonDef.fillText(weight, textX, textY);
                    }
                    contextNonDef.stroke();
                }
            }
        }
    }
};

// class Graph {
//     constructor() {
//         this.nodes = [];
//         this.edges = [];
//     }
//
//     getGraphNodes() {
//         for (let i = 0; i < nodeNumberNonDef; i++) {
//             this.nodes.push(i);
//         }
//         return this.nodes;
//     }
//
//     getGraphEdges(adjacencyMatrix) {
//         for (let i = 0; i < nodeNumberNonDef; i++) {
//             for (let j = 0; j < nodeNumberNonDef; j++) {
//                 if (adjacencyMatrix[i][j] === 1 && i !== j) {
//                     this.edges.push([i, j]);
//                 }
//             }
//         }
//         return this.edges;
//     }
// };

const primMST = (weightsMatrix) => {
    const numNodes = weightsMatrix.length;
    const includedInMST = Array(numNodes).fill(false);
    const minWeights = Array(numNodes).fill(Infinity);
    const parents = Array(numNodes).fill(null);
    const mstEdges = [];
    const mstSteps = [];

    minWeights[0] = 0;

    for (let count = 0; count < numNodes; count++) {
        let minWeight = Infinity;
        let newNode = -1;

        for (let i = 0; i < numNodes; i++) {
            if (!includedInMST[i] && minWeights[i] < minWeight) {
                minWeight = minWeights[i];
                newNode = i;
            }
        }

        includedInMST[newNode] = true;

        if (parents[newNode] !== null) {
            mstEdges.push([parents[newNode] + 1, newNode + 1, minWeights[newNode]]);
            mstSteps.push([parents[newNode], newNode]);
        }

        for (let i = 0; i < numNodes; i++) {
            if (weightsMatrix[newNode][i] && !includedInMST[i] && weightsMatrix[newNode][i] < minWeights[i]) {
                minWeights[i] = weightsMatrix[newNode][i];
                parents[i] = newNode;
            }
        }
    }

    return { mstEdges, mstSteps };
};

let currentTreeEdgeIndex = 0;

const drawNextTreeEdge = (treeEdges, weightsMatrix) => {
    if (currentTreeEdgeIndex < treeEdges.length) {
        const [parent, child] = treeEdges[currentTreeEdgeIndex];
        console.log([parent + 1, child + 1], weightsMatrix[parent][child]);
        const startX = nodePositionsNonDef[child].x;
        const startY = nodePositionsNonDef[child].y;
        const endX = nodePositionsNonDef[parent].x;
        const endY = nodePositionsNonDef[parent].y;

        contextNonDef.strokeStyle = 'green';
        contextNonDef.lineWidth = 2;

        contextNonDef.beginPath();
        contextNonDef.moveTo(startX, startY);
        contextNonDef.lineTo(endX, endY);

        contextNonDef.stroke();

        currentTreeEdgeIndex++;
    } else {
        console.log('MST is finished');
    }
};

function reorderArray(arr) {
    const reorderedArr = [];
    const visited = new Set();

    for (let i = 0; i < arr.length; i++) {
        if (!visited.has(i)) {
            let current = arr[i];
            reorderedArr.push(current);
            visited.add(i);

            let nextIndex = arr.findIndex(pair => pair[0] === current[1] && !visited.has(arr.indexOf(pair)));
            while (nextIndex !== -1) {
                current = arr[nextIndex];
                reorderedArr.push(current);
                visited.add(nextIndex);
                nextIndex = arr.findIndex(pair => pair[0] === current[1] && !visited.has(arr.indexOf(pair)));
            }
        }
    }

    return reorderedArr;
}


if (contextNonDef) {
    const adjacencyMatrix = generateAdjacencyMatrixNonDef();
    console.log('Adjacency matrix:', adjacencyMatrix);

    const weightsMatrix = generateWeightsMatrixNonDef(adjacencyMatrix);
    console.log('Weights matrix:', weightsMatrix);

    const mstEdges = primMST(weightsMatrix).mstEdges;
    // console.log('MST edges:', mstEdges);

    const mstSteps = primMST(weightsMatrix).mstSteps;
    // console.log('MST steps:', mstSteps);

    const reorderedArr = reorderArray(mstSteps);
    // console.log(reorderedArr);

    const nextStepButton = document.getElementById('canvas-btn');
    nextStepButton.addEventListener('click', () => {
        drawNextTreeEdge(reorderedArr, weightsMatrix);
        drawGraphNodesNonDef();
    });

    drawGraphEdgesNonDef(adjacencyMatrix, weightsMatrix);
    drawGraphNodesNonDef();
} else {
    console.log('canvas are not supported');
}
