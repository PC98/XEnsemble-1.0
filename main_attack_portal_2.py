from __future__ import absolute_import
from __future__ import division
from __future__ import print_function
from __future__ import unicode_literals

import warnings

warnings.filterwarnings("ignore", category=FutureWarning)
warnings.filterwarnings("ignore", category=UserWarning)

import os
import pdb
import shutil

import keras
import numpy as np
import tensorflow as tf
from tensorflow.python.platform import flags

tf.compat.v1.logging.set_verbosity(tf.compat.v1.logging.ERROR)

FLAGS = flags.FLAGS

flags.DEFINE_string('dataset_name', 'MNIST', 'Supported: MNIST, CIFAR-10, ImageNet.')
flags.DEFINE_string('model_name', 'cleverhans', 'Supported: cleverhans, cleverhans_adv_trained and carlini for MNIST; carlini and DenseNet for CIFAR-10; ResNet50, VGG19, Inceptionv3 and MobileNet for ImageNet.')

flags.DEFINE_boolean('select', True, 'Select correctly classified examples for the experiment.')
flags.DEFINE_integer('nb_examples', 6, 'The number of examples selected for attacks.')
flags.DEFINE_integer('label_index', 0, 'The index of desired label in dataset.')
flags.DEFINE_integer('random_image', 1, '0 if random is off, any integer otherwise')
flags.DEFINE_boolean('balance_sampling', False, 'Select the same number of examples for each class.')
flags.DEFINE_boolean('test_mode', False, 'Only select one sample for each class.')

flags.DEFINE_string('attacks', "FGSM?eps=0.1;BIM?eps=0.1&eps_iter=0.02;JSMA?targeted=next;CarliniL2?targeted=next&batch_size=100&max_iterations=1000;CarliniL2?targeted=next&batch_size=100&max_iterations=1000&confidence=2", 'Attack name and parameters in URL style, separated by semicolon.')
flags.DEFINE_float('clip', -1, 'L-infinity clip on the adversarial perturbations.')
flags.DEFINE_boolean('visualize', True, 'Output the image examples for each attack, enabled by default.')


flags.DEFINE_string('detection', '', 'Supported: feature_squeezing.')
flags.DEFINE_boolean('detection_train_test_mode', True, 'Split into train/test datasets.')

flags.DEFINE_string('result_folder', "results2", 'The output folder for results.')
flags.DEFINE_boolean('verbose', False, 'Stdout level. The hidden content will be saved to log files anyway.')

FLAGS.model_name = FLAGS.model_name.lower()


def load_tf_session():
    # Set TF random seed to improve reproducibility
    tf.set_random_seed(1234)

    # Create TF session and set as Keras backend session
    sess = tf.Session()
    keras.backend.set_session(sess)
    print("Created TensorFlow session and set Keras backend.")
    return sess


def main(argv=None):
    # 0. Select a dataset.
    from datasets import MNISTDataset, CIFAR10Dataset, ImageNetDataset, LFWDataset
    from datasets import get_correct_prediction_idx, evaluate_adversarial_examples2, calculate_mean_confidence, calculate_accuracy
    from utils.parameter_parser import parse_params

    if FLAGS.dataset_name == "MNIST":
        dataset = MNISTDataset()
    elif FLAGS.dataset_name == "CIFAR-10":
        dataset = CIFAR10Dataset()
    elif FLAGS.dataset_name == "ImageNet":
        dataset = ImageNetDataset()
    elif FLAGS.dataset_name == "LFW":
        dataset = LFWDataset()

    # 1. Load a dataset.
    print("\n===Loading %s data..." % FLAGS.dataset_name)
    if FLAGS.dataset_name == 'ImageNet':
        if FLAGS.model_name == 'inceptionv3':
            img_size = 299
        else:
            img_size = 224
        X_test_all, Y_test_all = dataset.get_test_data(img_size, 0, 200)
    else:
        X_test_all, Y_test_all = dataset.get_test_dataset()
    #z = np.where(Y_test_all == np.asarray([1, 0, 0, 0, 0, 0, 0, 0, 0, 0]))

    #LABEL SELECTION
    label = np.asarray([0] * Y_test_all.shape[1])
    label[FLAGS.label_index] = 1
    filter_indices = []
    for i in range(len(Y_test_all)):
        if np.array_equal(Y_test_all[i], label):
            filter_indices.append(i)
    print(X_test_all.shape, Y_test_all.shape)
    X_test_all = np.take(X_test_all, filter_indices, 0)
    Y_test_all = np.take(Y_test_all, filter_indices, 0)
    print(X_test_all.shape, Y_test_all.shape)

    # 2. Load a trained model.
    sess = load_tf_session()
    keras.backend.set_learning_phase(0)
    # Define input TF placeholder
    x = tf.placeholder(tf.float32, shape=(None, dataset.image_size, dataset.image_size, dataset.num_channels))
    y = tf.placeholder(tf.float32, shape=(None, dataset.num_classes))

    with tf.variable_scope(FLAGS.model_name):
        """
        Create a model instance for prediction.
        The scaling argument, 'input_range_type': {1: [0,1], 2:[-0.5, 0.5], 3:[-1, 1]...}
        """
        model = dataset.load_model_by_name(FLAGS.model_name, logits=False, input_range_type=1)
        model.compile(loss='categorical_crossentropy', optimizer='sgd', metrics=['acc'])

    # 3. Evaluate the trained model.
    # TODO: add top-5 accuracy for ImageNet.
    print("Evaluating the pre-trained model...")
    Y_pred_all = model.predict(X_test_all)
    mean_conf_all = calculate_mean_confidence(Y_pred_all, Y_test_all)
    accuracy_all = calculate_accuracy(Y_pred_all, Y_test_all)
    print('Test accuracy on raw legitimate examples %.4f' % (accuracy_all))
    print('Mean confidence on ground truth classes %.4f' % (mean_conf_all))

    # 4. Select some examples to attack.
    import hashlib
    from datasets import get_first_n_examples_id_each_class

    if FLAGS.select:
        # Filter out the misclassified examples.
        correct_idx = get_correct_prediction_idx(Y_pred_all, Y_test_all)
        if FLAGS.test_mode:
            # Only select the first example of each class.
            correct_and_selected_idx = get_first_n_examples_id_each_class(Y_test_all[correct_idx])
            selected_idx = [correct_idx[i] for i in correct_and_selected_idx]
        else:
            if not FLAGS.balance_sampling:
                # TODO: Possibly randomize this
                if FLAGS.random_image != 0:
                    np.random.seed(FLAGS.random_image)
                    print("RANDOM NUMBER")
                    print(np.random.randint(100))
                    np.random.shuffle(correct_idx)
                selected_idx = correct_idx[:FLAGS.nb_examples]
            else:
                # select the same number of examples for each class label.
                nb_examples_per_class = int(FLAGS.nb_examples / Y_test_all.shape[1])
                correct_and_selected_idx = get_first_n_examples_id_each_class(Y_test_all[correct_idx], n=nb_examples_per_class)
                selected_idx = [correct_idx[i] for i in correct_and_selected_idx]
    else:
        selected_idx = np.array(range(FLAGS.nb_examples))

    from utils.output import format_number_range
    selected_example_idx_ranges = format_number_range(sorted(selected_idx))
    print("Selected %d examples." % len(selected_idx))
    print("Selected index in test set (sorted): %s" % selected_example_idx_ranges)
    X_test, Y_test, Y_pred = X_test_all[selected_idx], Y_test_all[selected_idx], Y_pred_all[selected_idx]

    # The accuracy should be 100%.
    accuracy_selected = calculate_accuracy(Y_pred, Y_test)
    mean_conf_selected = calculate_mean_confidence(Y_pred, Y_test)
    print('Test accuracy on selected legitimate examples %.4f' % (accuracy_selected))
    print('Mean confidence on ground truth classes, selected %.4f\n' % (mean_conf_selected))

    task = {}
    task['dataset_name'] = FLAGS.dataset_name
    task['model_name'] = FLAGS.model_name
    task['accuracy_test'] = accuracy_all
    task['mean_confidence_test'] = mean_conf_all

    task['test_set_selected_length'] = len(selected_idx)
    task['test_set_selected_idx_ranges'] = selected_example_idx_ranges
    task['test_set_selected_idx_hash'] = hashlib.sha1(str(selected_idx).encode('utf-8')).hexdigest()
    task['accuracy_test_selected'] = accuracy_selected
    task['mean_confidence_test_selected'] = mean_conf_selected

    #task_id = "%s_%d_%s_%s" % \
     #   (task['dataset_name'], task['test_set_selected_length'], task['test_set_selected_idx_hash'][:5], task['model_name'])

    task_id = "%s_%s" % \
           (task['dataset_name'], task['model_name'])

    FLAGS.result_folder = os.path.join(FLAGS.result_folder, task_id)
    if os.path.exists(FLAGS.result_folder):
        print("RESULTS FOLDER")
        print(FLAGS.result_folder)
        shutil.rmtree(FLAGS.result_folder)
    if not os.path.isdir(FLAGS.result_folder):
        os.makedirs(FLAGS.result_folder)

    from utils.output import save_task_descriptor2
    save_task_descriptor2(FLAGS.result_folder, [task])

    # 5. Generate adversarial examples.
    from attacks import maybe_generate_adv_examples
    from utils.squeeze import reduce_precision_py

    #attack_string_hash = hashlib.sha1(FLAGS.attacks.encode('utf-8')).hexdigest()[:5]
    attack_string_hash = FLAGS.attacks.encode('utf-8')

    from datasets.datasets_utils import get_next_class, get_most_likely_class, get_least_likely_class
    Y_test_target_next = get_next_class(Y_test)
    Y_test_target_most = get_most_likely_class(Y_test)
    Y_test_target_ll = get_least_likely_class(Y_pred)

    X_test_adv_list = []
    X_test_adv_discretized_list = []
    Y_test_adv_discretized_pred_list = []

    attack_string_list = filter(lambda x: len(x) > 0, FLAGS.attacks.lower().split(';'))
    to_csv = []

    X_adv_cache_folder = os.path.join(FLAGS.result_folder, 'adv_examples')
    adv_log_folder = os.path.join(FLAGS.result_folder, 'adv_logs')
    predictions_folder = os.path.join(FLAGS.result_folder, 'predictions')
    for folder in [X_adv_cache_folder, adv_log_folder, predictions_folder]:
        if os.path.isdir(folder):
            #os.rmdir(folder)
            shutil.rmtree(folder)
    for folder in [X_adv_cache_folder, adv_log_folder, predictions_folder]:
        if not os.path.isdir(folder):
            os.makedirs(folder)

    predictions_fpath = os.path.join(predictions_folder, "legitimate.npy")
    np.save(predictions_fpath, Y_pred, allow_pickle=False)

    if FLAGS.clip >= 0:
        epsilon = FLAGS.clip
        print("Clip the adversarial perturbations by +-%f" % epsilon)
        max_clip = np.clip(X_test + epsilon, 0, 1)
        min_clip = np.clip(X_test - epsilon, 0, 1)

    for attack_string in attack_string_list:
        attack_log_fpath = os.path.join(adv_log_folder, "%s_%s.log" % (task_id, attack_string))
        attack_name, attack_params = parse_params(attack_string)
        print("\nRunning attack: %s %s" % (attack_name, attack_params))

        if 'targeted' in attack_params:
            targeted = attack_params['targeted']
            print("targeted value: %s" % targeted)
            if targeted == 'next':
                Y_test_target = Y_test_target_next
            elif targeted == 'most':
                Y_test_target = Y_test_target_most
            elif targeted == 'll':
                Y_test_target = Y_test_target_ll
            elif targeted is False:
                attack_params['targeted'] = False
                Y_test_target = Y_test.copy()
        else:
            targeted = False
            attack_params['targeted'] = False
            Y_test_target = Y_test.copy()

        x_adv_fname = "%s_%s.pickle" % (task_id, attack_string)
        x_adv_fpath = os.path.join(X_adv_cache_folder, x_adv_fname)

        X_test_adv, aux_info = maybe_generate_adv_examples(sess, model, x, y, X_test, Y_test_target, attack_name, attack_params, use_cache=x_adv_fpath, verbose=FLAGS.verbose, attack_log_fpath=attack_log_fpath)

        if FLAGS.clip > 0:
            # This is L-inf clipping.
            X_test_adv = np.clip(X_test_adv, min_clip, max_clip)

        X_test_adv_list.append(X_test_adv)

        if isinstance(aux_info, float):
            duration = aux_info
        else:
            duration = aux_info['duration']

        dur_per_sample = duration / len(X_test_adv)

        # 5.0 Output predictions.
        # Y_test_adv_pred = model.predict(X_test_adv)
        # predictions_fpath = os.path.join(predictions_folder, "%s.npy"% attack_string)
        # np.save(predictions_fpath, Y_test_adv_pred, allow_pickle=False)

        # 5.1 Evaluate the adversarial examples being discretized to uint8.
        print("\n---Attack (uint8): %s" % attack_string)
        # All data should be discretized to uint8.
        X_test_adv_discret = reduce_precision_py(X_test_adv, 256)
        X_test_adv_discretized_list.append(X_test_adv_discret)
        Y_test_adv_discret_pred = model.predict(X_test_adv_discret)
        Y_test_adv_discretized_pred_list.append(Y_test_adv_discret_pred)

        rec = evaluate_adversarial_examples2(X_test, Y_test, X_test_adv_discret, Y_test_target.copy(), targeted, Y_test_adv_discret_pred)
        confidences = rec['confidence_scores']
        preds = np.argmax(Y_test_adv_discret_pred,axis=1)
        k = 0
        confidence_scores = ""
        preds_after_attack = ""
        for pred in preds:
            preds_after_attack += str(pred) + ","
            if pred == FLAGS.label_index:
                confidence_scores += str(float("nan")) + ","
            else:
                confidence_scores += str(confidences[k]) + ","
                k += 1
        rec['confidence_scores'] = confidence_scores.rstrip(",")
        rec['dataset_name'] = FLAGS.dataset_name
        rec['model_name'] = FLAGS.model_name
        rec['attack_string'] = attack_string
        rec['original_label_index'] = FLAGS.label_index
        rec['random'] = True if FLAGS.random_image != 0 else False
        rec['duration_per_sample'] = dur_per_sample
        rec['discretization'] = True
        rec['prediction_after_attack'] = preds_after_attack.rstrip(",")
        rec['number_of_images'] = FLAGS.nb_examples
        to_csv.append(rec)

    from utils.output import write_to_csv
    attacks_evaluation_csv_fpath = os.path.join(FLAGS.result_folder,"evaluation.csv")
    fieldnames = ['dataset_name', 'model_name', 'attack_string', 'original_label_index', 'random',  'duration_per_sample', 'discretization', 'success_rate', 'mean_confidence', 'confidence_scores', 'mean_l2_dist', 'mean_li_dist', 'mean_l0_dist_value', 'mean_l0_dist_pixel', 'prediction_after_attack', 'number_of_images']
    write_to_csv(to_csv, attacks_evaluation_csv_fpath, fieldnames)

    if FLAGS.visualize is True:
        from datasets.visualization import show_imgs_in_rows2
        if FLAGS.test_mode or FLAGS.balance_sampling:
            selected_idx_vis = range(Y_test.shape[1])
        else:
            #selected_idx_vis = get_first_n_examples_id_each_class(Y_test, 1)
            #selected_idx_vis = selected_idx
            selected_idx_vis = [i for i in range(FLAGS.nb_examples)]
        legitimate_examples = X_test[selected_idx_vis]

        rows = [legitimate_examples]
        rows += map(lambda x: x[selected_idx_vis], X_test_adv_list)
        img_fpath = os.path.join(FLAGS.result_folder, '%s_attacks_%s_examples.png' % (task_id, attack_string_hash))
        show_imgs_in_rows2(rows, dataset.num_channels, img_fpath)
        print('\n===Adversarial image examples are saved in ', img_fpath)
        print(Y_test_adv_discretized_pred_list)

        """rows = [legitimate_examples]
        rows2 = map(lambda x: x[selected_idx_vis], X_test_adv_list)

        img_fpath = os.path.join(FLAGS.result_folder, '%s_attacks_%s_example_original.png' % (task_id, attack_string_hash))
        show_imgs_in_rows(rows, img_fpath)
        print('\n===Adversarial image examples are saved in ', img_fpath)
        #print(Y_test_adv_discretized_pred_list)

        img_fpath = os.path.join(FLAGS.result_folder,
                                 '%s_attacks_%s_example_adversarial.png' % (task_id, attack_string_hash))
        show_imgs_in_rows(rows2, img_fpath)
        print('\n===Adversarial image examples are saved in ', img_fpath)"""
        #print(Y_test_adv_discretized_pred_list)

        # TODO: output the prediction and confidence for each example, both legitimate and adversarial


if __name__ == '__main__':
    main()

# python main.py --dataset_name MNIST --model_name cnn1 --attacks
# "fgsm?eps=0.3;bim?eps=0.3&eps_iter=0.06;deepfool?overshoot=10;pgdli?eps=0.3;
# fgsm?eps=0.3&targeted=most;fgsm?eps=0.3&targeted=next;fgsm?eps=0.3&targeted=ll;
# bim?eps=0.3&eps_iter=0.06&targeted=most;
# bim?eps=0.3&eps_iter=0.06&targeted=next;
# bim?eps=0.3&eps_iter=0.06&targeted=ll;
# carlinili?targeted=most&batch_size=1&max_iterations=1000&confidence=10;
# carlinili?targeted=next&batch_size=1&max_iterations=1000&confidence=10;
# carlinili?targeted=ll&batch_size=1&max_iterations=1000&confidence=10;
# carlinil2?targeted=most&batch_size=100&max_iterations=1000&confidence=10;
# carlinil2?targeted=next&batch_size=100&max_iterations=1000&confidence=10;
# carlinil2?targeted=ll&batch_size=100&max_iterations=1000&confidence=10;
# carlinil0?targeted=most&batch_size=1&max_iterations=1000&confidence=10;
# carlinil0?targeted=next&batch_size=1&max_iterations=1000&confidence=10;
# carlinil0?targeted=ll&batch_size=1&max_iterations=1000&confidence=10;
# jsma?targeted=most;
# jsma?targeted=next;
# jsma?targeted=ll;"
