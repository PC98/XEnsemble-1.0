from PIL import Image, ImageChops
import numpy as np
import pdb


def show_img(pixel_array, mode=None):
    # img = Image.fromarray(pixel_array*255, mode=mode)
    img = Image.fromarray((np.squeeze(pixel_array) * 255).astype(np.uint8))
    img.show()


def show_imgs_in_rows(rows, fpath=None):
    # TODO: get the maximum.
    width_num = len(rows[0])
    height_num = len(rows)
    image_size = rows[0][0].shape[:2]
    img_width, img_height = image_size

    x_margin = 2
    y_margin = 2

    # pdb.set_trace()

    total_width = width_num * img_width + (width_num - 1) * x_margin
    total_height = height_num * img_height + (height_num - 1) * y_margin

    new_im = Image.new('RGB', (total_width, total_height), (255, 255, 255))

    x_offset = 0
    y_offset = 0

    for imgs in rows:
        imgs_row = list(imgs)
        for img_array in imgs_row:
            # pdb.set_trace()
            img = Image.fromarray((np.squeeze(img_array) * 255).astype(np.uint8))
            new_im.paste(img, (x_offset, y_offset))
            x_offset += img_width + x_margin

        x_offset = 0
        y_offset += img_height + y_margin

    if fpath is not None:
        new_im.save(fpath)
    # new_im.show()

def show_imgs_in_rows2(rows, num_channels, fpath=None):
    # TODO: get the maximum.
    width_num = len(rows[0])
    height_num = len(rows)
    image_size = rows[0][0].shape[:2]
    img_width, img_height = image_size

    x_margin = 2
    y_margin = 2

    # pdb.set_trace()

    #total_width = width_num * img_width + (width_num - 1) * x_margin
    #total_height = height_num * img_height + (height_num - 1) * y_margin

    total_width = img_width
    total_height = img_height

    originals = rows[0]
    adversarials = rows[1]
    for i in range(len(originals)):
        original = Image.new('RGB', (total_width, total_height), (255, 255, 255))
        img = Image.fromarray((np.squeeze(originals[i]) * 255).astype(np.uint8))
        original.paste(img, (0, 0))
        original = original.resize(size=(img_width * 3, img_height * 3))
        original.save(fpath.split('/')[0] + "/" + fpath.split('/')[1] + "/original" + str(i) + ".png")
        adversarial = Image.new('RGB', (total_width, total_height), (255, 255, 255))
        img = Image.fromarray((np.squeeze(adversarials[i]) * 255).astype(np.uint8))
        adversarial.paste(img, (0, 0))
        adversarial = adversarial.resize(size=(img_width * 3, img_height * 3))
        adversarial.save(fpath.split('/')[0] + "/" + fpath.split('/')[1] + "/adversarial" + str(i) + ".png")
        difference = ImageChops.difference(original, adversarial)
        if num_channels > 1:
            difference = ImageChops.invert(difference)
        difference.save(fpath.split('/')[0] + "/" + fpath.split('/')[1] + "/difference" + str(i) + ".png")
        #print(i)

    """i = 1
    prev_im = None
    for imgs in rows:
        imgs_row = list(imgs)
        for img_array in imgs_row:
            new_im = Image.new('RGB', (total_width, total_height), (255, 255, 255))
            img = Image.fromarray((np.squeeze(img_array) * 255).astype(np.uint8))
            new_im.paste(img, (0,0))
            if fpath is not None:
                new_im = new_im.resize(size=(img_width * 3, img_height * 3))
                new_im.save(fpath.split('/')[0] + "/" + fpath.split('/')[1] + "/image" + str(i) + ".png")
                if prev_im is None:
                    prev_im = new_im
                else:
                    difference = ImageChops.difference(prev_im, new_im)
                    if num_channels > 1:
                        difference = ImageChops.invert(difference)
                    difference.save(fpath.split('/')[0] + "/" + fpath.split('/')[1] + "/difference" + str(i) + ".png")
                    prev_im = None
                if i % 2 == 0:
                    new_im.save(fpath.split('/')[0] + "/" + fpath.split('/')[1] + "/original" + str(i) + ".png")
                if i % 2 == 1:
                    new_im.save(fpath.split('/')[0] + "/" + fpath.split('/')[1] + "/attacked" + str(i) + ".png")
                i += 1
            x_offset += img_width + x_margin
        x_offset = 0
        y_offset += img_height + y_margin
        if prev_im:
            difference = ImageChops.difference(prev_im, new_im)
            if num_channels > 1:
                difference = ImageChops.invert(difference)
            difference = difference.resize(size=(img_width * 3, img_height * 3))
            difference.save(fpath.split('/')[0] + "/" + fpath.split('/')[1] + "/difference.png")
        prev_im = new_im"""

    # new_im.show()