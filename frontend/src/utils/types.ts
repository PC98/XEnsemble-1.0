export interface ServerResponse {
  success: boolean;
}

export type DATASET = "MNIST" | "CIFAR-10" | "ImageNet";

const MODEL_OBJ = {
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
type MODEL = keyof typeof MODEL_OBJ;

export const DATA: Record<
  DATASET,
  { models: MODEL[]; labels: Promise<string[]> | string[] }
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
      "CNN-2",
      "CNN-1",
      "CNN-2 Adv. Trained",
      "DenseNet",
      "LeNet",
      "ResNet-20",
      "ResNet-32",
      "ResNet-44",
      "ResNet-56",
      "ResNet-110",
      "Distillation",
    ],
    labels: [
      "Airplane (0)",
      "Automobile (1)",
      "Bird (2)",
      "Cat (3)",
      "Deer (4)",
      "Dog (5)",
      "Frog (6)",
      "Horse (7)",
      "Ship (8)",
      "Truck (9)",
    ],
  },
  ImageNet: {
    models: ["ResNet-50", "VGG-19", "VGG-16", "Inception v3", "MobileNet"],
    labels: (async () => {
      const file = await fetch("/ImageNetLabels.txt");
      const text = await file.text();
      return text.split("\n").map((label, index) => `${label} (${index})`);
    })(),
  },
};
