export interface SuccessfulServerResponse {
  success: boolean;
  images: {
    original: string;
    attacked: string;
    difference: string;
  };
  evaluation: {
    dataset_name: string;
    model_name: string;
    attack_string: string;
    duration_per_sample: number;
    discretization: boolean; // always true; UI is thus not displaying this for now
    success_rate: number;
    // all "mean" metrics are susceptible to NaN values, which the JSON will treat as null
    mean_confidence: number | null;
    mean_l2_dist: number | null;
    mean_li_dist: number | null;
    mean_l0_dist_value: number | null;
    mean_l0_dist_pixel: number | null;
    original_label_index: number;
    prediction_after_attack: number[];
    random: boolean;
    nb_examples: number;
  };
}

export type ServerResponse =
  | {
      success: false;
    }
  | SuccessfulServerResponse;

export interface IndexRouteLocationState {
  selectedModel: string;
  selectedDataset: string;
  selectedLabel: string;
  selectedAttack: string;
  selectedRandom: boolean;
  selectedNBExamples: number;
}

interface Parameter {
  value: string;
  helperText?: string;
}

interface NumberParameter extends Parameter {
  defaultValue: number;
  inputProps: Partial<Pick<HTMLInputElement, "min" | "max" | "step">>;
  type: "number";
}

interface DropdownParameter extends Parameter {
  options: { name: string; value: string }[];
  defaultValue: string;
  type: "dropdown";
}

interface BooleanParameter extends Parameter {
  defaultValue: boolean;
  helperText: string;
  type: "boolean";
}

type AttackParameter = NumberParameter | DropdownParameter | BooleanParameter;

export interface AttackInformation {
  parameters: Record<string, AttackParameter>;
  targeted: "YES" | "NO" | "BOTH";
  value: string;
}
