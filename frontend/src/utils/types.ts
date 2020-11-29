export interface SuccessfulServerResponse {
  success: boolean;
  images: Array<{
    original: string;
    adversarial: string;
    difference: string;
  }>;
  evaluation: {
    dataset_name: string;
    model_name: string;
    attack_string: string;
    original_label_index: number;
    random: boolean;
    duration_per_sample: number;
    discretization: boolean; // always true; UI is thus not displaying this for now
    success_rate: number;
    // all "mean" metrics are susceptible to NaN values, which the JSON will treat as null
    mean_confidence: number | null;
    confidence_scores: number[] | null[];
    mean_l2_dist: number | null;
    mean_li_dist: number | null;
    mean_l0_dist_value: number | null;
    mean_l0_dist_pixel: number | null;
    prediction_after_attack: number[];
    number_of_images: number;
  };
  user_input: IndexRouteLocationState;
}

export type ServerResponse =
  | {
      success: false;
    }
  | SuccessfulServerResponse;

// Use labels from InputForm.tsx to index into this object
export type IndexRouteLocationState = { [key in string]: string };

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

export interface TableData {
  head: string;
  body: string;
}
