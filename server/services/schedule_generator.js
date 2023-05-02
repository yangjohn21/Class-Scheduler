const { Graph, alg } = require('graphlib');
const { data } = require('./data');
const { Course } = require('../models/course.js');
const courses = data.data;

exports.generateSchedule = async (constraints, preferences) => {
  const courses = await Course.find();
  const schedule = generateSchedule(courses);
  return schedule;
}

function generateSchedule(courses) {
  const graph = createGraph(courses);
  // perform topological sort on graph
  const sorted = alg.topsort(graph);
  // Implement scheduling algorithm
  const schedule = [];
  // TODO: implement scheduling algorithm
  return schedule;
}
//console.log(generateSchedule(courses));

function createGraph(courses) {
  // Create an empty directed graph
  const graph = new Graph({ directed: true });
  
  // Add nodes to the graph for each course
  for (const course of courses) {
    graph.setNode(course.key, course);
  }

  // Add edges to the graph for each prerequisite relationship
  for (const course of courses) {
    const { key, prerequisites } = course;
    if (prerequisites.length == 0) continue;
    for (let i = 0; i < prerequisites.length; i++) {
      for (const prerequisite of prerequisites[i].options) {
        //if (!courseKeys.includes(prerequisite)) console.log(prerequisite);
        graph.setEdge(prerequisite, key);
      }
    }
  }

  // Add nodes that are not in data.js but are prerequisites
  for (const node of graph.nodes()) {
    if (graph.node(node) == undefined) {
      graph.setNode(node, { key: node, credits: 4})
    }
  }

  return graph;
}

const graph = createGraph(courses);
// console.log(json.write(graph)); 

// make graph all ancestors and descendants of a node
function makeSubGraph(graph, key) {
  if (!graph.hasNode(key)) { console.log(`Graph does not contain node: ${key}`); return; }
  // Get the set of nodes that should be included in the graph
  const nodes = new Set([key]);
  // add ancestors
  for (const node of graph.predecessors(key)) {
    nodes.add(node);
    for (const ancestor of graph.predecessors(node)) {
      nodes.add(ancestor);
      for (const ancestor2 of graph.predecessors(ancestor)) {
        nodes.add(ancestor2);
      }
    }
  }
  // add descendants
  for (const node of graph.successors(key)) {
    nodes.add(node);
    for (const descendant of graph.successors(node)) {
      nodes.add(descendant);
      for (const descendant2 of graph.successors(descendant)) {
        nodes.add(descendant2);
      }
    }
  }

  // Create a new graph that only includes the desired nodes
  const subgraph = new Graph({ directed: true });
  for (const node of nodes) {
    subgraph.setNode(node, graph.node(node));
  }
  for (const edge of graph.edges()) {
    if (nodes.has(edge.v) && nodes.has(edge.w)) {
      subgraph.setEdge(edge.v, edge.w);
    }
  }
  // return the subgraph
  return subgraph;
  // console.log(subgraph.edges());
}

function printGraph(graph) {
  for (const edge of graph.edges()) {
    const v = edge.v.split(" ")[0] + "_" + edge.v.split(" ")[1];
    const w = edge.w.split(" ")[0] + "_" + edge.w.split(" ")[1];
    console.log( v + " -> " + w + ";");
  }
}
//printGraph(graph);
subgraph = makeSubGraph(graph, 'COMPSCI 320');
//printGraph(subgraph);

// console.log(alg.topsort(graph));
sortedCourses = alg.topsort(graph).map((courseKey) => graph.node(courseKey));

function satisfiesCSRequirements(coursesTaken) {
  // Define the required courses
  const coreCourses = [
    'COMPSCI 220',
    'COMPSCI 230',
    'COMPSCI 240',
    'COMPSCI 250'
  ];
  const mathCourses = [
    'MATH 131',
    'MATH 132',
    'MATH 235'
  ];

  const scienceCourses = [
    ['CHEM 111', 'CHEM 121'],
    ['CHEM 112', 'CHEM 122'],
    ['GEOL 101'], // i have to include GEOL 103 and GEOL 131 or GEOL 105 and GEOL 131
    ['PHYSICS 151', 'PHYSICS 181'],
    ['PHYSICS 152', 'PHYSICS 182'] 
  ];

  const outsideElectives = [
    'ECE 353',
    'ECE 547',
    'ECE 668',
    'LINGUIST 401',
    'MATH 411',
    'MATH 545',
    'MATH 551',
    'MATH 552'
  ];

  // Count the number of required courses that have been taken
  let num300PlusTaken = 0;
  let num400PlusTaken = 0;

  for (const course of coursesTaken) {
    let courseSubject = course.split(" ")[0];
    let courseNum = course.split(" ")[1];
    if (courseSubject !== 'COMPSCI') continue;
    if (courseNum.startsWith('3')) {
      num300PlusTaken++;
    } else if (courseNum.startsWith('4')) {
      num400PlusTaken++;
    }
  }

  let numScienceTaken = 0;

  for (let i = 0; i < scienceCourses.length; i++) {
    const scienceCourse = scienceCourses[i];
    const hasScienceCourse = scienceCourse.some((course) => coursesTaken.includes(course));

    if (hasScienceCourse) {
      numScienceTaken++;
    }
  }
  // Check if the major requirements are satisfied
  const hasTakenCoreCourses = !coreCourses.some((course) => coursesTaken.indexOf(course) == -1);
  const hasTakenMathCourses = !mathCourses.some((course) => coursesTaken.indexOf(course) == -1) && (coursesTaken.includes('MATH 233') || coursesTaken.includes('MATH 515'));
  const hasTakenIE = (coursesTaken.includes('COMPSCI 320') || coursesTaken.includes('COMPSCI 326'));
  const hasTakenUpperLevelCourses = (num300PlusTaken >= 4 || num300PlusTaken >= 3 && outsideElectives.some((course) => coursesTaken.includes(course))) && num400PlusTaken >= 3 && coursesTaken.includes('COMPSCI 311');
  const hasTakenScienceCourses = numScienceTaken >= 2;

  return hasTakenCoreCourses && hasTakenMathCourses && hasTakenIE && hasTakenUpperLevelCourses && hasTakenScienceCourses;
}

let coursesTaken1 = ['COMPSCI 220', 'COMPSCI 230', 'COMPSCI 240', 'COMPSCI 250', 'COMPSCI 311', 'COMPSCI 320', 'COMPSCI 320', 'COMPSCI 320', 'COMPSCI 420', 'COMPSCI 420', 'COMPSCI 420'];
//console.log(satisfiesCSRequirements(coursesTaken1)); // false

function scoreSchedule(schedule, preferences) {
  let score = 0;
  
  // Score based on professor rating and difficulty
  schedule.forEach(section => {
    section.professor.forEach(prof => {
      const professor = findProfessorByKey(prof);
      if (professor) {
        score += professor.rating * preferences.professorRatingWeight;
        score -= professor.difficulty * preferences.professorDifficultyWeight;
      }
    });
  });
  
  // Score based on course time and days
  schedule.forEach(section => {
    if (section.start >= preferences.startTime && section.end <= preferences.endTime) {
      const daysMatch = section.days.some(day => preferences.courseDays.includes(day));
      if (daysMatch) {
        score += preferences.courseTimeWeight;
      }
    }
  });
  
  return score;
}

function findProfessorByKey(key) {
  return professors.find(prof => prof.key === key);
}

// Sample preferences
const preferences = {
  professorRatingWeight: 2,
  professorDifficultyWeight: 1,
  courseTimeWeight: 3,
  startTime: "09:00",
  endTime: "17:00",
  courseDays: [1, 3, 5]
};

// Sample schedule
const schedule = [
  {
    start: "10:00",
    end: "11:30",
    year: 2023,
    key: 1,
    season: "Fall",
    courseKey: "COMP101",
    type: "Lecture",
    days: [1, 3],
    location: "Room 101",
    professor: ["p1"]
  },
  {
    start: "14:00",
    end: "15:30",
    year: 2023,
    key: 2,
    season: "Fall",
    courseKey: "COMP102",
    type: "Lecture",
    days: [2, 4],
    location: "Room 102",
    professor: ["p2"]
  }
];

const professors = [
  {
    name: "Professor A",
    key: "p1",
    rating: 4.5,
    difficulty: 3,
    reviews: 10
  },
  {
    name: "Professor B",
    key: "p2",
    rating: 3.5,
    difficulty: 4,
    reviews: 5
  }
];

const score = scoreSchedule(schedule, preferences);
console.log(score); // outputs 12

function creditsTaken(coursesTaken) {
  let credits = 0;
  for (const courseKey of coursesTaken) {
    const course = courses.find(course => course.key === courseKey);
    credits += course.credits;
  }
  return credits;
}