from flask import Flask
import subprocess

app = Flask(__name__)


@app.route('/api/form', methods=['POST'])
def api_form():
    rc = subprocess.run(['python', 'main_attack_portal.py', "--dataset_name", "CIFAR-10", "--model_name", "CNN1",
                         "--nb_examples=1", "--attacks", "fgsm?eps=0.3;"], stdout=subprocess.DEVNULL)

    return {'success': True if rc.returncode == 0 else False}


if __name__ == '__main__':
    app.run(threaded=True, port=5000)
