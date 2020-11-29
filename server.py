from flask import Flask, request
import subprocess
import json
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


@app.route('/api/form', methods=['POST'])
def api_form():
    form_input = request.form.to_dict()
    rc = subprocess.run(['python', 'main_attack_portal_2.py', "--dataset_name", form_input['Dataset'],
                         f"--label_index={form_input['Label']}", f"--random_image={form_input['Random']}", "--model_name", form_input['Model'],
                         f"--nb_examples={form_input['Number']}", "--attacks", form_input["Attack"]])  # To hide output, add stdout=subprocess.DEVNULL

    if rc.returncode != 0:
        return {'success': False}

    # Model value comes from front-end and is already in lower-case
    task_id = f"{form_input['Dataset']}_{form_input['Model']}"
    results_dir = os.path.join(RESULTS_DIR, task_id)
    nb_examples = int(form_input["Number"])
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

        return {'success': True, 'images': images, 'evaluation': eval_dict, 'user_input': json.loads(form_input['user_input'])}


if __name__ == '__main__':
    app.run(threaded=True, port=5000)
