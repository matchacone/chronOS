import type { AlgorithmId } from "../algorithms";
import { primaryButtonClass } from "./styles";

interface CreateSimulationLinkProps {
  algorithmId: AlgorithmId;
}

export function CreateSimulationLink({ algorithmId }: CreateSimulationLinkProps) {
  return (
    <a href={`/simulate?algorithm=${algorithmId}`} className={`create-simulation ${primaryButtonClass}`}>
      Create scheduling simulation
    </a>
  );
}
