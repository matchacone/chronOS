export type AlgorithmId =
  | "fcfs"
  | "sjf"
  | "srt"
  | "priority"
  | "rr"
  | "ljf"
  | "hrrn"
  | "mlq"
  | "mlfq"
  | "lrtf";

export interface SchedulingAlgorithm {
  id: AlgorithmId;
  name: string;
  roman: string;
  preemptive: "Non-preemptive" | "Preemptive" | "Hybrid";
  summary: string;
}

export const SCHEDULING_ALGORITHMS: readonly SchedulingAlgorithm[] = [
  {
    id: "fcfs",
    name: "First Come First Serve",
    roman: "I",
    preemptive: "Non-preemptive",
    summary: "Dispatches ready processes strictly in arrival order.",
  },
  {
    id: "sjf",
    name: "Shortest Job First",
    roman: "II",
    preemptive: "Non-preemptive",
    summary: "Selects the waiting process with the smallest CPU burst.",
  },
  {
    id: "srt",
    name: "Shortest Remaining Time",
    roman: "III",
    preemptive: "Preemptive",
    summary: "Preempts the running job whenever a shorter remaining burst arrives.",
  },
  {
    id: "priority",
    name: "Priority Scheduling",
    roman: "IV",
    preemptive: "Hybrid",
    summary: "Orders CPU execution according to assigned process priority.",
  },
  {
    id: "rr",
    name: "Round Robin",
    roman: "V",
    preemptive: "Preemptive",
    summary: "Rotates every ready process through fixed time quanta.",
  },
  {
    id: "ljf",
    name: "Longest Job First",
    roman: "VI",
    preemptive: "Non-preemptive",
    summary: "Allocates the processor to the process with the longest burst.",
  },
  {
    id: "hrrn",
    name: "Highest Response Ratio Next",
    roman: "VII",
    preemptive: "Non-preemptive",
    summary: "Balances burst length and waiting time to prevent starvation.",
  },
  {
    id: "mlq",
    name: "Multilevel Queue Scheduling",
    roman: "VIII",
    preemptive: "Hybrid",
    summary: "Partitions ready processes across fixed-priority queue tiers.",
  },
  {
    id: "mlfq",
    name: "Multilevel Feedback Queue Scheduling",
    roman: "IX",
    preemptive: "Preemptive",
    summary: "Promotes or demotes processes across queues based on CPU behavior.",
  },
  {
    id: "lrtf",
    name: "Longest Remaining Time First",
    roman: "X",
    preemptive: "Preemptive",
    summary: "Continuously runs whichever job has the largest remaining burst.",
  },
] as const;
