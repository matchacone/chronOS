import { z } from "zod";
import { ALGORITHM_IDS } from "../algorithms";
import { MAX_PROCESSES } from "./types";

export const algorithmIdSchema = z.enum(ALGORITHM_IDS);

/**
 * A form field holding a whole number >= min, e.g. "3" -> 3.
 * Checked as a non-empty string first: z.coerce.number() alone would turn "" into 0 and let it pass.
 */
const wholeNumber = (min: number) =>
  z.string().trim().min(1).pipe(z.coerce.number<string>().int().min(min));

const processSchema = z.object({
  arrival: wholeNumber(0),
  burst: wholeNumber(1),
  priority: wholeNumber(0).optional(),
});

/** Validates the form's raw string values and turns them into the scheduling engine's input. */
export const simInputSchema = z
  .object({
    algorithm: algorithmIdSchema,
    timeQuantum: wholeNumber(1).optional(),
    processes: z
      .array(processSchema)
      .min(1)
      .max(MAX_PROCESSES)
      // Process ids follow table order: P1 = 1, P2 = 2, ...
      .transform((processes) => processes.map((process, index) => ({ id: index + 1, ...process }))),
  })
  .superRefine((input, ctx) => {
    if (input.algorithm === "rr" && input.timeQuantum === undefined) {
      ctx.addIssue({ code: "custom", message: "Round Robin needs a time quantum.", path: ["timeQuantum"] });
    }

    // Priorities are all-or-nothing, and Priority Scheduling can't run without them.
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

/** What the form sends to the schema: every value is still the raw input string. */
export type SimFormValues = z.input<typeof simInputSchema>;

/** What the scheduling engine receives: parsed numbers, with an id on each process. */
export type SimInput = z.output<typeof simInputSchema>;
