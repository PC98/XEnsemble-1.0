#!/usr/bin/env bash
dataset="MNIST"
model="CNN1"
attack="fgsm?eps=0.3"
label_index=0

python main_attack_portal_2.py --dataset_name $dataset --label_index=$label_index --model_name $model --nb_examples=1 --attacks $attack