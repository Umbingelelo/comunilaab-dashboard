import { Component, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlaceService } from '../../store/place-service/place-service.service';
import { Graph } from './graph';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { AlertGeneratorService } from '../../shared/alert-generator/alert-generator.service';
type Steps = 'add-vertex' | 'add-nodes' | 'save';

@Component({
  selector: 'app-map-editor',
  templateUrl: './map-editor.component.html',
  styleUrls: ['./map-editor.component.css']
})
export class MapEditorComponent implements OnInit {

  public faSpinner = faSpinner;
  public loading = true;
  public currentPlace: any;
  public currentStep: Steps = 'add-nodes';
  public steps: Steps[] = ['add-nodes', 'add-vertex', 'save'];
  public graph = new Graph();
  public nodeSelected = false;
  public nodeStartOfVertex: any;
  public nodeEndOfVertex: any;
  public imageLoading = true;

  constructor(
    public ActivatedRoute: ActivatedRoute,
    public PlaceService: PlaceService,
    public Router: Router,
    public AlertGeneratorService: AlertGeneratorService,
  ) { }

  ngOnInit(): void {
    this.ActivatedRoute.paramMap.subscribe((ParamsMap: any) => {
      const { params } = ParamsMap;
      const { id } = params;
      this.getAllData(id).catch((error) => {
        console.error(error);
      }).finally(() => {
        this.nodeStartOfVertex = null;
        this.nodeEndOfVertex = null;
        this.nodeSelected = false;
        this.loading = false;
      })
    })
  }

  async getAllData(id: number) {
    this.currentPlace = await this.PlaceService.findById(id);
  }

  setData() {
    const { map_nodes, map_matrix } = this.currentPlace;
    if (!map_nodes || !map_matrix) throw new Error('Map nodes or map matrix not found');
    map_nodes.forEach((node: any) => {
      this.createNode(node[0], node[1], false);
    });
    const allNodes = this.graph.getAllNodes();
    const pairs = this.convertMatrixToPairs(map_matrix)
    pairs.forEach((pair) => {
      const [node1, node2] = pair;
      this.graph.addVertex(allNodes[node1], allNodes[node2]);
      this.nodeStartOfVertex = allNodes[node1];
      this.nodeEndOfVertex = allNodes[node2];
      this.makeAndPaintHTMLLine();
    });
    this.imageLoading = false;
  }

  convertMatrixToPairs(matrix: (number[] | null)[][]): any[] {
    const pairs: any[] = [];
    for (let rowIndex = 0; rowIndex < matrix.length; rowIndex++) {
      const row = matrix[rowIndex];
      for (let colIndex = 0; colIndex < row.length && colIndex < rowIndex; colIndex++) {
        const destinations = row[colIndex];
        if (!destinations) continue;
        else {
          if (destinations.length === 2) {
            const otherNode = destinations.find((destination) => {
              return destination !== rowIndex
            });
            if (otherNode === undefined) throw new Error('Other node not found');
            pairs.push([rowIndex, otherNode]);
          }
        }
      }
    }
    return pairs;
  }

  getNodePosition(x: number, y: number, isRelative: boolean) {
    const map = document.getElementById('map') as HTMLImageElement;
    if (!map) throw new Error('Map not found');
    const naturalHeight = map.naturalHeight;
    const naturalWidth = map.naturalWidth;
    const sizedHeight = map.height;
    const sizedWidth = map.width;
    const realX = isRelative ? (Number(x) * naturalWidth / sizedWidth) : x;
    const realY = isRelative ? (Number(y) * naturalHeight / sizedHeight) : y;
    const relativeX = isRelative ? x : (Number(x) * sizedWidth / naturalWidth);
    const relativeY = isRelative ? y : (Number(y) * sizedHeight / naturalHeight);
    const nextId = this.graph.getNextId();
    return {
      x: realX,
      y: realY,
      relativeX,
      relativeY,
      id: nextId
    }
  }

  onClickNode($event: MouseEvent) {
    if (!$event.target) throw new Error('Target not found');
    const target = ($event.target as HTMLDivElement);
    if (this.currentStep === 'add-nodes') {
      this.addNodeOnClick(target);
    } else if (this.currentStep === 'add-vertex') {
      this.addLineOnClick(target);
    }
  }

  addNodeOnClick(target: any) {
    const allVertex = this.graph.getVertexOfNodeById(target.id.split('-')[1]);
    const allIds = allVertex.map((vertex) => { return `line-${vertex.node1.id}-${vertex.node2.id}`; })
    allIds.forEach((id) => {
      const line = document.getElementById(id);
      if (line) line.remove();
    })
    target.remove();
    this.graph.removeNodeFromVertexesById(target.id.split('-')[1]);
    this.graph.removeNodeById(target.id.split('-')[1]);
  }

  addLineOnClick(target: any) {
    const divId = target.id;
    const nodeId = divId.split('-')[1];
    const circle = this.graph.findNodeById(nodeId);
    try {
      if (!this.nodeSelected) {
        this.nodeStartOfVertex = circle;
        this.nodeSelected = true;
      } else {
        this.nodeEndOfVertex = circle;
        this.nodeSelected = false;
        this.graph.addVertex(this.nodeStartOfVertex, this.nodeEndOfVertex);
        this.makeAndPaintHTMLLine();
      }
    } catch (error) {
      this.nodeStartOfVertex = null;
      this.nodeEndOfVertex = null;
      this.nodeSelected = false;
      this.AlertGeneratorService.addAlert(
        'danger', 'Error', 'No se puede agregar una arista al mismo nodo.'
      )
    }
  }

  paintCircle(event: MouseEvent) {
    if (this.currentStep !== 'add-nodes') return;
    const { offsetX, offsetY } = event;
    this.createNode(offsetX, offsetY, true)
  }

  createNode(offsetX: number, offsetY: number, isRelative = true) {
    const map = document.getElementById('map') as HTMLImageElement;
    if (!map) throw new Error('Map not found');
    const circle = this.getNodePosition(offsetX, offsetY, isRelative);
    this.graph.addNode({
      x: circle.x,
      y: circle.y,
      id: String(circle.id),
      xRelative: circle.relativeX,
      yRelative: circle.relativeY,
    });
    const node = this.generateHTMLNode(circle);
    map.parentElement?.appendChild(node);
  }

  generateHTMLNode(circle: any) {
    const { relativeX, relativeY, id } = circle;
    const node = document.createElement('div');
    node.id = `node-${id}`;
    node.style.top = `${relativeY}px`;
    node.style.left = `${relativeX}px`;
    node.style.position = 'absolute';
    node.style.backgroundColor = 'rgb(256,256, 256)';
    node.style.border = '3px solid black';
    node.style.width = `${window.innerWidth / 90}px`;
    node.style.height = `${window.innerWidth / 90}px`;
    node.style.borderRadius = '50%';
    node.style.transform = 'translate(-50%, -50%)';
    node.style.zIndex = '2';
    node.addEventListener('click', this.onClickNode.bind(this));
    node.addEventListener('mouseover', (nodeEvent) => {
      const target = nodeEvent.target as HTMLDivElement;
      target.style.cursor = 'pointer';
      if (this.currentStep === 'add-nodes') target.style.backgroundColor = '#ef4444';
      else if (this.currentStep === 'add-vertex') target.style.backgroundColor = '#4ade80';
    });
    node.addEventListener('mouseout', (nodeEvent) => {
      const target = nodeEvent.target as HTMLDivElement;
      target.style.backgroundColor = 'rgb(256,256, 256)';
    });
    return node;
  }

  makeAndPaintHTMLLine() {
    if (!this.nodeStartOfVertex || !this.nodeEndOfVertex) throw new Error('Node 1 or Node 2 not found');
    const map = document.getElementById('map') as HTMLImageElement;
    if (!map) throw new Error('Map not found');
    const lineValues = this.calculateLineValues();
    const line = this.generateLineHtmlElement(lineValues);
    map.parentElement?.appendChild(line);
  }

  calculateLineValues() {
    const x1 = this.nodeStartOfVertex.xRelative;
    const y1 = this.nodeStartOfVertex.yRelative;
    const x2 = this.nodeEndOfVertex.xRelative;
    const y2 = this.nodeEndOfVertex.yRelative;
    const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    const angle = Math.atan2(y2 - y1, x2 - x1);
    const leftistNode = x1 < x2 ? x1 : x2;
    const distanceLengthToZero = (-1 * length / 2)
    const middlePointBetweenNodes = Math.abs(x1 - x2) / 2;
    return {
      angle,
      x1,
      x2,
      y1,
      y2,
      middlePointBetweenNodes,
      distanceLengthToZero,
      leftistNode,
      length
    }
  }

  generateLineHtmlElement(values: any) {
    const { angle, y1, y2, distanceLengthToZero, leftistNode, middlePointBetweenNodes, length } = values;
    const line = document.createElement('div');
    line.id = `line-${this.nodeStartOfVertex.id}-${this.nodeEndOfVertex.id}`;
    line.style.position = 'absolute';
    line.style.height = '5px';
    line.style.backgroundColor = 'black';
    line.style.zIndex = '1';
    line.style.transform = `rotate(${angle}rad)`;
    line.style.width = `${length}px`;
    line.style.top = `${((y1 + y2) / 2) - 5}px`;
    line.style.left = `${distanceLengthToZero + leftistNode + middlePointBetweenNodes}px`;
    line.addEventListener('click', (event) => {
      const { target } = event;
      (target as HTMLDivElement).remove();
      const id = (target as HTMLDivElement).id;
      const [node1, node2] = id.split('-').slice(1);
      this.graph.removeVertexByNodeIds(node1, node2);
    })
    return line;
  }

  nextStep() {
    if (this.currentStep === this.steps[this.steps.length - 1]) return;
    const index = this.steps.indexOf(this.currentStep);
    if (index === this.steps.length - 1) throw new Error('Next step not found');
    if (index === -1) throw new Error('Step not found');
    const nextIndex = index + 1;
    if (nextIndex >= this.steps.length) throw new Error('Next step not found');
    this.currentStep = this.steps[nextIndex];
    if (this.currentStep === 'save') this.save();
  }

  save() {
    const { map_matrix, map_nodes } = this.graph.getStructuresForBackend();
    this.loading = true;
    this.PlaceService.updateWithGraph(this.currentPlace.id, {
      map_matrix,
      map_nodes
    }).catch((error) => {
      console.error(error);
    }).finally(() => {
      this.loading = false;
      this.Router.navigate(['/place', this.currentPlace.id]);
    })
  }

  setPreviousStep() {
    const index = this.steps.indexOf(this.currentStep);
    if (index === 0) throw new Error('Prev step not found');
    if (index === -1) throw new Error('Step not found');
    const prevIndex = index - 1;
    if (prevIndex < 0) throw new Error('Prev step not found');
    this.currentStep = this.steps[prevIndex];
  }

  existsFormPreviousStep() {
    const index = this.steps.indexOf(this.currentStep);
    if (index === -1) return false;
    if (index === 0) return false;
    const prevIndex = index - 1;
    if (prevIndex < 0) return false;
    return true;
  }

  isSaveNextStep() {
    const index = this.steps.indexOf(this.currentStep);
    const nextStep = this.steps[index + 1];
    if (nextStep === 'save') return true;
    return false;
  }

  resetGraph() {
    this.graph.resetGraph();
    const map = document.getElementById('map') as HTMLImageElement;
    if (!map) throw new Error('Map not found');
    const allNodes = document.querySelectorAll('[id^="node-"]');
    allNodes.forEach((node) => {
      node.remove();
    });
    const allLines = document.querySelectorAll('[id^="line-"]');
    allLines.forEach((line) => {
      line.remove();
    });
  }

}
