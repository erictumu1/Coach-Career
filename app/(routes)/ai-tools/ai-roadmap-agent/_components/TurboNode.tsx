import { Handle, Position } from "@xyflow/react";

function TurboNode({ data }: any) {
  return (
    <div className="rounded-lg bg-customTeal border-customTeal shadow-md transition-transform duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg w-64 p-5">
      <div className="font-bold text-lg text-white">{data.title}</div>
      <p className="text-sm text-gray-300 mt-1 line-clamp-2">
        {data.description}
      </p>
      <a
        href={data?.link}
        target="blank"
        className="text-white underline text-sm mt-2 inline-block"
      >
        Learn more
      </a>

      {/* This is to allow to connect different nodes together. */}
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

export default TurboNode;
