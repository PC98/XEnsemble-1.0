#!/usr/bin/env bash
dataset="CIFAR-10"
model="CNN1"
attack="fgsm?eps=0.3;"

python main_attack_portal.py --dataset_name $dataset --model_name $model --nb_examples=1 --attacks "$attack"
