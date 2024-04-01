export default function IconButton({ icon, text }) {
  return (
    <button className="flex flex-col items-center m-2 space-y-1 focus:outline-none text-white">
      {icon}
      <span className="text-lg">{text}</span>
    </button>
  );
}
