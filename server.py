from flask import Flask, request
import subprocess

app = Flask(__name__)


@app.route('/api/form', methods=['POST'])
def api_form():
    form_input = request.form.to_dict()
    rc = subprocess.run(['python', 'main_attack_portal_2.py', "--dataset_name", form_input['Dataset'],
                         f"--label_index={form_input['Label']}", f"--random_image={form_input['Random']}", "--model_name", form_input['Model'],
                         "--nb_examples=1", "--attacks", form_input["Attack"]])  # To hide output, add stdout=subprocess.DEVNULL

    return {'success': rc.returncode == 0}


if __name__ == '__main__':
    app.run(threaded=True, port=5000)
