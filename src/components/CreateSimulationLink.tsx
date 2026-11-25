import type { AlgorithmId } from "../algorithms";
import { primaryButtonClass } from "./styles";

interface CreateSimulationLinkProps {
  /** Algorithm currently selected on the clock dial; the simulator opens with it preselected. */
  algorithmId: AlgorithmId;
}

export function CreateSimulationLink({ algorithmId }: CreateSimulationLinkProps) {
  return (
    <a href={`/simulate?algorithm=${algorithmId}`} className={`create-simulation ${primaryButtonClass}`}>
      Create scheduling simulation
    </a>
  );
}
