import imagenetLabels from "./ImageNetLabels";

export interface SuccessfulServerResponse {
  success: boolean;
  images: {
    original: string;
    attacked: string;
    difference: string;
  };
  evaluation: {
    dataset_name: DATASET;
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
    prediction_after_attack: number;
    random: boolean;
  };
}

export type ServerResponse =
  | {
      success: false;
    }
  | SuccessfulServerResponse;

export interface IndexRouteLocationState {
  selectedModel: MODEL;
  selectedDataset: DATASET;
  selectedLabel: string;
  selectedAttack: string;
  selectedRandom: boolean;
}

export type DATASET = "MNIST" | "CIFAR-10" | "ImageNet";

export const MODEL_OBJ = {
  "CNN-2": "cnn2",
  "CNN-1": "cnn1",
  "CNN-2 Adv. Trained": "cnn2_adv_trained",
  "PGD Trained": "pgdtrained",
  "PGD Base": "pgdbase",
  "CNN-1 Double": "cnn1_double",
  "CNN-1 Half": "cnn1_half",
  "CNN-1 30": "cnn1_30",
  "CNN-1 40": "cnn1_40",
  "CNN-2 Double": "cnn2_double",
  "CNN-2 Half": "cnn2_half",
  "CNN-2 30": "cnn2_30",
  "CNN-2 40": "cnn2_40",
  Distillation: "distillation",
  DenseNet: "densenet",
  LeNet: "lenet",
  "ResNet-20": "resnet20",
  "ResNet-32": "resnet32",
  "ResNet-44": "resnet44",
  "ResNet-56": "resnet56",
  "ResNet-110": "resnet110",
  "ResNet-50": "resnet50",
  "VGG-19": "vgg19",
  "VGG-16": "vgg16",
  "Inception v3": "inceptionv3",
  MobileNet: "mobilenet",
} as const;
export type MODEL = keyof typeof MODEL_OBJ;

// Reverse of MODEL_OBJ, used for results page
// @ts-ignore
export const FLIPPED_MODEL_OBJ: { [k in string]: MODEL } = Object.keys(
  MODEL_OBJ
  // @ts-ignore
).reduce((flipped, key: MODEL) => {
  // @ts-ignore
  flipped[MODEL_OBJ[key]] = key;
  return flipped;
}, {});

const addIndicesToLabels = (labels: string[]) =>
  labels.map((label, index) => `${label} (${index})`);

export const DATA: Record<DATASET, { models: MODEL[]; labels: string[] }> = {
  MNIST: {
    models: [
      "CNN-2",
      "CNN-1",
      "CNN-2 Adv. Trained",
      "PGD Trained",
      "PGD Base",
      "CNN-1 Double",
      "CNN-1 Half",
      "CNN-1 30",
      "CNN-1 40",
      "CNN-2 Double",
      "CNN-2 Half",
      "CNN-2 30",
      "CNN-2 40",
      "Distillation",
    ],
    labels: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
  },
  "CIFAR-10": {
    models: [
      "CNN-1",
      "LeNet",
      "ResNet-20",
      "ResNet-32",
      "ResNet-44",
      "ResNet-56",
      "ResNet-110",
      "Distillation",
    ],
    labels: addIndicesToLabels([
      "Airplane",
      "Automobile",
      "Bird",
      "Cat",
      "Deer",
      "Dog",
      "Frog",
      "Horse",
      "Ship",
      "Truck",
    ]),
  },
  ImageNet: {
    models: ["ResNet-50", "VGG-19", "VGG-16", "Inception v3", "MobileNet"],
    labels: addIndicesToLabels(imagenetLabels),
  },
};
