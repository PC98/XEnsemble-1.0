from flask import Flask, request
import subprocess
import random
import os
import base64
import csv
import math

app = Flask(__name__)

RESULTS_DIR = os.path.join('.', 'results2')


def encoded_img(img_path):
    with open(img_path, "rb") as img:
        return base64.b64encode(img.read()).decode()


def parse_float_data(data: str):
    float_val = float(data)
    if math.isnan(float_val):
        return None

    return float_val


def process_one_attack(form_input, random_flag, attack):
    rc = subprocess.run(['python', 'main_attack_portal_2.py', "--dataset_name", form_input['dataset'],
                         f"--label_index={form_input['classLabelValue']}", f"--random_image={random_flag}", "--model_name", form_input['modelValue'],
                         f"--nb_examples={form_input['number']}", "--attacks", attack])  # To hide output, add stdout=subprocess.DEVNULL

    if rc.returncode != 0:
        return None

    # Model value comes from front-end and is already in lower-case
    task_id = f"{form_input['dataset']}_{form_input['modelValue']}"
    results_dir = os.path.join(RESULTS_DIR, task_id)
    nb_examples = int(form_input["number"])
    images = []
    for i in range(nb_examples):
        original_img = encoded_img(
            os.path.join(results_dir, f"original{i}.png"))
        adversarial_img = encoded_img(os.path.join(
            results_dir, f"adversarial{i}.png"))
        difference_img = encoded_img(
            os.path.join(results_dir, f"difference{i}.png"))

        images.append({'original': original_img,
                       'adversarial': adversarial_img, 'difference': difference_img})

    with open(os.path.join(results_dir, "evaluation.csv")) as eval_file:
        reader = csv.DictReader(eval_file)
        rows = list(reader)
        assert len(rows) == 1
        eval_dict = dict(rows[0])

        keys_of_float_data = ['duration_per_sample', 'success_rate', 'mean_confidence',
                              'mean_l2_dist', 'mean_li_dist', 'mean_l0_dist_value', 'mean_l0_dist_pixel']
        for key in keys_of_float_data:
            eval_dict[key] = parse_float_data(eval_dict[key])

        keys_of_float_arr_data = ['confidence_scores']
        for key in keys_of_float_arr_data:
            eval_dict[key] = [parse_float_data(x)
                              for x in eval_dict[key].split(",")]

        keys_of_int_data = ['original_label_index', 'number_of_images']
        for key in keys_of_int_data:
            eval_dict[key] = int(eval_dict[key])

        keys_of_int_arr_data = ['prediction_after_attack']
        for key in keys_of_int_arr_data:
            eval_dict[key] = [int(x) for x in eval_dict[key].split(",")]

        keys_of_bool_data = ['discretization', 'random']
        for key in keys_of_bool_data:
            eval_dict[key] = True if eval_dict[key] == "True" else False

        assert len(eval_dict["confidence_scores"]) == nb_examples
        assert len(eval_dict["prediction_after_attack"]
                   ) == nb_examples

        return images, eval_dict


@app.route('/api/form', methods=['POST'])
def api_form():
    form_input = request.json
    if form_input['random']:
        # Choose any random number
        random_flag = random.randint(0, 100)
    else:
        random_flag = 0
    attacks = form_input["attackStr"].split(";")

    results = []
    for attack in attacks:
        attack_result = process_one_attack(form_input, random_flag, attack)
        if attack_result is None:
            return {'success': False}

        results.append(
            {'images': attack_result[0], 'evaluation': attack_result[1]})

    return {'success': True, 'results': results, 'user_input': form_input}


if __name__ == '__main__':
    app.run(threaded=True, port=5000)
