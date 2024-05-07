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
const kDef = 1 - 0.01 - 9 * 0.005 - 0.15;

const drawGraphNodesDef = () => {
    contextDef.strokeStyle = 'white';
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

let visitedNodesDFS = [];
let currentStepDFS = 0;

const DFSAlgorithm = (adjacencyMatrix, startNode) => {
    const visited = new Array(nodeNumberDef).fill(false);

    const dfsUtil = (currentNode) => {
        visitedNodesDFS.push(currentNode);
        visited[currentNode] = true;

        for (let i = 0; i < nodeNumberDef; i++) {
            if (adjacencyMatrix[currentNode][i] === 1 && !visited[i]) {
                dfsUtil(i);
            }
        }
    }

    dfsUtil(startNode);
}

const drawNextStepDFS = (adjacencyMatrix) => {
    if (currentStepDFS < visitedNodesDFS.length) {
        const currentNodeIndex = visitedNodesDFS[currentStepDFS];
        console.log(`DFS - active node: ${currentNodeIndex + 1}`);

        for (let i = 0; i < nodeNumberDef; i++) {
            if (adjacencyMatrix[currentNodeIndex][i] === 1) {
                const startX = nodePositionsDef[i].x;
                const startY = nodePositionsDef[i].y;

                const endX = nodePositionsDef[currentNodeIndex].x;
                const endY = nodePositionsDef[currentNodeIndex].y;

                contextDef.strokeStyle = 'red';
                contextDef.lineWidth = 1;

                if (i === currentNodeIndex) {
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
        currentStepDFS++;
    } else {
        console.log("DFS is finished");
    }
}

const createTreeEdgesFromDFS = (visitedNodesDFS) => {
    const treeEdges = [];
    for (let i = 1; i < visitedNodesDFS.length; i++) {
        const parent = visitedNodesDFS[i - 1];
        const child = visitedNodesDFS[i];
        treeEdges.push([parent, child]);
    }
    return treeEdges;
};

let currentTreeEdgeIndexDFS = 0;

const drawNextTreeEdgeDFS = (treeEdges) => {
    if (currentTreeEdgeIndexDFS < treeEdges.length) {
        const [parent, child] = treeEdges[currentTreeEdgeIndexDFS];
        const startX = nodePositionsDef[child].x;
        const startY = nodePositionsDef[child].y;
        const endX = nodePositionsDef[parent].x;
        const endY = nodePositionsDef[parent].y;

        contextDef.strokeStyle = 'green';
        contextDef.lineWidth = 2;

        contextDef.beginPath();
        contextDef.moveTo(startX, startY);
        contextDef.lineTo(endX, endY);

        let adjustedStartPoint = calculateAdjustedStartPoint(startX, startY, endX, endY, 20);
        const angle = Math.atan2(endY - startY, endX - startX);
        drawArrow(adjustedStartPoint.x, adjustedStartPoint.y, angle);
        contextDef.stroke();

        currentTreeEdgeIndexDFS++;
    }
};

if (contextDef) {
    const adjacencyMatrix = generateAdjacencyMatrixDef();
    console.log(adjacencyMatrix);

    const startNode = 0;
    DFSAlgorithm(adjacencyMatrix, startNode);

    const nextStepButton = document.getElementById('canvas-btn');
    nextStepButton.addEventListener('click', () => {
        drawNextStepDFS(adjacencyMatrix);
        const treeEdges = createTreeEdgesFromDFS(visitedNodesDFS);
        drawNextTreeEdgeDFS(treeEdges);
        drawGraphNodesDef();
    });

    drawGraphEdgesDef(adjacencyMatrix);
    drawGraphNodesDef();
} else {
    console.log('canvas are not supported');
}
