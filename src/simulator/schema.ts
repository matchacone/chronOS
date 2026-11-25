import { z } from "zod";
import { ALGORITHM_IDS } from "../algorithms";
import { MAX_PROCESSES } from "./types";

export const algorithmIdSchema = z.enum(ALGORITHM_IDS);

const wholeNumber = (min: number) =>
  z.string().trim().min(1).pipe(z.coerce.number<string>().int().min(min));

const processSchema = z.object({
  arrival: wholeNumber(0),
  burst: wholeNumber(1),
  priority: wholeNumber(0).optional(),
});

export const simInputSchema = z
  .object({
    algorithm: algorithmIdSchema,
    timeQuantum: wholeNumber(1).optional(),
    processes: z
      .array(processSchema)
      .min(1)
      .max(MAX_PROCESSES)
      .transform((processes) => processes.map((process, index) => ({ id: index + 1, ...process }))),
  })
  .superRefine((input, ctx) => {
    if (input.algorithm === "rr" && input.timeQuantum === undefined) {
      ctx.addIssue({ code: "custom", message: "Round Robin needs a time quantum.", path: ["timeQuantum"] });
    }

    const withPriority = input.processes.filter((process) => process.priority !== undefined).length;
    const needsPriority = input.algorithm === "priority" || withPriority > 0;
    if (needsPriority && withPriority < input.processes.length) {
      input.processes.forEach((process, index) => {
        if (process.priority === undefined) {
          ctx.addIssue({ code: "custom", message: "Missing priority.", path: ["processes", index, "priority"] });
        }
      });
    }
  });

export type SimFormValues = z.input<typeof simInputSchema>;

export type SimInput = z.output<typeof simInputSchema>;
