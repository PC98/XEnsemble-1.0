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

    total_width = width_num * img_width + (width_num - 1) * x_margin
    total_height = height_num * img_height + (height_num - 1) * y_margin

    #total_width = img_width
    #total_height = img_height

    #new_im = Image.new('RGB', (total_width, total_height), (255, 255, 255))

    x_offset = 0
    y_offset = 0
    i = 0
    prev_im = None
    for imgs in rows:
        new_im = Image.new('RGB', (total_width, int(total_height/2)), (255, 255, 255))
        imgs_row = list(imgs)
        for img_array in imgs_row:
            # pdb.set_trace()
            img = Image.fromarray((np.squeeze(img_array) * 255).astype(np.uint8))
            new_im.paste(img, (x_offset, y_offset))
            #x_offset += img_width + x_margin
        x_offset = 0
        #y_offset += img_height + y_margin
        if prev_im:
            difference = ImageChops.difference(prev_im, new_im)
            if num_channels > 1:
                difference = ImageChops.invert(difference)
            difference = difference.resize(size=(img_width * 3, img_height * 3))
            difference.save(fpath.split('/')[0] + "/" + fpath.split('/')[1] + "/difference.png")
        prev_im = new_im
        if fpath is not None:
            new_im = new_im.resize(size=(img_width*3, img_height*3))
            if i == 0:
                new_im.save(fpath.split('/')[0] + "/" + fpath.split('/')[1] + "/original.png")
            if i == 1:
                new_im.save(fpath.split('/')[0] + "/" + fpath.split('/')[1] + "/attacked.png")
            i +=1
    # new_im.show()