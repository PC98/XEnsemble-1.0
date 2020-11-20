import React from "react";
import clsx from "clsx";
import makeStyles from "@material-ui/core/styles/makeStyles";
import ImageRowElement from "./ImageRowElement";
import { SuccessfulServerResponse } from "../utils/types";

interface Props {
  images: SuccessfulServerResponse["images"];
  originalImageLabel: string;
  attackedImageLabel: string;
  className: string;
}

const useStyles = makeStyles({
  row: {
    display: "flex",
    flex: 1,
    justifyContent: "space-evenly",
  },
});

const withModelPredictionPrefix = (str: string) => `Model prediction: ${str}`;

const ImageRow: React.FC<Props> = ({
  images,
  className,
  originalImageLabel,
  attackedImageLabel,
}) => {
  const { row } = useStyles();

  return (
    <div className={clsx(row, className)}>
      <ImageRowElement
        encodedImage={images.original}
        altText="before attack"
        label="Image before attack"
        caption={withModelPredictionPrefix(originalImageLabel)}
      />
      <ImageRowElement
        encodedImage={images.attacked}
        altText="after attack"
        label="Image after attack"
        caption={withModelPredictionPrefix(attackedImageLabel)}
      />
      <ImageRowElement
        encodedImage={images.difference}
        altText="pixel difference"
        label="Pixel difference"
      />
    </div>
  );
};

export default ImageRow;
