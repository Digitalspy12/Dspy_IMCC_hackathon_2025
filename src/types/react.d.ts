/// <reference types="react" />
/// <reference types="react-dom" />

declare namespace React {
  interface FC<P = {}> {
    (props: P & { children?: React.ReactNode }): React.ReactElement | null;
  }

  type ReactElement = {
    $$typeof: symbol;
    type: any;
    props: any;
    key: string | null;
  };

  type ReactNode = ReactElement | string | number | boolean | null | undefined | ReactNodeArray;
  interface ReactNodeArray extends Array<ReactNode> {}

  interface JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

declare module "*.svg" {
  const content: React.FC<React.SVGAttributes<SVGElement>>;
  export default content;
}

declare module "*.jpg" {
  const content: string;
  export default content;
}

declare module "*.png" {
  const content: string;
  export default content;
}

declare module "react" {
  export = React;
}