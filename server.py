from flask import Flask, request, send_file
import subprocess
import os
import base64
import csv
import math

app = Flask(__name__)

RESULTS_DIR = os.path.join('.', 'results2')


def encoded_img(img_path):
    with open(img_path, "rb") as img:
        return base64.b64encode(img.read()).decode()


@app.route('/api/form', methods=['POST'])
def api_form():
    form_input = request.form.to_dict()
    rc = subprocess.run(['python', 'main_attack_portal_2.py', "--dataset_name", form_input['Dataset'],
                         f"--label_index={form_input['Label']}", f"--random_image={form_input['Random']}", "--model_name", form_input['Model'],
                         "--nb_examples=1", "--attacks", form_input["Attack"]])  # To hide output, add stdout=subprocess.DEVNULL

    if rc.returncode != 0:
        return {'success': False}

    # Model value comes from front-end and is already in lower-case
    task_id = f"{form_input['Dataset']}_{form_input['Model']}"
    results_dir = os.path.join(RESULTS_DIR, task_id)

    original_img = encoded_img(os.path.join(results_dir, "original.png"))
    attacked_img = encoded_img(os.path.join(results_dir, "attacked.png"))
    difference_img = encoded_img(os.path.join(results_dir, "difference.png"))
    images_dict = {'original': original_img,
                   'attacked': attacked_img, 'difference': difference_img}

    with open(os.path.join(results_dir, "evaluation.csv")) as eval_file:
        reader = csv.DictReader(eval_file)
        rows = list(reader)
        assert len(rows) == 1
        eval_dict = dict(rows[0])

        keys_of_float_data = ['duration_per_sample', 'success_rate', 'mean_confidence',
                              'mean_l2_dist', 'mean_li_dist', 'mean_l0_dist_value', 'mean_l0_dist_pixel']
        for key in keys_of_float_data:
            float_val = float(eval_dict[key])
            if math.isnan(float_val):
                eval_dict[key] = None
            else:
                eval_dict[key] = float_val

        keys_of_int_data = ['original_label_index', 'prediction_after_attack']
        for key in keys_of_int_data:
            eval_dict[key] = int(eval_dict[key])

        keys_of_bool_data = ['discretization', 'random']
        for key in keys_of_bool_data:
            eval_dict[key] = True if eval_dict[key] == "True" else False

        return {'success': True, 'images': images_dict, 'evaluation': eval_dict}


if __name__ == '__main__':
    app.run(threaded=True, port=5000)
