import imagenetLabels from "./ImageNetLabels";
import { AttackInformation } from "./types";

export type ATTACK =
  | "Fast Gradient Signed Method"
  | "Basic Iterative Method"
  | "Jacobian-based Saliency Map"
  | "DeepFool"
  | "Projected Gradient Descent"
  | "Carlini L-2"
  | "Carlini L-0"
  | "Carlini L-infinity";

export const TARGETED_TYPES = {
  "Most likely": "most",
  "Least likely": "ll",
  Next: "next",
} as const;

const EPSILON = (defaultValue = 0.1) => ({
  value: "eps",
  defaultValue,
  inputProps: { step: "any" },
  helperText: "Maximum distortion",
  type: "number" as const,
});

const SHARED_CLIP_PARAMETERS = {
  "Min. clip": {
    value: "clip_min",
    defaultValue: 0,
    inputProps: { step: "0.01", min: "0", max: "1" },
    helperText: "Min. value per input dimension", // Minimum input component value
    type: "number" as const,
  },
  "Max. clip": {
    value: "clip_max",
    defaultValue: 1,
    inputProps: { step: "0.01", min: "0", max: "1" },
    helperText: "Max. value per input dimension",
    type: "number" as const,
  },
};

const SHARED_CLEVERHANDS_PARAMETERS = {
  Norm: {
    value: "ord",
    options: [
      { name: "L-infinity", value: "li" },
      { name: "L-2", value: "l2" },
      { name: "L-1", value: "l1" },
    ],
    defaultValue: "L-infinity",
    helperText: `Order of the norm${"\u00a0".repeat(12)}`, // a bit of a hack to artificially increase width of dropdown
    type: "dropdown" as const,
  },
  ...SHARED_CLIP_PARAMETERS,
};

export const ATTACK_OBJ: Record<ATTACK, AttackInformation> = {
  "Fast Gradient Signed Method": {
    value: "fgsm",
    targeted: "BOTH",
    parameters: {
      Epsilon: EPSILON(),
      ...SHARED_CLEVERHANDS_PARAMETERS,
    },
  },
  "Basic Iterative Method": {
    value: "bim",
    targeted: "BOTH",
    parameters: {
      Epsilon: EPSILON(),
      "Epsilon iteration": {
        value: "eps_iter",
        defaultValue: 0.05,
        inputProps: { step: "any" },
        helperText: "Step size for each attack iteration",
        type: "number",
      },
      "Num. of attack iterations": {
        value: "nb_iter",
        defaultValue: 10,
        inputProps: { min: "1" },
        type: "number",
      },
      ...SHARED_CLEVERHANDS_PARAMETERS,
    },
  },
  DeepFool: {
    value: "deepfool",
    targeted: "NO",
    parameters: {
      "Num. of classes": {
        value: "num_classes",
        defaultValue: 10,
        inputProps: { min: "1" },
        helperText: "Limits the num. of classes to test against",
        type: "number",
      },
      Overshoot: {
        value: "overshoot",
        defaultValue: 0.02,
        inputProps: { step: "any" },
        helperText: "Termination criterion to prevent vanishing updates",
        type: "number",
      },
      "Max. iterations": {
        value: "max_iter",
        defaultValue: 50,
        inputProps: { min: "1" },
        type: "number",
      },
    },
  },
  "Jacobian-based Saliency Map": {
    value: "jsma",
    targeted: "YES",
    parameters: {
      Theta: {
        value: "theta",
        defaultValue: 1,
        inputProps: { step: "any" },
        helperText: "Perturbation introduced to modified components",
        type: "number",
      },
      Gamma: {
        value: "gamma",
        defaultValue: 0.1,
        inputProps: { step: "0.01", min: "0", max: "1" },
        helperText: "Max. percentage of perturbed features",
        type: "number",
      },
      ...SHARED_CLIP_PARAMETERS,
    },
  },
  "Projected Gradient Descent": {
    value: "pgdli",
    targeted: "NO",
    parameters: {
      Epsilon: EPSILON(0.3),
      "Num. of steps": {
        value: "k",
        defaultValue: 40,
        inputProps: { min: "1" },
        type: "number",
      },
      "Step size": {
        value: "a",
        defaultValue: 0.01,
        inputProps: { step: "any" },
        type: "number",
      },
      "Random start": {
        value: "random_start",
        helperText: "Add random uniform noise",
        defaultValue: true,
        type: "boolean",
      },
      "Loss function": {
        value: "loss_func",
        options: [
          { name: "Cross-entropy", value: "xent" },
          { name: "Carlini-Wagner", value: "cw" },
        ],
        defaultValue: "Cross-entropy",
        helperText: "\u00a0".repeat(60),
        type: "dropdown",
      },
    },
  },
  "Carlini L-0": {
    value: "carlinil0",
    targeted: "YES",
    parameters: {
      "Batch size": {
        value: "batch_size",
        inputProps: { min: "1" },
        defaultValue: 10,
        type: "number",
      },
      "Learning rate": {
        value: "learning_rate",
        inputProps: { step: "any" },
        defaultValue: 0.01,
        type: "number",
      },
      "Max. iterations": {
        value: "max_iterations",
        inputProps: { min: "1" },
        defaultValue: 1000,
        type: "number",
      },
      "Abort Early": {
        value: "abort_early",
        helperText: "Abort Gradient Descent upon first solution",
        defaultValue: true,
        type: "boolean",
      },
      "Initial constant": {
        value: "initial_const",
        inputProps: { step: "any" },
        helperText: "Tunes relative importance of distance and confidence",
        defaultValue: 0.001,
        type: "number",
      },
      "Largest constant": {
        value: "largest_const",
        inputProps: { step: "any" },
        helperText: "Largest value to go up to before giving up",
        defaultValue: 2000000.0,
        type: "number",
      },
      "Reduce constant": {
        value: "reduce_const",
        helperText: "Reduce constant at each iteration",
        defaultValue: false,
        type: "boolean",
      },
      "Constant factor": {
        value: "const_factor",
        inputProps: { min: "1.01", step: "0.01" },
        defaultValue: 2,
        helperText: "Rate at which to increase the constant",
        type: "number",
      },
      "Independent channels": {
        value: "independent_channels",
        helperText: "Modify each channel independently",
        defaultValue: false,
        type: "boolean",
      },
      Confidence: {
        value: "confidence",
        inputProps: { step: "any" },
        defaultValue: 0.01,
        type: "number",
      },
    },
  },
  "Carlini L-2": {
    value: "carlinil2",
    targeted: "YES",
    parameters: {
      "Batch size": {
        value: "batch_size",
        inputProps: { min: "1" },
        defaultValue: 1,
        type: "number",
      },
      "Learning rate": {
        value: "learning_rate",
        inputProps: { step: "any" },
        defaultValue: 0.01,
        type: "number",
      },
      "Max. iterations": {
        value: "max_iterations",
        inputProps: { min: "1" },
        defaultValue: 10000,
        type: "number",
      },
      "Abort Early": {
        value: "abort_early",
        helperText: "Abort Gradient Descent upon first solution",
        defaultValue: true,
        type: "boolean",
      },
      "Initial constant": {
        value: "initial_const",
        inputProps: { step: "any" },
        helperText: "Tunes relative importance of distance and confidence",
        defaultValue: 0.001,
        type: "number",
      },
      "Binary search step": {
        value: "binary_search_steps",
        inputProps: { min: "1" },
        defaultValue: 9,
        type: "number",
      },
      Confidence: {
        value: "confidence",
        inputProps: { step: "any" },
        defaultValue: 0,
        type: "number",
      },
    },
  },
  "Carlini L-infinity": {
    value: "carlinili",
    targeted: "YES",
    parameters: {
      "Batch size": {
        value: "batch_size",
        inputProps: { min: "1" },
        defaultValue: 10,
        type: "number",
      },
      "Learning rate": {
        value: "learning_rate",
        inputProps: { step: "any" },
        defaultValue: 0.005,
        type: "number",
      },
      "Max. iterations": {
        value: "max_iterations",
        inputProps: { min: "1" },
        defaultValue: 1000,
        type: "number",
      },
      "Abort Early": {
        value: "abort_early",
        helperText: "Abort Gradient Descent upon first solution",
        defaultValue: true,
        type: "boolean",
      },
      "Initial constant": {
        value: "initial_const",
        inputProps: { step: "any" },
        helperText: "Tunes relative importance of distance and confidence",
        defaultValue: 0.00001,
        type: "number",
      },
      "Largest constant": {
        value: "largest_const",
        inputProps: { step: "any" },
        helperText: "Largest value to go up to before giving up",
        defaultValue: 20,
        type: "number",
      },
      "Reduce constant": {
        value: "reduce_const",
        helperText: "Reduce constant at each iteration",
        defaultValue: false,
        type: "boolean",
      },
      "Decrease factor": {
        value: "decrease_factor",
        inputProps: { min: "0.01", max: "0.99", step: "0.01" },
        defaultValue: 0.9,
        helperText: "Rate at which to decrease the constant",
        type: "number",
      },
      "Constant factor": {
        value: "const_factor",
        inputProps: { min: "1.01", step: "0.01" },
        defaultValue: 2,
        helperText: "Rate at which to increase the constant",
        type: "number",
      },
      Confidence: {
        value: "confidence",
        inputProps: { step: "any" },
        defaultValue: 0,
        type: "number",
      },
    },
  },
};

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

const addIndicesToLabels = (labels: string[]) =>
  labels.map((label, index) => `${label} (${index})`);

export const DATASET_OBJ: Record<
  DATASET,
  { models: MODEL[]; labels: string[] }
> = {
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
