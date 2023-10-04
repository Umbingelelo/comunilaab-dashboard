import { v4 } from 'uuid'
export interface NodeGraph {
    id: string;
    x: number;
    y: number;
    xRelative: number;
    yRelative: number;
}

export interface Vertex {
    node1: NodeGraph;
    node2: NodeGraph;
}

export class Graph {

    private nodes: NodeGraph[] = [];
    private vertexes: Vertex[] = [];

    constructor() {
        this.nodes = [];
        this.vertexes = [];
    }

    addNode(node: NodeGraph) {
        const nodeFound = this.nodes.find((oldNode) => oldNode.id === node.id);
        if (nodeFound) throw new Error('Node already exists');
        this.nodes.push(node);
    }

    addVertex(node1: NodeGraph, node2: NodeGraph) {
        if (!this.nodes.includes(node1)) throw new Error('Node 1 not found');
        if (!this.nodes.includes(node2)) throw new Error('Node 2 not found');
        if (node1.id === node2.id) throw new Error('Vertex cannot be the same node');

        const vertex = this.vertexes.find((vertex) => {
            return vertex.node1.id === node1.id && vertex.node2.id === node2.id;
        });
        if (vertex) throw new Error('Vertex already exists');

        const vertex2 = this.vertexes.find((vertex) => {
            return vertex.node1.id === node2.id && vertex.node2.id === node1.id;
        });
        if (vertex2) throw new Error('Vertex already exists');

        this.vertexes.push({ node1, node2 });
    }

    getTotalNodes() {
        return this.nodes.length;
    }

    findNodeById(id: string) {
        return this.nodes.find((node) => node.id === id);
    }

    removeNode(node: NodeGraph) {
        const index = this.nodes.indexOf(node);
        if (index === -1) throw new Error('Node not found');
        this.nodes.splice(index, 1);
        this.vertexes = this.vertexes.filter((vertex) => {
            return vertex.node1.id !== node.id && vertex.node2.id !== node.id;
        });
    }

    removeNodeById(id: string) {
        const node = this.findNodeById(id);
        if (!node) throw new Error('Node not found');
        this.removeNode(node);
    }

    removeVertex(vertex: Vertex) {
        const index = this.vertexes.indexOf(vertex);
        if (index === -1) throw new Error('Vertex not found');
        this.vertexes.splice(index, 1);
    }

    getVertexOfNodeById(id: string) {
        const node = this.findNodeById(id);
        if (!node) throw new Error('Node not found');
        return this.getVertexOfNode(node);
    }

    getVertexOfNode(node: NodeGraph) {
        return this.vertexes.filter((vertex) => {
            return vertex.node1.id === node.id || vertex.node2.id === node.id;
        });
    }

    getStructuresForBackend() {
        this.fillGraph();
        const map_nodes = this.getMapNodes();
        const map_matrix = this.generateDistanceMatrix();
        return {
            map_nodes,
            map_matrix,
        }
    }

    fillGraph() {
        let vertexCopy = [...this.vertexes];
        let index = 0;
        while (index < vertexCopy.length) {
            const vertex = vertexCopy[index];
            const node1 = vertex.node1;
            const node2 = vertex.node2;
            const distance = this.calculateDistance(node1, node2);
            if (distance > 100) {
                this.addNodeBetweenTwoNodes(node1, node2, vertex)
                index = 0;
                vertexCopy = [...this.vertexes];
            } else {
                index += 1;
            }
        }
    }

    addNodeBetweenTwoNodes(node1: NodeGraph, node2: NodeGraph, vertex: Vertex) {
        const newNode = {
            id: this.getNextId(),
            x: (node1.x + node2.x) / 2,
            y: (node1.y + node2.y) / 2,
            xRelative: 0,
            yRelative: 0,
        }
        this.addNode(newNode);
        this.removeVertex(vertex);
        this.addVertex(node1, newNode);
        this.addVertex(newNode, node2);
    }

    addNodeBetweenNodes(node1: NodeGraph, node2: NodeGraph, newNode: NodeGraph) {
        const vertex = this.vertexes.find((vertex) => {
            return vertex.node1.id === node1.id && vertex.node2.id === node2.id;
        });
        if (!vertex) throw new Error('Vertex not found');
        this.removeVertex(vertex);
        this.addNode(newNode);
        this.addVertex(node1, newNode);
        this.addVertex(newNode, node2);
    }

    getMapNodes() {
        return this.nodes.map((node) => {
            return [
                node.x,
                node.y,
            ]
        })
    }

    generateDistanceMatrix() {
        const matrix: number[][] = [];
        this.nodes.forEach((node) => {
            const distances: number[] = [];
            this.nodes.forEach((node2) => {
                if (node.id === node2.id) {
                    distances.push(0);
                } else {
                    const firstVertex = this.vertexes.find((vertex) => {
                        return vertex.node1.id === node.id && vertex.node2.id === node2.id;
                    });
                    const otherVertex = this.vertexes.find((vertex) => {
                        return vertex.node1.id === node2.id && vertex.node2.id === node.id;
                    });
                    const vertex = firstVertex || otherVertex || null;
                    if (vertex) {
                        distances.push(this.calculateDistance(node, node2));
                    } else {
                        distances.push(Infinity);
                    }
                }
            });
            matrix.push(distances);
        });
        return matrix;
    }

    private calculateDistance(node1: NodeGraph, node2: NodeGraph) {
        const x = node1.x - node2.x;
        const y = node1.y - node2.y;
        return Math.sqrt(x * x + y * y);
    }

    getAllNodes() {
        return this.nodes;
    }

    addVertexById(id1: string, id2: string) {
        const node1 = this.findNodeById(id1);
        const node2 = this.findNodeById(id2);
        if (!node1) throw new Error('Node 1 not found');
        if (!node2) throw new Error('Node 2 not found');
        this.addVertex(node1, node2);
    }

    removeNodeFromVertexesById(id: string) {
        const node = this.findNodeById(id);
        if (!node) throw new Error('Node not found');
        const vertexes = this.getVertexOfNode(node);
        vertexes.forEach((vertex) => {
            this.removeVertex(vertex);
        });
    }

    getNextId() {
        return v4().replace(/-/g, '');
    }

    removeVertexByNodeIds(id1: string, id2: string) {
        const node1 = this.findNodeById(id1);
        const node2 = this.findNodeById(id2);
        if (!node1) throw new Error('Node 1 not found');
        if (!node2) throw new Error('Node 2 not found');
        const vertex = this.vertexes.find((vertex) => {
            return vertex.node1.id === node1.id && vertex.node2.id === node2.id;
        });
        if (!vertex) throw new Error('Vertex not found');
        this.removeVertex(vertex);
    }

    resetGraph() {
        this.nodes = [];
        this.vertexes = [];
    }

}
