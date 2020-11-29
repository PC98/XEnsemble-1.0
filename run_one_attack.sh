#!/usr/bin/env bash
dataset="CIFAR-10"
model="resnet110"
attack="fgsm?targeted=most"
label_index=1
random_image=1
nb_examples=2

python main_attack_portal_2.py --dataset_name $dataset --label_index=$label_index --random_image=$random_image --model_name $model --nb_examples=$nb_examples --attacks $attack
