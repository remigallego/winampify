import React from "react";

interface Props extends React.ImgHTMLAttributes<HTMLImageElement> {
  cachedSize?: { w: number; h: number };
}

const ImgCached = (props: Props) => {
  const { cachedSize, src, ...imgProps } = props;
  let url = src;
  // If src is URL, we use weserv.nl for caching.
  // https://images.weserv.nl/docs/quick-reference.html
  if (src.startsWith("https://") || src.startsWith("http://")) {
    const cdnUrl = "images.weserv.nl";
    url = `//${cdnUrl}/?url=${props.src}`;
    if (props.cachedSize?.h || props.cachedSize?.w)
      url = url.concat(`&h=${props.cachedSize.h}&w=${props.cachedSize.w}`);
  }

  return <img {...imgProps} src={url}></img>;
};

export default ImgCached;
